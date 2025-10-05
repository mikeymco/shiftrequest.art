/**
 * Gallery Music Embed Management
 * Handles Spotify and Soundcloud embed visibility
 * Allows users to close the player
 */

class GalleryMusicEmbed {
	constructor() {
		this.musicEmbed = document.querySelector('.gallery__music-embed');
		this.closeButton = document.querySelector('.gallery__music-embed__close');
    this.closeButton.addEventListener('click', e => this.hidePlayer(e));

    this.bodyHasMusicClass = 'has-music-embed--' + this.musicEmbed.dataset.musicService;
    document.body.classList.add(this.bodyHasMusicClass);
	}

	hidePlayer(e) {
		document.body.classList.remove(this.bodyHasMusicClass);
		this.musicEmbed.style.display = 'none';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new GalleryMusicEmbed();
});
