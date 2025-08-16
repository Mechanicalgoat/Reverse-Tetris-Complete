class AIStatusVisualizer {
    constructor() {
        this.imageElement = null;
        this.textElement = null;
        this.currentState = 'normal';
        this.animationTimeout = null;
        
        // Map states to image files
        this.stateImages = {
            normal: 'images/ai/normal.png',
            thinking: 'images/ai/thinking.png',
            'line-clear': 'images/ai/line-clear.png',
            'line-clear-alt': 'images/ai/line-clear-alt.png',
            failed: 'images/ai/failed.png'
        };
        
        // Map states to text keys for i18n
        this.stateTexts = {
            normal: 'ready',
            thinking: 'thinking',
            'line-clear': 'celebrating',
            'line-clear-alt': 'celebrating',
            failed: 'confused'
        };
    }
    
    init() {
        this.imageElement = document.getElementById('aiStatusImage');
        this.textElement = document.getElementById('aiStatusText');
        
        if (!this.imageElement || !this.textElement) {
            console.warn('AI status elements not found');
            return false;
        }
        
        this.setState('normal');
        return true;
    }
    
    setState(state, duration = 0) {
        if (!this.imageElement || !this.textElement) {
            return;
        }
        
        // Clear any existing animation timeout
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
        }
        
        // Remove all animation classes
        this.imageElement.classList.remove('thinking', 'line-clear', 'failed');
        
        // Set new state
        this.currentState = state;
        
        // Update image source
        if (this.stateImages[state]) {
            this.imageElement.src = this.stateImages[state];
        }
        
        // Update text
        if (this.stateTexts[state]) {
            const textKey = this.stateTexts[state];
            if (typeof i18n !== 'undefined') {
                this.textElement.textContent = i18n.getText(textKey);
                this.textElement.setAttribute('data-i18n', textKey);
            } else {
                // Fallback text
                const fallbackTexts = {
                    ready: 'Ready',
                    thinking: 'Thinking...',
                    celebrating: 'Success!',
                    confused: 'Failed'
                };
                this.textElement.textContent = fallbackTexts[textKey] || 'Ready';
            }
        }
        
        // Add appropriate animation class
        if (state === 'thinking') {
            this.imageElement.classList.add('thinking');
        } else if (state === 'line-clear' || state === 'line-clear-alt') {
            this.imageElement.classList.add('line-clear');
        } else if (state === 'failed') {
            this.imageElement.classList.add('failed');
        }
        
        // Auto-return to normal state after duration
        if (duration > 0) {
            this.animationTimeout = setTimeout(() => {
                this.setState('normal');
            }, duration);
        }
    }
    
    // Convenience methods for different states
    showNormal() {
        this.setState('normal');
    }
    
    showThinking() {
        this.setState('thinking');
    }
    
    showLineClear(linesCount = 1) {
        // Use alternate image for multi-line clears
        const state = linesCount > 2 ? 'line-clear-alt' : 'line-clear';
        this.setState(state, 2000); // Show for 2 seconds
    }
    
    showFailed() {
        this.setState('failed', 1500); // Show for 1.5 seconds
    }
    
    // Get current state
    getCurrentState() {
        return this.currentState;
    }
    
    // Check if currently in an animated state
    isAnimating() {
        return this.animationTimeout !== null;
    }
}

// Create global instance
let aiStatusVisualizer = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    aiStatusVisualizer = new AIStatusVisualizer();
    if (!aiStatusVisualizer.init()) {
        console.warn('Failed to initialize AI status visualizer');
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIStatusVisualizer;
}