document.addEventListener('DOMContentLoaded', async function() {
    const articlesContainer = document.getElementById('articles-container');
    
    // Initialize articles and ensure default articles are created if needed
    await initializeArticles();
    
    // Load and display all articles
    function loadArticles() {
        const articles = getArticlesFromStorage();
        
        // Clear the container
        articlesContainer.innerHTML = '';
        
        if (!articles || articles.length === 0) {
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
        articles.forEach((article, index) => {
            const hasImage = article.images && article.images.length > 0;
            const isEven = index % 2 === 0;
            
            const articleCard = document.createElement('a');
            articleCard.href = `../myObjects/fullArticleTemplate.html?id=${article.id}`;
            articleCard.className = 'flex flex-col items-center border shadow-sm md:flex-row w-full border-gray-700 bg-gray-800 hover:bg-gray-700 transition duration-200 ease-in-out';
            
            // Content section
            const contentSection = `
                <section class="flex flex-col justify-between p-4 leading-normal w-full md:w-2/3">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">${article.title}</h5>
                    <p class="text-sm text-gray-400 mb-1">By ${article.author} • ${article.date}</p>
                    <p class="mb-3 font-normal text-gray-400">${article.content.substring(0, 60)}${article.content.length > 60 ? '...' : ''}</p>
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
                                ${article.likes || 0} likes
                            </span>
                        </div>
                    </div>
                </section>
            `;
            
            // Image section
            const imageSection = hasImage ? 
                `<img class="object-cover w-full h-96 md:h-auto md:w-1/3" src="${article.images[0]}" alt="${article.title}">` : 
                `<div class="w-full h-96 md:h-auto md:w-1/3 bg-gray-700 flex items-center justify-center">
                    <img src="../storyImgs/default-img.jpg" alt="${article.title}" class="w-full h-full object-cover">
                </div>`;
            
            // Alternate image position based on index (even/odd)
            articleCard.innerHTML = isEven ? 
                `${contentSection}${imageSection}` : 
                `${imageSection}${contentSection}`;
            
            articlesContainer.appendChild(articleCard);
        });
    }
    
    // Helper function to get articles from localStorage
    function getArticlesFromStorage() {
        try {
            const articlesJSON = localStorage.getItem('darkweb_articles');
            return articlesJSON ? JSON.parse(articlesJSON) : [];
        } catch (error) {
            console.error("Error loading articles:", error);
            return [];
        }
    }

    // Initialize articles and make sure default articles exist
    async function initializeArticles() {
        try {
            // Check if ArticleManager exists
            if (typeof ArticleManager !== 'undefined') {
                console.log("Using ArticleManager to initialize articles");
                // Create default articles if none exist
                await ArticleManager.createDefaultArticlesIfNeeded();
            } else {
                console.warn("ArticleManager not found, checking for articles directly");
                // Check if articles already exist in localStorage
                const articles = getArticlesFromStorage();
                
                // If no articles and no ArticleManager, create basic default articles
                if (articles.length === 0) {
                    console.log("No ArticleManager found and no articles exist. Creating basic default article");
                    const defaultArticle = {
                        id: 'default-' + Date.now().toString(),
                        title: 'Welcome to the DarkWeb News',
                        content: 'This is a default article created because no articles were found.',
                        author: 'System',
                        date: new Date().toLocaleDateString(),
                        comments: [],
                        images: [],
                        likes: 0,
                        dislikes: 0
                    };
                    
                    localStorage.setItem('darkweb_articles', JSON.stringify([defaultArticle]));
                }
            }
            
            // Load articles into the view
            loadArticles();
            
        } catch (error) {
            console.error("Error initializing articles:", error);
            // Show error message in the articles container
            articlesContainer.innerHTML = `
                <div class="flex justify-center items-center col-span-full py-12">
                    <p class="text-red-500 text-lg">Error loading articles. Please refresh the page.</p>
                </div>
            `;
        }
    }
});