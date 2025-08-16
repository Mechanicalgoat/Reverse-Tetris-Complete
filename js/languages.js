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
        gameTitle: "REVERSE TETRIS",
        // Welcome modal keys
        welcomeSubtitle: "Choose your language to begin",
        // Rules modal keys
        howToPlay: "How to Play",
        objective: "Objective",
        objectiveDesc: "Send pieces to the AI and try to fill the top 3 rows to win. But be careful - every piece you send costs points!",
        scoring: "Scoring System",
        scoringRule1: "Start with initial points based on difficulty",
        scoringRule2: "Lose points for every piece you send",
        scoringRule3: "Lose more points when AI clears lines",
        scoringRule4: "Your score can go negative!",
        scoringRule5: "Challenge: Keep your score as high as possible",
        controlsRule1: "Click piece buttons or use keys 1-7",
        controlsRule2: "Send pieces rapidly for speed bonus",
        controlsRule3: "Press Space to pause",
        continue: "Continue",
        // Difficulty modal keys
        selectDifficulty: "Select Difficulty",
        difficultyDesc: "Choose your challenge level. Higher difficulty means smarter AI and more starting points.",
        easyDesc: "Relaxed AI, fewer starting points",
        normalDesc: "Balanced challenge",
        hardDesc: "Smart AI, more starting points",
        startingPoints: "Starting Points",
        startGame: "Start Game",
        // Current score keys
        currentScore: "Current Score",
        piecesSent: "Pieces Sent",
        help: "Help"
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
        gameTitle: "リバーステトリス",
        // Welcome modal keys
        welcomeSubtitle: "開始する言語を選択してください",
        // Rules modal keys
        howToPlay: "遊び方",
        objective: "目的",
        objectiveDesc: "AIにピースを送って上3行を埋めて勝利を目指そう！ただし、ピースを送るたびにポイントが減るので注意！",
        scoring: "スコアシステム",
        scoringRule1: "難易度に応じた初期ポイントでスタート",
        scoringRule2: "ピースを送るたびにポイントが減少",
        scoringRule3: "AIがラインを消すとさらにポイントが減少",
        scoringRule4: "スコアはマイナスになることもあります！",
        scoringRule5: "チャレンジ：できるだけ高いスコアを維持しよう",
        controlsRule1: "ピースボタンをクリックまたは1-7キーを使用",
        controlsRule2: "連続で送ってスピードボーナス獲得",
        controlsRule3: "スペースキーで一時停止",
        continue: "続行",
        // Difficulty modal keys
        selectDifficulty: "難易度選択",
        difficultyDesc: "チャレンジレベルを選択してください。難易度が高いほどAIが賢く、開始スコアが多くなります。",
        easyDesc: "リラックスしたAI、少ない開始ポイント",
        normalDesc: "バランスの取れたチャレンジ",
        hardDesc: "賢いAI、多めの開始ポイント",
        startingPoints: "開始ポイント",
        startGame: "ゲーム開始",
        // Current score keys
        currentScore: "現在のスコア",
        piecesSent: "送信ピース数",
        help: "ヘルプ"
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
        gameTitle: "反向俄罗斯方块",
        // Welcome modal keys
        welcomeSubtitle: "选择您的语言开始游戏",
        // Rules modal keys
        howToPlay: "游戏玩法",
        objective: "目标",
        objectiveDesc: "向AI发送方块并尝试填满顶部3行获胜。但要小心 - 每发送一个方块都会扣除分数！",
        scoring: "评分系统",
        scoringRule1: "根据难度获得初始分数",
        scoringRule2: "每发送一个方块扣除分数",
        scoringRule3: "AI消除行时扣除更多分数",
        scoringRule4: "您的分数可能变为负数！",
        scoringRule5: "挑战：尽可能保持高分",
        controlsRule1: "点击方块按钮或使用1-7键",
        controlsRule2: "快速发送方块获得速度奖励",
        controlsRule3: "按空格键暂停",
        continue: "继续",
        // Difficulty modal keys
        selectDifficulty: "选择难度",
        difficultyDesc: "选择您的挑战级别。难度越高意味着AI更聪明，起始分数更多。",
        easyDesc: "轻松的AI，较少起始分数",
        normalDesc: "平衡的挑战",
        hardDesc: "聪明的AI，更多起始分数",
        startingPoints: "起始分数",
        startGame: "开始游戏",
        // Current score keys
        currentScore: "当前分数",
        piecesSent: "已发送方块",
        help: "帮助"
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