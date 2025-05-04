// articleManager.js - Save this file in your logic folder

// Import necessary modules if using Node.js
// For browser-based implementation, we'll define the class directly
class MyArticle {
    constructor(title, content, author, images = [], date = null) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.date = date || new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.comments = [];
        this.images = Array.isArray(images) ? images : (images ? [images] : []);
        this.likes = 0;
        this.dislikes = 0;
    }

    addComment(comment) {
        this.comments.push(comment);
    }

    addImage(image) {
        this.images.push(image);
    }

    addLike() {
        this.likes++;
    }

    addDislike() {
        this.dislikes++;
    }

    getComments() {
        return this.comments;
    }

    getImages() {
        return this.images;
    }
    
    getAllValues() {
        return {
            title: this.title,
            content: this.content,
            date: this.date,
            author: this.author,
            comments: this.comments,
            images: this.images,
            likes: this.likes,
            dislikes: this.dislikes
        };
    }
}

// ArticleManager: Handles storage and retrieval of articles
const ArticleManager = {
    // Storage key
    STORAGE_KEY: 'darkweb_articles',

    // Initialize storage and create default articles if needed
    async init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
            // Create default articles if this is the first initialization
            await this.createDefaultArticlesIfNeeded();
        }
        return true;
    },

    getArticles() {
        try {
            const articlesJSON = localStorage.getItem(this.STORAGE_KEY);
            return articlesJSON ? JSON.parse(articlesJSON) : [];
        } catch (error) {
            console.error("Error loading articles:", error);
            return [];
        }
    },

    // Save article to localStorage
    saveArticle(article) {
        this.init();
        const articles = this.getAllArticles();
        
        // Generate a simple ID for the article
        const articleWithId = {
            id: Date.now().toString(),
            ...article.getAllValues()
        };
        
        articles.push(articleWithId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
        return articleWithId.id;
    },

    // Get all articles
    getAllArticles() {
        this.init();
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    },

    // Get article by ID
    getArticleById(id) {
        const articles = this.getAllArticles();
        return articles.find(article => article.id === id);
    },

    // Update existing article
    updateArticle(id, updatedData) {
        const articles = this.getAllArticles();
        const index = articles.findIndex(article => article.id === id);
        
        if (index !== -1) {
            articles[index] = { ...articles[index], ...updatedData };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
            return true;
        }
        return false;
    },

    // Delete article
    deleteArticle(id) {
        const articles = this.getAllArticles();
        const filteredArticles = articles.filter(article => article.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredArticles));
    },

    // Add comment to article
    addCommentToArticle(articleId, comment) {
        const article = this.getArticleById(articleId);
        if (article) {
            if (!article.comments) article.comments = [];
            article.comments.push(comment);
            return this.updateArticle(articleId, article);
        }
        return false;
    },

    // Add like to article
    addLikeToArticle(articleId) {
        const article = this.getArticleById(articleId);
        if (article) {
            article.likes = (article.likes || 0) + 1;
            return this.updateArticle(articleId, article);
        }
        return false;
    },

    // Add dislike to article
    addDislikeToArticle(articleId) {
        const article = this.getArticleById(articleId);
        if (article) {
            article.dislikes = (article.dislikes || 0) + 1;
            return this.updateArticle(articleId, article);
        }
        return false;
    },

    // Create default articles if none exist
    createDefaultArticlesIfNeeded: async function() {
        const articles = this.getArticles();
        
        if (articles.length === 0) {
            console.log("No articles found. Creating default articles...");
            
            // Create an array for default articles
            const defaultArticles = [];
            
            // Define a function to create and save a default article with a guaranteed unique ID
            const createAndAddDefaultArticle = async (title, contentPath, fallbackContent, author, imagePath, date) => {
                // Generate truly unique ID by generating a UUID-like string
                const uniqueId = 'default-' + Math.random().toString(36).substring(2, 15) + 
                                 Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString();
                
                // Try to load content from file
                let content = fallbackContent;
                try {
                    const loadedContent = await loadTextContent(contentPath);
                    if (loadedContent && loadedContent.trim() !== "") {
                        content = loadedContent;
                    }
                } catch (error) {
                    console.warn(`Could not load content from ${contentPath}, using fallback content.`, error);
                }
                
                // Create the article object directly
                const articleObj = {
                    id: uniqueId,
                    title: title,
                    content: content,
                    author: author,
                    date: date instanceof Date ? date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : date, // Format the date if it's a Date object
                    comments: [],
                    images: imagePath ? [imagePath] : [],
                    likes: 0,
                    dislikes: 0
                };
                
                // Add to our default articles array
                defaultArticles.push(articleObj);
                console.log(`Created default article: ${title} with ID: ${uniqueId}`);
            };
            
            // Create each default article with unique IDs
            // Using await to ensure each article gets processed sequentially for unique timestamps
            await createAndAddDefaultArticle(
                "Late night coding sessions recommended", 
                "../txtFiles/codingPoetry.txt",
                "Many developers find that their most productive coding sessions happen late at night when distractions are minimal and creativity peaks. The quiet hours of the night can provide the perfect environment for deep focus.", 
                "CyberPhantom", 
                "../storyImgs/coding-vibrant.png",
                new Date(2023, 6, 20)
            );


            await createAndAddDefaultArticle(
                "To Be or Not to Be: A Hacker's Dilemma", 
                "../txtFiles/hacker.txt",
                "This is a sample article content discussing ethical considerations in the world of hacking and cybersecurity. The article explores the moral implications of different hacking approaches and their potential impact on society.", 
                "Darkweb", 
                "../storyImgs/hacker-break.png",
                "Dec 02, 2023"
            );

            await createAndAddDefaultArticle(
                "The perfect setup", 
                "../txtFiles/perfectSetup.txt",
                "The age-old debate: How many monitors do you need to become a true productivity powerhouse? The answer isn't as binary as it might seem.", 
                "Darkweb", 
                "../storyImgs/screens.jpg",
                "Jan 12, 2025"
            );
            
            await createAndAddDefaultArticle(
                "Writing HTML will make you go crazy", 
                "../txtFiles/goCrazy.txt",
                "Writing HTML can be a challenging but rewarding experience. As you dive deeper into web development, you'll discover both the frustrations and joys of creating something from nothing but text and tags.", 
                "CyberPhantom", 
                "../storyImgs/html.jpg",
                "Feb 14, 2024"
            );
            
            await createAndAddDefaultArticle(
                "Coding while listening to music increases productivity", 
                "../txtFiles/codeWithMusic.txt",
                "Studies have shown that listening to music while coding can increase focus and productivity. The right playlist can help developers enter a flow state where time seems to disappear and code flows naturally.", 
                "PrivacyGuardian", 
                "../storyImgs/coding-notes.jpg",
                "Mar 15, 2023"
            );
            
            await createAndAddDefaultArticle(
                "The Reality Rewrite: How Java Reshapes Our Understanding", 
                "../txtFiles/reality.txt",
                "Java has been reshaping our understanding of software development for over two decades. Its 'write once, run anywhere' philosophy continues to influence modern programming practices.", 
                "CyberPhantom", 
                "../storyImgs/coding-next-gen.jpeg",
                "Apr 30, 2022"
            );

            await createAndAddDefaultArticle(
                "Don't Shake Hands With The Devil: A Dev's Plea", 
                "../txtFiles/devil.txt",
                'They dangle promises, seductive whispers of shortcuts and ease. "Just this one fix," they hiss.', 
                "Devon Ilson", 
                "../storyImgs/handshake.jpg",
                "May 10, 2023"
            );
            
            await createAndAddDefaultArticle(
                "Dark Mode: The New Standard Illuminating the Web", 
                "../txtFiles/darkMode.txt",
                "Dark mode has become the preferred choice for many developers and users alike. It reduces eye strain, saves battery life on OLED screens, and provides a sleek, modern aesthetic.", 
                "CyberPhantom", 
                "../storyImgs/darkMode.png",
                "Jun 20, 2023");

            await createAndAddDefaultArticle(
                "The art of naming variables", 
                "../txtFiles/naming.txt",
                "Let's face it, coding is like a complex game of Jenga.  One wrong move can send your entire structure tumbling down.", 
                "DarkWeb", 
                "../storyImgs/coding-text.jpg",
                "Jul 25, 2023"
            );
            
            

            

            
            
            // Save all default articles to localStorage
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultArticles));
            console.log("Created and saved default articles:", defaultArticles);
            
            // For debugging - verify data was saved
            const savedArticles = localStorage.getItem(this.STORAGE_KEY);
            console.log("Verification - articles in localStorage:", savedArticles ? JSON.parse(savedArticles) : "None");
            
            return true;
        }
        
        return false;
    }
};

// Helper function to load text content from a file
async function loadTextContent(path) {
  console.log(`Attempting to load text from: ${path}`);
  
  try {
    // First, try using fetch API (works in modern browsers)
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const textContent = await response.text();
    console.log(`Successfully loaded text from ${path}`);
    return textContent;
  } catch (fetchError) {
    console.warn(`Fetch attempt failed: ${fetchError.message}`);
    
    // If fetch fails, try XMLHttpRequest as a fallback (more compatible)
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', path, true);
      xhr.responseType = 'text';
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log(`Successfully loaded text using XMLHttpRequest from ${path}`);
          resolve(xhr.responseText);
        } else {
          reject(new Error(`XMLHttpRequest failed with status: ${xhr.status}`));
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('XMLHttpRequest network error'));
      };
      
      xhr.send();
    }).catch(xhrError => {
      console.error(`All attempts to load text failed: ${xhrError.message}`);
      throw new Error(`Could not load text from ${path}: ${xhrError.message}`);
    });
  }
}

// Function to handle image files
function handleImageFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            resolve(event.target.result); // Base64 encoded image
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

// Export the classes and functions if using in Node.js environment
// For browser, these will be available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MyArticle, ArticleManager, handleImageFile };
}