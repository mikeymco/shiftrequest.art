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

    this.footer = document.querySelector('footer');
    this.hasMusicClass = 'has-music-embed--' + this.musicEmbed.dataset.musicService;
    this.footer.classList.add(this.hasMusicClass);
	}

	hidePlayer(e) {
		this.footer.classList.remove(this.hasMusicClass);
		this.musicEmbed.style.display = 'none';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new GalleryMusicEmbed();
});
