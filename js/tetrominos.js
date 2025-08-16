const TETROMINOS = {
    I: {
        shape: [[1, 1, 1, 1]],
        color: COLORS.I
    },
    O: {
        shape: [[1, 1], [1, 1]],
        color: COLORS.O
    },
    T: {
        shape: [[0, 1, 0], [1, 1, 1]],
        color: COLORS.T
    },
    S: {
        shape: [[0, 1, 1], [1, 1, 0]],
        color: COLORS.S
    },
    Z: {
        shape: [[1, 1, 0], [0, 1, 1]],
        color: COLORS.Z
    },
    J: {
        shape: [[1, 0, 0], [1, 1, 1]],
        color: COLORS.J
    },
    L: {
        shape: [[0, 0, 1], [1, 1, 1]],
        color: COLORS.L
    }
};

class Tetromino {
    constructor(type) {
        this.type = type;
        this.shape = TETROMINOS[type].shape;
        this.color = TETROMINOS[type].color;
        this.x = Math.floor((GRID_WIDTH - this.shape[0].length) / 2);
        this.y = 0;
        this.rotation = 0;
    }

    rotate() {
        const rows = this.shape.length;
        const cols = this.shape[0].length;
        const rotated = [];

        for (let i = 0; i < cols; i++) {
            rotated[i] = [];
            for (let j = rows - 1; j >= 0; j--) {
                rotated[i][rows - 1 - j] = this.shape[j][i];
            }
        }

        return rotated;
    }

    getRotatedShape(rotations = 1) {
        let shape = this.shape;
        for (let i = 0; i < rotations; i++) {
            const rows = shape.length;
            const cols = shape[0].length;
            const rotated = [];

            for (let i = 0; i < cols; i++) {
                rotated[i] = [];
                for (let j = rows - 1; j >= 0; j--) {
                    rotated[i][rows - 1 - j] = shape[j][i];
                }
            }
            shape = rotated;
        }
        return shape;
    }

    clone() {
        const cloned = new Tetromino(this.type);
        cloned.x = this.x;
        cloned.y = this.y;
        cloned.rotation = this.rotation;
        cloned.shape = this.shape.map(row => [...row]);
        return cloned;
    }
}

function drawTetromino(ctx, tetromino, offsetX = 0, offsetY = 0, cellSize = CELL_SIZE) {
    ctx.fillStyle = tetromino.color;
    
    for (let y = 0; y < tetromino.shape.length; y++) {
        for (let x = 0; x < tetromino.shape[y].length; x++) {
            if (tetromino.shape[y][x]) {
                const drawX = (tetromino.x + x) * cellSize + offsetX;
                const drawY = (tetromino.y + y) * cellSize + offsetY;
                
                ctx.fillRect(drawX, drawY, cellSize - 1, cellSize - 1);
                
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.strokeRect(drawX, drawY, cellSize - 1, cellSize - 1);
            }
        }
    }
}

function drawTetrominoPreview(canvas, type) {
    const ctx = canvas.getContext('2d');
    const tetromino = TETROMINOS[type];
    const cellSize = 15;
    
    canvas.width = 60;
    canvas.height = 60;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const offsetX = (canvas.width - tetromino.shape[0].length * cellSize) / 2;
    const offsetY = (canvas.height - tetromino.shape.length * cellSize) / 2;
    
    ctx.fillStyle = tetromino.color;
    
    for (let y = 0; y < tetromino.shape.length; y++) {
        for (let x = 0; x < tetromino.shape[y].length; x++) {
            if (tetromino.shape[y][x]) {
                const drawX = x * cellSize + offsetX;
                const drawY = y * cellSize + offsetY;
                
                ctx.fillRect(drawX, drawY, cellSize - 1, cellSize - 1);
                
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.strokeRect(drawX, drawY, cellSize - 1, cellSize - 1);
            }
        }
    }
}