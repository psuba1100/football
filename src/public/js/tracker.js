let mainTimerRunning = false;
const timers = {}; // To store timer intervals and elapsed time
const bigArea = document.getElementById('big-area');
const mainTimerBtn = document.getElementById('main-timer-btn');
const individualTimersContainer = document.getElementById('individual-timers');

// Initialize timers for squares
document.querySelectorAll('.square').forEach(square => {
    timers[square.id] = { interval: null, elapsed: 0 };
    createTimerDisplay(square.id);
    square.addEventListener('dragstart', dragStart);
});

// Timer controls
mainTimerBtn.addEventListener('click', toggleMainTimer);

function toggleMainTimer() {
    mainTimerRunning = !mainTimerRunning;
    mainTimerBtn.textContent = mainTimerRunning ? 'Stop Timer' : 'Start Timer';

    if (mainTimerRunning) {
        startAllTimers();
    } else {
        pauseAllTimers();
    }
}

function startAllTimers() {
    Object.keys(timers).forEach(squareId => {
        if (document.getElementById(squareId).parentElement === bigArea) {
            startTimer(squareId);
        }
    });
}

function pauseAllTimers() {
    Object.keys(timers).forEach(squareId => pauseTimer(squareId));
}

function startTimer(squareId) {
    if (!timers[squareId].interval) {
        timers[squareId].interval = setInterval(() => {
            timers[squareId].elapsed++;
            updateTimerDisplay(squareId);
        }, 1000);
    }
}

function pauseTimer(squareId) {
    if (timers[squareId].interval) {
        clearInterval(timers[squareId].interval);
        timers[squareId].interval = null;
    }
}

function updateTimerDisplay(squareId) {
    const timerElement = document.querySelector(`#timer-${squareId}`);
    timerElement.textContent = `Square ${squareId.replace('square', '')}: ${timers[squareId].elapsed}s`;
}

function createTimerDisplay(squareId) {
    const timerElement = document.createElement('div');
    timerElement.classList.add('timer');
    timerElement.id = `timer-${squareId}`;
    timerElement.textContent = `Square ${squareId.replace('square', '')}: 0s`;
    individualTimersContainer.appendChild(timerElement);
}

// Drag and drop functionality
bigArea.addEventListener('dragover', dragOver);
bigArea.addEventListener('drop', drop);

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const squareId = event.dataTransfer.getData('text');
    const square = document.getElementById(squareId);

    // Calculate the position of the drop relative to the big area
    const bigAreaRect = bigArea.getBoundingClientRect();
    const dropX = event.clientX - bigAreaRect.left - square.offsetWidth / 2;
    const dropY = event.clientY - bigAreaRect.top - square.offsetHeight / 2;

    // Update the square's position
    square.style.left = `${Math.max(0, Math.min(bigArea.offsetWidth - square.offsetWidth, dropX))}px`;
    square.style.top = `${Math.max(0, Math.min(bigArea.offsetHeight - square.offsetHeight, dropY))}px`;

    bigArea.appendChild(square);

    if (mainTimerRunning) startTimer(squareId);

    // Allow clicking to return the square to the list
    square.addEventListener('click', () => {
        const squareList = document.querySelector('.square-list');
        squareList.appendChild(square);

        // Reset the position styles
        square.style.position = ''; 
        square.style.left = ''; 
        square.style.top = ''; 
        pauseTimer(squareId);
    });
}