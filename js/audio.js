class AudioManager {
    constructor() {
        this.bgmTracks = [
            'music/tetris-music-box.mp3',
            'music/tetris-strings.mp3'
        ];
        this.currentTrackIndex = 0;
        this.bgmAudio = null;
        this.isMuted = false;
        this.volume = 0.3; // 控えめな音量 (30%)
        this.isPlaying = false;
        
        this.initAudio();
        this.loadMuteState();
    }

    initAudio() {
        try {
            this.bgmAudio = new Audio();
            this.bgmAudio.volume = this.isMuted ? 0 : this.volume;
            this.bgmAudio.loop = false;
            
            // 曲が終わったら次の曲を再生
            this.bgmAudio.addEventListener('ended', () => {
                this.playNextTrack();
            });
            
            // エラーハンドリング
            this.bgmAudio.addEventListener('error', (e) => {
                console.warn('Audio error:', e);
                this.playNextTrack(); // エラーの場合は次の曲を試す
            });
            
            console.log('Audio system initialized');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    loadMuteState() {
        const savedMuteState = localStorage.getItem('reverseTetrisMuted');
        this.isMuted = savedMuteState === 'true';
        this.updateVolumeIcon();
    }

    saveMuteState() {
        localStorage.setItem('reverseTetrisMuted', this.isMuted.toString());
    }

    startBGM() {
        if (!this.bgmAudio || this.isPlaying) return;
        
        try {
            this.currentTrackIndex = Math.floor(Math.random() * this.bgmTracks.length);
            this.isPlaying = true;
            console.log('Attempting to start BGM...');
            this.playCurrentTrack();
        } catch (error) {
            console.warn('Failed to start BGM:', error);
        }
    }

    playCurrentTrack() {
        if (!this.bgmAudio) {
            console.warn('BGM audio not initialized');
            return;
        }
        
        const trackPath = this.bgmTracks[this.currentTrackIndex];
        console.log('Loading track:', trackPath);
        
        this.bgmAudio.src = trackPath;
        this.bgmAudio.volume = this.isMuted ? 0 : this.volume;
        
        this.bgmAudio.play().then(() => {
            console.log('BGM playing successfully:', trackPath);
        }).catch(error => {
            console.warn('Audio play failed:', error.message);
            console.warn('This might be due to browser autoplay policy. Audio will start after user interaction.');
        });
    }

    playNextTrack() {
        if (!this.isPlaying) return;
        
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.bgmTracks.length;
        this.playCurrentTrack();
    }

    stopBGM() {
        if (this.bgmAudio && this.isPlaying) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0;
            this.isPlaying = false;
            console.log('BGM stopped');
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateVolume();
        this.updateVolumeIcon();
        this.saveMuteState();
        
        console.log('Audio muted:', this.isMuted);
    }

    updateVolume() {
        if (this.bgmAudio) {
            this.bgmAudio.volume = this.isMuted ? 0 : this.volume;
        }
    }

    updateVolumeIcon() {
        const volumeBtn = document.getElementById('volumeBtn');
        if (volumeBtn) {
            volumeBtn.textContent = this.isMuted ? '🔇' : '🔊';
            volumeBtn.title = this.isMuted ? 'Unmute' : 'Mute';
        }
    }

    setVolume(newVolume) {
        this.volume = Math.max(0, Math.min(1, newVolume));
        this.updateVolume();
    }

    // ユーザー操作後に再生を試行（ブラウザの自動再生ポリシー対応）
    enableAudioAfterUserInteraction() {
        console.log('User interaction detected, enabling audio...');
        
        if (this.isPlaying && this.bgmAudio && this.bgmAudio.paused) {
            console.log('Attempting to resume paused audio...');
            this.bgmAudio.play().catch(error => {
                console.warn('Audio resume failed:', error);
            });
        }
        
        // ブラウザのaudioコンテキストを有効化
        try {
            if (this.bgmAudio) {
                this.bgmAudio.volume = this.isMuted ? 0 : this.volume;
            }
        } catch (error) {
            console.warn('Audio context activation failed:', error);
        }
    }
}

// グローバルインスタンス
let audioManager;

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    audioManager = new AudioManager();
});