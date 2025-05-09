// Check if ArticleManager is available
if (typeof ArticleManager === "undefined") {
  console.error(
    "ERROR: ArticleManager is not defined. Make sure articleManager.js is loaded first!"
  );
} else {
  console.log("Found ArticleManager, creating default articles if needed");


  // Create default articles if none exist
  const created = ArticleManager.createDefaultArticlesIfNeeded();

  if (created) {
    console.log("Default articles have been created successfully");
  } else {
    console.log("Default articles were not created (articles already exist)");
    console.log("Existing articles:", ArticleManager.getArticles());
  }
}
