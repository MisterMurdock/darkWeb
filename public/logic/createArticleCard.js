// createArticle.js - Using a more direct approach for default image

document.addEventListener("DOMContentLoaded", function () {
  // Get form elements
  const titleInput = document.getElementById("title-input");
  const authorInput = document.getElementById("author-input");
  const articleTextArea = document.getElementById("articleText");
  const imageInput = document.getElementById("img-input");
  const uploadBtn = document.getElementById("uploadBtn");

  // Define default image path
  const DEFAULT_IMAGE = "../storyImgs/default-img.jpg";

  // Add event listener to the upload button
  uploadBtn.addEventListener("click", async function () {
    // Validate inputs
    if (!titleInput.value.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!authorInput.value.trim()) {
      alert("Please enter an author name");
      return;
    }
    if (!articleTextArea.value.trim()) {
      alert("Please enter article content");
      return;
    }

    try {
      // Initialize image array for the article
      let imageArray = [];

      // Process image if provided
      if (imageInput.files && imageInput.files[0]) {
        try {
          const processedImage = await handleImageFile(imageInput.files[0]);
          if (processedImage) {
            imageArray.push(processedImage);
            console.log("User image added to array");
          }
        } catch (imgError) {
          console.warn("Error processing uploaded image:", imgError);
        }
      }

      // Create article with whatever images we have (might be empty array)
      const article = new MyArticle(
        titleInput.value.trim(),
        articleTextArea.value.trim(),
        authorInput.value.trim()
      );

      // Check if image array is empty and add default if needed
      if (article.images.length === 0) {
        console.log("No images in article, adding default image");
        article.addImage(DEFAULT_IMAGE);
        console.log("Default image added:", DEFAULT_IMAGE);
      }

      // Set the date
      article.date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Debug: Log the article before saving
      console.log("Article before saving:", article.getAllValues());

      // Save article
      const articleId = ArticleManager.saveArticle(article);
      console.log("Article saved with ID:", articleId);

      // Show success toast
      if (typeof showToast === "function") {
        showToast("success", "Article successfully created!");
      } else {
        alert("Article successfully created and saved!");
      }

      // Delay redirect to allow toast to be seen
      setTimeout(() => {
        // Redirect to view all articles
        window.location.href = "viewArticles.html";
      }, 1500);
    } catch (error) {
      console.error("Error saving article:", error);

      // Show error toast if available, otherwise fallback to alert
      if (typeof showToast === "function") {
        showToast("error", "Failed to save article. Please try again.");
      } else {
        alert("Failed to save article. Please try again.");
      }
    }
  });

  // Helper function for handling image files
  async function handleImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }

      const reader = new FileReader();

      reader.onload = function (e) {
        if (e.target && e.target.result) {
          resolve(e.target.result); // This will be a data URL like "data:image/jpeg;base64,..."
        } else {
          reject(new Error("Failed to read file data"));
        }
      };

      reader.onerror = function (e) {
        reject(
          new Error(
            "Error reading image file: " + (e.message || "Unknown error")
          )
        );
      };

      reader.readAsDataURL(file);
    });
  }
});
