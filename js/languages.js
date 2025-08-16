const languages = {
    en: {
        title: "Reverse Tetris",
        score: "Score",
        linesCleared: "Lines",
        piecesSent: "Pieces",
        difficulty: "Difficulty",
        statistics: "Statistics",
        pieceSelection: "Select Piece",
        queue: "Queue",
        aiStatus: "AI Status",
        pause: "Pause",
        resume: "Resume",
        reset: "Reset",
        easy: "Easy",
        normal: "Normal",
        hard: "Hard",
        gameOver: "Game Clear!",
        gameOverMessage: "Congratulations! You've successfully overwhelmed the AI!",
        finalScore: "Final Score",
        finalLines: "Lines Cleared",
        finalPieces: "Pieces Sent",
        playAgain: "Play Again",
        confirmReset: "Reset the game?",
        gamePaused: "Game is paused or not started",
        queueFull: "Queue is full (max 5)",
        controls: "Controls",
        controlsInfo: "Click pieces or use 1-7 keys • Space to pause",
        language: "Language",
        thinking: "AI Thinking...",
        ready: "Ready",
        sendingPiece: "Sending piece...",
        lineClearing: "Clearing lines...",
        gameTitle: "REVERSE TETRIS"
    },
    ja: {
        title: "リバーステトリス",
        score: "スコア",
        linesCleared: "ライン",
        piecesSent: "ピース",
        difficulty: "難易度",
        statistics: "統計",
        pieceSelection: "ピース選択",
        queue: "キュー",
        aiStatus: "AI状態",
        pause: "一時停止",
        resume: "再開",
        reset: "リセット",
        easy: "イージー",
        normal: "ノーマル",
        hard: "ハード",
        gameOver: "ゲームクリア！",
        gameOverMessage: "おめでとうございます！AIを困らせることに成功しました！",
        finalScore: "最終スコア",
        finalLines: "消去ライン",
        finalPieces: "送信ピース",
        playAgain: "もう一度プレイ",
        confirmReset: "ゲームをリセットしますか？",
        gamePaused: "ゲームが一時停止中または未開始です",
        queueFull: "キューが満杯です（最大5個）",
        controls: "操作方法",
        controlsInfo: "ピースをクリックまたは1-7キー • スペースで一時停止",
        language: "言語",
        thinking: "AI思考中...",
        ready: "準備完了",
        sendingPiece: "ピース送信中...",
        lineClearing: "ライン消去中...",
        gameTitle: "リバーステトリス"
    },
    zh: {
        title: "反向俄罗斯方块",
        score: "分数",
        linesCleared: "消除行",
        piecesSent: "方块数",
        difficulty: "难度",
        statistics: "统计",
        pieceSelection: "选择方块",
        queue: "队列",
        aiStatus: "AI状态",
        pause: "暂停",
        resume: "继续",
        reset: "重置",
        easy: "简单",
        normal: "普通",
        hard: "困难",
        gameOver: "游戏通关！",
        gameOverMessage: "恭喜！你成功困住了AI！",
        finalScore: "最终分数",
        finalLines: "消除行数",
        finalPieces: "发送方块",
        playAgain: "再玩一次",
        confirmReset: "重置游戏？",
        gamePaused: "游戏暂停或未开始",
        queueFull: "队列已满（最多5个）",
        controls: "控制",
        controlsInfo: "点击方块或使用1-7键 • 空格键暂停",
        language: "语言",
        thinking: "AI思考中...",
        ready: "准备就绪",
        sendingPiece: "发送方块中...",
        lineClearing: "消除行中...",
        gameTitle: "反向俄罗斯方块"
    }
};

class LanguageManager {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.listeners = [];
        this.initialized = false;
    }

    detectLanguage() {
        const saved = localStorage.getItem('reverseTetrislanguage');
        if (saved && languages[saved]) {
            return saved;
        }

        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('ja')) return 'ja';
        if (browserLang.startsWith('zh')) return 'zh';
        return 'en';
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    setLanguage(lang) {
        if (languages[lang] && lang !== this.currentLanguage) {
            this.currentLanguage = lang;
            localStorage.setItem('reverseTetrislanguage', lang);
            this.updateUI();
            this.notifyListeners();
        }
    }

    getText(key) {
        const text = languages[this.currentLanguage]?.[key] || 
                    languages['en']?.[key] || 
                    key;
        return text;
    }

    updateUI() {
        requestAnimationFrame(() => {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.dataset.i18n;
                const text = this.getText(key);
                if (element.textContent !== text) {
                    element.textContent = text;
                }
            });

            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.dataset.i18nPlaceholder;
                const text = this.getText(key);
                if (element.placeholder !== text) {
                    element.placeholder = text;
                }
            });

            const title = this.getText('title');
            if (document.title !== title) {
                document.title = title;
            }

            const gameTitle = document.querySelector('.game-title');
            if (gameTitle) {
                const titleText = this.getText('gameTitle');
                if (gameTitle.textContent !== titleText) {
                    gameTitle.textContent = titleText;
                }
            }
        });
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentLanguage);
            } catch (error) {
                console.warn('Language listener error:', error);
            }
        });
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        this.updateUI();
    }
}

const i18n = new LanguageManager();