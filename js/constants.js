const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const CELL_SIZE = 30;
const GAME_SPEED = 500;
const LINE_CLEAR_DELAY = 150;

const COLORS = {
    I: '#00e5ff',
    O: '#ffd600', 
    T: '#aa00ff',
    S: '#00e676',
    Z: '#ff1744',
    J: '#2979ff',
    L: '#ff6d00',
    EMPTY: '#050505',
    GRID_LINE: '#1a1a1a',
    HIGHLIGHT: '#ffffff'
};

const DIFFICULTY_SETTINGS = {
    easy: {
        heightWeight: -0.3,
        linesWeight: 0.5,
        holesWeight: -0.5,
        bumpinessWeight: -0.3,
        randomness: 0.15,
        thinkingTime: 300
    },
    normal: {
        heightWeight: -0.5,
        linesWeight: 1.0,
        holesWeight: -1.0,
        bumpinessWeight: -0.5,
        randomness: 0.08,
        thinkingTime: 200
    },
    hard: {
        heightWeight: -0.8,
        linesWeight: 1.5,
        holesWeight: -2.0,
        bumpinessWeight: -0.5,
        randomness: 0,
        thinkingTime: 100
    }
};

const SCORE_VALUES = {
    PIECE_PLACED: 10,
    LINE_CLEARED: 100,
    MULTIPLE_LINES_BONUS: 50,
    GAME_CLEAR: 1000
};

const PERFORMANCE_CONFIG = {
    FPS_TARGET: 60,
    ANIMATION_DURATION: 200,
    DEBOUNCE_DELAY: 50,
    MAX_CACHE_SIZE: 100
};