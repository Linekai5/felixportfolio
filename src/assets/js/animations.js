// root-relative imports break when the site is served from a sub‑path
// (e.g. GitHub Pages at /felixportfolio/). use relative paths instead so the
// module loader resolves against this file's location.
import { gsap } from '../../../gsap-public/esm/index.js';
import { SplitText } from '../../../gsap-public/esm/SplitText.js';

// This comment was added to bump the file modification time and force a new
// GitHub Pages build. The previous cached version on the CDN still had the
// root-relative imports, which caused 404 errors when the page tried to load
// SplitText.js. A fresh deploy should serve the updated version with
// relative paths.

// Initialize GSAP animations
export function initAnimations() {
    gsap.set("div:not(.meimage)", { opacity: 1 });
    gsap.registerPlugin(SplitText);
    
    // Animate navigation menu
    const navSplit = SplitText.create("#wel", { type: "chars" });
    gsap.from(navSplit.chars, {
        y: 50,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 2, 
        ease: "power4"
    });
    
}

// Function to animate box transitions
export function animateBoxTransition(contentElement, xValue, onComplete) {
    // Show and animate the selected box
    gsap.set(contentElement, { 
        display: "flex",
        x: xValue,
    });
    
    gsap.to(contentElement, {
        ease: "power1.outin",
        x: 0,
        onComplete: onComplete
    });
}

// Function to animate content exiting (moving up and out)
export function animateContentExit(contentElement, callback) {
    gsap.to(contentElement, {
        scale: 0.1,
        y: window.innerHeight,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: callback
    });
}

// Function to reset content position
export function resetContentPosition(contentElement) {
    gsap.set(contentElement, { y: 0, opacity: 1, scale: 1 });
}

// Function to initialize the GSAP SplitText animation for .greet
export function initGreetAnimation() {
    const greetElement = document.querySelector('.greet');
    if (!greetElement) return;
    greetElement.innerHTML = 'MALIKHAI<br>FELIX';
    import('../../../gsap-public/esm/SplitText.js').then(({ SplitText }) => {
        gsap.registerPlugin(SplitText);
        
        const welcomeSplit = SplitText.create(".greet", { type: "chars" });
        
        // Ensure chars are hidden and parent is visible to prevent flash
        gsap.set(welcomeSplit.chars, { opacity: 0 });
        gsap.set(greetElement, { opacity: 1 });
        
        gsap.fromTo(welcomeSplit.chars, {
            x: () => gsap.utils.random(-150, 150),
            y: () => gsap.utils.random(-550, 550),
            opacity: 0
        }, {
            x: 0,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.5,
            onComplete: () => {
               // Add blinking arrow only on desktop
               if (window.innerWidth <= 768) return;

               const startBox = document.querySelector('#startbox1');
               if (startBox && !document.querySelector('.start-arrow')) {
                   const arrow = document.createElement('img');
                   arrow.src = 'src/assets/logos/keyarrowright.svg';
                   arrow.className = 'start-arrow';
                   arrow.alt = 'Next';
                   
                   // Style the arrow
                   Object.assign(arrow.style, {
                       position: 'absolute',
                       bottom: '5%',
                       right: '5%',
                       width: '40px',
                       opacity: '0',
                       zIndex: '10'
                   });
                   
                   startBox.appendChild(arrow);
                   
                   // Blinking animation
                   gsap.to(arrow, {
                       opacity: 1,
                       duration: 1,
                       repeat: -1,
                       yoyo: true,
                       ease: "power1.inOut"
                   });
               }
            }
        });
    });
}


// Function to clear about text
export { animateSkillsText };

export function clearAboutText() {
    const aboutText = document.querySelector('.about');
    if (!aboutText) return;
    
    // Kill any existing animations
    gsap.killTweensOf(aboutText);
    gsap.killTweensOf('.about div');
    
    // Revert split if it exists
    if (currentAboutSplit) {
        currentAboutSplit.revert();
        currentAboutSplit = null;
    }
    
    // Clear the text content
    aboutText.textContent = '';
    
    // Reset positions
    gsap.set(aboutText, { x: 0 });
    
    // Reset meimage opacity to 0
    const meImage = document.querySelector('.meimage');
    if (meImage) {
        gsap.killTweensOf(meImage);
        gsap.set(meImage, { opacity: 0 }); // Instant reset
        gsap.set(meImage, { x: 0 });
    }
    
    // Clear skills text
    const skillsElement = document.querySelector('#skillsText');
    if (skillsElement) {
        gsap.killTweensOf(skillsElement);
        gsap.killTweensOf('#skillsText div');
        skillsElement.textContent = '';
    }
    
    // Clear arrow
    const arrowElement = document.querySelector('#skillsArrow');
    if (arrowElement) {
        gsap.killTweensOf(arrowElement);
        gsap.set(arrowElement, { opacity: 0 });
    }
    
    // Clear ferris wheel
    const ferrisWheel = document.querySelector('#ferrisWheel');
    if (ferrisWheel) {
        gsap.killTweensOf(ferrisWheel);
        gsap.killTweensOf('.ferris-item');
        gsap.killTweensOf('.ferris-spinner');
        ferrisWheel.style.display = 'none';
        ferrisWheel.innerHTML = '';
        gsap.set(ferrisWheel, { x: 0, y: 0, rotation: 0, yPercent: -50 });
    }
    
    // Reset view state
    isSkillsView = false;
}



// Store the current split instance
let currentAboutSplit = null;
let currentComingSoonSplit = null;

// Function to animate about text with scatter and implosion effect
// fromPageIndex: 0 = home, 2 = project, 3 = contact
export function animateAboutText(fromPageIndex = 0) {
    const aboutText = document.querySelector('.about');
    if (!aboutText) return;
    
    // Set the text content
    const introduction = "Hello! I'm Malikhai, a 17-year-old programmer from the Netherlands studying software development at Grafisch Lyceum Rotterdam. I love solving problems and finding new solutions, which is why I want to become a software engineer. I'm most interested in AI/ML, cloud, and data engineering. Outside of coding, I enjoy reading, playing guitar, creating music, and bouldering.";
    aboutText.textContent = introduction;
    
    // Kill any existing animations on the about text
    gsap.killTweensOf(aboutText);
    gsap.killTweensOf('.about div');
    
    // Revert previous split if it exists
    if (currentAboutSplit) {
        currentAboutSplit.revert();
        currentAboutSplit = null;
    }
    
    // Split text into words
    const split = new SplitText(aboutText, { type: "words" });
    currentAboutSplit = split;
    const words = split.words;
    
    // Lock container dimensions to prevent collapse when children become absolute
    gsap.set(aboutText, { 
        height: aboutText.offsetHeight, 
        width: aboutText.offsetWidth 
    });
    
    // Find Malikhai word
    let malikhaiIndex = -1;
    words.forEach((word, index) => {
        if (word.textContent.toLowerCase().includes('malikhai')) {
            malikhaiIndex = index;
        }
    });
    
    // Store original positions BEFORE making them absolute
    const originalPositions = words.map(word => {
        const rect = word.getBoundingClientRect();
        const textParentRect = aboutText.getBoundingClientRect();
        return {
            x: rect.left - textParentRect.left,
            y: rect.top - textParentRect.top
        };
    });
    
    // Set initial state for all words - position absolute with original positions
    words.forEach((word, i) => {
        gsap.set(word, {
            position: "absolute",
            left: originalPositions[i].x,
            top: originalPositions[i].y
        });
    });
    
    // Determine if coming from project or contact page (should animate from right)
    const shouldAnimateFromRight = fromPageIndex === 2 || fromPageIndex === 3;
    
    // Set Malikhai and other words initial positions
    words.forEach((word, i) => {
        if (i === malikhaiIndex) {
            // Malikhai always starts from the top of the page
            gsap.set(word, {
                opacity: 1,
                x: 0,
                y: -window.innerHeight + originalPositions[i].y
            });
        } else {
            // Other words start off-screen horizontally
            const direction = Math.random() > 0.5 ? 1 : -1;
            const distance = gsap.utils.random(window.innerWidth * 2, window.innerWidth * 5);
            gsap.set(word, {
                opacity: 1,
                x: direction * distance
            });
        }
    });
    // Animate Malikhai smoothly to its correct position
    if (malikhaiIndex !== -1) {
        gsap.to(words[malikhaiIndex], {
            duration: 0.6,
            x: 0,
            y: 0,
            ease: "power2.out"
        });
    }
    
    // Wait for page transition to complete, then animate only the other words
    const otherWords = words.filter((_, i) => i !== malikhaiIndex);
    
    gsap.to(otherWords, {
        duration: 0.5,
        delay: 0.2,
        x: 0,
        ease: "power4.inOut",
        stagger: {
            amount: 0.3,
            from: "start"
        },
        onComplete: () => {
            // Unlock container dimensions so it can resize naturally
            gsap.set(aboutText, { height: 'auto', width: 'auto' });

            // Temporarily switch to relative to get natural flow positions
            words.forEach(word => {
                gsap.set(word, {
                    position: 'relative',
                    left: 'auto',
                    top: 'auto',
                    x: 0,
                    y: 0
                });
            });
            
            // Force a reflow to get accurate positions
            aboutText.offsetHeight;
            
            // Store new positions
            const newPositions = words.map(word => {
                const rect = word.getBoundingClientRect();
                const textParentRect = aboutText.getBoundingClientRect();
                return {
                    x: rect.left - textParentRect.left,
                    y: rect.top - textParentRect.top
                };
            });
            
            // Lock container dimensions again
            gsap.set(aboutText, { 
                height: aboutText.offsetHeight, 
                width: aboutText.offsetWidth 
            });

            // Switch back to absolute with new positions
            words.forEach((word, i) => {
                gsap.set(word, {
                    position: 'absolute',
                    left: newPositions[i].x,
                    top: newPositions[i].y,
                    x: 0,
                    y: 0
                });
            });
            
            // Add resize handler for responsiveness
            let resizeTimeout;
            const handleResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    // Unlock container dimensions
                    gsap.set(aboutText, { height: 'auto', width: 'auto' });

                    // Temporarily switch to relative
                    words.forEach(word => {
                        gsap.set(word, {
                            position: 'relative',
                            left: 'auto',
                            top: 'auto',
                            x: 0,
                            y: 0
                        });
                    });
                    
                    // Force reflow
                    aboutText.offsetHeight;
                    
                    // Get new positions
                    const updatedPositions = words.map(word => {
                        const rect = word.getBoundingClientRect();
                        const textParentRect = aboutText.getBoundingClientRect();
                        return {
                            x: rect.left - textParentRect.left,
                            y: rect.top - textParentRect.top
                        };
                    });
                    
                    // Lock container dimensions again
                    gsap.set(aboutText, { 
                        height: aboutText.offsetHeight, 
                        width: aboutText.offsetWidth 
                    });

                    // Switch back to absolute with updated positions
                    words.forEach((word, i) => {
                        gsap.set(word, {
                            position: 'absolute',
                            left: updatedPositions[i].x,
                            top: updatedPositions[i].y,
                            x: 0,
                            y: 0
                        });
                    });
                }, 150);
            };
            
            window.addEventListener('resize', handleResize);
            
            // Smoothly fade in the meimage div after text animation completes
            const meImage = document.querySelector('.meimage');
            if (meImage) {
                gsap.to(meImage, {
                    opacity: 1,
                    duration: 0.2,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Animate skills text with handwriting effect after meimage appears
                        animateSkillsText();
                    }
                });
            }
        }
    });
}

// Track current view state
let isSkillsView = false;
let isAnimating = false;

// Helper function to animate arrow drawing
function animateArrow(onComplete) {
    const arrowLine = document.querySelector('.arrow-line');
    const arrowHead = document.querySelector('.arrow-head');
    const arrowSvg = document.querySelector('#skillsArrow');
    
    if (!arrowLine || !arrowHead || !arrowSvg) {
        if (onComplete) onComplete();
        return;
    }
    
    // Get path length for line
    const lineLength = arrowLine.getTotalLength() || 50;
    
    // Set initial states
    // We set opacity 1 on the line because we hide it via strokeDashoffset
    gsap.set(arrowLine, { 
        strokeDasharray: lineLength, 
        strokeDashoffset: lineLength, 
        opacity: 1
    });
    
    gsap.set(arrowHead, { 
        opacity: 0,
        scale: 0,
        transformOrigin: "center"
    });
    
    const tl = gsap.timeline({ onComplete: onComplete });
    
    // Make SVG visible at start of timeline to prevent FOUC
    tl.set(arrowSvg, { opacity: 1 }, 0);
    
    // Draw line
    tl.to(arrowLine, {
        strokeDashoffset: 2 * lineLength, // Animate to 2L (reveals from end)
        duration: 0.4,
        ease: "power2.out"
    }, 0);
    
    // Pop in arrowhead
    tl.to(arrowHead, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "back.out(1.7)"
    }, "-=0.1");
}

// Function to animate skills text with handwriting effect
function animateSkillsText() {
    const skillsElement = document.querySelector('#skillsText');
    const arrowElement = document.querySelector('#skillsArrow');
    if (!skillsElement) return;
    
    const text = "SKILLS";
    
    // Set the text content
    skillsElement.textContent = text;
    
    // Split text into characters using SplitText
    const skillsSplit = new SplitText(skillsElement, { type: "chars" });
    
    // Set initial state - hide all characters
    gsap.set(skillsSplit.chars, { 
        opacity: 0
    });
    
    if (arrowElement) {
        gsap.set(arrowElement, { opacity: 0 });
    }
    
    // Animate arrow first, then text
    animateArrow(() => {
        // Animate each character appearing smoothly with stagger
        gsap.to(skillsSplit.chars, {
            opacity: 1,
            duration: 0.1,
            stagger: 0.05,
            ease: "power2.inOut"
        });
    });
    
    // Add click handler to skills button
    skillsElement.onclick = () => {
        // Prevent clicking while animation is in progress
        if (isAnimating) return;
        
        if (!isSkillsView) {
            toggleToSkillsView();
        } else {
            toggleToAboutView();
        }
    };
}

// Function to toggle to skills detail view
function toggleToSkillsView() {
    isAnimating = true;
    isSkillsView = true;
    const aboutText = document.querySelector('.about');
    const meImage = document.querySelector('.meimage');
    const skillsElement = document.querySelector('#skillsText');
    const ferrisWheel = document.querySelector('#ferrisWheel');
    
    // Fade out skills button text
    gsap.to(skillsElement, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
            skillsElement.textContent = "";
            gsap.set(skillsElement, { opacity: 1 });
        }
    });
    
    // Fade out arrow
    const arrowElement = document.querySelector('#skillsArrow');
    if (arrowElement) {
        gsap.to(arrowElement, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.inOut"
        });
    }
    
    // Slide out - about to left, meimage to right
    const slideDistance = window.innerWidth + 100; // Calculate exact pixels to clear screen
    const isLargeScreen = window.innerWidth > 1440;
    
    const timeline = gsap.timeline();
    timeline.to(aboutText, {
        x: -slideDistance,
        duration: 0.5,
        ease: "power2.in",
        overwrite: true,
        force3D: true
    }, 0);
    
    timeline.to(meImage, {
        x: slideDistance,
        yPercent: isLargeScreen ? -50 : 0, // Maintain vertical centering on large screens
        duration: 0.5,
        ease: "power2.in",
        overwrite: true,
        force3D: true,
        onComplete: () => {
            // Reset meimage opacity to 0 after slide out so it can fade in smoothly when we return
            gsap.set(meImage, { opacity: 0 });
        }
    }, 0);
    
    // Slide in new content with lorem text
    timeline.call(() => {
        // Set lorem text
        aboutText.innerHTML = "I've worked with multiple programming languages, but I'm most comfortable with JavaScript and Python. My real interest lies in the logic and structure of the backend, which is why I’m focusing more on backend technologies like Python with FastAPI.";
        
        // Reset position off-screen left for about text
        gsap.set(aboutText, { x: -slideDistance });
        
        // Prepare ferris wheel off-screen right
        // Explicitly set yPercent to -50 to match CSS centering and ensure x is off-screen
        gsap.set(ferrisWheel, { x: slideDistance, y: 0, yPercent: -50 });
        animateFerrisWheel();
        
        // Animate about text in from left
        gsap.to(aboutText, {
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            force3D: true
        });
        
        // Animate ferris wheel in from right
        gsap.to(ferrisWheel, {
            x: 0,
            y: 0, // Ensure y is 0
            yPercent: -50, // Explicitly maintain vertical centering
            duration: 0.5,
            ease: "power2.out",
            force3D: true,
            overwrite: true // Safe to overwrite now as rotation is on child element
        });
        
        // Change skills button to "ABOUT" and animate it
        skillsElement.textContent = "";
        const aboutSplit = new SplitText(skillsElement, { type: "chars" });
        skillsElement.textContent = "ABOUT";
        const newSplit = new SplitText(skillsElement, { type: "chars" });
        
        gsap.set(newSplit.chars, { opacity: 0 });
        
        // Reset arrow opacity for drawing
        const arrowElement = document.querySelector('#skillsArrow');
        if (arrowElement) {
            gsap.set(arrowElement, { opacity: 0 });
        }

        // Draw arrow then animate text
        animateArrow(() => {
            gsap.to(newSplit.chars, {
                opacity: 1,
                duration: 0.2,
                stagger: 0.1,
                ease: "power2.inOut",
                onComplete: () => {
                    isAnimating = false;
                }
            });
        });
    });
}

// Function to toggle back to about view
function toggleToAboutView() {
    isAnimating = true;
    isSkillsView = false;
    const aboutText = document.querySelector('.about');
    const meImage = document.querySelector('.meimage');
    const skillsElement = document.querySelector('#skillsText');
    const ferrisWheel = document.querySelector('#ferrisWheel');
    const isLargeScreen = window.innerWidth > 1440;
    
    // Fade out about button text
    gsap.to(skillsElement, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
            skillsElement.textContent = "";
            gsap.set(skillsElement, { opacity: 1 });
        }
    });
    
    // Fade out arrow
    const arrowElement = document.querySelector('#skillsArrow');
    if (arrowElement) {
        gsap.to(arrowElement, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.inOut"
        });
    }
    
    // The original about text content
    const originalAboutText = "Hello! I'm Malikhai, a 17-year-old programmer from the Netherlands studying software development at Grafisch Lyceum Rotterdam. I love solving problems and finding new solutions, which is why I want to become a software engineer. I'm most interested in AI/ML, cloud, and data engineering. Outside of coding, I enjoy reading, playing guitar, creating music, and bouldering.";
    
    // Slide out - lorem text to left, ferris wheel to right
    const slideDistance = window.innerWidth + 100; // Calculate exact pixels to clear screen
    
    const timeline = gsap.timeline();
    timeline.to(aboutText, {
        x: -slideDistance,
        duration: 0.5,
        ease: "power2.in",
        overwrite: true,
        force3D: true
    }, 0);
    
    timeline.to(ferrisWheel, {
        x: slideDistance,
        y: 0, // Ensure y is 0
        yPercent: -50, // Explicitly maintain vertical centering
        duration: 0.5,
        ease: "power2.in",
        overwrite: true, // This is fine here as we are exiting
        force3D: true
    }, 0);
    
    // Stop ferris wheel
    timeline.call(() => {
        gsap.killTweensOf(ferrisWheel);
        gsap.killTweensOf('.ferris-item');
        gsap.killTweensOf('.ferris-spinner'); // Kill spinner tweens too
        ferrisWheel.style.display = 'none';
        ferrisWheel.innerHTML = '';
    });
    
    // Slide back original content
    timeline.call(() => {
        // Set the original about text (no Malikhai animation, just show it)
        aboutText.textContent = originalAboutText;
        
        
        // Reset position - about text off-screen left, meimage off-screen right
        gsap.set(aboutText, { x: -slideDistance });
        gsap.set(meImage, { x: slideDistance, opacity: 1, yPercent: isLargeScreen ? -50 : 0 });
        
        // Animate about text in from left
        gsap.to(aboutText, {
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            force3D: true
        });
        
        // Animate meimage in from right
        gsap.to(meImage, {
            x: 0,
            yPercent: isLargeScreen ? -50 : 0,
            duration: 0.5,
            ease: "power2.out",
            force3D: true,
            onComplete: () => {
                // Animate skills button text after content slides in
                skillsElement.textContent = "SKILLS";
                const skillsSplit = new SplitText(skillsElement, { type: "chars" });
                gsap.set(skillsSplit.chars, { opacity: 0 });
                
                // Reset arrow opacity for drawing
                const arrowElement = document.querySelector('#skillsArrow');
                if (arrowElement) {
                    gsap.set(arrowElement, { opacity: 0 });
                }

                // Draw arrow then animate text
                animateArrow(() => {
                    gsap.to(skillsSplit.chars, {
                        opacity: 1,
                        duration: 0.1,
                        stagger: 0.05,
                        ease: "power2.inOut",
                        onComplete: () => {
                            isAnimating = false;
                        }
                    });
                });
            }
        });
    });
}

// Function to create and animate ferris wheel
function animateFerrisWheel() {
    const ferrisWheel = document.querySelector('#ferrisWheel');
    if (!ferrisWheel) return;
    
    // Skill icons configuration
    const skillIcons = [
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
    ];
    
    const numberOfItems = skillIcons.length;
    
    // Make radius responsive based on screen width
    let radius = 160;
    if (window.innerWidth <= 480) {
        radius = 90; // Adjusted for 10 items
    } else if (window.innerWidth <= 768) {
        radius = 120; // Adjusted for 10 items
    }
    
    // Clear previous items
    ferrisWheel.innerHTML = '';
    ferrisWheel.style.display = 'block';
    
    // Reset ferris wheel container position (vertical centering)
    // We do NOT rotate the container anymore, we rotate the spinner inside
    // Only set yPercent if it's not already set correctly to avoid jumping
    gsap.set(ferrisWheel, { y: 0, yPercent: -50 });
    gsap.set(ferrisWheel, { rotation: 0 });
    
    // Create a spinner container for rotation
    const spinner = document.createElement('div');
    spinner.className = 'ferris-spinner';
    ferrisWheel.appendChild(spinner);
    
    // Create ferris wheel items
    const items = [];
    for (let i = 0; i < numberOfItems; i++) {
        const item = document.createElement('div');
        item.className = 'ferris-item';
        
        // SEO: Use img tag instead of background image
        const img = document.createElement('img');
        img.src = skillIcons[i];
        
        // Generate alt text from filename
        const filename = skillIcons[i].split('/').pop();
        let altText = filename.replace('.svg', '').replace(/-/g, ' ').replace('svgrepo com', '').replace(' 1', '').trim();
        // Capitalize first letter and format
        if (altText.toLowerCase().includes('html')) altText = 'HTML5';
        else if (altText.toLowerCase().includes('css')) altText = 'CSS3';
        else if (altText.toLowerCase().includes('php')) altText = 'PHP';
        else if (altText.toLowerCase().includes('sql')) altText = 'SQL';
        else if (altText.toLowerCase().includes('api')) altText = 'FastAPI';
        else altText = altText.charAt(0).toUpperCase() + altText.slice(1);
        
        img.alt = altText + " Skill";
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.pointerEvents = 'none'; // Ensure clicks pass to parent if needed

        item.appendChild(img);
        spinner.appendChild(item);
        items.push(item);
    }
    
    // Position items in a circle - fixed positions relative to spinner
    items.forEach((item, index) => {
        const angle = (index / numberOfItems) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        gsap.set(item, {
            x: x,
            y: y,
            rotation: 0,
            transformOrigin: "50% 50%"
        });
    });
    
    // Create a synchronized timeline for the ferris wheel
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none", duration: 60 } });
    
    // Animate the SPINNER rotating (not the container)
    tl.to(spinner, {
        rotation: 360,
        transformOrigin: "50% 50%",
        force3D: true
    }, 0);
    
    // Counter-rotate items so they stay upright
    items.forEach((item) => {
        tl.to(item, {
            rotation: -360,
            force3D: true
        }, 0);
    });
}

// Export the toggle function for external use
export { toggleToSkillsView, toggleToAboutView };

let projects = [];
let animationRunning = false;
let loadRequestId = 0;

// Function to load project data
async function loadProjects() {
    try {
        const response = await fetch('src/assets/data/projects.json');
        return await response.json();
    } catch (error) {
        console.error("Failed to load projects:", error);
        return [];
    }
}

// Update loop for floating animation
function updatePositions() {
    if (!animationRunning) return;
    
    const projectBox = document.querySelector('#projectbox3');
    if (!projectBox) return;

    // Stop all movement if any project is expanded
    if (projects.some(p => p.isExpanded)) return;
    
    const bounds = { w: projectBox.clientWidth, h: projectBox.clientHeight };
    
    // Move and Wall Bounce
    projects.forEach(p => {
        if (p.isExpanded) return;
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Wall Bounce
        if (p.x <= 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x + p.width >= bounds.w) { p.x = bounds.w - p.width; p.vx = -Math.abs(p.vx); }
        if (p.y <= 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y + p.height >= bounds.h) { p.y = bounds.h - p.height; p.vy = -Math.abs(p.vy); }
        
        gsap.set(p.element, { x: p.x, y: p.y });
    });
    
    // Collision Avoidance
    for (let i = 0; i < projects.length; i++) {
        for (let j = i + 1; j < projects.length; j++) {
            const p1 = projects[i];
            const p2 = projects[j];
            
            if (p1.isExpanded || p2.isExpanded) continue;
            
            const c1x = p1.x + p1.width / 2;
            const c1y = p1.y + p1.height / 2;
            const c2x = p2.x + p2.width / 2;
            const c2y = p2.y + p2.height / 2;
            
            const dx = c1x - c2x;
            const dy = c1y - c2y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Repel if closer than diagonal distance + buffer
            const minDist = Math.sqrt(p1.width*p1.width + p1.height*p1.height) * 1.1; 
            
            if (dist < minDist) {
                // Calculate repulsion vector
                const angle = Math.atan2(dy, dx);
                const force = (minDist - dist) / minDist * 0.02; // Gentle force
                
                const fx = Math.cos(angle) * force;
                const fy = Math.sin(angle) * force;
                
                p1.vx += fx;
                p1.vy += fy;
                p2.vx -= fx;
                p2.vy -= fy;
                
                // Cap velocity to keep it slow
                const maxSpeed = 0.2;
                const v1 = Math.sqrt(p1.vx * p1.vx + p1.vy * p1.vy);
                if (v1 > maxSpeed) {
                    p1.vx = (p1.vx / v1) * maxSpeed;
                    p1.vy = (p1.vy / v1) * maxSpeed;
                }
                const v2 = Math.sqrt(p2.vx * p2.vx + p2.vy * p2.vy);
                if (v2 > maxSpeed) {
                    p2.vx = (p2.vx / v2) * maxSpeed;
                    p2.vy = (p2.vy / v2) * maxSpeed;
                }
            }
            
            // Hard collision check (overlap)
            if (p1.x < p2.x + p2.width && p1.x + p1.width > p2.x &&
                p1.y < p2.y + p2.height && p1.y + p1.height > p2.y) {
                
                // Push apart
                const overlapX = (Math.min(p1.x + p1.width, p2.x + p2.width) - Math.max(p1.x, p2.x)) / 2;
                const overlapY = (Math.min(p1.y + p1.height, p2.y + p2.height) - Math.max(p1.y, p2.y)) / 2;
                
                if (overlapX < overlapY) {
                    if (p1.x < p2.x) { p1.x -= overlapX; p2.x += overlapX; }
                    else { p1.x += overlapX; p2.x -= overlapX; }
                    // Force move away
                    if (p1.x < p2.x) { p1.vx = -Math.abs(p1.vx); p2.vx = Math.abs(p2.vx); }
                    else { p1.vx = Math.abs(p1.vx); p2.vx = -Math.abs(p2.vx); }
                } else {
                    if (p1.y < p2.y) { p1.y -= overlapY; p2.y += overlapY; }
                    else { p1.y += overlapY; p2.y -= overlapY; }
                    // Force move away
                    if (p1.y < p2.y) { p1.vy = -Math.abs(p1.vy); p2.vy = Math.abs(p2.vy); }
                    else { p1.vy = Math.abs(p1.vy); p2.vy = -Math.abs(p2.vy); }
                }
            }
        }
    }
}

// Setup interactions for a project card
function setupCardInteractions(project, projectBox) {
    const card = project.element;
    const content = project.contentElement;
    const title = card.querySelector('.project-title');
    
    // Hover effects
    const addHoverEffects = () => {
        card.onmouseenter = () => {
            if (!project.isExpanded) gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        };
        card.onmouseleave = () => {
            if (!project.isExpanded) gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
        };
    };
    
    const removeHoverEffects = () => {
        card.onmouseenter = null;
        card.onmouseleave = null;
    };

    addHoverEffects();

    // Expand function
    const expandCard = () => {
        project.isExpanded = true;
        
        // Remove handlers
        card.onclick = null;
        removeHoverEffects();
        
        // Reset scale
        gsap.to(card, { scale: 1, duration: 0.2 });
        
        // Hide title
        if (title) gsap.to(title, { opacity: 0, duration: 0.2 });
        
        // Fade out other projects
        projects.forEach(p => {
            if (p !== project) {
                gsap.to(p.element, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
            }
        });
        
        const tl = gsap.timeline();
        
        // Step 1: Move to center
        const centerX = (projectBox.clientWidth - 150) / 2;
        const centerY = (projectBox.clientHeight - 200) / 2;
        
        tl.to(card, {
            x: centerX,
            y: centerY,
            duration: 0.3,
            ease: "power2.inOut",
            overwrite: true
        });
        
        // Step 2: Expand
        tl.to(card, {
            x: 0,
            y: 0,
            width: "100%",
            height: "100%",
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
                // Load content
                content.innerHTML = project.data.content;
                
                // Create back text
                const backText = document.createElement('div');
                backText.className = 'project-back-text';
                backText.textContent = "Click to go back";
                content.appendChild(backText);
                
                // Prepare SplitText
                const split = new SplitText(backText, { type: "chars" });
                gsap.set(split.chars, { opacity: 0 });
                gsap.set(backText, { opacity: 1 });

                // Fade in content
                gsap.to(content, {
                    visibility: 'visible',
                    opacity: 1,
                    duration: 0.1,
                    onComplete: () => {
                        content.style.pointerEvents = 'auto'; 
                        
                        // Add global listener to collapse on any click
                        setTimeout(() => {
                            document.addEventListener('click', collapseCard);
                        }, 10);
                        
                        // Animate back text characters
                        gsap.to(split.chars, {
                            opacity: 1,
                            duration: 0.1,
                            stagger: 0.02,
                            ease: "power2.inOut"
                        });
                    }
                });
            }
        });
    };

    // Collapse function
    const collapseCard = (e) => {
        // If clicking on text content (h2 or p), don't collapse
        if (e && e.target && (e.target.tagName === 'H2' || e.target.tagName === 'P' || e.target.closest('h2') || e.target.closest('p'))) {
            return;
        }

        document.removeEventListener('click', collapseCard);
        content.style.pointerEvents = 'none';

        const tl = gsap.timeline();

        // Fade out content
        tl.to(content, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                content.style.visibility = 'hidden';
                content.innerHTML = '';
            }
        });

        // Shrink back
        const centerX = (projectBox.clientWidth - 150) / 2;
        const centerY = (projectBox.clientHeight - 200) / 2;

        tl.to(card, {
            width: 150,
            height: 200,
            x: centerX,
            y: centerY,
            duration: 0.4,
            ease: "power2.inOut"
        });

        // Show title
        if (title) tl.to(title, { opacity: 1, duration: 0.2 }, "-=0.2");

        // Move to random position and resume
        tl.add(() => {
            // Find new random position
            const margin = 20;
            const newStartX = gsap.utils.random(margin, projectBox.clientWidth - 150 - margin);
            const newStartY = gsap.utils.random(margin, projectBox.clientHeight - 200 - margin);
            
            // Update internal state
            project.x = newStartX;
            project.y = newStartY;
            
            gsap.to(card, {
                x: newStartX,
                y: newStartY,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    project.isExpanded = false;
                    addHoverEffects();
                    card.onclick = expandCard;
                    
                    // Fade in other projects
                    projects.forEach(p => {
                        if (p !== project) {
                            gsap.to(p.element, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
                        }
                    });
                }
            });
        });
    };

    card.onclick = expandCard;
}

// Function to initialize project animations
export async function initProjectAnimations() {
    const projectBox = document.querySelector('#projectbox3');
    if (!projectBox) return;
    
    // Invalidate previous loads
    const myRequestId = ++loadRequestId;

    // Clear existing
    projectBox.innerHTML = '';
    projects = [];
    animationRunning = false;
    gsap.ticker.remove(updatePositions);
    
    const data = await loadProjects();
    
    // Check if this load is still valid
    if (myRequestId !== loadRequestId) return;
    
    data.forEach((item, index) => {
        // Create Card
        const card = document.createElement('div');
        card.className = 'project-card';
        card.id = item.id;
        card.innerHTML = `<span class="project-title">${item.title}</span>`;
        
        // Create Content
        const content = document.createElement('div');
        content.className = 'project-content';
        content.id = `${item.id}-content`;
        
        projectBox.appendChild(card);
        projectBox.appendChild(content);
        
        // Initial Position (Random non-overlapping)
        let x, y, hit;
        let maxTries = 100;
        const width = 150;
        const height = 200;
        
        do {
            x = gsap.utils.random(20, projectBox.clientWidth - width - 20);
            y = gsap.utils.random(20, projectBox.clientHeight - height - 20);
            hit = false;
            for (let p of projects) {
                if (x < p.x + p.width + 20 && x + width + 20 > p.x &&
                    y < p.y + p.height + 20 && y + height + 20 > p.y) {
                    hit = true;
                    break;
                }
            }
            maxTries--;
        } while (hit && maxTries > 0);
        
        // Set initial styles
        gsap.set(card, {
            x: x,
            y: y,
            width: width,
            height: height,
            opacity: 0,
            scale: 0.5,
            visibility: 'hidden'
        });
        
        // Add to projects array
        const project = {
            element: card,
            contentElement: content,
            data: item,
            x: x,
            y: y,
            vx: gsap.utils.random(-0.15, 0.15), // Slower velocity
            vy: gsap.utils.random(-0.15, 0.15),
            width: width,
            height: height,
            isExpanded: false
        };
        projects.push(project);
        
        // Fade In
        gsap.to(card, {
            opacity: 1,
            scale: 1,
            visibility: 'visible',
            duration: 0.2,
            delay: 0.05 * index,
            ease: "back.out(1.2)"
        });
        
        setupCardInteractions(project, projectBox);
    });
    
    // Start Animation Loop
    animationRunning = true;
    gsap.ticker.add(updatePositions);
}

// Function to reset project view
export function resetProjectView() {
    loadRequestId++; // Invalidate pending loads
    animationRunning = false;
    gsap.ticker.remove(updatePositions);
    
    const projectBox = document.querySelector('#projectbox3');
    if (projectBox) {
        projectBox.innerHTML = '';
    }
    projects = [];
}

// Social Icons Configuration
const socialIcons = [
    { name: 'github', icon: 'src/assets/logos/githubsv.svg', link: 'https://github.com/Linekai5' },
    { name: 'gmail', icon: 'src/assets/logos/gmailsv.svg', link: 'malikhaidfelix@gmail.com', type: 'email' },
    { name: 'linkedin', icon: 'src/assets/logos/linkedinsv.svg', link: 'https://linkedin.com/in/malikhai-felix-9ab44b33a' },
];

// Function to reset contact view
let atomTicker = null;

export function resetContactView() {
    const contactBox = document.querySelector('#contactbox4');
    
    if (atomTicker) {
        gsap.ticker.remove(atomTicker);
        atomTicker = null;
    }

    if (contactBox) {
        // Kill all GSAP tweens inside the contact box
        gsap.killTweensOf(contactBox.querySelectorAll('*'));
        contactBox.innerHTML = '';
    }
}

// Function to initialize contact page animations
export function initContactAnimations() {
    const contactBox = document.querySelector('#contactbox4');
    if (!contactBox) return;
    
    // Inject HTML
    contactBox.innerHTML = `
        <form class="contact-form" id="form" method="POST" novalidate>
            <div class="form-group" style="position: relative;">
                <input type="text" name="name" class="form-input" placeholder="Name" required>
                <div class="form-underline" style="opacity: 0; visibility: hidden;"></div>
                <div class="validation-bubble" id="val-name">
                    <img src="src/assets/valwarning/pleasefillin.svg" alt="Please fill in">
                </div>
            </div>              
            <div class="form-group" style="position: relative;">
                <input type="email" name="email" class="form-input" placeholder="Email" required>
                <div class="form-underline" style="opacity: 0; visibility: hidden;"></div>
                <div class="validation-bubble" id="val-email-empty">
                    <img src="src/assets/valwarning/pleasefillin.svg" alt="Please fill in">
                </div>
                <div class="validation-bubble" id="val-email-invalid">
                    <img src="src/assets/valwarning/pleasevalidmail.svg" alt="Please enter valid email">
                </div>
            </div>
            <div class="form-group" style="position: relative;">
                <textarea name="message" class="form-input form-textarea" placeholder="Message" rows="5" required></textarea>
                <div class="form-underline" style="opacity: 0; visibility: hidden;"></div>
                <div class="validation-bubble" id="val-message">
                    <img src="src/assets/valwarning/pleasefillin.svg" alt="Please fill in">
                </div>
            </div>
            <button type="submit" class="form-submit" style="opacity: 0; visibility: hidden;">Send Message</button>
        </form>
        <div class="success-message" style="position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%); opacity: 0; visibility: hidden; z-index: 100; pointer-events: none;">
            <img src="src/assets/valwarning/succes.svg" alt="Message Sent" style="width: 300px;">
        </div>
        <div class="atom-container">
            ${socialIcons.map(icon => `
                <a href="${icon.type === 'email' ? '#' : icon.link}" 
                   ${icon.type === 'email' ? '' : 'target="_blank"'} 
                   class="atom-icon" 
                   title="${icon.type === 'email' ? 'Copy Email' : icon.name}" 
                   data-type="${icon.type || 'link'}"
                   data-content="${icon.link}"
                   style="opacity: 0; visibility: hidden;">
                    <img src="${icon.icon}" alt="${icon.name}">
                </a>
            `).join('')}
            <div id="copy-feedback" style="position: absolute; top: -40px; left: 50%; transform: translateX(-50%); background: #01418a; color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; opacity: 0; pointer-events: none; white-space: nowrap; font-family: inter;">Email copied!</div>
        </div>
    `;

    const form = contactBox.querySelector('.contact-form');
    const formGroups = document.querySelectorAll('.form-group');
    const submitBtn = document.querySelector('.form-submit');
    const atomIcons = document.querySelectorAll('.atom-icon');
    
    // Social Icons Click Handler
    atomIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const type = icon.getAttribute('data-type');
            if (type === 'email') {
                e.preventDefault();
                const content = icon.getAttribute('data-content');
                navigator.clipboard.writeText(content).then(() => {
                    const feedback = document.getElementById('copy-feedback');
                    if (feedback) {
                        gsap.killTweensOf(feedback);
                        gsap.fromTo(feedback, 
                            { opacity: 0, y: 0 },
                            { opacity: 1, y: -10, duration: 0.3, onComplete: () => {
                                gsap.to(feedback, { opacity: 0, y: 0, duration: 0.3, delay: 1.5 });
                            }}
                        );
                    }
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    });
    
    // Validation Logic
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hide all existing bubbles
        gsap.to('.validation-bubble', { opacity: 0, y: -10, duration: 0.2, overwrite: true });

        // Validate Name
        const nameInput = form.querySelector('input[name="name"]');
        if (!nameInput.value.trim()) {
            showValidation(nameInput.parentElement.querySelector('#val-name'));
            return; // Stop and show only this error
        }

        // Validate Email
        const emailInput = form.querySelector('input[name="email"]');
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailValue) {
            showValidation(emailInput.parentElement.querySelector('#val-email-empty'));
            return; // Stop and show only this error
        } else if (!emailRegex.test(emailValue)) {
            showValidation(emailInput.parentElement.querySelector('#val-email-invalid'));
            return; // Stop and show only this error
        }

        // Validate Message
        const messageInput = form.querySelector('textarea[name="message"]');
        if (!messageInput.value.trim()) {
            showValidation(messageInput.parentElement.querySelector('#val-message'));
            return; // Stop and show only this error
        }

        // If all valid
        // Handle submission via fetch to prevent redirect
        const formData = new FormData(form);
        formData.append("access_key", "965aee87-5f31-4fd3-8def-a937b7e9cc77");

        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        })
        .then(async (response) => {
            const json = await response.json();
            if (response.status == 200) {
                // Success Animation
                const successMsg = contactBox.querySelector('.success-message');
                
                // Show success message
                gsap.fromTo(successMsg, 
                    { scale: 0.5, autoAlpha: 0 },
                    { 
                        autoAlpha: 1, 
                        scale: 1.2, 
                        duration: 0.5, 
                        ease: "back.out(1.7)",
                        onComplete: () => {
                            // Hide after delay
                            gsap.to(successMsg, { 
                                autoAlpha: 0, 
                                scale: 0.8, 
                                duration: 0.5, 
                                delay: 2,
                                ease: "power2.in"
                            });
                        }
                    }
                );

                form.reset();
            } else {
                console.log(response);
                alert(json.message);
            }
        })
        .catch(error => {
            console.log(error);
            alert("Something went wrong!");
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });

    function showValidation(element) {
        gsap.to(element, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" });
    }

    // Clear validation on input
    form.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
             const bubbles = input.parentElement.querySelectorAll('.validation-bubble');
             gsap.to(bubbles, { opacity: 0, y: -10, duration: 0.2, overwrite: true });
        });
    });
    
    // Reset states
    // Use autoAlpha to handle both opacity and visibility (prevents clicking while hidden)
    gsap.set(submitBtn, { autoAlpha: 0 });
    gsap.set(atomIcons, { autoAlpha: 0, scale: 0 });
    
    // 1. Form Animations
    // Save original overflow to restore later
    const originalOverflowY = contactBox.style.overflowY;
    
    const tl = gsap.timeline({
        onStart: () => { contactBox.style.overflow = 'visible'; },
        onComplete: () => { 
            contactBox.style.overflow = ''; 
            contactBox.style.overflowY = originalOverflowY;
        }
    });
    
    formGroups.forEach((group, index) => {
        const underline = group.querySelector('.form-underline');
        const input = group.querySelector('.form-input');
        
        // Determine direction (Left, Right, Left)
        const fromRight = index === 1; 
        const startX = fromRight ? window.innerWidth : -window.innerWidth;
        
        input.classList.remove('placeholder-visible');
        
        // Ensure it's hidden initially
        gsap.set(underline, { autoAlpha: 0 });

        // Animate underline slide in from screen edge
        tl.fromTo(underline, {
            scaleX: 1,
            x: startX,
            autoAlpha: 1
        }, {
            x: 0,
            duration: 0.8,
            ease: "power4.out",
            immediateRender: false // Crucial: Don't apply 'from' vars until this tween starts
        }, index * 0.2);
    });
    
    // Animate placeholders fading in AFTER lines arrive
    tl.add(() => {
        document.querySelectorAll('.form-input').forEach(input => {
            input.classList.add('placeholder-visible');
        });
    });
    
    // Animate button - AFTER placeholders are done
    tl.to(submitBtn, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out"
    }, "+=0.1");
    
    // 2. Atom Animation
    // Fade in icons AFTER button is done
    tl.to(atomIcons, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4, // Quick load in
        stagger: 0.1,
        ease: "back.out(1.5)"
    }, "+=0.1");
    
    // Independent Floating Animation with Collision Avoidance
    const container = document.querySelector('.atom-container');
    gsap.set(container, { rotation: 0 });
    
    const radius = 140; // Increased Boundary radius
    const minDistance = 100; // Increased Minimum distance between centers
    const atoms = [];

    // Initialize positions and velocities
    atomIcons.forEach((icon) => {
        let x, y, valid = false;
        let attempts = 0;
        
        // Find non-overlapping start position
        while (!valid && attempts < 100) {
            x = gsap.utils.random(-radius, radius);
            y = gsap.utils.random(-radius, radius);
            valid = true;
            
            for (const other of atoms) {
                const dx = x - other.x;
                const dy = y - other.y;
                if (Math.sqrt(dx*dx + dy*dy) < minDistance) {
                    valid = false;
                    break;
                }
            }
            attempts++;
        }
        
        // Store atom state
        const atom = {
            element: icon,
            x: x,
            y: y,
            // Extremely slow initial velocity
            vx: gsap.utils.random(-0.05, 0.05),
            vy: gsap.utils.random(-0.05, 0.05)
        };
        atoms.push(atom);
        
        gsap.set(icon, { x, y });
    });

    // Physics loop for organic movement without overlap
    atomTicker = () => {
        atoms.forEach(atom => {
            // Update position
            atom.x += atom.vx;
            atom.y += atom.vy;
            
            // Boundary Check (Soft bounce/steer back)
            const dist = Math.sqrt(atom.x * atom.x + atom.y * atom.y);
            if (dist > radius) {
                const angle = Math.atan2(atom.y, atom.x);
                // Push back towards center
                atom.vx -= Math.cos(angle) * 0.002;
                atom.vy -= Math.sin(angle) * 0.002;
            }
            
            // Collision Check (Repulsion)
            atoms.forEach(other => {
                if (atom === other) return;
                const dx = atom.x - other.x;
                const dy = atom.y - other.y;
                const d = Math.sqrt(dx*dx + dy*dy);
                
                if (d < minDistance) {
                    const force = (minDistance - d) * 0.001; // Very Gentle repulsion
                    const angle = Math.atan2(dy, dx);
                    atom.vx += Math.cos(angle) * force;
                    atom.vy += Math.sin(angle) * force;
                }
            });
            
            // Random Wandering Force
            atom.vx += gsap.utils.random(-0.002, 0.002);
            atom.vy += gsap.utils.random(-0.002, 0.002);

            // Speed Limit (Damping)
            const speed = Math.sqrt(atom.vx*atom.vx + atom.vy*atom.vy);
            const maxSpeed = 0.05; // Extremely slow
            if (speed > maxSpeed) {
                atom.vx = (atom.vx / speed) * maxSpeed;
                atom.vy = (atom.vy / speed) * maxSpeed;
            }
            
            // Apply
            gsap.set(atom.element, { x: atom.x, y: atom.y });
        });
    };
    
    gsap.ticker.add(atomTicker);
}



