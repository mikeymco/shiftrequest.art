/**
 * Music Player Management
 * Handles Spotify embed visibility, close/restore functionality
 */
class MusicPlayer {
	constructor() {
		this.musicSection = document.querySelector('.music-section');
		this.closeButton = document.querySelector('.close-music');
		this.storageKey = 'musicPlayerHidden';
		
		this.init();
	}
	
	init() {
		if (!this.musicSection) return;
		
		this.setupInitialState();
		this.bindEvents();
	}
	
	setupInitialState() {
		const isHidden = localStorage.getItem(this.storageKey) === 'true';
		
		if (!isHidden) {
			this.showPlayer();
		} else {
			this.hidePlayer();
		}
	}
	
	bindEvents() {
		// Close button functionality
		if (this.closeButton) {
			this.closeButton.addEventListener('click', () => {
				this.hidePlayer();
				this.rememberChoice(true);
			});
		}
	}
	
	showPlayer() {
		this.musicSection.style.display = 'block';
		document.body.classList.add('has-music');
	}
	
	hidePlayer() {
		this.musicSection.style.display = 'none';
		document.body.classList.remove('has-music');
	}
	
	isHidden() {
		return localStorage.getItem(this.storageKey) === 'true';
	}
	
	rememberChoice(hidden) {
		if (hidden) {
			localStorage.setItem(this.storageKey, 'true');
		} else {
			localStorage.removeItem(this.storageKey);
		}
	}
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	new MusicPlayer();
});