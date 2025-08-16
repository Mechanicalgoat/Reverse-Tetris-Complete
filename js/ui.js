class UI {
    constructor(game) {
        this.game = game;
        this.initEventListeners();
        this.initPiecePreview();
        this.initLanguageSelector();
    }

    initEventListeners() {
        document.querySelectorAll('.piece-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pieceType = btn.dataset.piece;
                this.handlePieceSelection(pieceType, btn);
            });

            btn.addEventListener('mouseenter', () => {
                if (this.game.state.isPlaying && !this.game.state.isPaused) {
                    btn.style.transform = 'scale(1.05)';
                }
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.game.pause();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.confirmReset();
        });

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                this.game.changeDifficulty(difficulty);
            });
        });

        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.game.hideGameOverModal();
            this.game.reset();
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }

    initLanguageSelector() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                i18n.setLanguage(lang);
                this.updateLanguageButtons();
            });
        });

        i18n.addListener(() => {
            this.updateUI();
        });

        this.updateLanguageButtons();
        i18n.updateUI();
    }

    updateLanguageButtons() {
        const currentLang = i18n.getCurrentLanguage();
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }

    initPiecePreview() {
        document.querySelectorAll('.piece-preview').forEach(canvas => {
            const pieceType = canvas.dataset.piece;
            drawTetrominoPreview(canvas, pieceType);
        });
    }

    handlePieceSelection(pieceType, button) {
        if (!this.game.state.isPlaying || this.game.state.isPaused) {
            this.showMessage(i18n.getText('gamePaused'));
            return;
        }

        if (this.game.pieceQueue.length >= 5) {
            this.showMessage(i18n.getText('queueFull'));
            this.shakeElement(document.getElementById('pieceQueue'));
            return;
        }

        const success = this.game.sendPiece(pieceType);
        
        if (success) {
            this.animatePieceSelection(button);
            this.playSound('select');
        }
    }

    handleKeyPress(e) {
        if (!this.game.state.isPlaying || this.game.state.isPaused) {
            return;
        }

        const keyMap = {
            '1': 'I',
            '2': 'O',
            '3': 'T',
            '4': 'S',
            '5': 'Z',
            '6': 'J',
            '7': 'L'
        };

        const pieceType = keyMap[e.key];
        if (pieceType) {
            e.preventDefault();
            const button = document.querySelector(`.piece-btn[data-piece="${pieceType}"]`);
            if (button) {
                this.handlePieceSelection(pieceType, button);
                this.animatePieceSelection(button);
            }
        }

        if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            this.game.pause();
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            if (this.game.state.isGameClear) {
                this.game.hideGameOverModal();
            }
        }
    }

    animatePieceSelection(button) {
        button.classList.add('selected');
        
        setTimeout(() => {
            button.classList.remove('selected');
        }, 200);
    }

    shakeElement(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'game-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-panel);
            color: var(--text-primary);
            border: 1px solid var(--border);
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 2000;
            animation: messageShow 2s ease;
            backdrop-filter: blur(8px);
            box-shadow: 0 8px 32px var(--shadow);
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }

    confirmReset() {
        if (!this.game.state.isPlaying && !this.game.state.isGameClear) {
            this.game.reset();
            return;
        }

        if (confirm(i18n.getText('confirmReset'))) {
            this.game.reset();
        }
    }

    updateUI() {
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.textContent = this.game.state.isPaused ? 
                i18n.getText('resume') : i18n.getText('pause');
        }
    }

    playSound(type) {
        // Sound implementation could go here
    }

    updateDifficultyDisplay() {
        const difficulty = this.game.state.currentDifficulty;
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
        });
    }
}

// Add message animation CSS
const style = document.createElement('style');
style.textContent = `
    .selected {
        background: var(--accent) !important;
        border-color: var(--accent) !important;
        transform: scale(0.95) !important;
    }
    
    .shake {
        animation: shake 0.5s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
    
    @keyframes messageShow {
        0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.9) translateY(10px); 
        }
        15% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) translateY(0); 
        }
        85% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) translateY(0); 
        }
        100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.9) translateY(-10px); 
        }
    }
`;
document.head.appendChild(style);