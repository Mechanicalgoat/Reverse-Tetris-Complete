class AIPlayer {
    constructor(difficulty = 'normal') {
        this.difficulty = difficulty;
        this.settings = DIFFICULTY_SETTINGS[difficulty];
        this.isThinking = false;
        this.moveCache = new Map();
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.settings = DIFFICULTY_SETTINGS[difficulty];
        this.moveCache.clear();
    }

    async findBestMove(board, pieceType) {
        this.isThinking = true;
        this.showThinking(true);

        const cacheKey = this.generateCacheKey(board, pieceType);
        if (this.moveCache.has(cacheKey)) {
            await this.delay(Math.min(this.settings.thinkingTime, 200));
            this.isThinking = false;
            this.showThinking(false);
            return this.moveCache.get(cacheKey);
        }

        const thinkingDelay = this.settings.thinkingTime * 0.3;
        await this.delay(thinkingDelay);

        const piece = new Tetromino(pieceType);
        const moves = this.getAllPossibleMoves(board, piece);
        
        let bestMove = null;
        let bestScore = -Infinity;

        for (const move of moves) {
            const score = this.evaluateMove(board, move);
            const finalScore = this.applyRandomness(score);
            
            if (finalScore > bestScore) {
                bestScore = finalScore;
                bestMove = move;
            }
        }

        if (this.moveCache.size > 50) {
            this.moveCache.clear();
        }
        this.moveCache.set(cacheKey, bestMove);

        this.isThinking = false;
        this.showThinking(false);
        
        return bestMove;
    }

    generateCacheKey(board, pieceType) {
        const gridStr = board.grid.map(row => row.join('')).join('|');
        return `${pieceType}-${gridStr}-${this.difficulty}`;
    }

    getAllPossibleMoves(board, piece) {
        const moves = [];
        const checkedPositions = new Set();
        
        for (let rotation = 0; rotation < 4; rotation++) {
            const rotatedShape = piece.getRotatedShape(rotation);
            
            for (let x = -2; x < GRID_WIDTH + 2; x++) {
                const testPiece = piece.clone();
                testPiece.shape = rotatedShape;
                testPiece.x = x;
                testPiece.rotation = rotation;
                
                if (!this.isValidHorizontalPosition(board, testPiece)) {
                    continue;
                }
                
                while (board.isValidPosition(testPiece, 0, 1)) {
                    testPiece.y++;
                }
                
                const posKey = `${testPiece.x}-${testPiece.y}-${rotation}`;
                if (!checkedPositions.has(posKey) && testPiece.y >= 0) {
                    checkedPositions.add(posKey);
                    moves.push({
                        piece: testPiece.clone(),
                        x: testPiece.x,
                        y: testPiece.y,
                        rotation: rotation
                    });
                }
            }
        }
        
        return moves;
    }

    isValidHorizontalPosition(board, piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = piece.x + x;
                    if (boardX < 0 || boardX >= GRID_WIDTH) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    evaluateMove(board, move) {
        const testBoard = new Board(document.createElement('canvas'));
        testBoard.setGrid(board.copyGrid());
        testBoard.placePiece(move.piece);
        
        const completedLines = testBoard.checkLines();
        const height = testBoard.getHeight();
        const holes = testBoard.getHoles();
        const bumpiness = testBoard.getBumpiness();
        
        const score = 
            this.settings.heightWeight * height +
            this.settings.linesWeight * completedLines.length +
            this.settings.holesWeight * holes +
            this.settings.bumpinessWeight * bumpiness;
        
        return score;
    }

    applyRandomness(score) {
        if (this.settings.randomness === 0) {
            return score;
        }
        
        const randomFactor = 1 + (Math.random() - 0.5) * this.settings.randomness;
        return score * randomFactor;
    }

    async animateMove(board, move) {
        const piece = new Tetromino(move.piece.type);
        piece.shape = move.piece.shape;
        piece.x = move.x;
        piece.y = 0;
        
        board.currentPiece = piece;
        board.draw();

        const dropSpeed = 16;
        const targetY = move.y;
        
        while (piece.y < targetY) {
            await this.delay(dropSpeed);
            piece.y++;
            board.draw();
        }
        
        board.placePiece(piece);
        board.draw();
    }

    delay(ms) {
        return new Promise(resolve => {
            if (ms <= 0) {
                resolve();
            } else {
                setTimeout(resolve, ms);
            }
        });
    }

    showThinking(show) {
        const thinkingElement = document.getElementById('aiThinking');
        if (thinkingElement) {
            thinkingElement.style.opacity = show ? '1' : '0.5';
            thinkingElement.style.transform = show ? 'scale(1)' : 'scale(0.95)';
        }
    }
}