class AIPlayer {
    constructor(difficulty = 'normal') {
        this.difficulty = difficulty;
        this.settings = DIFFICULTY_SETTINGS[difficulty];
        this.isThinking = false;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.settings = DIFFICULTY_SETTINGS[difficulty];
    }

    async findBestMove(board, pieceType) {
        this.isThinking = true;
        this.showThinking(true);

        await this.delay(this.settings.thinkingTime);

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

        this.isThinking = false;
        this.showThinking(false);
        
        return bestMove;
    }

    getAllPossibleMoves(board, piece) {
        const moves = [];
        
        for (let rotation = 0; rotation < 4; rotation++) {
            const rotatedPiece = piece.clone();
            rotatedPiece.shape = piece.getRotatedShape(rotation);
            
            for (let x = -2; x < GRID_WIDTH + 2; x++) {
                const testPiece = rotatedPiece.clone();
                testPiece.x = x;
                
                if (!this.isValidHorizontalPosition(board, testPiece)) {
                    continue;
                }
                
                while (board.isValidPosition(testPiece, 0, 1)) {
                    testPiece.y++;
                }
                
                if (testPiece.y >= 0) {
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
        
        const dropSpeed = 50;
        while (piece.y < move.y) {
            piece.y++;
            board.draw();
            await this.delay(dropSpeed);
        }
        
        board.placePiece(piece);
        board.draw();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showThinking(show) {
        const thinkingElement = document.getElementById('aiThinking');
        if (thinkingElement) {
            thinkingElement.style.opacity = show ? '1' : '0.3';
        }
    }
}