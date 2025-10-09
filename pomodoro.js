// 🎯 Debug logging helper
const logDebug = (message, data = null) => {
    console.log(`⏰ TimerDebug: ${message}`, data ? data : '');
};

// 🎯 Performance monitoring helper
const trackPerformance = (operation, startTime) => {
    const duration = performance.now() - startTime;
    logDebug(`⏱️ ${operation} Performance`, { duration: `${duration.toFixed(2)}ms` });
    return duration;
};

document.addEventListener('DOMContentLoaded', () => {
    const loadStartTime = performance.now();
    logDebug('🚀 Pomodoro timer initialized');

    // 🎯 DOM Elements with enhanced accessibility
    const timeDisplay = document.querySelector('.time-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pomodoroBtn = document.getElementById('pomodoro-btn');
    const shortBreakBtn = document.getElementById('short-break-btn');
    const longBreakBtn = document.getElementById('long-break-btn');

    // 🎯 Timer state with enhanced tracking
    let timerInterval;
    let isRunning = false;
    let timeRemaining = 25 * 60; // Default Pomodoro time in seconds
    let currentMode = 'pomodoro';
    let sessionStats = {
        pomodorosCompleted: 0,
        totalFocusTime: 0,
        sessions: [],
        startTime: null
    };

    // Timer configurations
    const timerConfig = {
        pomodoro: 25 * 60,
        'short-break': 5 * 60,
        'long-break': 15 * 60
    };

    const modeNames = {
        pomodoro: 'Pomodoro',
        'short-break': 'Short Break',
        'long-break': 'Long Break'
    };

    // 🎯 Enhanced display update with accessibility
    function updateDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const displayText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        timeDisplay.textContent = displayText;
        
        // 🎯 Update aria-live region for screen readers
        timeDisplay.setAttribute('aria-live', 'polite');
        timeDisplay.setAttribute('aria-label', `${minutes} minutes ${seconds} seconds remaining in ${modeNames[currentMode]}`);
        
        logDebug('🔄 Display updated', {
            display: displayText,
            mode: currentMode,
            remaining: timeRemaining
        });
    }

    // 🎯 Enhanced timer start with state tracking
    function startTimer() {
        if (isRunning) {
            logDebug('⚠️ Timer already running', { currentMode, timeRemaining });
            return;
        }

        const startTime = performance.now();
        isRunning = true;
        
        // 🎯 Track session start
        if (!sessionStats.startTime) {
            sessionStats.startTime = new Date();
            logDebug('🎬 Session started', { 
                startTime: sessionStats.startTime.toISOString(),
                mode: currentMode 
            });
        }

        // 🎯 Update button states for accessibility
        updateButtonStates();
        
        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateDisplay();
                
                // 🎯 Log every minute for performance monitoring
                if (timeRemaining % 60 === 0) {
                    logDebug('⏲️ Timer tick', {
                        minutesRemaining: Math.floor(timeRemaining / 60),
                        mode: currentMode
                    });
                }
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                
                // 🎯 Track session completion
                trackSessionCompletion();
                
                // 🎯 Enhanced notification
                const completionMessage = `${modeNames[currentMode]} session completed!`;
                logDebug('✅ Timer completed', { 
                    mode: currentMode,
                    message: completionMessage
                });
                
                // 🎯 Accessible notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Pomodoro Timer', {
                        body: completionMessage,
                        icon: '/timer-icon.png'
                    });
                } else {
                    // Fallback alert with enhanced accessibility
                    const alertBox = document.createElement('div');
                    alertBox.setAttribute('role', 'alert');
                    alertBox.setAttribute('aria-live', 'assertive');
                    alertBox.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #4CAF50;
                        color: white;
                        padding: 1rem;
                        border-radius: 8px;
                        z-index: 1000;
                    `;
                    alertBox.textContent = completionMessage;
                    document.body.appendChild(alertBox);
                    
                    setTimeout(() => {
                        document.body.removeChild(alertBox);
                    }, 5000);
                }
                
                updateButtonStates();
            }
        }, 1000);

        const startDuration = trackPerformance('Timer Start', startTime);
        logDebug('▶️ Timer started', {
            mode: currentMode,
            duration: timeRemaining,
            startPerformance: `${startDuration.toFixed(2)}ms`
        });
    }

    // 🎯 Enhanced pause function with state tracking
    function pauseTimer() {
        if (!isRunning) {
            logDebug('⚠️ Timer not running, cannot pause');
            return;
        }

        const pauseTime = performance.now();
        clearInterval(timerInterval);
        isRunning = false;
        
        updateButtonStates();
        
        const pauseDuration = trackPerformance('Timer Pause', pauseTime);
        logDebug('⏸️ Timer paused', {
            mode: currentMode,
            remaining: timeRemaining,
            pausePerformance: `${pauseDuration.toFixed(2)}ms`
        });
    }

    // 🎯 Enhanced reset function with session tracking
    function resetTimer() {
        const resetTime = performance.now();
        
        pauseTimer();
        timeRemaining = timerConfig[currentMode];
        updateDisplay();
        
        // 🎯 Update active button state
        updateActiveModeButton();
        
        const resetDuration = trackPerformance('Timer Reset', resetTime);
        logDebug('🔄 Timer reset', {
            mode: currentMode,
            resetTo: timeRemaining,
            resetPerformance: `${resetDuration.toFixed(2)}ms`
        });
    }

    // 🎯 Enhanced mode setting with validation
    function setMode(mode) {
        if (!timerConfig.hasOwnProperty(mode)) {
            logDebug('❌ Invalid mode attempted', { attemptedMode: mode });
            return;
        }

        const modeChangeTime = performance.now();
        const previousMode = currentMode;
        
        pauseTimer();
        currentMode = mode;
        timeRemaining = timerConfig[mode];
        updateDisplay();
        
        // 🎯 Update active button with accessibility
        updateActiveModeButton();
        
        const modeChangeDuration = trackPerformance('Mode Change', modeChangeTime);
        logDebug('🎯 Mode changed', {
            from: previousMode,
            to: mode,
            duration: timeRemaining,
            performance: `${modeChangeDuration.toFixed(2)}ms`
        });
    }

    // 🎯 Helper function to update active mode button
    function updateActiveModeButton() {
        const activeButton = document.querySelector('.modes .active');
        if (activeButton) {
            activeButton.classList.remove('active');
            activeButton.setAttribute('aria-pressed', 'false');
        }
        
        const newActiveButton = document.getElementById(`${currentMode}-btn`);
        if (newActiveButton) {
            newActiveButton.classList.add('active');
            newActiveButton.setAttribute('aria-pressed', 'true');
        }
    }

    // 🎯 Helper function to update control button states
    function updateButtonStates() {
        // Update Start/Pause button states
        startBtn.disabled = isRunning;
        startBtn.setAttribute('aria-disabled', isRunning.toString());
        pauseBtn.disabled = !isRunning;
        pauseBtn.setAttribute('aria-disabled', (!isRunning).toString());
        
        // Update button labels for accessibility
        startBtn.setAttribute('aria-label', isRunning ? 'Timer is running' : 'Start timer');
        pauseBtn.setAttribute('aria-label', isRunning ? 'Pause timer' : 'Timer is paused');
        
        logDebug('🔘 Button states updated', {
            isRunning: isRunning,
            startDisabled: startBtn.disabled,
            pauseDisabled: pauseBtn.disabled
        });
    }

    // 🎯 Session tracking and statistics
    function trackSessionCompletion() {
        const session = {
            mode: currentMode,
            duration: timerConfig[currentMode],
            completedAt: new Date().toISOString(),
            successful: true
        };
        
        sessionStats.sessions.push(session);
        
        if (currentMode === 'pomodoro') {
            sessionStats.pomodorosCompleted++;
            sessionStats.totalFocusTime += timerConfig.pomodoro;
        }
        
        logDebug('📊 Session completed and tracked', {
            session: session,
            totalPomodoros: sessionStats.pomodorosCompleted,
            totalFocusTime: sessionStats.totalFocusTime
        });
        
        // 🎯 Log statistics periodically
        if (sessionStats.pomodorosCompleted % 4 === 0) {
            logDebug('🏆 Milestone reached', {
                pomodorosCompleted: sessionStats.pomodorosCompleted,
                totalSessions: sessionStats.sessions.length,
                totalFocusTime: sessionStats.totalFocusTime
            });
        }
    }

    // 🎯 Enhanced event listeners with error handling
    function setupEventListeners() {
        try {
            // Control buttons
            startBtn.addEventListener('click', () => {
                logDebug('👆 Start button clicked');
                startTimer();
            });
            
            pauseBtn.addEventListener('click', () => {
                logDebug('👆 Pause button clicked');
                pauseTimer();
            });
            
            resetBtn.addEventListener('click', () => {
                logDebug('👆 Reset button clicked');
                resetTimer();
            });
            
            // Mode buttons
            pomodoroBtn.addEventListener('click', () => {
                logDebug('👆 Pomodoro mode selected');
                setMode('pomodoro');
            });
            
            shortBreakBtn.addEventListener('click', () => {
                logDebug('👆 Short break mode selected');
                setMode('short-break');
            });
            
            longBreakBtn.addEventListener('click', () => {
                logDebug('👆 Long break mode selected');
                setMode('long-break');
            });
            
            // 🎯 Keyboard navigation support
            document.addEventListener('keydown', (event) => {
                switch (event.key) {
                    case ' ':
                    case 'Enter':
                        if (document.activeElement === startBtn && !isRunning) {
                            event.preventDefault();
                            logDebug('⌨️ Start timer with keyboard');
                            startTimer();
                        } else if (document.activeElement === pauseBtn && isRunning) {
                            event.preventDefault();
                            logDebug('⌨️ Pause timer with keyboard');
                            pauseTimer();
                        }
                        break;
                    case 'r':
                    case 'R':
                        if (event.ctrlKey) {
                            event.preventDefault();
                            logDebug('⌨️ Reset timer with Ctrl+R');
                            resetTimer();
                        }
                        break;
                    case '1':
                        event.preventDefault();
                        logDebug('⌨️ Switch to Pomodoro with keyboard');
                        setMode('pomodoro');
                        break;
                    case '2':
                        event.preventDefault();
                        logDebug('⌨️ Switch to Short Break with keyboard');
                        setMode('short-break');
                        break;
                    case '3':
                        event.preventDefault();
                        logDebug('⌨️ Switch to Long Break with keyboard');
                        setMode('long-break');
                        break;
                }
            });
            
            logDebug('🔧 Event listeners setup completed');
            
        } catch (error) {
            logDebug('❌ Error setting up event listeners', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    // 🎯 Initialize accessibility attributes
    function initializeAccessibility() {
        // Time display
        timeDisplay.setAttribute('role', 'timer');
        timeDisplay.setAttribute('aria-live', 'polite');
        timeDisplay.setAttribute('aria-atomic', 'true');
        
        // Control buttons
        startBtn.setAttribute('aria-label', 'Start the timer');
        pauseBtn.setAttribute('aria-label', 'Pause the timer');
        resetBtn.setAttribute('aria-label', 'Reset the timer to initial time');
        
        // Mode buttons
        pomodoroBtn.setAttribute('aria-label', 'Set Pomodoro mode - 25 minutes focus');
        pomodoroBtn.setAttribute('aria-pressed', 'true');
        shortBreakBtn.setAttribute('aria-label', 'Set Short Break mode - 5 minutes break');
        shortBreakBtn.setAttribute('aria-pressed', 'false');
        longBreakBtn.setAttribute('aria-label', 'Set Long Break mode - 15 minutes break');
        longBreakBtn.setAttribute('aria-pressed', 'false');
        
        logDebug('♿ Accessibility features initialized');
    }

    // 🎯 Request notification permission
    function initializeNotifications() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                logDebug('🔔 Notification permission status', { permission: permission });
            });
        }
    }

    // 🎯 Initialize the application
    function initializeApp() {
        initializeAccessibility();
        initializeNotifications();
        setupEventListeners();
        updateDisplay();
        updateButtonStates();
        
        const loadDuration = trackPerformance('App Initialization', loadStartTime);
        logDebug('✅ Pomodoro timer fully initialized', {
            loadTime: `${loadDuration.toFixed(2)}ms`,
            initialMode: currentMode,
            initialTime: timeRemaining
        });
    }

    // Start the application
    initializeApp();

    // 🎯 Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        logDebug('🧹 Timer cleanup performed', {
            sessionsCompleted: sessionStats.pomodorosCompleted,
            totalFocusTime: sessionStats.totalFocusTime,
            totalSessions: sessionStats.sessions.length
        });
    });
});
