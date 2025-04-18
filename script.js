class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timer = null;
        this.isRunning = false;
        this.laps = [];
        this.isCountdown = false;
        this.targetTime = 0;
        this.warningThreshold = 10000; 
        
        this.display = document.querySelector('.display');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.lapList = document.getElementById('lapList');
        this.modeToggle = document.getElementById('modeToggle');
        this.countdownInput = document.querySelector('.countdown-input');
        this.minutesInput = document.getElementById('minutesInput');
        this.secondsInput = document.getElementById('secondsInput');
        this.millisecondsInput = document.getElementById('millisecondsInput');
        this.setTimeBtn = document.getElementById('setTimeBtn');
        
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.modeToggle.addEventListener('click', () => this.toggleMode());
        this.setTimeBtn.addEventListener('click', () => this.setCountdownTime());
        
        this.updateDisplay();
    }
    
    toggleMode() {
        this.reset();
        this.isCountdown = !this.isCountdown;
        this.modeToggle.textContent = this.isCountdown ? 'Switch to Stopwatch' : 'Switch to Countdown';
        this.countdownInput.style.display = this.isCountdown ? 'block' : 'none';
        this.lapBtn.style.display = this.isCountdown ? 'none' : 'block';
        this.display.classList.remove('warning');
    }
    
    setCountdownTime() {
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        const milliseconds = parseInt(this.millisecondsInput.value) || 0;
        
        this.targetTime = (minutes * 60000) + (seconds * 1000) + (milliseconds * 10);
        this.elapsedTime = this.targetTime;
        this.updateDisplay();
        this.display.classList.remove('warning');
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            if (this.isCountdown) {
                this.startTime = Date.now();
                this.timer = setInterval(() => this.updateCountdown(), 10);
            } else {
                this.startTime = Date.now() - this.elapsedTime;
                this.timer = setInterval(() => this.updateDisplay(), 10);
            }
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timer);
            this.display.classList.remove('warning');
        }
    }
    
    reset() {
        this.pause();
        if (this.isCountdown) {
            this.elapsedTime = this.targetTime;
        } else {
            this.elapsedTime = 0;
        }
        this.laps = [];
        this.lapList.innerHTML = '';
        this.updateDisplay();
        this.display.classList.remove('warning');
    }
    
    recordLap() {
        if (this.isRunning && !this.isCountdown) {
            const lapTime = this.formatTime(this.elapsedTime);
            this.laps.push(lapTime);
            const lapItem = document.createElement('li');
            lapItem.textContent = `Lap ${this.laps.length}: ${lapTime}`;
            this.lapList.prepend(lapItem);
        }
    }
    
    updateCountdown() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.startTime;
        this.elapsedTime = Math.max(0, this.targetTime - elapsed);
        
        if (this.elapsedTime <= this.warningThreshold && this.elapsedTime > 0) {
            this.display.classList.add('warning');
        } else {
            this.display.classList.remove('warning');
        }
        
        if (this.elapsedTime <= 0) {
            this.pause();
            this.elapsedTime = 0;
            this.display.classList.remove('warning');
        }
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        if (this.isRunning && !this.isCountdown) {
            const currentTime = Date.now();
            this.elapsedTime = currentTime - this.startTime;
        }
        this.display.textContent = this.formatTime(this.elapsedTime);
    }
    
    formatTime(time) {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const milliseconds = Math.floor((time % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
    }
}

const stopwatch = new Stopwatch(); 
