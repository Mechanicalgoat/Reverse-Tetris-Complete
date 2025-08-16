class UI {
    constructor(game) {
        this.game = game;
        this.initEventListeners();
        this.initPiecePreview();
    }

    initEventListeners() {
        document.querySelectorAll('.piece-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pieceType = btn.dataset.piece;
                this.handlePieceSelection(pieceType, btn);
            });

            btn.addEventListener('mouseenter', () => {
                if (this.game.state.isPlaying && !this.game.state.isPaused) {
                    btn.style.transform = 'scale(1.1)';
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

    initPiecePreview() {
        document.querySelectorAll('.piece-preview').forEach(canvas => {
            const pieceType = canvas.dataset.piece;
            drawTetrominoPreview(canvas, pieceType);
        });
    }

    handlePieceSelection(pieceType, button) {
        if (!this.game.state.isPlaying || this.game.state.isPaused) {
            this.showMessage('ゲーム中でないか一時停止中です');
            return;
        }

        if (this.game.pieceQueue.length >= 5) {
            this.showMessage('キューが満杯です');
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
            '7': 'L',
            'q': 'I',
            'w': 'O',
            'e': 'T',
            'r': 'S',
            't': 'Z',
            'y': 'J',
            'u': 'L'
        };

        const pieceType = keyMap[e.key.toLowerCase()];
        if (pieceType) {
            e.preventDefault();
            const button = document.querySelector(`.piece-btn[data-piece="${pieceType}"]`);
            if (button) {
                this.handlePieceSelection(pieceType, button);
            }
        }

        if (e.key === ' ' || e.key === 'p') {
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
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        button.appendChild(ripple);
        
        setTimeout(() => {
            button.classList.remove('selected');
            ripple.remove();
        }, 300);
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
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 18px;
            z-index: 2000;
            animation: fadeInOut 2s ease;
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

        if (confirm('ゲームをリセットしますか？')) {
            this.game.reset();
        }
    }

    playSound(type) {
        // サウンド実装は省略（オプション）
    }

    updateDifficultyDisplay() {
        const difficulty = this.game.state.currentDifficulty;
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
        });
    }
}

// アニメーション用CSS追加
const style = document.createElement('style');
style.textContent = `
    .selected {
        animation: pulse 0.3s ease;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(0.9); }
        100% { transform: scale(1); }
    }
    
    .ripple {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.5);
        animation: rippleEffect 0.3s ease;
    }
    
    @keyframes rippleEffect {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
    
    .shake {
        animation: shake 0.5s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);