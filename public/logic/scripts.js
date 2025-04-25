
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded, initializing functions');
  // supportBtnAlert();
  // submitBtnAlert();
  // sidebarToggle();
  loadFooter();
  loadNavBar();
});

//   function supportBtnAlert() {
//     console.log('Script sprt loaded');
//     document.getElementById('supportBtn').addEventListener('click', function () {
//       alert('Thanks for the support! Feels better already =D');
//     });}

// function submitBtnAlert() {
//   console.log('Script submit loaded');
//     document.getElementById('submitBtn').addEventListener('click', function () {
//       alert('Nothing is sent, but its nice that you took the time!');
//     });}


// // function sidebarToggle() {
// //     document.addEventListener('DOMContentLoaded', function () {
// //       const toggleButton = document.querySelector('[data-drawer-toggle="default-sidebar"]');
// //       const sidebar = document.getElementById('default-sidebar');

// //       if (toggleButton && sidebar) {
// //         // Add click event listener
// //         toggleButton.addEventListener('click', function () {
// //           sidebar.classList.toggle('-translate-x-full');
// //         });
// //       }
// //     });}

// function sidebarToggle() {
//   console.log('Script loaded');
//   // Remove the nested DOMContentLoaded event
//   // const toggleButton = document.querySelector('[data-drawer-toggle="default-sidebar"]');
//   // const sidebar = document.getElementById('default-sidebar');

//   if (toggleButton && sidebar) {
//     // Add click event listener
//     toggleButton.addEventListener('click', function () {
//       sidebar.classList.toggle('-translate-x-full');
//     });
//   } else {
//     console.warn('Sidebar toggle: Elements not found', { 
//       toggleButton: !!toggleButton, 
//       sidebar: !!sidebar 
//     });
//   }
// }

function loadFooter() {
  console.log('Script loaded');
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
  console.log('Script loaded');
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
        // For Flowbite v1.x - initialize all component types
        if (window.flowbite.initDrawers) window.flowbite.initDrawers();
        if (window.flowbite.initDropdowns) window.flowbite.initDropdowns();
        if (window.flowbite.initCollapses) window.flowbite.initCollapses();
        // Add other component initializers as needed
      }
    }
    
    // Add manual event listeners for all interactive elements
    
    // 1. Handle drawer toggle buttons
    document.querySelectorAll('[data-drawer-toggle]').forEach(button => {
      const targetId = button.getAttribute('data-drawer-target');
      const target = document.getElementById(targetId);
      
      if (target) {
        button.addEventListener('click', () => {
          target.classList.toggle('-translate-x-full');
        });
      }
    });
    
    // 2. Handle drawer hide/close buttons
    document.querySelectorAll('[data-drawer-hide]').forEach(button => {
      const targetId = button.getAttribute('data-drawer-hide');
      const target = document.getElementById(targetId);
      
      if (target) {
        button.addEventListener('click', () => {
          target.classList.add('-translate-x-full');
        });
      }
    });
    
    // 3. Handle dropdown toggle buttons
    document.querySelectorAll('[data-dropdown-toggle]').forEach(button => {
      const targetId = button.getAttribute('data-dropdown-toggle');
      const target = document.getElementById(targetId);
      
      if (target) {
        button.addEventListener('click', () => {
          target.classList.toggle('hidden');
        });
      }
    });
    
    // 4. Handle collapse toggle buttons (for mobile menu)
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
    
    // Consider adding a small delay to ensure DOM is fully processed
    setTimeout(() => {
      if (window.flowbite && window.flowbite.initFlowbite) {
        window.flowbite.initFlowbite();
      }
    }, 100);
  })
  .catch(error => console.error('Navigation loading error:', error));
}

      