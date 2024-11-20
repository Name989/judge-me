document.addEventListener("DOMContentLoaded", function () {
    let images = []
    let imageurl 
    // Inject CSS for star rating, review list, and input form
    const style = document.createElement("style");
    style.textContent = `
  .product-review-container {
    font-family: Arial, sans-serif;
    width: 100%;
    max-width: 400px;
    margin: 20px auto;
    padding: 15px;
    border: 1px solid #e1e3e5;
    border-radius: 5px;
  }
  #product-rating {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 18px;
    margin-top: 10px
  }
  .star {
    font-size: 24px;
    color: #2aacbb;
    cursor: pointer;
  }
  #reviews h3 {
    margin-top: 20px;
  }
  .review-item {
    padding: 10px;
    border-bottom: 1px solid #e1e3e5;
  }
  .review-item:last-child {
    border-bottom: none;
  }
  .review-item .stars {
    font-size: 24px;
    color: #2aacbb;
  }
  .review-item p {
    margin: 5px 0 0;
  }
  #review-form {
    margin-top: 20px;
  }
  #review-form textarea {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    font-size: 14px;
  }
  #review-form button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #0070f3;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
  }
    #reviews{
        height: 300px;
    overflow-y: scroll;
    }
  #image-upload {
    margin-top: 15px;
  }
  #image-upload input {
    font-size: 14px;
    padding: 5px;
  }
`;
    document.head.appendChild(style);

    // Create HTML structure for product reviews and form
    const container = document.createElement("div");
    container.className = "product-review-container";
    container.innerHTML = `
    <div id="review-form">
    <h3>Submit Your Review</h3>
    <div id="user-stars" class="user-star-input"></div>
    <textarea id="user-review" placeholder="Write your review here..."></textarea>
    <textarea id="review-description" placeholder="Write your review description here..."></textarea>
    <div id="image-upload">
      <input type="file" id="image-file" accept="image/*" />
    </div>
    <button id="submit-review">Submit Review</button>
  </div>
  <div id="product-rating">
    <div id="star-rating"></div>
    <span id="average-rating"></span> / 5
  </div>
  <div id="reviews">
    <h3>Customer Reviews</h3>
    <ul id="review-list"></ul>
  </div>
`;

    document.body.appendChild(container);

    let reviews = [];

    // Function to fetch reviews from the API
    async function fetchReviews() {
        try {
          const response = await fetch('hhttps://broadway-pillow-bahamas-sf.trycloudflare.com/api/reviews/fetchdata'); // Replace with your endpoint
            if (!response.ok) throw new Error("Failed to fetch reviews");
            reviews = await response.json();
            updateReviewsUI();
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    }

    // Calculate average rating
    function calculateAverageRating() {
        return (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
    }

    // Function to render stars
    function renderStars(rating, starContainer, isInteractive = false) {
        starContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.textContent = i <= rating ? '★' : '☆';
            if (isInteractive) {
                star.addEventListener('click', () => setUserRating(i));
            }
            starContainer.appendChild(star);
        }
    }

    // Function to set user rating for submission
    let userRating = 0;
    function setUserRating(rating) {
        userRating = rating;
        renderStars(rating, document.getElementById('user-stars'), true);
    }

    // Display average rating and stars
    function updateProductRatingUI() {
        const averageRating = calculateAverageRating();
        document.getElementById("average-rating").textContent = averageRating;
        renderStars(Math.round(averageRating), document.getElementById("star-rating"));
    }

    // Display each review in the list
    function updateReviewsUI() {
        const reviewList = document.getElementById("review-list");
        reviewList.innerHTML = ''; // Clear previous reviews
        reviews.forEach(({ rating, title, description }) => {
            const reviewItem = document.createElement("li");
            reviewItem.classList.add("review-item");
            reviewItem.innerHTML = `
      <div class="stars">${'★'.repeat(rating) + '☆'.repeat(5 - rating)}</div>
      <p>${title}</p>
      <p>${description}</p>
    `;
            reviewList.appendChild(reviewItem);
        });
        updateProductRatingUI();
    }

    // Initialize the star input for user review
    renderStars(0, document.getElementById("user-stars"), true);

    // Handle image file upload and log image data to console
    async function uploadimage(images) {
        console.log('imagesss---', images);

        // Ensure images is an array
        if (!Array.isArray(images)) {
            images = [images]; // If it's not an array, wrap it in an array
        }

        images.forEach(file => {
            console.log('file-----', file);

            // Check if file exists
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64Image = e.target.result; // Base64 string of the image
                    console.log('Base64 Image:', base64Image); // Optional: to verify the base64 data

                    // Send the base64 image data to the server
                  fetch('https://broadway-pillow-bahamas-sf.trycloudflare.com/api/upload-image', {  // Change URL if needed
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: base64Image }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Image uploaded:', data.message);
                            console.log('Image URL:', data.image_url); // The URL of the uploaded image
                            imageurl = data.image_url
                        })
                        .catch(error => {
                            console.error('Error uploading image:', error);
                        });
                };

                reader.readAsDataURL(file);
            }
        });
    }

    
    document.getElementById('image-upload').addEventListener('change', (event) => {
        const file = event.target.files[0];
        images = file;
        console.log('imagesss---', images);
    })
    // Handle review submission
    document.getElementById("submit-review").addEventListener("click", async () => {
        const reviewText = document.getElementById("user-review").value;
        const reviewDescription = document.getElementById("review-description").value;

        if (userRating === 0 || !reviewText.trim() || !reviewDescription.trim() ) {
            alert("Please select a rating and enter your review.");
            return;
        }

        const newReview = { rating: userRating, title: reviewText, description: reviewDescription };

        try {
          const response = await fetch('https://broadway-pillow-bahamas-sf.trycloudflare.com/api/reviews', {  // Replace with your POST endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: 'test product',
                    customer_name: 'test',
                    title: reviewText,
                    rating: userRating,
                    description: reviewDescription,
                    status: 'Published',
                    type: 'Product',
                    via: 'web',
                }),
            });
            if (!response.ok) throw new Error("Failed to submit review");

            reviews.push(newReview); // Update local reviews array
            updateReviewsUI(); // Update the UI with new review
            uploadimage(images)

            // Reset form
            setUserRating(0);
            document.getElementById("user-review").value = '';
            document.getElementById("review-description").value = '';
            document.getElementById('image-file').value = '';  // Clear image input field
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    });

    // Fetch and display initial reviews
    fetchReviews();


});
