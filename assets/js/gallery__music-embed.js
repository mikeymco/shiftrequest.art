/**
 * Gallery Music Embed Management
 * Handles Spotify and Soundcloud embed visibility
 * Allows users to close the player
 */

class GalleryMusicEmbed {
	constructor() {
		this.musicEmbed = document.querySelector('.gallery__music-embed');
		this.closeButton = document.querySelector('.gallery__music-embed__close');

    if (!this.musicEmbed) return;

    document.body.classList.add('has-music-embed');

		if (this.closeButton) {
			this.closeButton.addEventListener('click', e => this.hidePlayer(e));
		}
	}

	hidePlayer(e) {
		document.body.classList.remove('has-music-embed');
		this.musicEmbed.style.display = 'none';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new GalleryMusicEmbed();
});
