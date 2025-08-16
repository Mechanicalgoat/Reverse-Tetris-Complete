let game;
let ui;

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    game = new Game();
    game.init();
    
    ui = new UI(game);
    
    game.reset();
    
    console.log('リバーステトリス - ゲーム開始');
    console.log('操作方法:');
    console.log('- ミノボタンをクリックまたは数字キー(1-7)でミノを送信');
    console.log('- スペースキーまたはPキーで一時停止');
    console.log('- 難易度ボタンで難易度変更');
}