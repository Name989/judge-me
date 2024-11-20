import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Layout, Card, TextContainer, Heading, Button, Badge, Grid, ButtonGroup } from '@shopify/polaris';
import reviewWidgetImage from './images/Screenshot_13.png';
import starRatingBadgeImage from './images/Screenshot_1.png';
import reviewsCarouselImage from './images/Screenshot_2.png';
import './extra.css';

function WidgetsPage() {
    const navigate = useNavigate();

    const handleReviewWidgetCustomize = () => {
        navigate('/design');
    };

    const handleStarRatingCustomize = () => {
        navigate('/star-rating-design');
    };

    const handleReviewsCarouselCustomize = () => {
        navigate('/reviews-carousel-design');
    };

    return (
        <Page title="Widgets" secondaryActions={[{ content: 'Change theme' }]}>
            <Layout>
                <Layout.Section>
                    <TextContainer spacing="tight">
                        <Heading>Getting started</Heading>
                    </TextContainer>

                    {/* Grid layout to match the 3-card wide structure */}
                    <Grid columns={{ xs: 1, sm: 3, md: 3, lg: 3 }} gap="small">
                        <WidgetCard
                            title="Review Widget"
                            description="Collect and display product reviews on your product pages."
                            imageSrc={reviewWidgetImage}
                            isInstalled={true}
                            onCustomize={handleReviewWidgetCustomize}
                        />
                        <WidgetCard
                            title="Star Rating Badge"
                            description="Show the average rating of your products and how many reviews they've received."
                            imageSrc={starRatingBadgeImage}
                            onCustomize={handleStarRatingCustomize}
                        />
                        <WidgetCard
                            title="Reviews Carousel"
                            description="Showcase your best reviews in a carousel on a page of your choice."
                            imageSrc={reviewsCarouselImage}
                            onCustomize={handleReviewsCarouselCustomize}
                        />
                    </Grid>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

function WidgetCard({ title, description, imageSrc, isInstalled, onCustomize }) {
    return (
        <Card>
            {/* Image Section with <img> tag */}
            <img
                src={imageSrc}
                alt={`${title} preview`}
                style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                }}
            />
            <Card.Section>
                <TextContainer spacing="tight">
                    <Heading>
                        {title} {isInstalled && <Badge progress="complete" tone="success">Installed</Badge>}
                    </Heading>
                    <p>{description}</p>
                </TextContainer>
            </Card.Section>
            <Card.Section>
                <ButtonGroup fullWidth>
                    <Button fullWidth onClick={onCustomize}>Customize</Button>
                    {!isInstalled && <Button primary fullWidth>Install</Button>}
                </ButtonGroup>
            </Card.Section>
        </Card>
    );
}

export default WidgetsPage;

