// articleManager.js - Save this file in your logic folder

// Import necessary modules if using Node.js
// For browser-based implementation, we'll define the class directly
class MyArticle {
    constructor(title, content, author, imageSrc = null) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.date = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        this.comments = [];
        this.images = imageSrc ? [imageSrc] : [];
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

    // Initialize storage if needed
    init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
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
    }
};

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