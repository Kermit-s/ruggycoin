// Password protection
const CORRECT_PASSWORD = 'bitpanda1';
const passwordOverlay = document.getElementById('passwordOverlay');
const mainContent = document.getElementById('mainContent');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const errorMessage = document.getElementById('errorMessage');

// Check if user is already authenticated
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('ruggyAuthenticated');
    if (isAuthenticated === 'true') {
        showMainContent();
    }
}

// Show main content and hide password overlay
function showMainContent() {
    passwordOverlay.style.display = 'none';
    mainContent.style.display = 'block';
    sessionStorage.setItem('ruggyAuthenticated', 'true');
}

// Handle login
function handleLogin() {
    const password = passwordInput.value.trim();
    
    if (password === CORRECT_PASSWORD) {
        showMainContent();
        errorMessage.textContent = '';
        passwordInput.value = '';
    } else {
        errorMessage.textContent = 'Incorrect password. Please try again.';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Event listeners for password protection
if (loginButton) {
    loginButton.addEventListener('click', handleLogin);
}
if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
}

// Show Thank You Popup
function showThankYouPopup() {
    const popup = document.getElementById('thankYouPopup');
    
    // Show popup with animation
    popup.classList.add('show');
    
    // Hide popup after 2.5 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2500);
}

// Pie Chart Interactions
function setupPieChartInteractions() {
    const pieSegments = document.querySelectorAll('.pie-segment');
    const pieChartInfo = document.getElementById('pieChartInfo');
    
    // Show default information
    showPieChartInfo('circulating');
    
    pieSegments.forEach(segment => {
        // Handle hover events
        segment.addEventListener('mouseenter', function() {
            const segmentType = this.dataset.segment;
            showPieChartInfo(segmentType);
        });
        
        // Handle mouse leave to return to default
        segment.addEventListener('mouseleave', function() {
            showPieChartInfo('circulating');
        });
        
        // Handle touch events for mobile (show info on touch)
        segment.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const segmentType = this.dataset.segment;
            showPieChartInfo(segmentType);
        });
    });
}

function showPieChartInfo(segmentType) {
    const pieChartInfo = document.getElementById('pieChartInfo');
    
    if (segmentType === 'circulating') {
        pieChartInfo.textContent = 'Circulating Supply';
        pieChartInfo.style.color = '#ff69b4';
    } else if (segmentType === 'locked') {
        pieChartInfo.textContent = 'Locked Liquidity Pool';
        pieChartInfo.style.color = '#32cd32';
    }
    
    // Add a subtle animation
    pieChartInfo.style.transform = 'scale(1.1)';
    setTimeout(() => {
        pieChartInfo.style.transform = 'scale(1)';
    }, 200);
}

// Check authentication on page load
checkAuth();

// Game state
let sessionTaps = 0;
let totalTaps = 0;
let communityTaps = 0;
let isAnimating = false;

// Badge numbers (synchronized with session taps)
let badgeNumber = 0;

// Server configuration
const SERVER_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin;

// DOM elements
const tapButton = document.getElementById('tapButton');
const sessionTapsElement = document.getElementById('sessionTaps');
const totalTapsElement = document.getElementById('totalTaps');
const communityTapsElement = document.getElementById('communityTaps');
const worldTapsElement = document.getElementById('worldTaps');
const worldTapsFooterElement = document.getElementById('worldTapsFooter');
const contractAddressElement = document.getElementById('contractAddress');
const copyTextElement = document.getElementById('copyText');
const resetLinkElement = document.getElementById('resetLink');
const ruggyCharacter = document.getElementById('ruggyCharacter');
const confettiContainer = document.getElementById('confettiContainer');
const tapSound = document.getElementById('tapSound');

// Badge elements
const badgeLeft = document.querySelector('.badge.top-left');
const badgeRight = document.querySelector('.badge.top-right');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadGameData();
    
    // Setup pie chart interactions
    setupPieChartInteractions();
    
    // Reset session taps for new session
    sessionTaps = 0;
    badgeNumber = 0;
    
    // Load community taps from server
    loadCommunityTaps();
    
    // Start live updates for community taps
    startLiveUpdates();
    
    // Update displays
    updateDisplays();
    
    // Add event listeners
    setupEventListeners();
    
    // Start character animation
    startCharacterAnimation();
});

function setupEventListeners() {
    // Tap button
    tapButton.addEventListener('click', handleTap);
    tapButton.addEventListener('touchstart', handleTap);
    
    // Copy contract address
    copyTextElement.addEventListener('click', copyContractAddress);
    
    // Reset counter
    resetLinkElement.addEventListener('click', resetCounter);
    
    // Social media button
    document.querySelector('.social-button').addEventListener('click', () => {
        window.open('https://twitter.com/realruggycoin', '_blank');
    });
    
    // Telegram button
    document.querySelector('.telegram-button').addEventListener('click', () => {
        window.open('https://t.me/+e5pYPAqUdTcxZGVi', '_blank');
    });
    
    // Whitepaper button
    document.querySelector('.whitepaper-button').addEventListener('click', showWhitepaper);
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            handleTap();
        }
    });
}

// Show Thank You Popup
function showThankYouPopup() {
    const popup = document.getElementById('thankYouPopup');
    
    // Show popup with animation
    popup.classList.add('show');
    
    // Hide popup after 2.5 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2500);
}

function handleTap() {
    if (isAnimating) return;
    
    // Increment counters
    sessionTaps++;
    totalTaps++;
    
    // Update badge numbers (synchronized with session taps)
    badgeNumber = sessionTaps;
    
    // Update displays
    updateDisplays();
    
    // Save data
    saveGameData();
    
    // Send tap to server
    sendTapToServer();
    
    // Play sound
    playTapSound();
    
    // Create confetti
    createConfetti();
    
    // Show thank you popup
    showThankYouPopup();
    
    // Animate character
    animateCharacter();
    
    // Animate button
    animateButton();
}

function updateDisplays() {
    // Update all counter displays
    sessionTapsElement.textContent = sessionTaps.toLocaleString();
    totalTapsElement.textContent = totalTaps.toLocaleString();
    communityTapsElement.textContent = communityTaps.toLocaleString();
    worldTapsElement.textContent = communityTaps.toLocaleString();
    worldTapsFooterElement.textContent = `${communityTaps.toLocaleString()} taps worldwide!`;
    
    // Update badge numbers (synchronized with session taps)
    if (badgeLeft) badgeLeft.textContent = badgeNumber;
    if (badgeRight) badgeRight.textContent = badgeNumber;
}

function animateCharacter() {
    isAnimating = true;
    
    // Add bounce animation
    ruggyCharacter.style.transform = 'scale(1.2) rotate(5deg)';
    ruggyCharacter.style.transition = 'transform 0.1s ease-out';
    
    // Add glow effect
    const glow = document.querySelector('.character-glow');
    glow.style.background = 'radial-gradient(circle, rgba(255, 105, 180, 0.6) 0%, transparent 70%)';
    
    setTimeout(() => {
        ruggyCharacter.style.transform = 'scale(1) rotate(0deg)';
        glow.style.background = 'radial-gradient(circle, rgba(255, 105, 180, 0.2) 0%, transparent 70%)';
        isAnimating = false;
    }, 100);
}

function animateButton() {
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.marginLeft = '-50px';
    ripple.style.marginTop = '-50px';
    
    tapButton.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createConfetti() {
    const insects = ['🦎', '🕷️', '🦗', '🐛', '🦋', '🐜', '🦟', '🦂', '🕸️', '🦎'];
    const colors = ['#00ff88', '#ff69b4', '#ff1493', '#00cc6a', '#ffa500'];
    
    for (let i = 0; i < 6; i++) {
        const insect = document.createElement('div');
        insect.className = 'confetti';
        insect.style.left = Math.random() * 100 + '%';
        insect.style.fontSize = (Math.random() * 10 + 30) + 'px';
        insect.style.color = colors[Math.floor(Math.random() * colors.length)];
        insect.style.animationDuration = (Math.random() * 0.5 + 1.5) + 's';
        insect.textContent = insects[Math.floor(Math.random() * insects.length)];
        
        confettiContainer.appendChild(insect);
        
        setTimeout(() => {
            insect.remove();
        }, 2000);
    }
}

function playTapSound() {
    try {
        // Create a celebratory fanfare sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a celebratory chord progression (C major chord)
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        const duration = 0.5;

        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const delay = index * 0.08; // Arpeggio effect

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Bright, celebratory sound
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);

            // Victory fanfare envelope
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
            gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + delay + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + delay + 0.25);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);

            oscillator.start(audioContext.currentTime + delay);
            oscillator.stop(audioContext.currentTime + delay + duration);
        });

        // Add a celebratory "ding" sound at the end
        setTimeout(() => {
            const celebOsc = audioContext.createOscillator();
            const celebGain = audioContext.createGain();

            celebOsc.connect(celebGain);
            celebGain.connect(audioContext.destination);

            celebOsc.type = 'sine';
            celebOsc.frequency.setValueAtTime(1568, audioContext.currentTime); // G6 - victory note

            celebGain.gain.setValueAtTime(0, audioContext.currentTime);
            celebGain.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 0.02);
            celebGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

            celebOsc.start(audioContext.currentTime);
            celebOsc.stop(audioContext.currentTime + 0.4);
        }, 200);
        
    } catch (error) {
        // Fallback to original sound if Web Audio API fails
        try {
            tapSound.currentTime = 0;
            tapSound.play();
        } catch (fallbackError) {
            console.log('Sound playback blocked');
        }
    }
}

function copyContractAddress() {
    const address = contractAddressElement.textContent;
    
    navigator.clipboard.writeText(address).then(() => {
        // Show success feedback
        const originalText = copyTextElement.innerHTML;
        copyTextElement.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyTextElement.style.color = '#00ff88';
        
        setTimeout(() => {
            copyTextElement.innerHTML = originalText;
            copyTextElement.style.color = '#ff69b4';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function resetCounter() {
    if (confirm('Are you sure you want to reset your all-time counter?')) {
        totalTaps = 0;
        sessionTaps = 0;
        badgeNumber = 0;
        updateDisplays();
        saveGameData();
        
        // Show reset animation
        const resetAnimation = document.createElement('div');
        resetAnimation.style.position = 'fixed';
        resetAnimation.style.top = '50%';
        resetAnimation.style.left = '50%';
        resetAnimation.style.transform = 'translate(-50%, -50%)';
        resetAnimation.style.fontSize = '2rem';
        resetAnimation.style.color = '#ff69b4';
        resetAnimation.style.zIndex = '1001';
        resetAnimation.textContent = 'RESET!';
        resetAnimation.style.animation = 'fadeInOut 2s ease-in-out';
        
        document.body.appendChild(resetAnimation);
        
        setTimeout(() => {
            resetAnimation.remove();
        }, 2000);
    }
}

// Function removed - now using server-based community taps

function startCharacterAnimation() {
    // Random character movements
    setInterval(() => {
        if (!isAnimating) {
            const randomMove = Math.random();
            if (randomMove < 0.1) {
                // Small bounce
                ruggyCharacter.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    ruggyCharacter.style.transform = 'scale(1)';
                }, 200);
            } else if (randomMove < 0.15) {
                // Wink animation
                ruggyCharacter.style.filter = 'brightness(1.2)';
                setTimeout(() => {
                    ruggyCharacter.style.filter = 'brightness(1)';
                }, 300);
            }
        }
    }, 3000);
}

function saveGameData() {
    const gameData = {
        // Don't save sessionTaps and badgeNumber - they should reset each session
        totalTaps,
        communityTaps
    };
    localStorage.setItem('ruggyGameData', JSON.stringify(gameData));
}

function loadGameData() {
    const savedData = localStorage.getItem('ruggyGameData');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        // Don't load sessionTaps and badgeNumber - they should start at 0
        totalTaps = gameData.totalTaps || 0;
    }
}

// Load community taps from server
async function loadCommunityTaps() {
    try {
        const response = await fetch(`${SERVER_URL}/api/taps`);
        const data = await response.json();
        communityTaps = data.communityTaps;
        updateDisplays();
    } catch (error) {
        console.log('Failed to load community taps, using local data');
        // Fallback to local data if server is not available
        const savedData = localStorage.getItem('ruggyGameData');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            communityTaps = gameData.communityTaps || 0;
        }
    }
}

// Auto-refresh community taps every 3 seconds
function startLiveUpdates() {
    setInterval(() => {
        loadCommunityTapsWithFeedback();
    }, 3000); // Update every 3 seconds
}

// Enhanced load function with visual feedback
async function loadCommunityTapsWithFeedback() {
    try {
        const response = await fetch(`${SERVER_URL}/api/taps`);
        const data = await response.json();
        const oldTaps = communityTaps;
        communityTaps = data.communityTaps;
        
        // Show brief animation if taps increased
        if (communityTaps > oldTaps) {
            showTapIncreaseAnimation(communityTaps - oldTaps);
        }
        
        updateDisplays();
    } catch (error) {
        console.log('Failed to load community taps');
    }
}

// Show animation when community taps increase
function showTapIncreaseAnimation(increase) {
    const worldTapsElement = document.getElementById('worldTaps');
    const worldTapsFooterElement = document.getElementById('worldTapsFooter');
    
    // Create floating +X indicator
    const indicator = document.createElement('div');
    indicator.textContent = `+${increase}`;
    indicator.style.position = 'absolute';
    indicator.style.color = '#00ff88';
    indicator.style.fontWeight = 'bold';
    indicator.style.fontSize = '1.2rem';
    indicator.style.animation = 'floatUp 2s ease-out forwards';
    indicator.style.pointerEvents = 'none';
    indicator.style.zIndex = '1000';
    
    // Position relative to world taps display
    const rect = worldTapsElement.getBoundingClientRect();
    indicator.style.left = (rect.left + rect.width / 2) + 'px';
    indicator.style.top = rect.top + 'px';
    indicator.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(indicator);
    
    // Remove after animation
    setTimeout(() => {
        indicator.remove();
    }, 2000);
    
    // Brief glow effect on counters
    [worldTapsElement, worldTapsFooterElement].forEach(element => {
        element.style.textShadow = '0 0 20px #00ff88';
        setTimeout(() => {
            element.style.textShadow = '';
        }, 1000);
    });
}

// Send tap to server
async function sendTapToServer() {
    try {
        const response = await fetch(`${SERVER_URL}/api/tap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.success) {
            communityTaps = data.communityTaps;
            updateDisplays();
        }
    } catch (error) {
        console.log('Failed to send tap to server');
        // Increment locally if server is not available
        communityTaps++;
        updateDisplays();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
    }
`;
document.head.appendChild(style);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Create massive insect invasion
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 100);
    }
    
    // Change character temporarily
    ruggyCharacter.style.filter = 'hue-rotate(180deg) brightness(1.5)';
    setTimeout(() => {
        ruggyCharacter.style.filter = 'none';
    }, 3000);
    
    // Show easter egg message
    const easterEgg = document.createElement('div');
    easterEgg.style.position = 'fixed';
    easterEgg.style.top = '50%';
    easterEgg.style.left = '50%';
    easterEgg.style.transform = 'translate(-50%, -50%)';
    easterEgg.style.fontSize = '3rem';
    easterEgg.style.color = '#ff69b4';
    easterEgg.style.zIndex = '1001';
    easterEgg.style.textAlign = 'center';
    easterEgg.innerHTML = '🦎 RUGGY INSECT INVASION! 🦎<br><span style="font-size: 1rem;">You found the secret!</span>';
    easterEgg.style.animation = 'fadeInOut 4s ease-in-out';
    
    document.body.appendChild(easterEgg);
    
    setTimeout(() => {
        easterEgg.remove();
    }, 4000);
}

// Whitepaper Modal
function showWhitepaper() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border: 3px solid #00ff88;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            color: white;
            text-align: center;
            box-shadow: 0 0 50px rgba(0, 255, 136, 0.5);
            position: relative;
            max-height: 85vh;
            overflow-y: auto;
        " class="modal-container">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                color: #00ff88;
                font-size: 2rem;
                cursor: pointer;
                font-weight: bold;
            ">×</button>
            
            <h1 style="
                color: #00ff88;
                font-size: 4rem;
                font-weight: 900;
                margin-bottom: 20px;
                text-shadow: 0 0 20px rgba(0, 255, 136, 0.7);
                letter-spacing: 2px;
            ">NO RUGPULL</h1>
            
            <p style="
                font-size: 1.5rem;
                color: #ff69b4;
                font-weight: bold;
                margin-top: 20px;
                text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
            ">
                $RUG Whitepaper<br>Anti-Rugpull Mission
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Show Thank You Popup
function showThankYouPopup() {
    const popup = document.getElementById('thankYouPopup');
    
    // Show popup with animation
    popup.classList.add('show');
    
    // Hide popup after 2.5 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2500);
}

// Roadmap Modal
function showRoadmap() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border: 3px solid #ff69b4;
            border-radius: 20px;
            padding: 35px;
            max-width: 650px;
            width: 90%;
            color: white;
            text-align: center;
            box-shadow: 0 0 50px rgba(255, 105, 180, 0.5);
            position: relative;
            animation: modalSlideIn 0.5s ease-out;
            max-height: 85vh;
            overflow-y: auto;
        " class="modal-container">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                color: #ff69b4;
                font-size: 2rem;
                cursor: pointer;
                font-weight: bold;
            ">×</button>
            
            <h1 style="
                color: #ff69b4;
                font-size: 3rem;
                font-weight: 900;
                margin-bottom: 20px;
                text-shadow: 0 0 20px rgba(255, 105, 180, 0.7);
                letter-spacing: 2px;
            ">🗺️ ROADMAP</h1>
            
            <div style="
                background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(0, 255, 136, 0.1));
                border-radius: 15px;
                padding: 30px;
                margin-bottom: 30px;
                border: 2px solid #ff69b4;
            ">
                <h2 style="
                    color: #ff69b4;
                    font-size: 2rem;
                    margin-bottom: 20px;
                    text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
                ">⚠️ NO FALSE PROMISES</h2>
                
                <p style="
                    font-size: 1.3rem;
                    color: #00ff88;
                    font-weight: bold;
                    margin-bottom: 25px;
                    line-height: 1.6;
                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
                ">
                    $RUG is the meme that fights back.<br>
                    Every time someone buys $RUG, they're making a statement.
                </p>
                
                <div style="
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 10px;
                    padding: 25px;
                    border: 2px solid #00ff88;
                ">
                    <h3 style="
                        color: #00ff88;
                        font-size: 1.8rem;
                        margin-bottom: 15px;
                        text-shadow: 0 0 15px rgba(0, 255, 136, 0.7);
                    ">🎯 OUR ONE AND ONLY GOAL:</h3>
                    
                    <p style="
                        font-size: 2.2rem;
                        font-weight: 900;
                        background: linear-gradient(45deg, #ff69b4, #00ff88, #ff69b4);
                        background-size: 200% 200%;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        animation: gradientShift 2s ease-in-out infinite;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 20px;
                    ">
                        BECOME THE MEME<br>AGAINST RUGPULLS! 🦎
                    </p>
                    
                    <p style="
                        font-size: 1.1rem;
                        color: #ccc;
                        font-style: italic;
                        margin-top: 20px;
                    ">
                        That's it. That's the roadmap. 🚀<br>
                        Simple, honest, and to the point.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// About Modal
function showAbout() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border: 3px solid #ff69b4;
            border-radius: 20px;
            padding: 40px;
            max-width: 700px;
            width: 90%;
            color: white;
            text-align: center;
            box-shadow: 0 0 50px rgba(255, 105, 180, 0.5);
            position: relative;
            animation: modalSlideIn 0.5s ease-out;
            max-height: 85vh;
            overflow-y: auto;
        " class="modal-container">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                color: #ff69b4;
                font-size: 2rem;
                cursor: pointer;
                font-weight: bold;
            ">×</button>
            
            <h1 style="
                color: #ff69b4;
                font-size: 2.5rem;
                font-weight: 900;
                margin-bottom: 25px;
                text-shadow: 0 0 20px rgba(255, 105, 180, 0.7);
                letter-spacing: 1px;
            ">ℹ️ ABOUT $RUG</h1>
            
            <div style="
                background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(0, 255, 136, 0.1));
                border-radius: 15px;
                padding: 30px;
                margin-bottom: 30px;
                border: 2px solid #ff69b4;
            ">
                <h2 style="
                    color: #ff69b4;
                    font-size: 1.8rem;
                    margin-bottom: 20px;
                    text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
                ">WHY WE CREATED THIS COIN</h2>
                
                <div style="text-align: left; line-height: 1.6; font-size: 1.1rem;">
                    <p style="
                        margin-bottom: 20px;
                        color: #ffffff;
                        font-weight: bold;
                    ">
                        <strong style="color: #ff69b4;">We've been there.</strong> We've felt the pain. 💔
                    </p>
                    
                    <p style="margin-bottom: 18px; color: #cccccc;">
                        We created $RUG because <strong style="color: #00ff88;">we've also been scammed</strong> and been victims of rugpulls. We know what it feels like to watch your investment disappear overnight because developers decided to abandon their project and run away with the money.
                    </p>
                    
                    <p style="margin-bottom: 18px; color: #cccccc;">
                        Every rugpull victim has a story. Every lost investment represents trust that was broken. We've experienced this firsthand, and we're tired of seeing good people get hurt by bad actors in the crypto space.
                    </p>
                    

                    
                    <div style="
                        margin-top: 20px;
                        text-align: center;
                        padding: 20px;
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 10px;
                        border: 1px solid rgba(255, 105, 180, 0.3);
                    ">
                        <p style="
                            color: #00ff88;
                            font-size: 1.2rem;
                            font-weight: bold;
                            margin-bottom: 10px;
                        ">
                            $RUG is our way of fighting back.
                        </p>
                        
                        <p style="
                            color: #ff69b4;
                            font-size: 1.1rem;
                            font-weight: bold;
                            text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
                        ">
                            Buy $RUG. Fight back. Never again.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Rugpull Info Modal
function showRugpullInfo() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border: 3px solid #ff69b4;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            color: white;
            text-align: center;
            box-shadow: 0 0 50px rgba(255, 105, 180, 0.5);
            position: relative;
            max-height: 85vh;
            overflow-y: auto;
        " class="modal-container">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                color: #ff69b4;
                font-size: 2rem;
                cursor: pointer;
                font-weight: bold;
            ">×</button>
            
            <h2 style="
                color: #ff69b4;
                font-size: 2rem;
                margin-bottom: 20px;
                text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
            ">🚨 What are RUGPULLS? 🚨</h2>
            
            <div style="text-align: left; line-height: 1.6;">
                <p style="margin-bottom: 15px; font-size: 1.1rem;">
                    <strong style="color: #ff69b4;">Rugpulls</strong> are fraudulent actions in the crypto world where developers:
                </p>
                
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">💸 <strong>Remove all liquidity</strong> and leave investors with worthless tokens</li>
                    <li style="margin-bottom: 8px;">🤖 <strong>Use fake bots</strong> to create artificial demand</li>
                    <li style="margin-bottom: 8px;">📢 <strong>Make false promises</strong> and then disappear</li>
                    <li style="margin-bottom: 8px;">🔒 <strong>Bypass token locks</strong> and sell prematurely</li>
                </ul>
                
                <p style="margin-bottom: 15px; font-size: 1.1rem;">
                    <strong style="color: #00ff88;">$RUG fights against this!</strong> We set an example for:
                </p>
                
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">✅ <strong>Transparency</strong> - All transactions are public</li>
                    <li style="margin-bottom: 8px;">✅ <strong>Fairness</strong> - No hidden tricks</li>
                    <li style="margin-bottom: 8px;">✅ <strong>Community</strong> - Together against fraud</li>
                    <li style="margin-bottom: 8px;">✅ <strong>Education</strong> - Awareness about rugpulls</li>
                </ul>
                
                <p style="
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #00ff88;
                    text-align: center;
                    margin-top: 20px;
                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
                ">
                    🦎 Support the mission - Buy $RUG! 🦎
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Show Thank You Popup
function showThankYouPopup() {
    const popup = document.getElementById('thankYouPopup');
    
    // Show popup with animation
    popup.classList.add('show');
    
    // Hide popup after 2.5 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2500);
} 
