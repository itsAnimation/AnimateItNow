document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.querySelector('.time-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pomodoroBtn = document.getElementById('pomodoro-btn');
    const shortBreakBtn = document.getElementById('short-break-btn');
    const longBreakBtn = document.getElementById('long-break-btn');

    let timerInterval;
    let isRunning = false;
    let timeRemaining = 25 * 60; // Default Pomodoro time in seconds
    let currentMode = 'pomodoro';

    const pomodoroTime = 25 * 60;
    const shortBreakTime = 5 * 60;
    const longBreakTime = 15 * 60;

    function updateDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                alert('Time\'s up!');
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;
    }

    function resetTimer() {
        pauseTimer();
        switch (currentMode) {
            case 'pomodoro':
                timeRemaining = pomodoroTime;
                break;
            case 'short-break':
                timeRemaining = shortBreakTime;
                break;
            case 'long-break':
                timeRemaining = longBreakTime;
                break;
        }
        updateDisplay();
        
        // Update active button
        document.querySelector('.modes .active').classList.remove('active');
        document.getElementById(`${currentMode}-btn`).classList.add('active');
    }

    function setMode(mode) {
        pauseTimer();
        currentMode = mode;
        switch (mode) {
            case 'pomodoro':
                timeRemaining = pomodoroTime;
                break;
            case 'short-break':
                timeRemaining = shortBreakTime;
                break;
            case 'long-break':
                timeRemaining = longBreakTime;
                break;
        }
        updateDisplay();
        
        // Update active button
        document.querySelector('.modes .active').classList.remove('active');
        document.getElementById(`${mode}-btn`).classList.add('active');
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    pomodoroBtn.addEventListener('click', () => setMode('pomodoro'));
    shortBreakBtn.addEventListener('click', () => setMode('short-break'));
    longBreakBtn.addEventListener('click', () => setMode('long-break'));
});
