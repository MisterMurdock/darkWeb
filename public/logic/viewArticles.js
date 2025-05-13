// For viewing article cards in viewArticles.html, prep for separating default articles from user created ones
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
            
            // If no articles, show the empty state
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
    
// Secure displayArticles function
function displayArticles(articles) {
    console.log(`Displaying ${articles.length} articles`);
    
    // Sort articles by date (newest first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear the container first
    articlesContainer.innerHTML = '';
    
    // Generate article cards
    articles.forEach(article => {
        console.log("Creating card for article:", article.title);
        
        const hasImage = article.images && article.images.length > 0;
        
        // Create elements properly instead of using innerHTML
        const articleCard = document.createElement('div');
        articleCard.className = 'border border-gray-700 bg-gray-800 rounded-lg overflow-hidden shadow-lg';
        
        // Create the link element
        const articleLink = document.createElement('a');
        articleLink.href = `../myObjects/fullArticleTemplate.html?id=${encodeURIComponent(article.id)}`;
        
        // Create container for the card content
        const cardContainer = document.createElement('div');
        cardContainer.className = 'h-full flex flex-col';
        
        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.className = hasImage ? 'h-48 overflow-hidden' : 'h-48 bg-gray-700 flex items-center justify-center';
        
        // Create and configure image
        const imageElement = document.createElement('img');
        imageElement.className = 'w-full h-full object-cover';
        
        // Validate and sanitize image URL
        if (hasImage) {
            // Basic URL validation (could be made more secure)
            // Future addition to safeCheck img content here
            const imageUrl = article.images[0];
            if (imageUrl && typeof imageUrl === 'string' && 
                (imageUrl.startsWith('http://') || 
                 imageUrl.startsWith('https://') || 
                 imageUrl.startsWith('../') || 
                 imageUrl.startsWith('./') || 
                 !imageUrl.includes(':'))) {
                imageElement.src = imageUrl;
            } else {
                imageElement.src = '../storyImgs/default-img.jpg';
            }
        } else {
            imageElement.src = '../storyImgs/default-img.jpg';
        }
        
        // Sanitize alt text
        imageElement.alt = article.title ? article.title.substring(0, 100) : 'Article image';
        
        // Append image to its container
        imageContainer.appendChild(imageElement);
        
        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'p-4 flex-grow hover:bg-gray-700 transition duration-200 ease-in-out';
        
        // Create and set title
        const titleElement = document.createElement('h5');
        titleElement.className = 'mb-2 text-xl font-bold tracking-tight text-white';
        titleElement.textContent = article.title || 'Untitled Article';
        
        // Create author and date info
        const metaInfo = document.createElement('p');
        metaInfo.className = 'text-sm text-gray-400 mb-1';
        metaInfo.textContent = `By ${article.author || 'Anonymous'} • ${article.date || 'Unknown date'}`;
        
        // Create content preview
        const previewElement = document.createElement('p');
        previewElement.className = 'font-normal text-gray-300 line-clamp-3 mb-4';
        const contentPreview = article.content 
            ? article.content.substring(0, 150) + (article.content.length > 150 ? '...' : '')
            : 'No content available';
        previewElement.textContent = contentPreview;
        
        // Create stats container
        const statsContainer = document.createElement('div');
        statsContainer.className = 'flex items-center justify-between';
        
        // Create engagement metrics container
        const metricsContainer = document.createElement('div');
        metricsContainer.className = 'flex items-center space-x-4';
        
        // Comments count
        const commentsSpan = document.createElement('span');
        commentsSpan.className = 'flex items-center text-sm text-gray-400';
        commentsSpan.innerHTML = `
            <svg class="w-4 h-4 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6C4.5 6 2 12 2 12s2.5 6 10 6 10-6 10-6-2.5-6-10-6z"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor"/>
            </svg>
        `;
        const commentsText = document.createTextNode(
            `${article.comments ? article.comments.length : 0} comments`
        );
        commentsSpan.appendChild(commentsText);
        
        // Likes count
        const likesSpan = document.createElement('span');
        likesSpan.className = 'flex items-center text-sm text-gray-400';
        likesSpan.innerHTML = `
            <svg class="w-4 h-4 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m-8-6h16"/>
            </svg>
        `;
        const likesText = document.createTextNode(`${article.likes || 0}`);
        likesSpan.appendChild(likesText);
        
        // Read more link
        const readMoreLink = document.createElement('a');
        readMoreLink.href = `../myObjects/fullArticleTemplate.html?id=${encodeURIComponent(article.id)}`;
        readMoreLink.className = 'text-blue-500 hover:text-blue-400 text-sm';
        readMoreLink.textContent = 'Read more →';
        
        // Assemble the card
        metricsContainer.appendChild(commentsSpan);
        metricsContainer.appendChild(likesSpan);
        
        statsContainer.appendChild(metricsContainer);
        statsContainer.appendChild(readMoreLink);
        
        contentContainer.appendChild(titleElement);
        contentContainer.appendChild(metaInfo);
        contentContainer.appendChild(previewElement);
        contentContainer.appendChild(statsContainer);
        
        cardContainer.appendChild(imageContainer);
        cardContainer.appendChild(contentContainer);
        
        articleLink.appendChild(cardContainer);
        articleCard.appendChild(articleLink);
        
        // Add the completed card to the container
        articlesContainer.appendChild(articleCard);
    });
    
    console.log(`Successfully displayed ${articles.length} articles`);
}

// Helper function to create a secure error display
function displayError(message) {
    const articlesContainer = document.getElementById('articles-container');
    if (!articlesContainer) return;
    
    // Clear container
    articlesContainer.innerHTML = '';
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'p-4 text-red-500';
    errorDiv.textContent = `Error: ${message}`;
    
    articlesContainer.appendChild(errorDiv);
}

// Helper function to show empty state
function displayEmptyState() {
    const articlesContainer = document.getElementById('articles-container');
    if (!articlesContainer) return;
    
    // Clear container
    articlesContainer.innerHTML = '';
    
    // Create empty state element
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'flex justify-center items-center col-span-full py-12';
    
    const emptyText = document.createElement('p');
    emptyText.className = 'text-gray-400 text-lg';
    emptyText.textContent = 'No articles found. Be the first to create one!';
    
    emptyDiv.appendChild(emptyText);
    articlesContainer.appendChild(emptyDiv);
}
    
    // Start loading articles
    console.log("Starting to load articles...");
    loadArticles();
});