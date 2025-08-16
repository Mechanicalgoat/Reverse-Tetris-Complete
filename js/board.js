class Board {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = this.createEmptyGrid();
        this.currentPiece = null;
        this.highlightedLines = [];
    }

    createEmptyGrid() {
        return Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
    }

    reset() {
        this.grid = this.createEmptyGrid();
        this.currentPiece = null;
        this.highlightedLines = [];
        this.draw();
    }

    isValidPosition(piece, offsetX = 0, offsetY = 0, newShape = null) {
        const shape = newShape || piece.shape;
        const newX = piece.x + offsetX;
        const newY = piece.y + offsetY;

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;

                    if (boardX < 0 || boardX >= GRID_WIDTH || 
                        boardY < 0 || boardY >= GRID_HEIGHT) {
                        return false;
                    }

                    if (this.grid[boardY][boardX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placePiece(piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardY = piece.y + y;
                    const boardX = piece.x + x;
                    if (boardY >= 0 && boardY < GRID_HEIGHT && 
                        boardX >= 0 && boardX < GRID_WIDTH) {
                        this.grid[boardY][boardX] = piece.type;
                    }
                }
            }
        }
        this.currentPiece = null;
    }

    checkLines() {
        const completedLines = [];
        
        for (let y = 0; y < GRID_HEIGHT; y++) {
            let isComplete = true;
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (!this.grid[y][x]) {
                    isComplete = false;
                    break;
                }
            }
            if (isComplete) {
                completedLines.push(y);
            }
        }
        
        return completedLines;
    }

    highlightLines(lines) {
        this.highlightedLines = lines;
        this.draw();
    }

    clearLines(lines) {
        for (const line of lines.sort((a, b) => b - a)) {
            this.grid.splice(line, 1);
            this.grid.unshift(Array(GRID_WIDTH).fill(0));
        }
        this.highlightedLines = [];
    }

    getHeight() {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (this.grid[y][x]) {
                    return GRID_HEIGHT - y;
                }
            }
        }
        return 0;
    }

    getHoles() {
        let holes = 0;
        for (let x = 0; x < GRID_WIDTH; x++) {
            let blockFound = false;
            for (let y = 0; y < GRID_HEIGHT; y++) {
                if (this.grid[y][x]) {
                    blockFound = true;
                } else if (blockFound) {
                    holes++;
                }
            }
        }
        return holes;
    }

    getBumpiness() {
        const heights = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
            let height = 0;
            for (let y = 0; y < GRID_HEIGHT; y++) {
                if (this.grid[y][x]) {
                    height = GRID_HEIGHT - y;
                    break;
                }
            }
            heights.push(height);
        }

        let bumpiness = 0;
        for (let i = 0; i < heights.length - 1; i++) {
            bumpiness += Math.abs(heights[i] - heights[i + 1]);
        }
        return bumpiness;
    }

    checkGameOver() {
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (this.grid[y][x]) {
                    return true;
                }
            }
        }
        return false;
    }

    draw() {
        this.ctx.fillStyle = COLORS.EMPTY;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGrid();
        this.drawBlocks();
        
        if (this.currentPiece) {
            drawTetromino(this.ctx, this.currentPiece);
        }

        if (this.highlightedLines.length > 0) {
            this.drawHighlightedLines();
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = COLORS.GRID_LINE;
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= GRID_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * CELL_SIZE, 0);
            this.ctx.lineTo(x * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
            this.ctx.stroke();
        }

        for (let y = 0; y <= GRID_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * CELL_SIZE);
            this.ctx.lineTo(GRID_WIDTH * CELL_SIZE, y * CELL_SIZE);
            this.ctx.stroke();
        }

        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 3 * CELL_SIZE);
        this.ctx.lineTo(GRID_WIDTH * CELL_SIZE, 3 * CELL_SIZE);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawBlocks() {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (this.grid[y][x]) {
                    const color = COLORS[this.grid[y][x]];
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(
                        x * CELL_SIZE,
                        y * CELL_SIZE,
                        CELL_SIZE - 1,
                        CELL_SIZE - 1
                    );

                    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(
                        x * CELL_SIZE,
                        y * CELL_SIZE,
                        CELL_SIZE - 1,
                        CELL_SIZE - 1
                    );
                }
            }
        }
    }

    drawHighlightedLines() {
        this.ctx.fillStyle = COLORS.HIGHLIGHT;
        for (const line of this.highlightedLines) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                this.ctx.fillRect(
                    x * CELL_SIZE,
                    line * CELL_SIZE,
                    CELL_SIZE - 1,
                    CELL_SIZE - 1
                );
            }
        }
    }

    copyGrid() {
        return this.grid.map(row => [...row]);
    }

    setGrid(grid) {
        this.grid = grid.map(row => [...row]);
    }
}