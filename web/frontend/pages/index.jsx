import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import {
  Page,
  Layout,
  Card,
  TextStyle,
  Badge,
  Button,
  ButtonGroup,
  Stack,
  DataTable,
  Icon
} from '@shopify/polaris';
import { MdCalendarToday } from 'react-icons/md';
import jimage from './images/letter-j.png';
import { StarFilledIcon } from '@shopify/polaris-icons';
function DashboardPage() {
  const [reviews, setReviews] = useState([]);
  const [reviewInsights, setReviewInsights] = useState({
    requestsSent: 0,
    reviewsOverTime: 0,
    revenueGenerated: 0,
    averageRating: 0,
    ordersFromJudgeMe: 0,
    questionsReceived: 0,
    trustScores: { transparency: 0, authenticity: 0 },
  });


  const [topProducts, setTopProducts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const dropdownRef = useRef(null);
  const handleRedirect = () => {
    navigate('/managereview');
  };
  const handleRedirect1 = () => {
    navigate('/statics');
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // Process data to set top products and recent reviews
      const topProducts = calculateTopProducts(data); // Assume this function processes top products
      const recentReviews = data.slice(0, 5); // Show only the 5 most recent reviews
      setReviews(data);
      setTopProducts(topProducts);
      setRecentReviews(recentReviews);
      // Calculate insights based on the fetched reviews
      calculateReviewInsights(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

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

  const calculateReviewInsights = (data) => {
    const totalReviews = data.length;
    const totalRequestsSent = totalReviews + 5; // Assuming you sent 5 more requests than reviews
    const averageRating = totalReviews > 0 ? (data.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : 0;
    const revenueGenerated = data.reduce((sum, review) => sum + (review.revenue || 0), 0);
    const questionsReceived = data.reduce((sum, review) => sum + (review.questions || 0), 0);

    // For Trust Scores
    const transparencyScore = calculateTransparency(data);
    const authenticityScore = calculateAuthenticity(data);

    setReviewInsights({
      requestsSent: totalRequestsSent,
      reviewsOverTime: totalReviews,
      revenueGenerated: revenueGenerated.toFixed(2),
      averageRating,
      ordersFromJudgeMe: totalReviews, // Assuming each review is linked to an order
      questionsReceived,
      trustScores: {
        transparency: transparencyScore,
        authenticity: authenticityScore,
      },
    });
  };

  const calculateTransparency = (reviews) => {
    // Example logic: All reviews should have a rating, comment, and date to be fully transparent
    const total = reviews.length;
    const transparentReviews = reviews.filter((review) => review.rating && review.comment && review.date).length;
    return total > 0 ? ((transparentReviews / total) * 100).toFixed(0) : 0;
  };

  const calculateAuthenticity = (reviews) => {
    // Example logic: All reviews with user details and no signs of spam are considered authentic
    const total = reviews.length;
    const authenticReviews = reviews.filter((review) => review.user && !review.isSpam).length;
    return total > 0 ? ((authenticReviews / total) * 100).toFixed(0) : 0;
  };
  useEffect(() => {
    // Calculate the current date and the date 3 days prior
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    // Format dates to 'YYYY-MM-DD' format
    const formatDate = (date) => date.toISOString().split('T')[0];
    setEndDate(formatDate(today));
    setStartDate(formatDate(threeDaysAgo));
  }, []);


  const calculateTopProducts = (data) => {
    // Implement logic to determine top products by review count, rating, etc.
    const productReviews = {}; // Object to store aggregated reviews per product

    data.forEach((review) => {
      const productName = review.productName; // Assume product name is part of the review data
      if (!productReviews[productName]) {
        productReviews[productName] = { name: productName, reviews: 0, totalRating: 0 };
      }
      productReviews[productName].reviews += 1;
      productReviews[productName].totalRating += review.rating;
    });

    // Convert object to array and calculate average rating
    return Object.values(productReviews).map((product) => ({
      ...product,
      rating: (product.totalRating / product.reviews).toFixed(1),
    }));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <Page>
      <div style={{display:'flex', justifyContent:'center', width:'100%'}}>
      <div style={{ maxWidth:'62.375rem'}}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={jimage}
            alt="Judge.me logo"
            style={{ width: '40px', marginRight: '10px' }}
          />
          <h1 style={{ margin: 0, fontSize:'20px', fontWeight:'bold' }}>Judge.me</h1>
        </div>
        <ButtonGroup>
          <Button onClick={handleRedirect}>Reviews Dashboard</Button>
          <Button>Search settings</Button>
        </ButtonGroup>
      </div>

      {/* Filter Section */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', position: 'relative' }}>
        <ButtonGroup>
          <Button icon={<MdCalendarToday/>} onClick={toggleDropdown}>Last 30 days</Button>
          <Button onClick={handleRedirect1}>View reports</Button>
        </ButtonGroup>
        
         {/* Dropdown */}
        {dropdownOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <ul>
              <li><input type="radio" name="filter" /> Yesterday</li>
              <li><input type="radio" name="filter" /> Today</li>
              <li><input type="radio" name="filter" /> Last 7 days</li>
              <li><input type="radio" name="filter" defaultChecked /> Last 30 days</li>
              <li><input type="radio" name="filter" /> Last 90 days</li>
              <li><input type="radio" name="filter" /> Last 12 months</li>
              <li><input type="radio" name="filter" /> All time</li>
              <li><input type="radio" name="filter" /> Custom</li>
            </ul>
            <div className="date-picker">
              <div style={{display: 'grid'}}>
              <label>Starting:</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div style={{display: 'grid'}}>
              <label>Ending:</label>
               <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
            </div>
             <div className="dropdown-buttons">
              <Button onClick={() => setDropdownOpen(false)}>Apply</Button>
              <Button onClick={() => { setStartDate(startDate); setEndDate(endDate); }}>Clear</Button>
            </div>
          </div>
        )}
      </div>


      <Layout>
        {/* First Row: 3 Cards */}
        <Layout.Section oneThird>
          <div style={{ height: '155px' }}>
          <Card sectioned title="Review requests sent">
            <Stack>
              <TextStyle variation="strong" textAlign="center">
                  {reviewInsights.requestsSent}
              </TextStyle>
              <TextStyle variation="subdued">— 0%</TextStyle>
            </Stack>
            </Card>
            </div>
        </Layout.Section>

        <Layout.Section oneThird>
        <div style={{height: '155px' }}>
          <Card sectioned title="Reviews over time">
            <Stack>
              <TextStyle variation="strong" textAlign="center">
                  {reviewInsights.reviewsOverTime}
              </TextStyle>
              <Badge status="success">↑ 100%</Badge>
            </Stack>
          </Card>
          </div>
        </Layout.Section>

        <Layout.Section oneThird>
          <div style={{ height: '155px' }}>
          <Card sectioned title="Revenue generated">
            <Stack>
              <TextStyle variation="strong" textAlign="center">
                ${reviewInsights.revenueGenerated}
              </TextStyle>
              <TextStyle variation="subdued">— 0%</TextStyle>
            </Stack>
            </Card>
            </div>
        </Layout.Section>

        {/* Second Row: 4 Cards in the Same Row Using Flexbox */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', width: '100%' }}>
          <div style={{ flex: '1', margin: '0 0 0 15px', height: '150px' }}> {/* Set a fixed height */}
            <Card sectioned title="Average rating" style={{ height: '100%' }}>
              <Stack>
                <TextStyle variation="strong" textAlign="center">
                  {reviewInsights.averageRating}
                </TextStyle>
                <Badge status="success">↑ 100%</Badge>
              </Stack>
            </Card>
          </div>

          <div style={{ flex: '1', margin: '0 0 0 15px', height: '150px' }}> {/* Set a fixed height */}
            <Card sectioned title="Orders from Judge.me" style={{ height: '100%' }}>
              <Stack>
                <TextStyle variation="strong" textAlign="center">
                  {reviewInsights.ordersFromJudgeMe}
                </TextStyle>
                <TextStyle variation="subdued">— 0%</TextStyle>
              </Stack>
            </Card>
          </div>

          <div style={{ flex: '1', margin: '0 0 0 15px', height: '150px' }}> {/* Set a fixed height */}
            <Card sectioned title="Questions received" style={{ height: '100% !important' }}>
              <Stack>
                <TextStyle variation="strong" textAlign="center">
                  {reviewInsights.questionsReceived}
                </TextStyle>
                <TextStyle variation="subdued">— 0%</TextStyle>
              </Stack>
            </Card>
          </div>

          <div style={{ flex: '1', margin: '0 0 0 15px', height: '150px' }}> {/* Set a fixed height */}
            <Card sectioned title="Trust scores" style={{ height: '100%' }}>
              <Stack>
                <TextStyle variation="strong">
                  Transparency: {reviewInsights.trustScores.transparency}%
                </TextStyle>
                <TextStyle variation="strong">
                  Authenticity: {reviewInsights.trustScores.authenticity}%
                </TextStyle>
              </Stack>
            </Card>
          </div>
        </div>

        {/* Third Row: 2 Cards */}
        <Layout.Section oneHalf>
          <Card sectioned title="Top products">
            <DataTable
              columnContentTypes={['text', 'text', 'text']}
              headings={['Product', 'Reviews', 'Rating']}
              rows={topProducts.map(product => [product.name, product.reviews, product.rating])}
            />
          </Card>
        </Layout.Section>

        <Layout.Section oneHalf>
          <Card title="Recent activity" sectioned>
            <Stack vertical>
              <TextStyle variation="strong">Last reviews</TextStyle>
              {recentReviews.map((review, index) => (
                <div style={{ borderBottom: '1px solid #c0bebe', borderColor:'##c0bebe', paddingBottom:'15px'}}>
                <Stack key={index} alignment="center">
                  <TextStyle>
                    <div style={{display:'flex'}}>
                    <StarRating  rating={review.rating} /> — {getDaysAgo(review.created_at)}
                    </div>
                    {review.title}<br></br>
                    {review.description}
                  </TextStyle>
                  </Stack>
                  </div>
              ))}
            </Stack>
          </Card>
        </Layout.Section>
        </Layout>
        </div>
        </div>
    </Page>
  );
}

export default DashboardPage;
