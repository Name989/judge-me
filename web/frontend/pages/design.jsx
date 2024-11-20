import React, { useState, useEffect } from 'react';
import {
    Page,
    Layout,
    Card,
    Checkbox,
    Select,
    Button,
    TextField,
    Stack,
    Heading,
    TextStyle,
    FormLayout,
    Toast,
    Frame,
} from '@shopify/polaris';

function ReviewWidgetPage() {
    // State for dynamic settings
    const [primaryColor, setPrimaryColor] = useState('#39c997');
    const [starColor, setStarColor] = useState('#f59d47');
    const [borderEnabled, setBorderEnabled] = useState(false);
    const [borderStyle, setBorderStyle] = useState('');
    const [reviewDate, setReviewDate] = useState(true);
    const [sortMethod, setSortMethod] = useState('Most Recent');
    const [reviewsPerPage, setReviewsPerPage] = useState(5);
    const [showToast, setShowToast] = useState(false);

    const sortOptions = [
        { label: 'Most Recent', value: 'Most Recent' },
        { label: 'Highest Rated', value: 'Highest Rated' },
        { label: 'Lowest Rated', value: 'Lowest Rated' },
    ];
    // Fetch default settings when the component mounts
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`/api/settings/1`); // Static ID 1
                if (!response.ok) throw new Error('Failed to fetch settings');

                const data = await response.json();
                setPrimaryColor(data.primary_color || '#39c997');
                setStarColor(data.star_color || '#f59d47');
                setBorderEnabled(data.border_around_widget || false);
                setBorderStyle(data.border_style || '');
                setReviewDate(data.show_review_date || true);
                setSortMethod(data.default_sorting_method || 'Most Recent');
                setReviewsPerPage(data.reviews_per_page || 5);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchSettings();
    }, []);
    // Save settings to the database
    const handleSave = async () => {
        const settings = {
            primary_color: primaryColor,
            star_color: starColor,
            border_around_widget: borderEnabled,
            border_style: borderStyle,
            show_review_date: reviewDate,
            default_sorting_method: sortMethod,
            reviews_per_page: reviewsPerPage,
        };

        try {

            try {
                // Send the status update to the server
                const response = await fetch(`/api/settings/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(settings), // Only send the status update
                });

                if (!response.ok) throw new Error('Failed to update review type');

            } catch (error) {
                console.error('Failed to update review status:', error);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <Frame>
            <Page title="Review Widget" fullWidth>
                <Layout>
                    {/* Left Column */}
                    <Layout.Section>
                        {/* Theme Section */}
                        <Card title="Theme Settings" sectioned>
                            <Card.Section>
                                <FormLayout>
                                    <Checkbox
                                        label="Show review date"
                                        checked={reviewDate}
                                        onChange={setReviewDate}
                                    />
                                    <Checkbox
                                        label="Add a border around the widget"
                                        checked={borderEnabled}
                                        onChange={setBorderEnabled}
                                    />
                                    <Select
                                        label="Border Style"
                                        options={[
                                            { label: 'Square corners', value: 'square' },
                                            { label: 'Round corners', value: 'round' },
                                        ]}
                                        value={borderStyle}
                                        onChange={setBorderStyle}
                                        disabled={!borderEnabled}
                                    />
                                </FormLayout>
                            </Card.Section>
                            <Card.Section title="Color">
                                <FormLayout>
                                    <TextField
                                        label="Primary color"
                                        type="color"
                                        value={primaryColor}
                                        onChange={setPrimaryColor}
                                    />
                                    <TextField
                                        label="Star color"
                                        type="color"
                                        value={starColor}
                                        onChange={setStarColor}
                                    />
                                </FormLayout>
                            </Card.Section>
                            <Card.Section title="Sorting and Reviews Per page">
                                <FormLayout>
                                    <Select
                                        label="Default sorting method"
                                        options={sortOptions}
                                        value={sortMethod}
                                        onChange={setSortMethod}
                                    />
                                    <TextField
                                        label="Number of reviews per page"
                                        type="number"
                                        value={reviewsPerPage}
                                        onChange={(value) => setReviewsPerPage(parseInt(value, 10))}
                                    />
                                </FormLayout>
                            </Card.Section>
                            <Button primary onClick={handleSave}>
                                Save Settings
                            </Button>
                        </Card>
                    </Layout.Section>

                    {/* Right Column - Preview Panel */}
                    <Layout.Section secondary>
                        <Card title="Preview">
                            <Card.Section>
                                <Heading>Customer Reviews</Heading>
                                <p style={{ color: starColor }}>★★★★★</p>
                                <p style={{ color: primaryColor }}>5.0 out of 5</p>
                                <TextStyle variation="subdued">Based on 3 reviews</TextStyle><br></br>
                                <Button primary>Write a review</Button>
                                <div style={{ marginTop: '1em' }}>
                                    <p style={{ color: primaryColor }}>Most Recent</p >
                                    <div
                                        style={{
                                            border: `1px ${borderStyle} ${borderEnabled ? primaryColor : 'transparent'}`,
                                            padding: '1em',
                                            marginTop: '1em',
                                        }}
                                    >
                                        <p style={{ color: primaryColor }}>John Smith</p>
                                        <p style={{ color: starColor }}>★★★★★</p>
                                        <p style={{ color: primaryColor }}>
                                            This is a sample review to demonstrate the widget.
                                        </p>
                                    </div>
                                </div>
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                </Layout>
                {showToast && <Toast content="Settings saved successfully!" onDismiss={() => setShowToast(false)} />}
            </Page>
        </Frame>
    );
}

export default ReviewWidgetPage;
