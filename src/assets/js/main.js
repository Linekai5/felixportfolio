import { initLetterAnimation } from './letter.js';
import { initAnimations, animateBoxTransition, animateContentExit, resetContentPosition, animateAboutText, clearAboutText, initGreetAnimation, initProjectAnimations, resetProjectView, initContactAnimations, resetContactView} from './animations.js';
import { initNavigation } from './navigation.js';

// Preload images
function preloadImages() {
    const imagesToPreload = [
        // Me Image
        'src/assets/me/meimg.png',
        
        // Skill Icons
        'src/skills/html5-01-svgrepo-com 1.svg',
        'src/skills/css3-01-svgrepo-com 1.svg',
        'src/skills/javascript-svgrepo-com 1.svg',
        'src/skills/php01-svgrepo-com 1.svg',
        'src/skills/mysql-svgrepo-com 1.svg',
        'src/skills/postgresql-svgrepo-com 1.svg',
        'src/skills/python-svgrepo-com 1.svg',
        'src/skills/fastapi-svgrepo-com 1.svg',
        'src/skills/git-svgrepo-com 1.svg',
        'src/skills/gcc.svg',
        
        // Social Icons
        'src/assets/logos/githubsv.svg',
        'src/assets/logos/gmailsv.svg',
        'src/assets/logos/linkedinsv.svg',
        'src/assets/logos/youtubesv.svg',
        
        // Validation Bubbles
        'src/assets/valwarning/pleasefillin.svg',
        'src/assets/valwarning/pleasevalidmail.svg'
    ];

    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Start preloading immediately
preloadImages();

// Initialize all animations
initLetterAnimation();
initAnimations();
initGreetAnimation();

const navPages = [
    {button: document.getElementById("namel"), content: document.getElementById("startbox1")},
    {button: document.getElementById("abo"), content: document.getElementById("aboutbox2")},
    {button: document.getElementById("proj"), content: document.getElementById("projectbox3")},
    {button: document.getElementById("con"), content: document.getElementById("contactbox4")}
];


let currentPageIndex = 0;
let isNavigating = false;

// Function to navigate to a specific page
function navigateToPage(targetIndex) {
    // Boundary check
    if (targetIndex < 0 || targetIndex >= navPages.length) return;
    
    // If clicking namel (home page), always reload
    if (targetIndex === 0) {
        location.reload();
        return;
    }
    
    // If navigation is in progress, ignore click
    if (isNavigating) return;
    
    // If already active, don't do anything
    if (window.getComputedStyle(navPages[targetIndex].content).display === "flex") return;
    if (navPages[targetIndex].button.id === "namel") {initLetterAnimation()};
    
    // Check if we're changing pages (not staying on the same page)
    const changingPages = targetIndex !== currentPageIndex;
    
    isNavigating = true;

    if (changingPages) {
        // Get the current page's content element
        const currentContent = navPages[currentPageIndex].content;
        // Animate current page content moving up and out first
        animateContentExit(currentContent, () => {
            // After content moves up, clear text if leaving about page
            if (currentPageIndex === 1) {
                clearAboutText();
            }
            // Clear coming soon text if leaving projects page
            if (currentPageIndex === 2) {
                resetProjectView();
            }
            // Clear contact form if leaving contact page
            if (currentPageIndex === 3) {
                resetContactView();
            }
            // Then proceed with page transition
            proceedWithTransition(targetIndex);
        });
    } else {
        // No special animation needed, proceed normally
        proceedWithTransition(targetIndex);
    }
}

// Helper function to handle the actual page transition
function proceedWithTransition(targetIndex) {
    // Capture the previous page index before updating
    const previousPageIndex = currentPageIndex;
    
    // Hide all boxes and reset button colors
    navPages.forEach(page => {
        page.button.style.color = "var(--maincolor-)"; page.button.style.opacity = "0.5";
        page.content.style.display = "none";
        // Reset position for all content
        resetContentPosition(page.content);
    });

    // Determine slide direction based on current vs target page
    let xAnimationValue = targetIndex > currentPageIndex ? -window.innerWidth : window.innerWidth;
    
    console.log(`Navigating to: ${navPages[targetIndex].button.textContent}, Index: ${targetIndex}, Direction: ${xAnimationValue > 0 ? 'from left' : 'from right'}`);
    
    currentPageIndex = targetIndex;
    navPages[targetIndex].button.style.color = "var(--maincolor-)"; navPages[targetIndex].button.style.opacity = "1";
    
    // Control scrolling based on which page we're on
    if (targetIndex === 0) {
        // Disable scrolling on home page
        document.body.style.overflow = 'hidden';
    } else {
        // Initially hide overflow during animation
        navPages[targetIndex].content.style.overflowY = 'hidden';
    }

    // Animate box transition with callback
    animateBoxTransition(navPages[targetIndex].content, xAnimationValue, () => {
        // After animation completes, check if scrolling is needed
        if (targetIndex !== 0) {
            const contentElement = navPages[targetIndex].content;
            const isOverflowing = contentElement.scrollHeight > contentElement.clientHeight;
            
            // Only enable scrolling on mobile devices (width <= 768px)
            if (isOverflowing && window.innerWidth <= 768) {
                // Enable scrolling only if content overflows and we are on mobile
                contentElement.style.overflowY = 'auto';
            } else {
                contentElement.style.overflowY = 'hidden';
            }
        }
        
        // Trigger about text animation if we're on the about page
        if (targetIndex === 1) {
            // Pass the previous page index to control Malikhai's animation direction
            animateAboutText(previousPageIndex);
        }
        
                // Trigger project animations if we're on the projects page
        if (targetIndex === 2) {
            initProjectAnimations();
        }
        
        // Trigger contact animations if we're on the contact page
        if (targetIndex === 3) {
            initContactAnimations();
        }

        // Animation complete, allow navigation again
        isNavigating = false;
    });
}


for (let i = 0; i < navPages.length; i++) {
    navPages[i].button.addEventListener("click", () => {
        navigateToPage(i);
    });
}

initNavigation((direction) => {
    if (direction === "next") {
        navigateToPage(currentPageIndex + 1);
    } else if (direction === "previous") {
        navigateToPage(currentPageIndex - 1);
    }
});