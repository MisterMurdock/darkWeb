// viewArticles.js - Display articles

console.log("viewArticles.js executing");

// Wait for DOMContentLoaded to ensure the container exists
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded in viewArticles.js");
    
    const articlesContainer = document.getElementById('articles-container');
    
    // Check if the container exists
    if (!articlesContainer) {
        console.error("ERROR: articles-container element not found on the page!");
        return;
    }
    
    console.log("Found articles-container:", articlesContainer);
    
    // Load and display all articles
    function loadArticles() {
        console.log("Loading articles...");
        
        // Make sure ArticleManager is available
        if (typeof ArticleManager === 'undefined') {
            console.error("ERROR: ArticleManager not found. Check that articleManager.js is loaded before this script.");
            articlesContainer.innerHTML = '<div class="p-4 text-red-500">Error: Article system not initialized properly. See console for details.</div>';
            return;
        }
        
        // Get all articles
        const articles = ArticleManager.getArticles();
        console.log("Articles loaded:", articles);
        
        // Clear the container
        articlesContainer.innerHTML = '';
        
        if (!articles || articles.length === 0) {
            console.log("No articles found, showing empty state");
            
            // Try to create default articles
            if (ArticleManager.createDefaultArticlesIfNeeded()) {
                // If default articles were created, reload the articles list
                const newArticles = ArticleManager.getArticles();
                console.log("Created default articles, now we have:", newArticles);
                
                if (newArticles && newArticles.length > 0) {
                    displayArticles(newArticles);
                    return;
                }
            }
            
            // If we still have no articles, show the empty state
            articlesContainer.innerHTML = `
                <div class="flex justify-center items-center col-span-full py-12">
                    <p class="text-gray-400 text-lg">No articles found. Be the first to create one!</p>
                </div>
            `;
            return;
        }
        
        // Display the articles
        displayArticles(articles);
    }
    
    // Function to display articles
    function displayArticles(articles) {
        console.log(`Displaying ${articles.length} articles`);
        
        // Sort articles by date (newest first)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Generate article cards
        articles.forEach(article => {
            console.log("Creating card for article:", article.title);
            
            const hasImage = article.images && article.images.length > 0;
            
            const articleCard = document.createElement('div');
            articleCard.className = 'border border-gray-700 bg-gray-800 rounded-lg overflow-hidden shadow-lg';
            articleCard.innerHTML = `
            <a href="../myObjects/fullArticleTemplate.html?id=${article.id}">
                <div class="h-full flex flex-col">
                    ${hasImage ? 
                        `<div class="h-48 overflow-hidden">
                            <img src="${article.images[0]}" alt="${article.title}" class="w-full h-full object-cover">
                        </div>` : 
                        `<div class="h-48 bg-gray-700 flex items-center justify-center">
                            <img src="../storyImgs/default-img.jpg" alt="${article.title}" class="w-full h-full object-cover">
                        </div>`
                    }
                    <div class="p-4 flex-grow hover:bg-gray-700 transition duration-200 ease-in-out">
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
                            <a href="fullArticleTemplate.html?id=${article.id}" class="text-blue-500 hover:text-blue-400 text-sm">
                                Read more →
                            </a>
                        </div>
                    </div>
                </div>
                </a>
            `;
            
            articlesContainer.appendChild(articleCard);
        });
        
        console.log(`Successfully displayed ${articles.length} articles`);
    }
    
    // Start loading articles
    console.log("Starting to load articles...");
    loadArticles();
});