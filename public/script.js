// Password Protection System
const CORRECT_PASSWORD = 'ruggy2024'; // Change this to your desired password
let isAuthenticated = false;

// DOM elements for password protection
const passwordOverlay = document.getElementById('passwordOverlay');
const mainContent = document.getElementById('mainContent');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const errorMessage = document.getElementById('errorMessage');

// Check if user is already authenticated (session storage)
function checkAuthentication() {
    const authenticated = sessionStorage.getItem('ruggyAuthenticated');
    if (authenticated === 'true') {
        isAuthenticated = true;
        showMainContent();
    }
}

// Show main content and hide password overlay
function showMainContent() {
    passwordOverlay.style.display = 'none';
    mainContent.style.display = 'block';
    isAuthenticated = true;
    sessionStorage.setItem('ruggyAuthenticated', 'true');
    
    // Initialize game functionality after authentication
    initializeGame();
}

// Handle login attempt
function handleLogin() {
    const enteredPassword = passwordInput.value.trim();
    
    if (enteredPassword === CORRECT_PASSWORD) {
        showMainContent();
        errorMessage.textContent = '';
        passwordInput.value = '';
    } else {
        errorMessage.textContent = '❌ Wrong password! Try again.';
        passwordInput.value = '';
        passwordInput.focus();
        
        // Shake animation for wrong password
        passwordOverlay.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            passwordOverlay.style.animation = '';
        }, 500);
    }
}

// Event listeners for password protection
loginButton.addEventListener('click', handleLogin);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLogin();
    }
});

// Focus on password input when page loads
passwordInput.focus();

// Check authentication on page load
checkAuthentication();

// Add shake animation for wrong password
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Game Variables
let sessionTaps = 0;
let totalTaps = 0;
let communityTaps = 0;
let badgeNumber = 0;

// DOM Elements
const tapButton = document.getElementById('tapButton');
const sessionTapsElement = document.getElementById('sessionTaps');
const totalTapsElement = document.getElementById('totalTaps');
const communityTapsElement = document.getElementById('communityTaps');
const worldTapsElement = document.getElementById('worldTaps');
const worldTapsFooterElement = document.getElementById('worldTapsFooter');
const contractAddressElement = document.getElementById('contractAddress');
const copyTextElement = document.getElementById('copyText');
const resetLinkElement = document.getElementById('resetLink');
const confettiContainer = document.getElementById('confettiContainer');
const ruggyCharacter = document.getElementById('ruggyCharacter');
const topLeftBadge = document.querySelector('.badge.top-left');
const topRightBadge = document.querySelector('.badge.top-right');

// Server URL (adjust for your deployment)
const SERVER_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : window.location.origin;

// Load game data from localStorage
function loadGameData() {
    const savedData = localStorage.getItem('ruggyGameData');
    if (savedData) {
        const data = JSON.parse(savedData);
        totalTaps = data.totalTaps || 0;
        totalTapsElement.textContent = totalTaps.toLocaleString();
    }
}

// Save game data to localStorage
function saveGameData() {
    const data = {
        totalTaps: totalTaps,
        communityTaps: communityTaps
    };
    localStorage.setItem('ruggyGameData', JSON.stringify(data));
}

// Load community taps from server
async function loadCommunityTaps() {
    try {
        const response = await fetch(`${SERVER_URL}/api/taps`);
        if (response.ok) {
            const data = await response.json();
            communityTaps = data.taps || 0;
            communityTapsElement.textContent = communityTaps.toLocaleString();
            worldTapsElement.textContent = communityTaps.toLocaleString();
            worldTapsFooterElement.textContent = `${communityTaps.toLocaleString()} taps worldwide!`;
        }
    } catch (error) {
        console.log('Could not load community taps from server, using fallback');
        // Fallback to localStorage if server is not available
        const savedData = localStorage.getItem('ruggyGameData');
        if (savedData) {
            const data = JSON.parse(savedData);
            communityTaps = data.communityTaps || 0;
            communityTapsElement.textContent = communityTaps.toLocaleString();
            worldTapsElement.textContent = communityTaps.toLocaleString();
            worldTapsFooterElement.textContent = `${communityTaps.toLocaleString()} taps worldwide!`;
        }
    }
}

// Send tap to server
async function sendTapToServer() {
    try {
        const response = await fetch(`${SERVER_URL}/api/tap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ timestamp: Date.now() })
        });
        
        if (response.ok) {
            const data = await response.json();
            communityTaps = data.taps;
            communityTapsElement.textContent = communityTaps.toLocaleString();
            worldTapsElement.textContent = communityTaps.toLocaleString();
            worldTapsFooterElement.textContent = `${communityTaps.toLocaleString()} taps worldwide!`;
        }
    } catch (error) {
        console.log('Could not send tap to server');
    }
}

// Handle tap
function handleTap() {
    // Increment counters
    sessionTaps++;
    totalTaps++;
    badgeNumber++;
    
    // Update display
    sessionTapsElement.textContent = sessionTaps.toLocaleString();
    totalTapsElement.textContent = totalTaps.toLocaleString();
    
    // Update badges
    topLeftBadge.textContent = badgeNumber;
    topRightBadge.textContent = badgeNumber;
    
    // Play sound
    playTapSound();
    
    // Create insect animation
    createConfetti();
    
    // Save to localStorage
    saveGameData();
    
    // Send to server
    sendTapToServer();
    
    // Character animation
    ruggyCharacter.style.transform = 'scale(1.1)';
    setTimeout(() => {
        ruggyCharacter.style.transform = 'scale(1)';
    }, 100);
}

// Create insect animation (falling insects)
function createConfetti() {
    const insects = ['🦗', '🦎', '🕷️', '🦋', '🐛', '🦂'];
    const numInsects = 6;
    
    for (let i = 0; i < numInsects; i++) {
        setTimeout(() => {
            const insect = document.createElement('div');
            insect.className = 'insect';
            insect.textContent = insects[Math.floor(Math.random() * insects.length)];
            insect.style.left = Math.random() * 100 + '%';
            insect.style.fontSize = (Math.random() * 20 + 15) + 'px';
            insect.style.color = `hsl(${Math.random() * 60 + 120}, 70%, 60%)`;
            insect.style.textShadow = '0 0 10px currentColor';
            
            confettiContainer.appendChild(insect);
            
            // Remove insect after animation
            setTimeout(() => {
                if (insect.parentNode) {
                    insect.parentNode.removeChild(insect);
                }
            }, 2000);
        }, i * 100);
    }
}

// Play tap sound (chameleon tongue flick)
function playTapSound() {
    try {
        // Try Web Audio API for better sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.connect(gainNode);
        gainNode.connect(filter);
        filter.connect(audioContext.destination);
        
        // Configure filter for tongue flick sound
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        
        // Configure oscillator
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
        
        // Configure gain
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        
    } catch (error) {
        // Fallback to audio element
        const audio = document.getElementById('tapSound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }
}

// Copy contract address
function copyContractAddress() {
    const text = contractAddressElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
        copyTextElement.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyTextElement.innerHTML = '<i class="fas fa-copy"></i> Click to copy';
        }, 2000);
    });
}

// Reset counter
function resetCounter() {
    if (confirm('Are you sure you want to reset your all-time counter?')) {
        totalTaps = 0;
        totalTapsElement.textContent = '0';
        saveGameData();
        
        // Send reset to server
        fetch(`${SERVER_URL}/api/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(() => {});
    }
}

// Update world taps (simulated growth)
function updateWorldTaps() {
    // This function is now handled by the server
    // Keeping for fallback purposes
}

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

function activateEasterEgg() {
    // Create massive insect invasion
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 50);
    }
}

// Initialize game functionality
function initializeGame() {
    // Reset session taps on page load
    sessionTaps = 0;
    badgeNumber = 0;
    sessionTapsElement.textContent = '0';
    topLeftBadge.textContent = '0';
    topRightBadge.textContent = '0';
    
    // Load data
    loadGameData();
    loadCommunityTaps();
    
    // Tap button
    tapButton.addEventListener('click', handleTap);
    
    // Contract address copy
    contractAddressElement.addEventListener('click', copyContractAddress);
    
    // Reset link
    resetLinkElement.addEventListener('click', resetCounter);
    
    // Social media button
    document.querySelector('.social-button').addEventListener('click', () => {
        window.open('https://twitter.com/realruggycoin', '_blank');
    });
    
    // Telegram button
    document.querySelector('.telegram-button').addEventListener('click', () => {
        window.open('https://t.me/+fCSY0VJlkwBmYzI8', '_blank');
    });
    
    // Whitepaper button
    document.querySelector('.whitepaper-button').addEventListener('click', () => {
        showWhitepaper();
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Konami Code (works even before login)
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
            konamiCode = [];
        }
    });
    
    // If already authenticated, initialize game
    if (isAuthenticated) {
        initializeGame();
    }
});

// Show rugpull info modal
function showRugpullInfo() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🚨 What are Rugpulls? 🚨</h3>
                <button class="close-button" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="modal-body">
                <p><strong>A rugpull is a malicious act in the cryptocurrency world where developers abandon a project and run away with investors' funds.</strong></p>
                <p>Common rugpull tactics include:</p>
                <ul>
                    <li>🚫 Removing liquidity from trading pairs</li>
                    <li>🚫 Abandoning the project after launch</li>
                    <li>🚫 Selling all tokens and disappearing</li>
                    <li>🚫 Creating fake projects with no real utility</li>
                </ul>
                <p><strong>$RUG stands against these practices and promotes transparency, fairness, and community trust in the crypto space.</strong></p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Show whitepaper modal
function showWhitepaper() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📄 RUGGY $RUG Whitepaper</h3>
                <button class="close-button" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="modal-body">
                <h2 style="text-align: center; color: #ff00ff; font-size: 3rem; margin: 20px 0;">NO RUGPULL</h2>
                <p style="text-align: center; font-size: 1.2rem; color: #00ff00;">That's our entire whitepaper. Simple, honest, transparent.</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
} 
