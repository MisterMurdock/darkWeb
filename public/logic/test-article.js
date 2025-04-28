// test-article.js
const { MyArticle } = require('./myArticle.js');
const moment = require('moment');

// Test function to verify functionality
function testArticleClass() {
  console.log("Starting MyArticle class tests...");
  
  // Test 1: Creating a new article
  console.log("\nTest 1: Creating a new article");
  const article = new MyArticle("Testing 101", "This is a test article content", "Jane Smith");
  console.log("Article created:", article);
  
  // Test 2: Adding comments
  console.log("\nTest 2: Adding comments");
  article.addComment("Great article!");
  article.addComment("Very informative");
  article.addComment("Looking forward to more content");
  console.log("Comments:", article.getComments());
  
  // Test 3: Adding images
  console.log("\nTest 3: Adding images");
  article.addImage("image1.jpg");
  article.addImage("image2.png");
  console.log("Images:", article.getImages());
  
  // Test 4: Adding likes and dislikes
  console.log("\nTest 4: Adding likes and dislikes");
  for (let i = 0; i < 5; i++) {
    article.addLike();
  }
  for (let i = 0; i < 2; i++) {
    article.addDislike();
  }
  console.log("Likes:", article.likes);
  console.log("Dislikes:", article.dislikes);
  
  // Test 5: Getting all values
  console.log("\nTest 5: Getting all values");
  const allValues = article.getAllValues();
  console.log("All values:", allValues);
  
  console.log("\nAll tests completed!");
}

// Run the tests
testArticleClass();