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
        this.pieceQueue = [];
        this.isProcessing = false;
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
        this.stats = {
            score: 0,
            linesCleared: 0,
            piecesSent: 0,
            pieceTypes: {
                I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0
            }
        };
        this.pieceQueue = [];
        this.isProcessing = false;
        this.updateUI();
        this.board.draw();
    }

    async sendPiece(pieceType) {
        if (!this.state.isPlaying || this.state.isPaused || this.isProcessing) {
            return false;
        }

        if (this.pieceQueue.length >= 5) {
            return false;
        }

        this.pieceQueue.push(pieceType);
        this.updateQueueDisplay();
        
        if (!this.isProcessing) {
            await this.processQueue();
        }

        return true;
    }

    async processQueue() {
        while (this.pieceQueue.length > 0 && this.state.isPlaying && !this.state.isPaused) {
            this.isProcessing = true;
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
        this.stats.score += SCORE_VALUES.PIECE_PLACED;

        const bestMove = await this.ai.findBestMove(this.board, pieceType);
        
        if (!bestMove) {
            this.gameOver();
            return;
        }

        await this.ai.animateMove(this.board, bestMove);

        const completedLines = this.board.checkLines();
        if (completedLines.length > 0) {
            await this.clearLines(completedLines);
        }

        if (this.board.checkGameOver()) {
            this.gameOver();
        }

        this.updateUI();
    }

    async clearLines(lines) {
        this.board.highlightLines(lines);
        this.board.draw();
        
        await this.delay(LINE_CLEAR_DELAY);
        
        this.board.clearLines(lines);
        this.board.draw();
        
        this.stats.linesCleared += lines.length;
        this.stats.score += lines.length * SCORE_VALUES.LINE_CLEARED;
        
        if (lines.length > 1) {
            this.stats.score += (lines.length - 1) * SCORE_VALUES.MULTIPLE_LINES_BONUS;
        }
        
        this.updateUI();
    }

    gameOver() {
        this.state.isPlaying = false;
        this.state.isGameClear = true;
        this.stats.score += SCORE_VALUES.GAME_CLEAR;
        this.showGameOverModal();
        this.updateUI();
    }

    pause() {
        if (!this.state.isPlaying || this.state.isGameClear) {
            return;
        }
        
        this.state.isPaused = !this.state.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.state.isPaused ? '再開' : '一時停止';
        
        if (!this.state.isPaused && this.pieceQueue.length > 0) {
            this.processQueue();
        }
    }

    changeDifficulty(difficulty) {
        if (this.isProcessing) {
            return;
        }
        
        this.state.currentDifficulty = difficulty;
        this.ai.setDifficulty(difficulty);
        
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });
    }

    updateUI() {
        document.getElementById('score').textContent = this.stats.score;
        document.getElementById('linesCleared').textContent = this.stats.linesCleared;
        document.getElementById('piecesSent').textContent = this.stats.piecesSent;
        
        this.updateStatsChart();
    }

    updateQueueDisplay() {
        const queueElement = document.getElementById('pieceQueue');
        queueElement.innerHTML = '';
        
        this.pieceQueue.forEach(pieceType => {
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            queueItem.style.backgroundColor = COLORS[pieceType];
            queueElement.appendChild(queueItem);
        });
    }

    updateStatsChart() {
        const canvas = document.getElementById('statsChart');
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
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(type, x + barWidth * 0.4, canvas.height);
        });
    }

    showGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        modal.classList.remove('hidden');
        
        document.getElementById('finalScore').textContent = this.stats.score;
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