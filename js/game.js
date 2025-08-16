class Game {
    constructor() {
        this.board = null;
        this.ai = null;
        this.state = {
            isPlaying: false,
            isPaused: false,
            isGameClear: false,
            currentDifficulty: 'easy'
        };
        this.stats = {
            score: 0,
            linesCleared: 0,
            piecesSent: 0,
            pieceTypes: {
                I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0
            }
        };
        this.countdownMode = false;
        this.initialScore = 0;
        this.pieceQueue = [];
        this.isProcessing = false;
        this.animationQueue = [];
        this.lastUpdate = 0;
        this.updateThrottle = 1000 / PERFORMANCE_CONFIG.FPS_TARGET;
        
        // Speed enhancement system
        this.speedBoost = {
            active: false,
            multiplier: 1.0,
            lastInputTime: 0,
            inputCount: 0,
            maxMultiplier: 5.0,
            decayRate: 0.95,
            boostThreshold: 100 // ms between inputs to trigger boost
        };
    }

    init() {
        const canvas = document.getElementById('gameBoard');
        this.board = new Board(canvas);
        this.ai = new AIPlayer(this.state.currentDifficulty);
        this.reset();
    }

    reset() {
        this.board.reset();
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.state.isGameClear = false;
        
        // Reset stats with appropriate starting score
        this.stats = {
            score: this.countdownMode ? this.initialScore : 0,
            linesCleared: 0,
            piecesSent: 0,
            pieceTypes: {
                I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0
            }
        };
        
        this.pieceQueue = [];
        this.isProcessing = false;
        this.animationQueue = [];
        this.resetSpeedBoost();
        this.updateUI();
        this.board.draw();
    }

    resetSpeedBoost() {
        this.speedBoost = {
            active: false,
            multiplier: 1.0,
            lastInputTime: 0,
            inputCount: 0,
            maxMultiplier: 5.0,
            decayRate: 0.95,
            boostThreshold: 100
        };
    }

    updateSpeedBoost() {
        const now = Date.now();
        const timeSinceLastInput = now - this.speedBoost.lastInputTime;
        
        if (timeSinceLastInput > 500) { // Reset if no input for 500ms
            this.speedBoost.multiplier = Math.max(1.0, this.speedBoost.multiplier * 0.8);
            this.speedBoost.inputCount = 0;
            this.speedBoost.active = false;
        } else {
            // Decay multiplier over time
            this.speedBoost.multiplier *= this.speedBoost.decayRate;
            this.speedBoost.multiplier = Math.max(1.0, this.speedBoost.multiplier);
        }
    }

    async sendPiece(pieceType) {
        if (!this.state.isPlaying || this.state.isPaused) {
            return false;
        }

        // Allow queue overflow during speed boost
        const maxQueueSize = this.speedBoost.active ? 10 : 5;
        if (this.pieceQueue.length >= maxQueueSize) {
            return false;
        }

        const now = Date.now();
        const timeSinceLastInput = now - this.speedBoost.lastInputTime;
        
        // Check for rapid input
        if (timeSinceLastInput < this.speedBoost.boostThreshold) {
            this.speedBoost.inputCount++;
            this.speedBoost.multiplier = Math.min(
                this.speedBoost.maxMultiplier, 
                1.0 + (this.speedBoost.inputCount * 0.3)
            );
            this.speedBoost.active = true;
        } else if (timeSinceLastInput > 300) {
            // Reset if input is too slow
            this.speedBoost.inputCount = 1;
            this.speedBoost.multiplier = 1.0;
            this.speedBoost.active = false;
        }
        
        this.speedBoost.lastInputTime = now;

        this.pieceQueue.push(pieceType);
        this.updateQueueDisplay();
        
        if (!this.isProcessing) {
            this.processQueue();
        }

        return true;
    }

    async processQueue() {
        while (this.pieceQueue.length > 0 && this.state.isPlaying && !this.state.isPaused) {
            this.isProcessing = true;
            this.updateSpeedBoost();
            
            const pieceType = this.pieceQueue.shift();
            this.updateQueueDisplay();
            
            await this.processPiece(pieceType);
            
            if (this.state.isGameClear) {
                break;
            }
        }
        this.isProcessing = false;
    }

    async processPiece(pieceType) {
        this.stats.piecesSent++;
        this.stats.pieceTypes[pieceType]++;
        
        // Countdown mode: subtract points for sending pieces
        if (this.countdownMode) {
            const pieceCost = 10; // Base cost per piece
            this.stats.score -= pieceCost;
        } else {
            this.stats.score += SCORE_VALUES.PIECE_PLACED;
        }

        const bestMove = await this.ai.findBestMove(this.board, pieceType, this.speedBoost.multiplier);
        
        if (!bestMove) {
            this.gameOver();
            return;
        }

        await this.ai.animateMove(this.board, bestMove, this.speedBoost.multiplier);

        const completedLines = this.board.checkLines();
        if (completedLines.length > 0) {
            await this.clearLines(completedLines);
        }

        if (this.board.checkGameOver()) {
            this.gameOver();
        }

        this.throttledUpdateUI();
    }

    async clearLines(lines) {
        // Faster line clearing during speed boost
        const clearDelay = this.speedBoost.active ? 
            Math.max(50, LINE_CLEAR_DELAY / this.speedBoost.multiplier) : 
            LINE_CLEAR_DELAY;

        this.board.highlightLines(lines);
        this.board.draw();
        
        await this.delay(clearDelay);
        
        this.board.clearLines(lines);
        this.board.draw();
        
        this.stats.linesCleared += lines.length;
        
        if (this.countdownMode) {
            // Countdown mode: lose more points when AI clears lines
            const linePenalty = lines.length * 50; // 50 points per line cleared by AI
            this.stats.score -= linePenalty;
            
            // Additional penalty for multiple lines (tetris, etc.)
            if (lines.length > 1) {
                const multiLinePenalty = (lines.length - 1) * 25;
                this.stats.score -= multiLinePenalty;
            }
        } else {
            // Original scoring system
            this.stats.score += lines.length * SCORE_VALUES.LINE_CLEARED;
            
            if (lines.length > 1) {
                this.stats.score += (lines.length - 1) * SCORE_VALUES.MULTIPLE_LINES_BONUS;
            }
            
            // Bonus points for speed boost
            if (this.speedBoost.active) {
                this.stats.score += Math.floor(lines.length * 10 * this.speedBoost.multiplier);
            }
        }
    }

    gameOver() {
        this.state.isPlaying = false;
        this.state.isGameClear = true;
        this.stats.score += SCORE_VALUES.GAME_CLEAR;
        
        // Speed bonus
        if (this.speedBoost.active) {
            this.stats.score += Math.floor(500 * this.speedBoost.multiplier);
        }
        
        this.showGameOverModal();
        this.updateUI();
    }

    pause() {
        if (!this.state.isPlaying || this.state.isGameClear) {
            return;
        }
        
        this.state.isPaused = !this.state.isPaused;
        
        if (this.state.isPaused) {
            this.resetSpeedBoost(); // Reset speed boost when paused
        }
        
        this.updatePauseButton();
        
        if (!this.state.isPaused && this.pieceQueue.length > 0) {
            this.processQueue();
        }
    }

    updatePauseButton() {
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            const resumeText = (typeof i18n !== 'undefined') ? i18n.getText('resume') : 'Resume';
            const pauseText = (typeof i18n !== 'undefined') ? i18n.getText('pause') : 'Pause';
            pauseBtn.textContent = this.state.isPaused ? resumeText : pauseText;
        }
    }

    setDifficulty(difficulty) {
        this.state.currentDifficulty = difficulty;
        if (this.ai) {
            this.ai.setDifficulty(difficulty);
        }
        this.resetSpeedBoost();
    }

    initializeCountdownMode(difficulty) {
        this.countdownMode = true;
        this.setDifficulty(difficulty);
        
        // Set initial score based on difficulty
        const startingScores = {
            easy: 3000,
            normal: 2000,
            hard: 1000
        };
        
        this.initialScore = startingScores[difficulty];
        this.stats.score = this.initialScore;
        
        // Initialize game state
        if (!this.board) {
            this.init();
        } else {
            this.reset();
        }
    }


    throttledUpdateUI() {
        const now = Date.now();
        if (now - this.lastUpdate > this.updateThrottle) {
            this.updateUI();
            this.lastUpdate = now;
        }
    }

    updateUI() {
        requestAnimationFrame(() => {
            const scoreElement = document.getElementById('score');
            if (scoreElement) {
                scoreElement.textContent = this.stats.score.toLocaleString();
                
                // Add negative score styling in countdown mode
                if (this.countdownMode && this.stats.score < 0) {
                    scoreElement.classList.add('negative');
                } else {
                    scoreElement.classList.remove('negative');
                }
            }
            
            const linesClearedElement = document.getElementById('linesCleared');
            if (linesClearedElement) {
                linesClearedElement.textContent = this.stats.linesCleared;
            }
            
            const piecesSentElement = document.getElementById('piecesSent');
            if (piecesSentElement) {
                piecesSentElement.textContent = this.stats.piecesSent;
            }
            
            // Show speed boost indicator
            this.updateSpeedIndicator();
            this.updateStatsChart();
        });
    }

    updateSpeedIndicator() {
        const aiStatus = document.getElementById('aiThinking');
        if (aiStatus && this.speedBoost.active) {
            const intensity = Math.min(1, this.speedBoost.multiplier / 3);
            aiStatus.style.filter = `hue-rotate(${intensity * 120}deg) brightness(${1 + intensity})`;
            aiStatus.style.transform = `scale(${1 + intensity * 0.2})`;
        } else if (aiStatus) {
            aiStatus.style.filter = '';
            aiStatus.style.transform = '';
        }
    }

    updateQueueDisplay() {
        const queueElement = document.getElementById('pieceQueue');
        if (!queueElement) return;
        
        requestAnimationFrame(() => {
            queueElement.innerHTML = '';
            
            this.pieceQueue.forEach((pieceType, index) => {
                const queueItem = document.createElement('div');
                queueItem.className = 'queue-item';
                queueItem.style.backgroundColor = COLORS[pieceType];
                
                // Visual feedback for speed boost
                if (this.speedBoost.active) {
                    queueItem.style.boxShadow = `0 0 10px ${COLORS[pieceType]}`;
                    queueItem.style.animation = 'queuePulse 0.3s ease infinite alternate';
                }
                
                queueItem.style.animationDelay = `${index * 30}ms`;
                queueElement.appendChild(queueItem);
            });
        });
    }

    updateStatsChart() {
        const canvas = document.getElementById('statsChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const pieceTypes = Object.keys(this.stats.pieceTypes);
        const maxCount = Math.max(...Object.values(this.stats.pieceTypes), 1);
        const barWidth = canvas.width / pieceTypes.length;
        
        pieceTypes.forEach((type, index) => {
            const count = this.stats.pieceTypes[type];
            const barHeight = (count / maxCount) * (canvas.height - 20);
            const x = index * barWidth + barWidth * 0.1;
            const y = canvas.height - barHeight - 10;
            
            ctx.fillStyle = COLORS[type];
            ctx.fillRect(x, y, barWidth * 0.8, barHeight);
            
            ctx.fillStyle = 'var(--text-secondary)';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(type, x + barWidth * 0.4, canvas.height - 2);
            
            if (count > 0) {
                ctx.fillStyle = 'var(--text-primary)';
                ctx.font = 'bold 9px Inter';
                ctx.fillText(count, x + barWidth * 0.4, y - 2);
            }
        });
    }

    showGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        modal.classList.remove('hidden');
        
        document.getElementById('finalScore').textContent = this.stats.score.toLocaleString();
        document.getElementById('finalLines').textContent = this.stats.linesCleared;
        document.getElementById('finalPieces').textContent = this.stats.piecesSent;
    }

    hideGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        modal.classList.add('hidden');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}