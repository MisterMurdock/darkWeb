// createArticle.js - Updated with default image and toast notification

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const titleInput = document.getElementById('title-input');
    const authorInput = document.getElementById('author-input');
    const articleTextArea = document.getElementById('articleText');
    const imageInput = document.getElementById('img-input');
    const uploadBtn = document.getElementById('uploadBtn');

    const DEFAULT_IMAGE = '../public/storyImgs/default-img.jpg';
    // Add event listener to the upload button
    uploadBtn.addEventListener('click', async function() {
        // Validate inputs
        if (!titleInput.value.trim()) {
            alert('Please enter a title');
            return;
        }
        if (!authorInput.value.trim()) {
            alert('Please enter an author name');
            return;
        }
        if (!articleTextArea.value.trim()) {
            alert('Please enter article content');
            return;
        }

        try {
            // Process image if provided, otherwise use default
            let imageSrc = DEFAULT_IMAGE; // Start with default image
            
            if (imageInput.files && imageInput.files[0]) {
                try {
                    imageSrc = await handleImageFile(imageInput.files[0]);
                } catch (imgError) {
                    console.warn('Error processing image, using default:', imgError);
                    // Keep using default image if there's an error
                }
            }

            // Create new article
            const article = new MyArticle(
                titleInput.value.trim(),
                articleTextArea.value.trim(),
                authorInput.value.trim(),
                imageSrc
            );

            // Save article
            const articleId = ArticleManager.saveArticle(article);

            // Show success toast
            if (typeof showToast === 'function') {
                showToast('success', 'Article successfully created!');
            } else {
                alert('Article successfully created and saved!');
            }
            
            // Delay redirect to allow toast to be seen
            setTimeout(() => {
                // Redirect to view all articles
                window.location.href = 'viewArticles.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error saving article:', error);
            
            // Show error toast if available, otherwise fallback to alert
            if (typeof showToast === 'function') {
                showToast('error', 'Failed to save article. Please try again.');
            } else {
                alert('Failed to save article. Please try again.');
            }
        }
    });

    // Helper function for handling image files (if not already defined elsewhere)
    // This is a placeholder - use your actual image handling function
    async function handleImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                resolve(e.target.result); // This will be a data URL like "data:image/jpeg;base64,..."
            };
            
            reader.onerror = function(e) {
                reject(new Error('Error reading image file'));
            };
            
            reader.readAsDataURL(file);
        });
    }
});