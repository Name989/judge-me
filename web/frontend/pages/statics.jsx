import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import {
    Page,
    Layout,
    Card,
    TextContainer,
    Badge,
    Stack,
    DisplayText,
    List,
    ProgressBar,
    Link,
    Button
} from '@shopify/polaris';
import { Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';

// Register chart elements
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend, Title);

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [averageRatings, setAverageRatings] = useState([]);
    const [averageRatings1, setAverageRatings1] = useState([]);
    const [organicReviewCount, setOrganicReviewCount] = useState(0);
    const navigate = useNavigate();
    // Fetch reviews from API
    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/reviews/data');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setReviews(data);
            processReviewsData(data);
            processReviewsData1(data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };

    const handleRedirect1 = () => {
        navigate('/');
    };
    // Process data for charts
    const processReviewsData = (data) => {
        const monthlyRatings = new Array(12).fill(0);
        const ratingCounts = new Array(12).fill(0);
        let organicCount = 0;

        data.forEach((review) => {
            const month = new Date(review.created_at).getMonth(); // Get month index (0 = Jan, 11 = Dec)
            monthlyRatings[month] += review.rating;
            ratingCounts[month] += 1;

            // Increment organic review count
            if (review.type === 'Product') {
                organicCount += 1;
            }
        });

        // Calculate average rating per month
        const averages = monthlyRatings.map((total, index) => (ratingCounts[index] === 0 ? 0 : total / ratingCounts[index]));
        setAverageRatings(averages);

        // Set organic review count
        setOrganicReviewCount(organicCount);
    };
    const processReviewsData1 = (data) => {
        const monthlyRatings = new Array(12).fill(0);
        const ratingCounts = new Array(12).fill(0);

        data.forEach((review) => {
            const month = new Date(review.created_at).getMonth(); // Get month index (0 = Jan, 11 = Dec)
            monthlyRatings[month] += review.rating;
            ratingCounts[month] += 1;

        });

        // Calculate average rating per month
        const averages1 = monthlyRatings.map((total, index) => (ratingCounts[index] === 0 ? 0 : total));
        setAverageRatings1(averages1);

    };
    useEffect(() => {
        fetchReviews();
    }, []);

    // Line chart data
    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Average Rating',
                data: averageRatings,
                borderColor: '#5c6ac4',
                backgroundColor: '#5c6ac4',
                fill: false,
            },
        ],
    };

    const lineData1 = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Average Rating',
                data: averageRatings1,
                borderColor: '#5c6ac4',
                backgroundColor: '#5c6ac4',
                fill: false,
            },
        ],
    };

    // Pie chart data (only Organic Reviews)
    const pieData = {
        labels: ['Organic Reviews', 'Web Reviews'],
        datasets: [
            {
                data: [organicReviewCount, organicReviewCount],
                backgroundColor: ['#1abc9c', '#f54257'],
                borderWidth: 0,
            },
        ],
    };


    // Pie chart options to create the doughnut effect and align legend
    const pieOptions = {
        cutout: '50%', // for doughnut effect
        plugins: {
            legend: {
                position: 'right', // Align legend on the right
                labels: {
                    usePointStyle: true, // Display legend with small circles
                    padding: 20,
                },
            },
            tooltip: {
                enabled: true,
            },
        },
    };


    // Custom style for equal chart height
    const chartHeight = '350px'; // Fixed height for all charts

    return (
        <Page>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{ maxWidth: '62.375rem' }}>
                    <div className="title-container" style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            size="medium"
                            icon={<FaArrowLeftLong />}
                            onClick={() => handleRedirect1()}
                        />
                        <h1 style={{ marginLeft: '5px' }}> Published Reviews Rating</h1>
                    </div>
                    <Layout>
                        {/* Average Rating by Creation Date */}
                        <Layout.Section oneHalf>
                            <div style={{ height: '300px' }}>
                                <Card title="Average rating by creation date" sectioned>
                                    <Line data={lineData} />
                                </Card>
                            </div>
                        </Layout.Section>

                        {/* Review Rating Breakdown */}
                        <Layout.Section oneHalf>
                            <div style={{ height: '300px' }}>
                                <Card title="Review rating breakdown" sectioned>
                                    <TextContainer>
                                        <p>
                                            You don't have any published reviews yet. You can <Link>import your existing reviews</Link>.
                                        </p>
                                    </TextContainer>
                                </Card>
                            </div>
                        </Layout.Section>

                        {/* All Reviews Performance */}
                        <Layout.Section oneHalf>
                            <div style={{ height: '300px' }}>
                                <Card title="All reviews performance" sectioned>
                                    <Line data={lineData1} />
                                </Card>
                            </div>
                        </Layout.Section>


                        {/* Reviews by Source */}
                        <Layout.Section oneHalf>
                            <div style={{ height: '300px' }}>
                                <Card title="Reviews by source" sectioned>
                                    <div style={{ position: 'relative', height: chartHeight }}>
                                        {/* Center number inside doughnut */}
                                        <div style={{
                                            position: 'sticky',
                                            left: '50%',
                                            transform: 'translate(14%, -18%)',
                                            fontSize: '3rem',
                                            fontWeight: 'bold',
                                            height: chartHeight
                                        }}>
                                            <Pie data={pieData} options={pieOptions} />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Layout.Section>

                        {/* Scores and Medals */}
                        <Layout.Section oneHalf>
                            <div style={{ height: '250px' }}>
                                <Card title="Trust scores" sectioned>
                                    <Stack vertical>
                                        <TextContainer>
                                            <DisplayText size="small">Transparency</DisplayText>
                                            <ProgressBar progress={10} />
                                        </TextContainer>
                                        <TextContainer>
                                            <DisplayText size="small">Authenticity</DisplayText>
                                            <ProgressBar progress={10} />
                                        </TextContainer>
                                        <p>0 out of {reviews.length} published reviews are verified.</p>
                                    </Stack>
                                </Card>
                            </div>
                        </Layout.Section>

                        <Layout.Section oneHalf>
                            <div style={{ height: '250px' }}>
                                <Card title="Store medals" sectioned>
                                    <Stack>
                                        {/* Replace with actual medals */}
                                        <p>Store medals will go here.</p>
                                    </Stack>
                                </Card>
                            </div>
                        </Layout.Section>
                    </Layout>
                </div>
            </div>
        </Page>
    );
};

export default ReviewsPage;
