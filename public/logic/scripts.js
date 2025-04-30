
document.addEventListener('DOMContentLoaded', function() {
  loadFooter();
  loadNavBar();
});


function loadFooter() {
    fetch('../myObjects/footer.html')
      .then(function (response) {
        return response.text();
      })
      .then(function (htmlString) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        const navElement = tempDiv.querySelector('footer');
        if (navElement) {
          document.getElementById('footer-container').innerHTML = navElement.outerHTML;
        } else {
          console.error('footer element not found in the loaded HTML');
        }
      })
      .catch(function (error) {
        console.error('Error loading navigation:', error);
      });}

function loadNavBar() {
  fetch('../myObjects/navigation.html')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  })
  .then(html => {
    // Insert the HTML
    document.getElementById('navigation-container').innerHTML = html;
    
    // Handle scripts
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      document.body.appendChild(newScript);
    });
    
    // Re-initialize all Flowbite components
    if (window.flowbite) {
      if (typeof window.flowbite.initFlowbite === 'function') {
        // For Flowbite v2.x
        window.flowbite.initFlowbite();
      } else {
        // initialize all component types
        if (window.flowbite.initDrawers) window.flowbite.initDrawers();
        if (window.flowbite.initDropdowns) window.flowbite.initDropdowns();
        if (window.flowbite.initCollapses) window.flowbite.initCollapses();
  
      }
    }
    
// Handle drawer toggle buttons
document.querySelectorAll('[data-drawer-toggle]').forEach(button => {
  const targetId = button.getAttribute('data-drawer-target');
  const target = document.getElementById(targetId);
  button.addEventListener('click', () => {
    target.classList.toggle('-translate-x-full');
    // overlay.classList.toggle('hidden');
  });
  // if (target) {
  //   // Create overlay element if it doesn't exist
  //   let overlay = document.getElementById('sidebar-overlay');
  //   if (!overlay) {
  //     overlay = document.createElement('div');
  //     overlay.id = 'sidebar-overlay';
  //     overlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 z-30 hidden';
  //     document.body.appendChild(overlay);
      
  //     // Add event listener to overlay to close sidebar when clicked
  //     overlay.addEventListener('click', () => {
  //       target.classList.add('-translate-x-full');
  //       overlay.classList.add('hidden');
  //     });
  //   }
    
  //   button.addEventListener('click', () => {
  //     target.classList.toggle('-translate-x-full');
  //     overlay.classList.toggle('hidden');
  //   });
  // }
});
    
  // Handle drawer hide/close buttons
document.querySelectorAll('[data-drawer-hide]').forEach(button => {
  const targetId = button.getAttribute('data-drawer-hide');
  const target = document.getElementById(targetId);
  
  if (target) {
    button.addEventListener('click', () => {
      target.classList.add('-translate-x-full');
      // Also hide the overlay when closing the sidebar
      const overlay = document.getElementById('sidebar-overlay');
      if (overlay) {
        overlay.classList.add('hidden');
      }
    });
  }
});
    
    // Handle dropdown toggle buttons
    document.querySelectorAll('[data-dropdown-toggle]').forEach(button => {
      const targetId = button.getAttribute('data-dropdown-toggle');
      const target = document.getElementById(targetId);
      
      if (target) {
        button.addEventListener('click', () => {
          target.classList.toggle('hidden');
        });
      }
    });
    
    // Handle collapse toggle buttons (for mobile menu)
    document.querySelectorAll('[data-collapse-toggle]').forEach(button => {
      const targetId = button.getAttribute('data-collapse-toggle');
      const target = document.getElementById(targetId);
      
      if (target) {
        button.addEventListener('click', () => {
          target.classList.toggle('hidden');
          
          // Toggle aria-expanded attribute for accessibility
          const expanded = button.getAttribute('aria-expanded') === 'true';
          button.setAttribute('aria-expanded', !expanded);
        });
      }
    });
    

    setTimeout(() => {
      if (window.flowbite && window.flowbite.initFlowbite) {
        window.flowbite.initFlowbite();
      }
    }, 100);
  })
  .catch(error => console.error('Navigation loading error:', error));

  // Add CSS for sidebar scrolling
const styleElement = document.createElement('style');
styleElement.textContent = `
  #default-sidebar {
    overflow-y: auto;
    max-height: 100vh;
  }
  
  body.sidebar-open {
    overflow: hidden;
  }
`;
document.head.appendChild(styleElement);

}

      