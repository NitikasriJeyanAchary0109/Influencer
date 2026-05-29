// This script runs on Instagram.com pages

// Function to extract profile data from the page
function extractProfileData() {
  const data = { username: '', name: '', followers: '', engagement: '' };
  
  // Username from URL
  const path = window.location.pathname.split('/');
  if (path.length > 1 && path[1] !== 'explore' && path[1] !== 'p' && path[1] !== 'reels') {
    data.username = path[1];
  } else {
    return null; // Not on a profile page
  }

  // Find follower count (Usually the second <li> in the header stats)
  const header = document.querySelector('header');
  if (header) {
    const listItems = header.querySelectorAll('ul li');
    if (listItems.length >= 2) {
      const followersSpan = listItems[1].querySelector('span[title]');
      if (followersSpan) {
        // Remove commas and extract number
        data.followers = followersSpan.getAttribute('title').replace(/,/g, '');
      } else {
        // Fallback for smaller screens or different layouts
        const fallbackText = listItems[1].textContent || '';
        const match = fallbackText.match(/([\d,]+K?M?)\s+followers/i);
        if (match) {
           data.followers = match[1].replace(/,/g, '').replace('K', '000').replace('M', '000000');
        }
      }
    }

    // Name (Usually in a specific span within header)
    const nameSpan = header.querySelector('h1 + span, h2 + span, div[dir="auto"] span');
    if (nameSpan) {
      data.name = nameSpan.textContent;
    }
    
    // Simulate engagement rate for the demo based on follower count
    if (data.followers) {
        const seed = parseInt(data.followers) || 12345;
        data.engagement = (1.5 + (seed % 7)).toFixed(2);
    }
  }
  
  return data.username ? data : null;
}

// Function to handle adding the influencer
function handleAddToInfluenceFlow(e) {
  e.preventDefault();
  const data = extractProfileData();
  
  if (!data) {
    alert("Could not extract profile data. Make sure you are on a user's profile page.");
    return;
  }
  
  // URL to your local InfluenceFlow app (or production URL)
  const baseUrl = 'http://localhost:5174/influencers';
  const url = new URL(baseUrl);
  url.searchParams.set('add_ig', data.username);
  if (data.name) url.searchParams.set('name', data.name);
  if (data.followers) url.searchParams.set('followers', data.followers);
  if (data.engagement) url.searchParams.set('engagement', data.engagement);
  
  // Open the app in a new tab
  window.open(url.toString(), '_blank');
}

// Function to inject the button
function injectButton() {
  // Check if we are on a profile page
  if (window.location.pathname === '/' || window.location.pathname.startsWith('/explore')) {
    return;
  }

  // Check if button already exists
  if (document.getElementById('influenceflow-import-btn')) return;

  // Find the header action buttons (Message, Follow, etc.)
  const headers = document.querySelectorAll('header section div');
  
  // Strategy: Find a button element in the header, then append next to its parent
  const headerBtns = Array.from(document.querySelectorAll('header button'));
  if (headerBtns.length === 0) return;
  
  const targetContainer = headerBtns[0].closest('div');
  if (!targetContainer) return;

  const btn = document.createElement('button');
  btn.id = 'influenceflow-import-btn';
  btn.className = 'influenceflow-btn';
  
  // SVG Icon
  btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Add to CRM`;
  
  btn.addEventListener('click', handleAddToInfluenceFlow);
  
  targetContainer.appendChild(btn);
}

// Observe DOM changes to handle Instagram's SPA navigation
const observer = new MutationObserver((mutations) => {
  // Debounce the injection slightly
  if (window.injectionTimeout) clearTimeout(window.injectionTimeout);
  window.injectionTimeout = setTimeout(injectButton, 500);
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial injection attempt
setTimeout(injectButton, 1000);
