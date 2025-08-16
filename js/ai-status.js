class AIStatusVisualizer {
    constructor() {
        this.imageElement = null;
        this.textElement = null;
        this.currentState = 'normal';
        this.animationTimeout = null;
        this.lastStateChange = 0;
        this.isProcessingQueue = false;
        this.pendingStateQueue = [];
        
        // Minimum display times for each state (in milliseconds)
        this.minDisplayTimes = {
            normal: 500,      // 0.5 seconds minimum
            thinking: 1500,   // 1.5 seconds minimum for thinking
            'line-clear': 2000,     // 2 seconds for celebration
            'line-clear-alt': 2500, // 2.5 seconds for big celebration
            failed: 2000      // 2 seconds for failure
        };
        
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
    
    setState(state, forceImmediate = false) {
        if (!this.imageElement || !this.textElement) {
            return;
        }
        
        // Add to queue if we're currently processing or if minimum time hasn't passed
        const now = Date.now();
        const timeSinceLastChange = now - this.lastStateChange;
        const minTime = this.minDisplayTimes[this.currentState] || 500;
        
        if (!forceImmediate && (this.isProcessingQueue || timeSinceLastChange < minTime)) {
            // Add to queue if not already queued
            if (!this.pendingStateQueue.includes(state)) {
                this.pendingStateQueue.push(state);
            }
            return;
        }
        
        // Process the state change
        this.isProcessingQueue = true;
        this.lastStateChange = now;
        
        // Clear any existing animation timeout
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
        }
        
        // Remove all animation classes
        this.imageElement.classList.remove('thinking', 'line-clear', 'failed');
        
        // Set new state
        this.currentState = state;
        
        // Update image source with a small delay for smooth transition
        setTimeout(() => {
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
        }, 100);
        
        // Schedule minimum display time and process queue
        const displayTime = this.minDisplayTimes[state] || 500;
        this.animationTimeout = setTimeout(() => {
            this.isProcessingQueue = false;
            
            // Process next state in queue or return to normal
            if (this.pendingStateQueue.length > 0) {
                const nextState = this.pendingStateQueue.shift();
                this.setState(nextState, true);
            } else if (state !== 'normal' && state !== 'thinking') {
                // Auto-return to normal for temporary states (not for thinking state)
                this.setState('normal', true);
            }
        }, displayTime);
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
        this.setState(state);
    }
    
    showFailed() {
        this.setState('failed');
    }
    
    // Force immediate state change (for game reset, etc.)
    forceState(state) {
        // Clear queue and force immediate change
        this.pendingStateQueue = [];
        this.isProcessingQueue = false;
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
        }
        this.setState(state, true);
    }
    
    // Get current state
    getCurrentState() {
        return this.currentState;
    }
    
    // Check if currently in an animated state
    isAnimating() {
        return this.animationTimeout !== null;
    }
    
    // Clear any pending states (useful for game pause/reset)
    clearQueue() {
        this.pendingStateQueue = [];
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