/**
 * Gallery Music Embed Management
 * Handles Spotify embed visibility, close/restore functionality
 */
class GalleryMusicEmbed {
	constructor() {
		this.musicEmbed = document.querySelector('.gallery-music-embed');
		this.closeButton = document.querySelector('.gallery-music-embed__close');

		this.init();
	}

	init() {
		if (!this.musicEmbed) return;
    document.body.classList.add('has-music-embed');
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
		this.musicEmbed.style.display = 'none';
		document.body.classList.remove('has-music-embed');
	}
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	new GalleryMusicEmbed();
});
