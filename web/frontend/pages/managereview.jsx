// ReviewsDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Page, Tabs, Select, DataTable, ButtonGroup, Button, Icon, Pagination, Popover, ActionList, Toast, Frame, Spinner, Modal, TextField } from '@shopify/polaris';
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
  const [replies, setReplies] = useState([]);
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
    spam: 0,
    archive: 0,
  });
  const [loadingReviewId, setLoadingReviewId] = useState(null); // State to manage which review is loading
  // State for toast
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editReview, setEditReview] = useState(null); // State to manage which review is being edited
  const [isEditModalOpen, setEditModalOpen] = useState(false); // State to manage modal visibility
  const [editReviewcost, setEditReviewcost] = useState(null); // State to manage which review is being edited
  const [isEditModalOpencost, setEditModalOpencost] = useState(false); // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyToEdit, setReplyToEdit] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const toggleToast = useCallback(() => setToastActive((active) => !active), []);

  useEffect(() => {
    fetchReviews();
    fetchReply();
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
    { id: 'spam', content: 'Spam' },
    { id: 'archive', content: 'Archive' },
  ];

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews/data'); // Fetch data from your backend
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setReviews(data);
      setFilteredReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const fetchReply = async () => {
    try {
      const response = await fetch('/api/reply'); // Fetch data from your backend
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('data---', data);
      setReplies(data);
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    }
  };

  const unarchived = async (id) => {
    try {
      // Send the status update to the server
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'Product' }), // Only send the status update
      });

      if (!response.ok) throw new Error('Failed to update review type');

      // Update the status in the reviews state without resetting the entire review
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, type: 'Product' } : review
        )
      );

      setToastMessage(`Review marked as Unarchived`);
      setToastActive(true);

    } catch (error) {
      console.error('Failed to update review status:', error);
    }
  };


  const updateReviewtype = async (id) => {
    try {
      // Send the status update to the server
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'Archived' }), // Only send the status update
      });

      if (!response.ok) throw new Error('Failed to update review type');

      // Update the status in the reviews state without resetting the entire review
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, type: 'Archived' } : review
        )
      );
      setToastMessage(`Review marked as Archived`);
      setToastActive(true);

    } catch (error) {
      console.error('Failed to update review status:', error);
    }
  };

  const handleSaveEdit = async (id) => {
    if (editReview) {
      try {
        // Send the updated review data to your backend
        const response = await fetch(`/api/reviews/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editReview.title,
            description: editReview.description,
          }),
        });

        if (!response.ok) throw new Error('Failed to update review');

        // Update the reviews state with the new data
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === editReview.id ? { ...review, ...editReview } : review
          )
        );

        // Close the modal and reset the editReview state
        setEditModalOpen(false);
        setEditReview(null);
        setToastMessage('Review updated successfully');
        setToastActive(true);
      } catch (error) {
        console.error('Failed to save edit:', error);
      }
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
  const handleEditReview = (review) => {
    setEditReview(review); // Set the review being edited
    setEditModalOpen(true); // Open the modal
  };

  const handleEmailEditReview = (review) => {
    setIsEmailModalOpen(true); // Open the modal
  };
  const handleEditReviewcost = (review) => {
    setEditReviewcost(review); // Set the review being edited
    setEditModalOpencost(true); // Open the modal
  };
  // Fetch the reply for the selected review (since only one reply is possible per review)
  const getReviewReply = (reviewId) => {
    const reviewReply = replies.find(reply => reply.review_id === reviewId);
    return reviewReply ? reviewReply : ''; // Return the reply content or an empty string if no reply
  };
  const handleReplyAction = (reviewId) => {
    const replyContent1 = getReviewReply(reviewId); // Fetch the existing reply if available
    setReplyContent(replyContent1.reply); // Set the reply content to the state
    console.log('reply text ---', replyContent1.reply);
    setReplyToEdit(replyContent1)
    console.log('reply to edit ---', replyToEdit.id);
    setSelectedReview(reviewId); // Set the selected review
    console.log('review-------', selectedReview);
    setIsModalOpen(true); // Open the modal
  };

  const handleSaveEditReply = async (id) => {
    try {
      const endpoint = id ? `/api/review-reply/${id}` : `/api/review-reply`;
      const method = id ? 'POST' : 'POST'; // If you're distinguishing PUT for updates, change to 'PUT'

      // Send the reply data to your backend
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review_id: selectedReview,
          reply: replyContent,
        }),
      });

      if (!response.ok) throw new Error('Failed to save the reply');

      fetchReply();
      setIsModalOpen(false); // Close the modal
      setToastMessage(id ? 'Reply updated successfully' : 'Reply added successfully');
      setToastActive(true);
    } catch (error) {
      console.error('Failed to save reply:', error);
    }
  };

  const handeldelete = async (id) => {
    try {
      // Send the status update to the server
      const response = await fetch(`/api/review-reply/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to update review status');

      // Update the status in the reviews state without resetting the entire review

      // Show toast notification based on the selected status
      fetchReply();
      setToastMessage(`Reply deleted successfully`);
      setToastActive(true);
    } catch (error) {
      console.error('Failed to update review status:', error);
    } finally {
      setLoadingReviewId(null); // Reset loading review ID
    }
  };

  const handleChange = (field, value) => {
    setEditReview((prev) => ({ ...prev, [field]: value })); // Update the corresponding field
  };


  const filterReviews = (reviewsToFilter, selectedTabId) => {
    let filtered;
    if (selectedTabId === 'allReviews') {
      filtered = reviewsToFilter.filter(
        (review) => review.type !== 'Spam' && review.type !== 'Archived'
      );
    } else if (selectedTabId === 'productReviews') {
      filtered = reviewsToFilter.filter((review) => review.type === 'Product');
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
    console.log('tab-id-----', selectedTabIndex)
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  // Pagination Logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const rows = currentReviews.map((review) => {
    const reviewReplies = getReviewReply(review.id);

    return [
      <div style={{ width: '150px' }}>
        <strong>{review.customer_name}</strong>
        <div>{review.product_name}</div>
      </div>,
      <div style={{ width: '120px' }}>{getDaysAgo(review.created_at)}</div>,
      <div style={{ width: '250px' }}>
        <StarRating rating={review.rating} />
        <div style={{ fontWeight: 'bold' }}>{review.title}</div>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '230px' }}>
          {review.description}
        </div>
        {/* Displaying replies for the review */}
        {reviewReplies && (
          <div style={{ backgroundColor: '#e0f7fa', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <strong>Your reply written on: {formatDate(reviewReplies.created_at)}</strong>
            </div> <br></br>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '230px' }}>{reviewReplies.reply}</div><br></br>
            <div> <button type="button" onClick={() => handeldelete(reviewReplies.id)} style={{backgroundColor:'red', borderRadius:'5px', color:'white', border:'none', height:'30px', width:'60px'}}>
              Delete
            </button></div>

          </div>
        )}
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
                onAction: () => handleReplyAction(review.id),
              },
              {
                content: 'Reply privately via email',
                prefix: <Icon source={PiArrowUDownLeftLight} />,
                onAction: () => handleEmailEditReview(review),
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
                onAction: () => handleEditReviewcost(review),
              },
              // Conditional item for Archive/Unarchive based on filterTabs
              {
                content: selectedFilterTab == 3 ? 'Unarchive' : 'Archive',
                prefix: <Icon source={FaArchive} />,
                onAction: () => {
                  if (selectedFilterTab == 3) {
                    // Call the function to unarchive the review
                    unarchived(review.id);
                  } else {
                    // Call the function to archive the review
                    updateReviewtype(review.id);
                  }
                },
              },
              {
                content: 'Edit review',
                prefix: <Icon source={HiPencil} />,
                onAction: () => handleEditReview(review),
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
    ];
  });

  return (
    <Frame>
      <div>
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
          {isEditModalOpencost && (
            <Modal
              open={isEditModalOpencost}
              onClose={() => setEditModalOpencost(false)}
              title="Ask coustomer to update review"
              primaryAction={{
                content: 'Send Email',
                onAction: () => handleSaveEdit(editReviewcost.id),
              }}
            >
              <Modal.Section>
                <div>
                  <TextField
                    label="Title"
                    value={editReviewcost?.title || ''}
                    onChange={(value) => handleChange('title', value)}
                  />
                  <TextField
                    label="Description"
                    value={editReviewcost?.description || ''}
                    onChange={(value) => handleChange('description', value)}
                    multiline={4}
                  />
                </div>
              </Modal.Section>
            </Modal>
          )}
          {isEditModalOpen && (
            <Modal
              open={isEditModalOpen}
              onClose={() => setEditModalOpen(false)}
              title="Edit Review"
              primaryAction={{
                content: 'Save',
                onAction: () => handleSaveEdit(editReview.id),
              }}
            >
              <Modal.Section>
                <div>
                  <TextField
                    label="Title"
                    value={editReview?.title || ''}
                    onChange={(value) => handleChange('title', value)}
                  />
                  <TextField
                    label="Description"
                    value={editReview?.description || ''}
                    onChange={(value) => handleChange('description', value)}
                    multiline={4}
                  />
                </div>
              </Modal.Section>
            </Modal>
          )}
          {/* Reply Modal */}
          <Modal
            open={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            title='Reply privatly via email'
            primaryAction={{
              content: 'Send Email',
              onAction: () => handleSaveEditReply(replyToEdit.id),
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: () => setIsModalOpen(false),
              },
            ]}
          >
            <Modal.Section>
              <TextField
                label="Your Reply"
                value={replyContent}
                onChange={(value) => setReplyContent(value)}
                multiline={4}
                maxLength={200}
              />
            </Modal.Section>
          </Modal>
          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title='Reply to Review'
            primaryAction={{
              content: 'Submit Reply',
              onAction: () => handleSaveEditReply(replyToEdit.id),
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: () => setIsModalOpen(false),
              },
            ]}
          >
            <Modal.Section>
              <TextField
                label="Your Reply"
                value={replyContent}
                onChange={(value) => setReplyContent(value)}
                multiline={4}
                maxLength={200}
              />
            </Modal.Section>
          </Modal>
          {toastActive && <Toast content={toastMessage} onDismiss={toggleToast} />}
        </Page>
      </div>
    </Frame>
  );
};

export default ReviewsDashboard;
