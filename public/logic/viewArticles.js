// viewArticles.js

document.addEventListener('DOMContentLoaded', function() {
    const articlesContainer = document.getElementById('articles-container');
    
    // Load and display all articles
    function loadArticles() {
        const articles = ArticleManager.getAllArticles();
        
        // Clear the container
        articlesContainer.innerHTML = '';
        
        if (articles.length === 0) {
            articlesContainer.innerHTML = `
                <div class="flex justify-center items-center col-span-full py-12">
                    <p class="text-gray-400 text-lg">No articles found. Be the first to create one!</p>
                </div>
            `;
            return;
        }
        
        // Sort articles by date (newest first)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Generate article cards
        articles.forEach(article => {
            const hasImage = article.images && article.images.length > 0;
            
            const articleCard = document.createElement('div');
            articleCard.className = 'border border-gray-700 bg-gray-800 rounded-lg overflow-hidden shadow-lg';
            articleCard.innerHTML = `
                <div class="h-full flex flex-col">
                    ${hasImage ? 
                        `<div class="h-48 overflow-hidden">
                            <img src="${article.images[0]}" alt="${article.title}" class="w-full h-full object-cover">
                        </div>` : 
                        `<div class="h-48 bg-gray-700 flex items-center justify-center">
                            <svg class="w-12 h-12 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 8H4m0 4h8m-8 4h8M15.488 8v4L19 8v8"/>
                            </svg>
                        </div>`
                    }
                    <div class="p-4 flex-grow">
                        <h5 class="mb-2 text-xl font-bold tracking-tight text-white">${article.title}</h5>
                        <p class="text-sm text-gray-400 mb-1">By ${article.author} • ${article.date}</p>
                        <p class="font-normal text-gray-300 line-clamp-3 mb-4">${article.content.substring(0, 150)}${article.content.length > 150 ? '...' : ''}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <span class="flex items-center text-sm text-gray-400">
                                    <svg class="w-4 h-4 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6C4.5 6 2 12 2 12s2.5 6 10 6 10-6 10-6-2.5-6-10-6z"/>
                                        <circle cx="12" cy="12" r="3" stroke="currentColor"/>
                                    </svg>
                                    ${article.comments ? article.comments.length : 0} comments
                                </span>
                                <span class="flex items-center text-sm text-gray-400">
                                    <svg class="w-4 h-4 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m-8-6h16"/>
                                    </svg>
                                    ${article.likes || 0}
                                </span>
                            </div>
                            <button data-id="${article.id}" class="view-article-btn text-blue-500 hover:text-blue-400 text-sm">
                                Read more →
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            articlesContainer.appendChild(articleCard);
            
            // Add event listener to the button
            articleCard.querySelector('.view-article-btn').addEventListener('click', function() {
                const articleId = this.getAttribute('data-id');
                viewArticleDetail(articleId);
            });
        });
    }
    
    // Handle view article detail
    function viewArticleDetail(articleId) {
        // You can implement this to navigate to a detail page
        // For now, we'll just alert the article details
        const article = ArticleManager.getArticleById(articleId);
        if (article) {
            // Ideally redirect to a detail page:
            // window.location.href = `articleDetail.html?id=${articleId}`;
            
            // For demonstration, show in alert:
            alert(`Title: ${article.title}\nAuthor: ${article.author}\nDate: ${article.date}\n\n${article.content}`);
        }
    }
    
    // Load articles when page loads
    loadArticles();
});