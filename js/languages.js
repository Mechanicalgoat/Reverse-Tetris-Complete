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
        gameOverMessage: "Congratulations! You've successfully stacked the AI!",
        finalScore: "Final Score",
        finalLines: "Lines Cleared",
        finalPieces: "Pieces Sent",
        playAgain: "Play Again",
        confirmReset: "Reset the game?",
        gamePaused: "Game is paused",
        queueFull: "Queue is full",
        controls: "Controls",
        controlsInfo: "Click pieces or use 1-7 keys • Space to pause",
        language: "Language"
    },
    ja: {
        title: "リバーステトリス",
        score: "スコア",
        linesCleared: "ライン消去",
        piecesSent: "送信ミノ",
        difficulty: "難易度",
        statistics: "統計",
        pieceSelection: "ミノ選択",
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
        finalPieces: "送信ミノ",
        playAgain: "もう一度プレイ",
        confirmReset: "ゲームをリセットしますか？",
        gamePaused: "ゲーム中でないか一時停止中です",
        queueFull: "キューが満杯です",
        controls: "操作方法",
        controlsInfo: "ミノクリックまたは1-7キー • スペースで一時停止",
        language: "言語"
    },
    zh: {
        title: "反向俄罗斯方块",
        score: "分数",
        linesCleared: "消除行数",
        piecesSent: "发送方块",
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
        gamePaused: "游戏未开始或已暂停",
        queueFull: "队列已满",
        controls: "控制",
        controlsInfo: "点击方块或使用1-7键 • 空格键暂停",
        language: "语言"
    }
};

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.listeners = [];
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    setLanguage(lang) {
        if (languages[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.updateUI();
            this.notifyListeners();
        }
    }

    getText(key) {
        return languages[this.currentLanguage][key] || languages['en'][key] || key;
    }

    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = this.getText(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            element.placeholder = this.getText(key);
        });

        document.title = this.getText('title');
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentLanguage));
    }
}

const i18n = new LanguageManager();