// createArticle.js - Add this to your HTML or save as a separate file

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const titleInput = document.getElementById('title-input');
    const authorInput = document.getElementById('author-input');
    const articleTextArea = document.getElementById('articleText');
    const imageInput = document.getElementById('img-input');
    const uploadBtn = document.getElementById('uploadBtn');

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
            // Process image if provided
            let imageSrc = null;
            if (imageInput.files && imageInput.files[0]) {
                imageSrc = await handleImageFile(imageInput.files[0]);
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

            // Show success message
            alert('Article successfully created and saved!');
            
            // Optionally redirect to view all articles
            // window.location.href = 'articles.html';
            
            // Or clear the form for a new article
            titleInput.value = '';
            authorInput.value = '';
            articleTextArea.value = '';
            imageInput.value = '';
            
        } catch (error) {
            console.error('Error saving article:', error);
            alert('Failed to save article. Please try again.');
        }
    });

    // Optional: Add preview functionality
    // Implement if needed
});