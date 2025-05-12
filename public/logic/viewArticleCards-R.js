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
            const noArticlesDiv = document.createElement('div');
            noArticlesDiv.className = 'flex justify-center items-center col-span-full py-12';
            
            const noArticlesText = document.createElement('p');
            noArticlesText.className = 'text-gray-400 text-lg';
            noArticlesText.textContent = 'No articles found. Be the first to create one!';
            
            noArticlesDiv.appendChild(noArticlesText);
            articlesContainer.appendChild(noArticlesDiv);
            return;
        }
        
        // Sort articles by date (newest first)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Generate article cards
        articles.forEach((article, index) => {
            const hasImage = article.images && article.images.length > 0;
            const isEven = index % 2 === 0;
            
            //article card container (link)
            const articleCard = document.createElement('a');
            articleCard.href = `../myObjects/fullArticleTemplate.html?id=${article.id}`;
            articleCard.className = 'flex flex-col items-stretch border shadow-sm md:flex-row w-full border-gray-700 bg-gray-800 hover:bg-gray-700 transition duration-200 ease-in-out';

            //content section
            const contentSection = document.createElement('section');
            contentSection.className = 'flex flex-col justify-between p-4 leading-normal w-full md:w-2/3';
            
            //title
            const title = document.createElement('h5');
            title.className = 'text-2xl font-bold tracking-tight text-white';
            title.textContent = article.title;
            contentSection.appendChild(title);
            
            //author and date
            const metadata = document.createElement('p');
            metadata.className = 'text-sm text-gray-400 mb-1';
            metadata.textContent = `By ${article.author} • ${article.date}`;
            contentSection.appendChild(metadata);
            
            //content preview
            const contentPreview = document.createElement('p');
            contentPreview.className = 'mb-3 font-normal text-gray-400';
            contentPreview.textContent = article.content.substring(0, 60) + (article.content.length > 60 ? '...' : '');
            contentSection.appendChild(contentPreview);
            
            // Create interaction stats container
            const interactionStats = document.createElement('div');
            interactionStats.className = 'flex items-center justify-between';
            
            const statsContainer = document.createElement('div');
            statsContainer.className = 'flex items-center space-x-4';
            
            // Comments stat
            const commentsSpan = document.createElement('span');
            commentsSpan.className = 'flex items-center text-sm text-gray-400';
            
            const commentsSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            commentsSvg.setAttribute('class', 'w-4 h-4 mr-1');
            commentsSvg.setAttribute('aria-hidden', 'true');
            commentsSvg.setAttribute('fill', 'none');
            commentsSvg.setAttribute('viewBox', '0 0 24 24');
            
            const commentsPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            commentsPath1.setAttribute('stroke', 'currentColor');
            commentsPath1.setAttribute('stroke-linecap', 'round');
            commentsPath1.setAttribute('stroke-linejoin', 'round');
            commentsPath1.setAttribute('stroke-width', '2');
            commentsPath1.setAttribute('d', 'M12 6C4.5 6 2 12 2 12s2.5 6 10 6 10-6 10-6-2.5-6-10-6z');
            
            const commentsCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            commentsCircle.setAttribute('cx', '12');
            commentsCircle.setAttribute('cy', '12');
            commentsCircle.setAttribute('r', '3');
            commentsCircle.setAttribute('stroke', 'currentColor');
            
            commentsSvg.appendChild(commentsPath1);
            commentsSvg.appendChild(commentsCircle);
            commentsSpan.appendChild(commentsSvg);
            
            const commentsText = document.createTextNode(` ${article.comments ? article.comments.length : 0} comments`);
            commentsSpan.appendChild(commentsText);
            
            // Likes stat
            const likesSpan = document.createElement('span');
            likesSpan.className = 'flex items-center text-sm text-gray-400';
            
            const likesSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            likesSvg.setAttribute('class', 'w-4 h-4 mr-1');
            likesSvg.setAttribute('aria-hidden', 'true');
            likesSvg.setAttribute('fill', 'none');
            likesSvg.setAttribute('viewBox', '0 0 24 24');
            
            const likesPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            likesPath.setAttribute('stroke', 'currentColor');
            likesPath.setAttribute('stroke-linecap', 'round');
            likesPath.setAttribute('stroke-linejoin', 'round');
            likesPath.setAttribute('stroke-width', '2');
            likesPath.setAttribute('d', 'M12 6v12m-8-6h16');
            
            likesSvg.appendChild(likesPath);
            likesSpan.appendChild(likesSvg);
            
            const likesText = document.createTextNode(` ${article.likes || 0} likes`);
            likesSpan.appendChild(likesText);
            
            // Add stats to container
            statsContainer.appendChild(commentsSpan);
            statsContainer.appendChild(likesSpan);
            interactionStats.appendChild(statsContainer);
            contentSection.appendChild(interactionStats);
            
            // Image section
            const imageSection = document.createElement('div');
            imageSection.className = 'w-full md:w-1/3 h-64 md:h-auto';

            if (hasImage) {
                const img = document.createElement('img');
                img.className = 'w-full h-full object-cover';
                img.src = article.images[0];
                img.alt = article.title;
                imageSection.appendChild(img);
            } else {
                const defaultImg = document.createElement('img');
                defaultImg.src = '../storyImgs/default-img.jpg';
                defaultImg.alt = article.title;
                defaultImg.className = 'w-full h-full object-cover bg-gray-700';
                imageSection.appendChild(defaultImg);
            }
            
            // Alternate image position based on index (even/odd)
            if (isEven) {
                articleCard.appendChild(contentSection);
                articleCard.appendChild(imageSection);
            } else {
                articleCard.appendChild(imageSection);
                articleCard.appendChild(contentSection);
            }

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
            const errorDiv = document.createElement('div');
            errorDiv.className = 'flex justify-center items-center col-span-full py-12';
            
            const errorText = document.createElement('p');
            errorText.className = 'text-red-500 text-lg';
            errorText.textContent = 'Error loading articles. Please refresh the page.';
            
            errorDiv.appendChild(errorText);
            articlesContainer.innerHTML = '';
            articlesContainer.appendChild(errorDiv);
        }
    }
});