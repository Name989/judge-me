// ReviewsDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Page, Tabs, Select, DataTable, ButtonGroup, Button, Icon, Pagination, Popover, ActionList, Toast, Frame, Spinner } from '@shopify/polaris';
import { StarFilledIcon } from '@shopify/polaris-icons';
import "@shopify/polaris/build/esm/styles.css";
import './index.css';
import { MdReply } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { BsShareFill } from "react-icons/bs";
import { HiPencil } from "react-icons/hi2";
import { FaArchive } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { PiArrowUDownLeftLight } from "react-icons/pi";

const getDaysAgo = (dateString) => {
  const givenDate = new Date(dateString);
  const today = new Date();
  givenDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = today - givenDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Icon
        key={i}
        source={StarFilledIcon}
        color={i <= rating ? 'highlight' : 'base'}
        size="large"
        className={`star ${i <= rating ? 'filled' : ''}`}
      />
    );
  }
  return <div className="star-rating">{stars}</div>;
};

const ReviewsDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedMainTab, setSelectedMainTab] = useState(0);
  const [selectedFilterTab, setSelectedFilterTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [popoverActive, setPopoverActive] = useState(null); // Track active popover
  const [reviewsPerPage] = useState(5); // Number of reviews to display per page
  const [allReviews, setAllReviews] = useState([]); // State for filtered all reviews
  const [reviewsCount, setReviewsCount] = useState({ // Store counts for each filter tab
    allReviews: 0,
    productReviews: 0,
    storeReviews: 0,
    spam: 0,
    archive: 0,
  });
  const [loadingReviewId, setLoadingReviewId] = useState(null); // State to manage which review is loading
  // State for toast
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toggleToast = useCallback(() => setToastActive((active) => !active), []);

  useEffect(() => {
    fetchReviews();
  }, []);

  const mainTabs = [
    { id: 'reviews-dashboard', content: 'Reviews Dashboard' },
    { id: 'questions-answers', content: 'Questions & Answers' },
    { id: 'add-reviews', content: 'Add Reviews' },
    { id: 'moderation', content: 'Moderation' },
    { id: 'products-groups', content: 'Products & Groups' },
  ];

  const filterTabs = [
    { id: 'allReviews', content: 'All Reviews' },
    { id: 'productReviews', content: 'Product Reviews' },
    { id: 'storeReviews', content: 'Store Reviews' },
    { id: 'spam', content: 'Spam' },
    { id: 'archive', content: 'Archive' },
  ];

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews'); // Fetch data from your backend
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setReviews(data);
      setFilteredReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const updateReviewStatus = async (id, newStatus) => {
    setLoadingReviewId(id);
    try {
      // Send the status update to the server
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }), // Only send the status update
      });

      if (!response.ok) throw new Error('Failed to update review status');

      // Update the status in the reviews state without resetting the entire review
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, status: newStatus } : review
        )
      );

      // Show toast notification based on the selected status
      setToastMessage(`Review marked as ${newStatus}`);
      setToastActive(true);
    } catch (error) {
      console.error('Failed to update review status:', error);
    } finally {
      setLoadingReviewId(null); // Reset loading review ID
    }
  };



  const filterReviews = (reviewsToFilter, selectedTabId) => {
    let filtered;
    if (selectedTabId === 'allReviews') {
      filtered = reviewsToFilter.filter(
        (review) => review.type !== 'Spam' && review.type !== 'Archived'
      );
    } else if (selectedTabId === 'productReviews') {
      filtered = reviewsToFilter.filter((review) => review.type === 'Product');
    } else if (selectedTabId === 'storeReviews') {
      filtered = reviewsToFilter.filter((review) => review.type === 'Store');
    } else if (selectedTabId === 'spam') {
      filtered = reviewsToFilter.filter((review) => review.type === 'Spam');
    } else if (selectedTabId === 'archive') {
      filtered = reviewsToFilter.filter((review) => review.type === 'Archived');
    }

    setFilteredReviews(filtered);
    setCurrentPage(1); // Reset to the first page when filtering

    setReviewsCount({
      allReviews: reviewsToFilter.filter((review) => review.type !== 'Spam' && review.type !== 'Archived').length,
      productReviews: reviewsToFilter.filter((review) => review.type === 'Product').length,
      storeReviews: reviewsToFilter.filter((review) => review.type === 'Store').length,
      spam: reviewsToFilter.filter((review) => review.type === 'Spam').length,
      archive: reviewsToFilter.filter((review) => review.type === 'Archived').length,
    });
  };

  useEffect(() => {
    filterReviews(reviews, filterTabs[selectedFilterTab].id);
  }, [reviews, selectedFilterTab]);

  const handleFilterTabChange = (selectedTabIndex) => {
    setSelectedFilterTab(selectedTabIndex);
    filterReviews(reviews, filterTabs[selectedTabIndex].id);
  };

  const handleSort = useCallback(
    (index, direction) => {
      const sortedReviews = [...filteredReviews].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return direction === 'ascending' ? dateA - dateB : dateB - dateA;
      });
      setFilteredReviews(sortedReviews);
    },
    [filteredReviews]
  );

  const togglePopover = (id) => {
    setPopoverActive((active) => (active === id ? null : id));
  };

  // Pagination Logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const rows = currentReviews.map((review) => [
    <div style={{ width: '150px' }}>
      <strong>{review.customer_name}</strong>
      <div>{review.product_name}</div>
    </div>,
    <div style={{ width: '120px' }}>{getDaysAgo(review.created_at)}</div>,
    <div style={{ width: '180px' }}>
      <StarRating rating={review.rating} />
      <div style={{ fontWeight: 'bold' }}>{review.title}</div>
      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
        {review.description}
      </div>
    </div>,
 <div style={{ width: '150px', marginLeft: 'auto', position: 'relative' }}>
  <Select
    labelInline
    label=""
    options={[
      { label: 'Published', value: 'Published' },
      { label: 'Hidden', value: 'Hidden' },
    ]}
    value={review.status}
    onChange={(newStatus) => updateReviewStatus(review.id, newStatus)}
    disabled={loadingReviewId === review.id} // Disable while loading
  />
  {loadingReviewId === review.id && (
    <div style={{ position: 'absolute', top: '50%', left: '100%', transform: 'translateY(-50%)' }}>
      <Spinner size="small" />
    </div>
  )}
</div>,
    <ButtonGroup>
      <Popover
        active={popoverActive === `reply-${review.id}`}
        activator={
          <Button
            size="large"
            icon={<MdReply />}
            onClick={() => togglePopover(`reply-${review.id}`)} // Toggle reply popover
            accessibilityLabel="More actions"
          />
        }
        onClose={() => togglePopover(`reply-${review.id}`)}
      >
        <ActionList
          items={[
            {
              content: 'Reply publicly',
              prefix: <Icon source={PiArrowUDownLeftLight} />,
              onAction: () => console.log(`Replying to review ${review.id}`),
            },
            {
              content: 'Reply privately via email',
              prefix: <Icon source={PiArrowUDownLeftLight} />,
              onAction: () => console.log(`Marking review ${review.id} as resolved`),
            },
          ]}
        />
      </Popover>
      <Popover
        active={popoverActive === review.id}
        activator={
          <Button
            size="large"
            icon={<BsThreeDots />}
            onClick={() => togglePopover(review.id)}
            accessibilityLabel="More actions"
          />
        }
        onClose={() => togglePopover(review.id)}
      >
        <ActionList
          items={[
            {
              content: 'Share on social media',
              prefix: <Icon source={BsShareFill} />,
              onAction: () => console.log('Share on social media'),
            },
            {
              content: 'Ask customer to update review',
              prefix: <Icon source={HiPencil} />, // Using the edit icon as a placeholder; replace with a more specific one if available
              onAction: () => console.log('Ask customer to update review'),
            },
            {
              content: 'Archive',
              prefix: <Icon source={FaArchive} />,
              onAction: () => console.log('Archive action'),
            },
            {
              content: 'Edit review',
              prefix: <Icon source={HiPencil} />,
              onAction: () => console.log('Edit review action'),
            },
            {
              content: 'View review details',
              prefix: <Icon source={FaEye} />,
              onAction: () => console.log('View review details'),
            },
          ]}
        />

      </Popover>
    </ButtonGroup>,
  ]);

  return (
    <Frame>
      <Page>
        <div className="main-tabs-header">
          <Tabs tabs={mainTabs} selected={selectedMainTab} onSelect={setSelectedMainTab} />
        </div>
        <div className="title-container">
          <h1>{mainTabs[selectedMainTab]?.content || 'Reviews Dashboard'}</h1>
        </div>
        <div className="content-wrapper">
          <Card>
            <Tabs
              tabs={filterTabs.map((tab, index) => ({
                ...tab,
                content: (
                  <div className={`tab ${selectedFilterTab === index ? 'tab-selected' : ''}`}>
                    {tab.content}
                    {selectedFilterTab === index && (
                      <span className="review-count">{reviewsCount[tab.id]}</span>
                    )}
                  </div>
                ),
              }))}
              selected={selectedFilterTab}
              onSelect={handleFilterTabChange}
            />
            <Card.Section>
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text', 'text']}
                headings={['Customer', 'Created', 'Review', '', 'Status']}
                rows={rows}
                sortable={[false, true, false, false, false]}
                onSort={handleSort}
                defaultSortDirection="descending"
              />
            </Card.Section>
            <Card.Section>
              <div className="pagination-container">
                <Pagination
                  hasPrevious={currentPage > 1}
                  hasNext={currentPage < totalPages}
                  onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  label={`Showing ${indexOfFirstReview + 1} to ${Math.min(indexOfLastReview, filteredReviews.length)} of ${filteredReviews.length} reviews`}
                />
              </div>
            </Card.Section>
          </Card>
        </div>
        {toastActive && <Toast content={toastMessage} onDismiss={toggleToast} />}
      </Page>
    </Frame>
  );
};

export default ReviewsDashboard;
