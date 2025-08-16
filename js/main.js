let game;
let ui;

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    try {
        i18n.init();
        
        game = new Game();
        game.init();
        
        ui = new UI(game);
        
        game.reset();
        
        logGameStart();
        
        document.body.classList.add('game-loaded');
        
    } catch (error) {
        console.error('Game initialization failed:', error);
        showErrorMessage('Failed to initialize game. Please refresh the page.');
    }
}

function logGameStart() {
    const lang = i18n.getCurrentLanguage();
    const messages = {
        en: {
            start: 'Reverse Tetris - Game Started',
            controls: 'Controls:',
            click: '- Click pieces or use 1-7 keys to send pieces',
            pause: '- Space key or P to pause',
            difficulty: '- Difficulty buttons to change difficulty'
        },
        ja: {
            start: 'リバーステトリス - ゲーム開始',
            controls: '操作方法:',
            click: '- ピースボタンをクリックまたは数字キー(1-7)でピースを送信',
            pause: '- スペースキーまたはPキーで一時停止',
            difficulty: '- 難易度ボタンで難易度変更'
        },
        zh: {
            start: '反向俄罗斯方块 - 游戏开始',
            controls: '控制方法:',
            click: '- 点击方块或使用1-7键发送方块',
            pause: '- 空格键或P键暂停',
            difficulty: '- 难度按钮更改难度'
        }
    };

    const msg = messages[lang] || messages.en;
    console.log(msg.start);
    console.log(msg.controls);
    console.log(msg.click);
    console.log(msg.pause);
    console.log(msg.difficulty);
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--danger);
        color: white;
        padding: 20px 40px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 500;
        z-index: 9999;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('ServiceWorker registered'))
            .catch(() => console.log('ServiceWorker registration failed'));
    });
}