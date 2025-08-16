let game;
let ui;

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    try {
        console.log('Starting game initialization...');
        
        // Initialize language manager
        if (typeof i18n !== 'undefined') {
            i18n.init();
        }
        
        console.log('Creating game instance...');
        game = new Game();
        
        console.log('Creating UI instance...');
        ui = new UI(game);
        
        console.log('All users will go through onboarding flow...');
        // Don't initialize game yet, let onboarding flow handle it
        
        console.log('Game initialization complete!');
        document.body.classList.add('game-loaded');
        
    } catch (error) {
        console.error('Game initialization failed:', error);
        console.error('Error stack:', error.stack);
        showErrorMessage('Failed to initialize game. Check console for details.');
    }
}

function logGameStart() {
    try {
        const lang = (typeof i18n !== 'undefined') ? i18n.getCurrentLanguage() : 'en';
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
    } catch (error) {
        console.error('Error in logGameStart:', error);
    }
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ef4444;
        color: white;
        padding: 20px 40px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 500;
        z-index: 9999;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        max-width: 80%;
        word-wrap: break-word;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 8000);
    
    // Allow clicking to dismiss
    errorDiv.addEventListener('click', () => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    });
}

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('ServiceWorker registered'))
            .catch((error) => console.log('ServiceWorker registration failed:', error));
    });
}