document.addEventListener('DOMContentLoaded', function() {
    // Get article ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        displayError("No article ID provided");
        return;
    }
    
    // Load article from localStorage
    loadArticle(articleId);
    
    // Set up likes/dislikes functionality
    setupLikesFunctionality(articleId);
    
    // Set up comments functionality
    setupCommentsFunctionality(articleId);
});

//delete article when clicking the delete button
document.getElementById('delete-article-btn').addEventListener('click', function() {    
    // Get article ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        console.error("No article ID provided");
        displayError("No article ID provided");
        return;
    }
    
    // Confirm deletion
    if (confirm("Are you sure you want to delete this article?")) {
        console.log("Deletion confirmed, attempting to delete article with ID:", articleId);
        
        try {
            // Delete the article
            ArticleManager.deleteArticle(articleId);
            console.log("Article deleted successfully");
            
            // Show deletion toast
            showToast('error', 'Article deleted successfully!');
            
            // Add a small delay before redirecting
            setTimeout(function() {
                window.location.href = '../pages/viewArticles.html';
            }, 1500);
        } catch (error) {
            console.error("Error deleting article:", error);
            displayError("Failed to delete the article");
        }
    } else {
        console.log("Deletion cancelled by user");
    }
});



// Load article from localStorage
function loadArticle(articleId) {
    try {
        // Get articles from localStorage
        const articlesJSON = localStorage.getItem('darkweb_articles');
        if (!articlesJSON) {
            displayError("No articles found");
            return;
        }
        
        const articles = JSON.parse(articlesJSON);
        const article = articles.find(a => a.id === articleId);
        
        if (!article) {
            displayError("Article not found");
            return;
        }
        
        // Display article content
        displayArticle(article);
        
    } catch (error) {
        console.error("Error loading article:", error);
        displayError("Error loading article");
    }
}

// Display article content on the page
function displayArticle(article) {
    // Set the title in the document
    document.title = `${article.title} - Darkweb`;
    
    // Set article title
    const titleElement = document.querySelector('.text-2xl.font-bold');
    if (titleElement) {
        titleElement.textContent = article.title;
    }
    
    // Set article content
    const contentElement = document.getElementById('textContent');
    if (contentElement) {
        
        // Clear previous content
        contentElement.innerHTML = '';
        
        // Split content by newlines and create properly sanitized elements
        const paragraphs = article.content.split('\n');
        paragraphs.forEach((paragraph, index) => {
            if (paragraph.trim() !== '') {
                const p = document.createElement('p');
                p.textContent = paragraph;
                p.className = 'mb-2';
                contentElement.appendChild(p);
            } else if (index < paragraphs.length - 1) {
                // Add spacing for empty lines (except the last one)
                const spacer = document.createElement('div');
                spacer.className = 'h-4'; // height spacing
                contentElement.appendChild(spacer);
            }
        });
    }
    
    // Set article image if available
    const imageElement = document.querySelector('.object-cover');
    if (imageElement) {
        if (article.images && article.images.length > 0) {
            imageElement.src = article.images[0];
            imageElement.alt = article.title;
        } else {
            // Default image if none provided
            imageElement.src = "../storyImgs/default-img.jpg";
            imageElement.alt = "Default image";
        }
    }

    
    // Add author and date information below the title
    // SECURITY FIX: textContent instead of innerHTML to prevent XSS
    const titleParent = titleElement?.parentElement;
    if (titleParent) {
        const metaInfo = document.createElement('p');
        metaInfo.className = 'text-sm text-gray-400 mb-4';
        
        // Create elements instead of using innerHTML
        const byText = document.createTextNode('By ');
        metaInfo.appendChild(byText);
        
        const authorSpan = document.createElement('span');
        authorSpan.className = 'font-medium';
        authorSpan.textContent = article.author;
        metaInfo.appendChild(authorSpan);
        
        const dateText = document.createTextNode(` • ${article.date}`);
        metaInfo.appendChild(dateText);
        
        // Insert after the title
        titleElement.insertAdjacentElement('afterend', metaInfo);
    }
}

// Display error message
function displayError(message) {
    const contentElement = document.getElementById('textContent');
    if (contentElement) {
        contentElement.innerHTML = `<div class="p-4 text-red-500">Error: ${message}</div>`;
    }
}

// Set up likes and dislikes functionality
function setupLikesFunctionality(articleId) {
    // Get article data
    const articlesJSON = localStorage.getItem('darkweb_articles');
    if (!articlesJSON) return;
    
    const articles = JSON.parse(articlesJSON);
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    const likesContainer = document.getElementById('likes-container');
    if (!likesContainer) return;
    
    // Create likes/dislikes UI
    likesContainer.innerHTML = `
        <div class="mt-6 flex items-center space-x-4 px-4">
            <button id="like-button" class="flex items-center space-x-2 text-gray-400 hover:text-green-500">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                </svg>
                <span id="likes-count">${article.likes || 0}</span>
            </button>
            <button id="dislike-button" class="flex items-center space-x-2 text-gray-400 hover:text-red-500">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
                </svg>
                <span id="dislikes-count">${article.dislikes || 0}</span>
            </button>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('like-button').addEventListener('click', function() {
        updateLikes(articleId, 'like');
    });
    
    document.getElementById('dislike-button').addEventListener('click', function() {
        updateLikes(articleId, 'dislike');
    });
}

// Update likes or dislikes
function updateLikes(articleId, action) {
    // Get article data
    const articlesJSON = localStorage.getItem('darkweb_articles');
    if (!articlesJSON) return;
    
    const articles = JSON.parse(articlesJSON);
    const articleIndex = articles.findIndex(a => a.id === articleId);
    if (articleIndex === -1) return;
    
    // Update likes/dislikes
    if (action === 'like') {
        articles[articleIndex].likes = (articles[articleIndex].likes || 0) + 1;
        document.getElementById('likes-count').textContent = articles[articleIndex].likes;
    } else {
        articles[articleIndex].dislikes = (articles[articleIndex].dislikes || 0) + 1;
        document.getElementById('dislikes-count').textContent = articles[articleIndex].dislikes;
    }
    
    // Save updated data
    localStorage.setItem('darkweb_articles', JSON.stringify(articles));
}


function setupCommentsFunctionality(articleId) {
    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) return;
    
    // Get article data
    const articlesJSON = localStorage.getItem('darkweb_articles');
    if (!articlesJSON) return;
    
    const articles = JSON.parse(articlesJSON);
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    // Create comments UI with dynamic content
    commentsContainer.innerHTML = `
        <div class="mt-6 px-4 py-2">
            <h3 class="text-xl font-bold text-white mb-4">Comments (${article.comments?.length || 0})</h3>
            <div id="comments-list" class="space-y-4 mb-6">
                ${renderCommentsList(article.comments || [], articleId)}
            </div>
            <div class="mb-6">
                <textarea id="comment-text" class="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600" 
                    rows="3" placeholder="Add a comment..."></textarea>
                <button id="add-comment-btn" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add Comment
                </button>
            </div>
        </div>
    `;
    
    // Add comment event listener
    document.getElementById('add-comment-btn').addEventListener('click', function() {
        addComment(articleId);
    });

    // Enter key support
    document.getElementById('comment-text').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addComment(articleId);
        }
    });

    //delete comment buttons
    setupDeleteCommentButtons(commentsContainer);

    // Delegate event handling for view all comments
    commentsContainer.addEventListener('click', function(e) {
        if (e.target.id === 'view-all-comments' || e.target.closest('#view-all-comments')) {
            e.preventDefault();
            const articles = JSON.parse(localStorage.getItem('darkweb_articles') || '[]');
            const article = articles.find(a => a.id === articleId);
            if (article && article.comments) {
                createAllCommentsModal(article.comments, articleId);
            }
        }
    });
}

// Display comments list with latest 3 comments, view all option, and delete buttons
function renderCommentsList(comments, articleId) {
    if (!comments || comments.length === 0) {
        return `<p class="text-gray-400">No comments yet. Be the first to comment!</p>`;
    }

    // Slice to get latest 3 comments
    const latestComments = comments.slice(-3).reverse();
    
    const commentsHTML = latestComments.map((comment, index) => `
        <div class="p-3 bg-gray-700 rounded-lg flex justify-between group" id="comment-${comments.length - index}">
            <div class="flex-grow">
                <p class="text-white">${escapeHTML(comment)}</p>
                <p class="text-xs text-gray-400 mt-1">Anonymous • ${new Date().toLocaleDateString()}</p>
            </div>
            <button class="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity delete-comment-btn" 
                data-article-id="${articleId}" data-comment-index="${comments.length - index - 1}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `).join('');

    // Add view all comments link if more than 3 comments
    const viewAllLink = comments.length > 3 ? `
        <div class="text-center mt-4">
            <a href="#" id="view-all-comments" class="text-blue-400 hover:text-blue-300 text-sm">
                View all ${comments.length} comments
            </a>
        </div>
    ` : '';

    return commentsHTML + viewAllLink;
}

// Create all comments modal with delete buttons
function createAllCommentsModal(comments, articleId) {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'all-comments-modal';
    modalContainer.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center';
    
    // Modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative';
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'absolute top-4 right-4 text-white text-3xl hover:text-gray-300';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    // Modal title
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'text-2xl font-bold text-white mb-6';
    modalTitle.textContent = `All Comments (${comments.length})`;
    
    // Comments container
    const allCommentsContainer = document.createElement('div');
    allCommentsContainer.className = 'space-y-4';
    
    // Render all comments (newest first)
    comments.slice().reverse().forEach((comment, index) => {
        const commentEl = document.createElement('div');
        commentEl.className = 'p-4 bg-gray-700 rounded-lg flex justify-between group';
        
        const commentContent = document.createElement('div');
        commentContent.className = 'flex-grow';
        
        const commentTextEl = document.createElement('p');
        commentTextEl.className = 'text-white mb-2';
        commentTextEl.textContent = comment;
        
        const commentMetaEl = document.createElement('p');
        commentMetaEl.className = 'text-xs text-gray-400';
        commentMetaEl.textContent = `Anonymous • ${new Date().toLocaleDateString()}`;
        
        commentContent.appendChild(commentTextEl);
        commentContent.appendChild(commentMetaEl);
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity';
        deleteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        `;
        
        // Add data attributes for delete functionality
        deleteBtn.dataset.articleId = articleId;
        deleteBtn.dataset.commentIndex = comments.length - index - 1;
        deleteBtn.classList.add('delete-comment-btn');
        
        commentEl.appendChild(commentContent);
        commentEl.appendChild(deleteBtn);
        
        allCommentsContainer.appendChild(commentEl);
    });
    
    // Assemble modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(allCommentsContainer);
    modalContainer.appendChild(modalContent);
    
    // Add modal to body
    document.body.appendChild(modalContainer);
    
    // Add event listeners for delete buttons in modal
    setupDeleteCommentButtons(modalContainer);
    
    // Close modal when clicking outside
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });
}
// Setup event listeners for delete comment buttons
function setupDeleteCommentButtons(container) {
    const deleteButtons = container.querySelectorAll('.delete-comment-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.dataset.articleId;
            const commentIndex = parseInt(this.dataset.commentIndex);
            removeComment(articleId, commentIndex);
        });
    });
}

// Remove comment function
function removeComment(articleId, commentIndex) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }
    showToast('success', 'Comment deleted successfully!');
    // Get articles from localStorage
    const articlesJSON = localStorage.getItem('darkweb_articles');
    if (!articlesJSON) {
        alert('Error: Could not find articles');
        return;
    }
    
    // Parse articles and find the current article
    const articles = JSON.parse(articlesJSON);
    const articleIndex = articles.findIndex(a => a.id === articleId);
    
    if (articleIndex === -1) {
        alert('Error: Article not found');
        return;
    }
    
    if (!articles[articleIndex].comments || commentIndex >= articles[articleIndex].comments.length) {
        alert('Error: Comment not found');
        return;
    }
    
    // Use ArticleManager to remove comment if available
    try {
        if (typeof ArticleManager !== 'undefined') {
            const articleObj = ArticleManager.getArticleById(articleId);
            if (articleObj && typeof articleObj.removeComment === 'function') {
                articleObj.removeComment(articles[articleIndex].comments[commentIndex]);
            } else {
                // Fallback: Remove comment directly
                articles[articleIndex].comments.splice(commentIndex, 1);
                localStorage.setItem('darkweb_articles', JSON.stringify(articles));
            }
        } else {
            // Fallback: Remove comment directly
            articles[articleIndex].comments.splice(commentIndex, 1);
            localStorage.setItem('darkweb_articles', JSON.stringify(articles));
        }
    } catch (error) {
        console.error('Error using ArticleManager:', error);
        // Fallback: Remove comment directly
        articles[articleIndex].comments.splice(commentIndex, 1);
        localStorage.setItem('darkweb_articles', JSON.stringify(articles));
    }
    
    // Update comments list in the UI
    const commentsList = document.getElementById('comments-list');
    if (commentsList) {
        // Update the comments list
        const updatedArticles = JSON.parse(localStorage.getItem('darkweb_articles'));
        const updatedArticle = updatedArticles.find(a => a.id === articleId);
        if (updatedArticle) {
            commentsList.innerHTML = renderCommentsList(updatedArticle.comments || [], articleId);
            
            // Setup delete buttons for the updated list
            setupDeleteCommentButtons(commentsList);
        }
    }
    
    // Update comment count in title
    const commentsCountEl = document.querySelector('#comments-container h3');
    if (commentsCountEl) {
        const updatedArticles = JSON.parse(localStorage.getItem('darkweb_articles'));
        const updatedArticle = updatedArticles.find(a => a.id === articleId);
        if (updatedArticle) {
            commentsCountEl.textContent = `Comments (${updatedArticle.comments?.length || 0})`;
        }
    }
    
    // If in a modal, update or close it
    const modal = document.getElementById('all-comments-modal');
    if (modal) {
        const updatedArticles = JSON.parse(localStorage.getItem('darkweb_articles'));
        const updatedArticle = updatedArticles.find(a => a.id === articleId);
        
        if (!updatedArticle || !updatedArticle.comments || updatedArticle.comments.length === 0) {
            // Close modal if no comments left
            document.body.removeChild(modal);
        } else {
            // Refresh modal with updated comments
            document.body.removeChild(modal);
            createAllCommentsModal(updatedArticle.comments, articleId);
        }
    }
}

// Helper function to escape HTML to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Add comment function (updated to work with new delete functionality)
function addComment(articleId) {
    // Get comment text
    const commentTextArea = document.getElementById('comment-text');
    const commentText = commentTextArea.value.trim();
    
    // Validate comment
    if (!commentText) {
        alert('Please enter a comment');
        return;
    }

    // Get articles from localStorage
    const articlesJSON = localStorage.getItem('darkweb_articles');
    if (!articlesJSON) {
        alert('Error: Could not find articles');
        return;
    }
    
    // Parse articles and find the current article
    const articles = JSON.parse(articlesJSON);
    const articleIndex = articles.findIndex(a => a.id === articleId);
    
    if (articleIndex === -1) {
        alert('Error: Article not found');
        return;
    }

    // Initialize comments array if it doesn't exist
    if (!articles[articleIndex].comments) {
        articles[articleIndex].comments = [];
    }

    // Add new comment
    articles[articleIndex].comments.push(commentText);

    // Save updated articles to localStorage
    localStorage.setItem('darkweb_articles', JSON.stringify(articles));

    // Update comments list in the UI
    const commentsList = document.getElementById('comments-list');
    
    // If there was a "No comments" message, remove it
    if (commentsList.querySelector('p.text-gray-400')) {
        commentsList.innerHTML = '';
    }

    // Display updated comments list (with latest 3 comments)
    commentsList.innerHTML = renderCommentsList(articles[articleIndex].comments, articleId);

    // Setup delete buttons for new comments
    setupDeleteCommentButtons(commentsList);

    // Clear the comment textarea
    commentTextArea.value = '';

    // Update comments count
    const commentsCountEl = document.querySelector('#comments-container h3');
    if (commentsCountEl) {
        commentsCountEl.textContent = `Comments (${articles[articleIndex].comments.length})`;
    }
}