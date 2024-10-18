import React, { useEffect, useState, useRef } from 'react';
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
} from '@shopify/polaris';
import { MdCalendarToday } from 'react-icons/md';



function DashboardPage() {
  const [data, setData] = useState({
    reviewRequestsSent: 0,
    reviewsOverTime: 3,
    revenueGenerated: 0,
    averageRating: 4.33,
    ordersFromJudgeMe: 0,
    questionsReceived: 0,
    trustScores: { transparency: 0, authenticity: 0 },
    topProducts: [{ name: 'eeeeeeee', reviews: 2, rating: 4 }],
    recentReviews: [
      { rating: 4, comment: 'iiiiiiii', date: '22 hours ago' },
      { rating: 5, comment: '5t', date: '2 days ago' },
    ],
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Calculate the current date and the date 3 days prior
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    // Format dates to 'YYYY-MM-DD' format
    const formatDate = (date) => date.toISOString().split('T')[0];
    setEndDate(formatDate(today));
    setStartDate(formatDate(threeDaysAgo));

    fetchData().then((fetchedData) => {
      setData(fetchedData);
    });
  }, []);

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
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://cdn.shopify.com/s/files/1/0533/2089/files/judgeme-logo.png"
            alt="Judge.me logo"
            style={{ width: '40px', marginRight: '10px' }}
          />
          <h1 style={{ margin: 0 }}>Judge.me</h1>
        </div>
        <ButtonGroup>
          <Button>Reviews Dashboard</Button>
          <Button>Search settings</Button>
        </ButtonGroup>
      </div>

      {/* Filter Section */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', position: 'relative' }}>
        <ButtonGroup>
          <Button icon={<MdCalendarToday/>} onClick={toggleDropdown}>Last 30 days</Button>
          <Button>View reports</Button>
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
                {data.reviewRequestsSent}
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
                {data.reviewsOverTime}
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
                ${data.revenueGenerated}
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
                  {data.averageRating.toFixed(2)}
                </TextStyle>
                <Badge status="success">↑ 100%</Badge>
              </Stack>
            </Card>
          </div>

          <div style={{ flex: '1', margin: '0 0 0 15px', height: '150px' }}> {/* Set a fixed height */}
            <Card sectioned title="Orders from Judge.me" style={{ height: '100%' }}>
              <Stack>
                <TextStyle variation="strong" textAlign="center">
                  {data.ordersFromJudgeMe}
                </TextStyle>
                <TextStyle variation="subdued">— 0%</TextStyle>
              </Stack>
            </Card>
          </div>

          <div style={{ flex: '1', margin: '0 0 0 15px', height: '150px' }}> {/* Set a fixed height */}
            <Card sectioned title="Questions received" style={{ height: '100% !important' }}>
              <Stack>
                <TextStyle variation="strong" textAlign="center">
                  {data.questionsReceived}
                </TextStyle>
                <TextStyle variation="subdued">— 0%</TextStyle>
              </Stack>
            </Card>
          </div>

          <div style={{ flex: '1', margin: '0 0 0 15px', height: '150px' }}> {/* Set a fixed height */}
            <Card sectioned title="Trust scores" style={{ height: '100%' }}>
              <Stack>
                <TextStyle variation="strong">
                  Transparency: {data.trustScores.transparency}%
                </TextStyle>
                <TextStyle variation="strong">
                  Authenticity: {data.trustScores.authenticity}%
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
                rows={data.topProducts.map(product => [product.name, product.reviews, product.rating])}
              />
            </Card>
          </Layout.Section>

          <Layout.Section oneHalf>
            <Card title="Recent activity" sectioned>
              <Stack vertical>
                <TextStyle variation="strong">Last reviews</TextStyle>
                {data.recentReviews.map((review, index) => (
                  <Stack key={index} alignment="center">
                    <TextStyle>
                      {Array(review.rating).fill('⭐').join('')} — {review.comment}
                    </TextStyle>
                    <TextStyle variation="subdued">({review.date})</TextStyle>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Layout.Section>
      </Layout>
    </Page>
  );
}

async function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reviewRequestsSent: 0,
        reviewsOverTime: 3,
        revenueGenerated: 0,
        averageRating: 4.33,
        ordersFromJudgeMe: 0,
        questionsReceived: 0,
        trustScores: { transparency: 0, authenticity: 0 },
        topProducts: [{ name: 'eeeeeeee', reviews: 2, rating: 4 }],
        recentReviews: [
          { rating: 4, comment: 'iiiiiiii', date: '22 hours ago' },
          { rating: 5, comment: '5t', date: '2 days ago' },
        ],
      });
    }, 1000);
  });
}

export default DashboardPage;
