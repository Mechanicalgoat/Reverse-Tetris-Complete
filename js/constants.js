const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const CELL_SIZE = 30;
const GAME_SPEED = 500;
const LINE_CLEAR_DELAY = 300;

const COLORS = {
    I: '#00f0f0',
    O: '#f0f000',
    T: '#a000f0',
    S: '#00f000',
    Z: '#f00000',
    J: '#0000f0',
    L: '#f0a000',
    EMPTY: '#111111',
    GRID_LINE: '#333333',
    HIGHLIGHT: '#ffffff'
};

const DIFFICULTY_SETTINGS = {
    easy: {
        heightWeight: -0.3,
        linesWeight: 0.5,
        holesWeight: -0.5,
        bumpinessWeight: -0.3,
        randomness: 0.1,
        thinkingTime: 800
    },
    normal: {
        heightWeight: -0.5,
        linesWeight: 1.0,
        holesWeight: -1.0,
        bumpinessWeight: -0.5,
        randomness: 0.05,
        thinkingTime: 600
    },
    hard: {
        heightWeight: -0.8,
        linesWeight: 1.5,
        holesWeight: -2.0,
        bumpinessWeight: -0.5,
        randomness: 0,
        thinkingTime: 400
    }
};

const SCORE_VALUES = {
    PIECE_PLACED: 10,
    LINE_CLEARED: 100,
    MULTIPLE_LINES_BONUS: 50,
    GAME_CLEAR: 1000
};