 // Rock Paper Scissors Enhanced Game Logic
const gameConfig = {
    sounds: {
        win: new Audio('sounds/win.mp3'),
        lose: new Audio('sounds/lose.mp3'),
        draw: new Audio('sounds/draw.mp3')
    },
    maxScore: 5,
    vibrationPatterns: {
        win: [100, 50, 100],
        lose: [200],
        draw: [50, 50]
    }
};

let userScore = 0;
let computerScore = 0;

const choices = document.querySelectorAll('.choice');
const msg = document.getElementById('message');
const body = document.body;

const userScoreRef = document.getElementById('user-score-value');
const computerScoreRef = document.getElementById('computer-score-value');

const choicesArray = ['ROCK', 'PAPER', 'SCISSORS'];

// Accessibility: Add keyboard support
choices.forEach(choice => {
    choice.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            playGame(choice.id);
        }
    });
});

const genChoice = () => {
    const randomIndex = Math.floor(Math.random() * 3);
    return choicesArray[randomIndex];
};

const playSound = (result) => {
    try {
        switch(result) {
            case 'win':
                gameConfig.sounds.win.play();
                break;
            case 'lose':
                gameConfig.sounds.lose.play();
                break;
            case 'draw':
                gameConfig.sounds.draw.play();
                break;
        }
    } catch (error) {
        console.warn('Sound playback failed:', error);
    }
};

const triggerVibration = (result) => {
    if ('vibrate' in navigator) {
        switch(result) {
            case 'win':
                navigator.vibrate(gameConfig.vibrationPatterns.win);
                break;
            case 'lose':
                navigator.vibrate(gameConfig.vibrationPatterns.lose);
                break;
            case 'draw':
                navigator.vibrate(gameConfig.vibrationPatterns.draw);
                break;
        }
    }
};

const determineWinner = (userChoice, computerChoice) => {
    if (userChoice === computerChoice) return 'draw';
    
    const winConditions = {
        'ROCK': 'SCISSORS',
        'PAPER': 'ROCK',
        'SCISSORS': 'PAPER'
    };

    return winConditions[userChoice] === computerChoice ? 'win' : 'lose';
};

const updateUI = (result, userChoice, computerChoice) => {
    const resultMessages = {
        'win': `You win! ${userChoice} beats ${computerChoice}`,
        'lose': `You lose! ${computerChoice} beats ${userChoice}`,
        'draw': `It's a draw! Both chose ${userChoice}`
    };

    msg.textContent = resultMessages[result];
    msg.classList.add(result);

    // Target msg-container for color change
    const msgContainer = document.querySelector('.msg-container');
    msgContainer.style.backgroundColor = result === 'win' ? 'var(--color-secondary)' : 
                                         result === 'lose' ? 'var(--color-accent)' : 
                                         'var(--color-primary)';

    // Reset color after 1 second
    setTimeout(() => {
        msgContainer.style.backgroundColor = 'var(--color-background)';
        msg.classList.remove(result);
    }, 1000);
};

const checkGameEnd = () => {
    if (userScore === gameConfig.maxScore || computerScore === gameConfig.maxScore) {
        const winner = userScore === gameConfig.maxScore ? 'Player' : 'Computer';
        msg.textContent = ` ${winner} wins the game! `;
        
        // Disable choices
        choices.forEach(choice => {
            choice.removeEventListener('click', choiceClickHandler);
            choice.setAttribute('aria-disabled', 'true');
        });

        // Optional: Add restart button or auto-restart
        setTimeout(resetGame, 3000);
    }
};

const resetGame = () => {
    userScore = 0;
    computerScore = 0;
    userScoreRef.textContent = userScore;
    computerScoreRef.textContent = computerScore;
    msg.textContent = 'New game! Make your choice.';
    
    choices.forEach(choice => {
        choice.addEventListener('click', choiceClickHandler);
        choice.removeAttribute('aria-disabled');
    });
};

const playGame = (userChoice) => {
    const computerChoice = genChoice();
    const result = determineWinner(userChoice, computerChoice);

    // Update scores
    if (result === 'win') userScore++;
    if (result === 'lose') computerScore++;

    // Update score display
    userScoreRef.textContent = userScore;
    computerScoreRef.textContent = computerScore;

    // Multimedia feedback
    playSound(result);
    triggerVibration(result);

    // Update UI
    updateUI(result, userChoice, computerChoice);

    // Check for game end
    checkGameEnd();
};

const choiceClickHandler = (event) => {
    const choiceId = event.currentTarget.id;
    playGame(choiceId);
};

choices.forEach((choice) => {
    choice.addEventListener('click', choiceClickHandler);
});

// Optional: Add touch and swipe support for mobile
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;

    if (Math.abs(diffX) > 50) {
        // Swipe detected, could be used for additional interactions
        console.log('Swipe detected:', diffX > 0 ? 'right' : 'left');
    }
});