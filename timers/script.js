document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timerContainer = document.getElementById('timerContainer');
    let intervalId;
    let creatingTimers = false;

    startBtn.addEventListener('click', () => {
        if (!creatingTimers) {
            creatingTimers = true;
            createTimersInBatches();
        }
    });

    stopBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        creatingTimers = false;
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        creatingTimers = false;
        timerContainer.innerHTML = '';
    });

    function createTimersInBatches() {
        const numberOfTimers = Math.floor(Math.random() * (100 - 30) + 30);
        let timersCreated = 0;

        intervalId = setInterval(() => {
            createRandomTimer();
            timersCreated++;
            if (timersCreated >= numberOfTimers) {
                clearInterval(intervalId);
                setTimeout(() => {
                    if (creatingTimers) createTimersInBatches();
                }, Math.random() * (4000 - 2000) + 2000);
            }
        }, 10);
    }

    function createRandomTimer() {
        const timerElement = document.createElement('div');
        timerElement.classList.add('timer');
        timerContainer.appendChild(timerElement);

        let countdown = Math.random() * (65000 - 4000) + 4000;
        timerElement.textContent = formatTime(countdown);

        const timeoutId = setInterval(() => {
            countdown -= 100;
            if (countdown <= 0) {
                clearInterval(timeoutId);
                timerElement.textContent = '00 : 00 : 00';
                setTimeout(() => {
                    timerElement.remove();
                }, 1000);
            } else {
                timerElement.textContent = formatTime(countdown);
                if (countdown <= 3000) {
                    timerElement.classList.add('red');
                }
            }
        }, 10);
    }

    function formatTime(milliseconds) {
        if (milliseconds < 0) milliseconds = 0;
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        const hundredths = Math.floor((milliseconds % 1000) / 10);
        return `${pad(minutes, 2)} : ${pad(seconds, 2)} : ${pad(hundredths, 2)}`;
    }

    function pad(number, length) {
        return number.toString().padStart(length, '0');
    }
});
