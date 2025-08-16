class UI {
    constructor(game) {
        this.game = game;
        this.selectedDifficulty = null;
        this.initEventListeners();
        this.initPiecePreview();
        this.initLanguageSelector();
        this.initOnboardingFlow();
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

        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.game.pause();
            });
        }

        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('ゲームをリセットして最初から始めますか？')) {
                    this.showWelcomeModal();
                }
            });
        }


        const playAgainBtn = document.getElementById('playAgainBtn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.game.hideGameOverModal();
                this.showWelcomeModal();
            });
        }

        const helpBtn = document.getElementById('helpBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                if (confirm('ヘルプを表示しますか？最初から設定し直すことになります。')) {
                    this.showWelcomeModal();
                }
            });
        }


        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }

    initLanguageSelector() {
        try {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const lang = btn.dataset.lang;
                    if (typeof i18n !== 'undefined') {
                        i18n.setLanguage(lang);
                        this.updateLanguageButtons();
                    }
                });
            });

            if (typeof i18n !== 'undefined') {
                i18n.addListener(() => {
                    this.updateUI();
                });

                this.updateLanguageButtons();
                i18n.updateUI();
            }
        } catch (error) {
            console.warn('Language selector initialization failed:', error);
        }
    }

    updateLanguageButtons() {
        try {
            if (typeof i18n === 'undefined') return;
            
            const currentLang = i18n.getCurrentLanguage();
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === currentLang);
            });
        } catch (error) {
            console.warn('Error updating language buttons:', error);
        }
    }

    initPiecePreview() {
        try {
            document.querySelectorAll('.piece-preview').forEach(canvas => {
                const pieceType = canvas.dataset.piece;
                if (typeof drawTetrominoPreview === 'function') {
                    drawTetrominoPreview(canvas, pieceType);
                }
            });
        } catch (error) {
            console.error('Error initializing piece previews:', error);
        }
    }

    handlePieceSelection(pieceType, button) {
        if (!this.game.state.isPlaying || this.game.state.isPaused) {
            this.showMessage(this.getText('gamePaused'));
            return;
        }

        // Allow larger queue during speed boost
        const maxQueue = this.game.speedBoost.active ? 10 : 5;
        if (this.game.pieceQueue.length >= maxQueue) {
            const queueFullMsg = this.game.speedBoost.active ? 
                'Speed queue is full (max 10)' : this.getText('queueFull');
            this.showMessage(queueFullMsg);
            this.shakeElement(document.getElementById('pieceQueue'));
            return;
        }

        const success = this.game.sendPiece(pieceType);
        
        if (success) {
            this.animatePieceSelection(button);
            this.showSpeedFeedback(button);
            this.playSound('select');
        }
    }

    getText(key) {
        if (typeof i18n !== 'undefined') {
            return i18n.getText(key);
        }
        
        // Fallback messages
        const fallback = {
            gamePaused: 'Game is paused or not started',
            queueFull: 'Queue is full (max 5)',
            confirmReset: 'Reset the game?',
            pause: 'Pause',
            resume: 'Resume'
        };
        
        return fallback[key] || key;
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
        if (!element) return;
        
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
            background: #1a1a1a;
            color: white;
            border: 1px solid #2d2d2d;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 2000;
            animation: messageShow 2s ease;
            backdrop-filter: blur(8px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 2000);
    }


    updateUI() {
        try {
            const pauseBtn = document.getElementById('pauseBtn');
            if (pauseBtn) {
                pauseBtn.textContent = this.game.state.isPaused ? 
                    this.getText('resume') : this.getText('pause');
            }
        } catch (error) {
            console.warn('Error updating UI:', error);
        }
    }

    playSound(type) {
        // Sound implementation could go here
    }


    showSpeedFeedback(button) {
        if (this.game.speedBoost.active) {
            button.classList.add('rapid-fire');
            setTimeout(() => {
                button.classList.remove('rapid-fire');
            }, 200);

            // Add speed boost indicator to game container
            const gameContainer = document.querySelector('.game-container');
            if (gameContainer) {
                gameContainer.classList.add('speed-boost-active');
                setTimeout(() => {
                    if (!this.game.speedBoost.active) {
                        gameContainer.classList.remove('speed-boost-active');
                    }
                }, 1000);
            }
        }
    }

    showSpeedMessage(multiplier) {
        if (multiplier > 2) {
            const messages = [
                'SPEED BOOST!',
                'RAPID FIRE!',
                'TURBO MODE!',
                'LIGHTNING FAST!',
                'MAXIMUM SPEED!'
            ];
            const messageIndex = Math.min(Math.floor(multiplier - 2), messages.length - 1);
            this.showMessage(messages[messageIndex]);
        }
    }

    initOnboardingFlow() {
        // Always show onboarding flow for every user
        this.showWelcomeModal();

        // Welcome modal language selection
        document.querySelectorAll('.welcome-lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                if (typeof i18n !== 'undefined') {
                    i18n.setLanguage(lang);
                }
                this.showRulesModal();
            });
        });

        // Rules modal continue button
        const continueBtn = document.getElementById('continueToDifficulty');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.showDifficultyModal();
            });
        }

        // Difficulty selection
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.addEventListener('click', () => {
                const difficulty = option.dataset.difficulty;
                this.selectDifficulty(difficulty);
            });
        });

        // Start game button
        const startGameBtn = document.getElementById('startGame');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                if (this.selectedDifficulty) {
                    this.startGameWithDifficulty(this.selectedDifficulty);
                }
            });
        }

        // Prevent modal close on overlay click during onboarding
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                // Don't allow closing during onboarding flow
                e.preventDefault();
                e.stopPropagation();
            });
        });
    }

    showWelcomeModal() {
        // Reset selection state
        this.selectedDifficulty = null;
        
        // Reset difficulty selection UI
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Disable start game button
        const startGameBtn = document.getElementById('startGame');
        if (startGameBtn) {
            startGameBtn.disabled = true;
        }
        
        this.hideAllModals();
        const modal = document.getElementById('welcomeModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    showRulesModal() {
        this.hideAllModals();
        const modal = document.getElementById('rulesModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    showDifficultyModal() {
        this.hideAllModals();
        const modal = document.getElementById('difficultyModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideAllModals() {
        const modals = ['welcomeModal', 'rulesModal', 'difficultyModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    }

    selectDifficulty(difficulty) {
        this.selectedDifficulty = difficulty;
        
        // Update visual selection
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[data-difficulty="${difficulty}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        // Enable start game button
        const startGameBtn = document.getElementById('startGame');
        if (startGameBtn) {
            startGameBtn.disabled = false;
        }
    }

    startGameWithDifficulty(difficulty) {
        try {
            console.log('Starting game with difficulty:', difficulty);
            
            // Hide all modals first
            this.hideAllModals();
            
            // Initialize game if not already done
            if (!this.game.board) {
                this.game.init();
            }
            
            // Initialize game with countdown scoring
            this.game.initializeCountdownMode(difficulty);
            
            console.log('Game started successfully with countdown mode');
        } catch (error) {
            console.error('Error starting game:', error);
        }
    }
}

// Add message animation CSS
const style = document.createElement('style');
style.textContent = `
    .selected {
        background: var(--accent, #4a9eff) !important;
        border-color: var(--accent, #4a9eff) !important;
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