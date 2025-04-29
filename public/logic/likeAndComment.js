document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded, initializing functions');
  loadLikes();
  loadComment();
});

//<!--Like script-->
function loadLikes() {
    // Function that runs when the page loads
    window.onload = function() {
          // Get the element where we want to put the imported content
          const container = document.getElementById('likes-container');
          
          // Create a request to fetch the likes.html file
          fetch('../myObjects/likes.html')
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return response.text();
              })
              .then(html => {
                  // Simply insert the HTML content directly
                  container.innerHTML = html;
              })
              .catch(error => {
                  console.error('Error loading likes:', error);
                  container.innerHTML = 'Failed to load content';
              });
      };}


//<!--Comments script-->
function loadComment() {
  fetch('../myObjects/comments.html')
.then(function(response) {
  return response.text();
})
.then(function(htmlString) {
  // Create a temporary container
  const tempDiv = document.createElement('div');
  
  // Set the HTML content
  tempDiv.innerHTML = htmlString;
  
  // Extract the form from the body
  const formElement = tempDiv.querySelector('form');
  
  // Insert the form into your container
  if (formElement) {
    document.getElementById('comments-container').innerHTML = formElement.outerHTML;
    
    // Extract scripts from the original HTML
    const scripts = tempDiv.querySelectorAll('script');
    
    // Create and append each script to execute it
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      
      // Copy attributes if any (like src)
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy the content for inline scripts
      if (script.innerHTML) {
        newScript.innerHTML = script.innerHTML;
      }
      
      // Add the script to the page to execute it
      document.body.appendChild(newScript);
    });
  } else {
    console.error('Form element not found in the loaded HTML');
  }
})
.catch(function(error) {
  console.error('Error loading comments:', error);
});}
