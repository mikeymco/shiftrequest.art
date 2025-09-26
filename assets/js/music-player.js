/**
 * Music Player Management
 * Handles Spotify embed visibility, close/restore functionality
 */
class MusicPlayer {
	constructor() {
		this.musicSection = document.querySelector('.music-section');
		this.closeButton = document.querySelector('.close-music');
		
		this.init();
	}
	
	init() {
		if (!this.musicSection) return;
		
		this.bindEvents();
	}

	bindEvents() {
		// Close button functionality
		if (this.closeButton) {
			this.closeButton.addEventListener('click', () => {
				this.hidePlayer();
			});
		}
	}

	hidePlayer() {
		this.musicSection.style.display = 'none';
		document.body.classList.remove('has-music');
	}
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	new MusicPlayer();
});