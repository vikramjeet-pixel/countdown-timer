const themeBtn = document.getElementById('theme-btn');
const eventSelect = document.getElementById('event-select');
const daysInput = document.getElementById('days');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const setCustomBtn = document.getElementById('set-custom-btn');
const daysDisplay = document.getElementById('days-display');
const hoursDisplay = document.getElementById('hours-display');
const minutesDisplay = document.getElementById('minutes-display');
const secondsDisplay = document.getElementById('seconds-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const statusEl = document.getElementById('status');
const progressCircle = document.querySelector('.progress-ring__circle');
const confettiContainer = document.getElementById('confetti-container');

let totalSeconds = 0;
let remainingSeconds = 0;
let timer = null;
let isPaused = false;
let themes = ['light', 'dark', 'ai'];
let currentThemeIndex = 0;
const completeSound = new Audio('https://freesound.org/data/previews/612/612614_7041357-lq.mp3'); // Sci-fi completion sound

// Event presets
const eventPresets = {
    newyear: { days: getDaysToNewYear(), hours: 0, minutes: 0, seconds: 0 },
    birthday: { days: 30, hours: 0, minutes: 0, seconds: 0 },
    launch: { days: 7, hours: 0, minutes: 0, seconds: 0 }
};

// Theme switching
themeBtn.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.setAttribute('data-theme', themes[currentThemeIndex]);
    if (eventSelect.value !== 'custom') document.body.setAttribute('data-event', eventSelect.value);
});

// Event selection
eventSelect.addEventListener('change', () => {
    const event = eventSelect.value;
    document.body.setAttribute('data-event', event);
    if (event !== 'custom') {
        const preset = eventPresets[event];
        totalSeconds = remainingSeconds = preset.days * 86400 + preset.hours * 3600 + preset.minutes * 60 + preset.seconds;
        updateDisplay();
    }
});

// Custom timer setup
setCustomBtn.addEventListener('click', () => {
    totalSeconds = remainingSeconds = 
        (parseInt(daysInput.value) || 0) * 86400 + 
        (parseInt(hoursInput.value) || 0) * 3600 + 
        (parseInt(minutesInput.value) || 0) * 60 + 
        (parseInt(secondsInput.value) || 0);
    document.body.setAttribute('data-event', 'custom');
    updateDisplay();
});

// Start timer
startBtn.addEventListener('click', () => {
    if (!timer && remainingSeconds > 0) {
        startTimer();
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        statusEl.textContent = "Counting down...";
    }
});

// Pause/Resume timer
pauseBtn.addEventListener('click', () => {
    if (isPaused) {
        startTimer();
        pauseBtn.textContent = "Pause";
        statusEl.textContent = "Counting down...";
    } else {
        clearInterval(timer);
        timer = null;
        pauseBtn.textContent = "Resume";
        statusEl.textContent = "Paused";
    }
    isPaused = !isPaused;
});

// Reset timer
resetBtn.addEventListener('click', () => {
    if (confirm("Reset the timer?")) {
        resetTimer();
        statusEl.textContent = "Timer reset.";
    }
});

function startTimer() {
    timer = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
            updateProgress();
        } else {
            clearInterval(timer);
            timer = null;
            statusEl.textContent = "Time's up! Event initiated.";
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            completeSound.play();
            triggerConfetti();
        }
    }, 1000);
}

function updateDisplay() {
    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    daysDisplay.textContent = String(days).padStart(2, '0');
    hoursDisplay.textContent = String(hours).padStart(2, '0');
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function updateProgress() {
    const progress = (totalSeconds - remainingSeconds) / totalSeconds;
    const offset = 942 * (1 - progress);
    progressCircle.style.strokeDashoffset = offset;
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    remainingSeconds = totalSeconds;
    updateDisplay();
    updateProgress();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause";
    isPaused = false;
    statusEl.textContent = "Ready to start.";
}

function getDaysToNewYear() {
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, 0, 1);
    return Math.ceil((nextYear - now) / (1000 * 60 * 60 * 24));
}

function triggerConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animation = `fall ${Math.random() * 2 + 1}s linear`;
        confettiContainer.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Initial setup
document.body.setAttribute('data-event', 'newyear');
totalSeconds = remainingSeconds = eventPresets.newyear.days * 86400;
updateDisplay();

// Confetti animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .confetti {
        position: absolute;
        width: 12px;
        height: 12px;
        opacity: 0.9;
        transform: rotate(${Math.random() * 360}deg);
    }
    @keyframes fall {
        0% { top: -20vh; opacity: 1; }
        100% { top: 100vh; opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);