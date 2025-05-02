document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded, initializing functions');
  loadLikes();
  loadComment();
});

// Set up likes and dislikes functionality
function setupLikesFunctionality(articleId) {
    const likesContainer = document.getElementById('likes-container');
    if (!likesContainer) return;
    
    // Get article data
    const articlesJSON = localStorage.getItem('darkweb_articles');
    if (!articlesJSON) return;
    
    const articles = JSON.parse(articlesJSON);
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
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

// Set up comments functionality
function setupCommentsFunctionality(articleId) {
    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) return;
    
    // Get article data
    const articlesJSON = localStorage.getItem('darkweb_articles');
    if (!articlesJSON) return;
    
    const articles = JSON.parse(articlesJSON);
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    // Render comments list
function renderComments(comments) {
    if (!comments.length) {
        return '<p class="text-gray-400">No comments yet. Be the first to comment!</p>';
    }
    
    return comments.map((comment, index) => `
        <div class="p-3 bg-gray-700 rounded-lg" id="comment-${index}">
            <p class="text-white">${comment}</p>
            <p class="text-xs text-gray-400 mt-1">Anonymous • ${new Date().toLocaleDateString()}</p>
        </div>
    `).join('');
}
    
    // Create comments UI
    commentsContainer.innerHTML = `
    
        <div class="mt-6 px-4 py-2">
            <h3 class="text-xl font-bold text-white mb-4">Comments (${article.comments?.length || 0})</h3>
            <div id="comments-list" class="space-y-4 mb-6">
                ${renderComments(article.comments || [])}
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
    
    // Add event listener for comment button
    document.getElementById('add-comment-btn').addEventListener('click', function() {
        const commentText = document.getElementById('comment-text').value.trim();
        if (commentText) {
            addComment(articleId, commentText);
        }
    });
}



// Add a new comment
function addComment(articleId, commentText) {
    // Get article data
    const articlesJSON = localStorage.getItem('darkweb_articles');
    if (!articlesJSON) return;
    
    const articles = JSON.parse(articlesJSON);
    const articleIndex = articles.findIndex(a => a.id === articleId);
    if (articleIndex === -1) return;
    
    // Initialize comments array if it doesn't exist
    if (!articles[articleIndex].comments) {
        articles[articleIndex].comments = [];
    }
    
    // Add the comment
    articles[articleIndex].comments.push(commentText);
    
    // Save updated data
    localStorage.setItem('darkweb_articles', JSON.stringify(articles));
    
    // Update the UI
    document.getElementById('comments-list').innerHTML = renderComments(articles[articleIndex].comments);
    document.getElementById('comment-text').value = '';
    
    // Update comment count in title
    const commentsTitle = document.querySelector('#comments-container h3');
    if (commentsTitle) {
        commentsTitle.textContent = `Comments (${articles[articleIndex].comments.length})`;
    }
}
