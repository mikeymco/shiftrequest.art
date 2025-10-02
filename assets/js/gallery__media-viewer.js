/**
 * Gallery Media Viewer
 * Full-screen image and video viewer
 * Uses window.location for URL based state management
 */

class GalleryMediaViewer {
  constructor() {
    this.loadingIndicatorActiveClass = 'gallery__media-viewer__loading-indicator--active';

    this.mediaViewer = document.querySelector('.overlay.gallery__media-viewer');
		this.mediaTiles = document.querySelectorAll('.gallery__tile--media'),

		this.image = document.querySelector('.gallery__media-viewer__image'),
		this.video = document.querySelector('.gallery__media-viewer__video'),
		this.caption = document.querySelector('.gallery__media-viewer__caption'),
		this.closeBtn = document.querySelector('.gallery__media-viewer__close'),
		this.nextBtn = document.querySelector('.gallery__media-viewer__next'),
		this.prevBtn = document.querySelector('.gallery__media-viewer__prev'),
		this.loadingIndicator = document.querySelector('.gallery__media-viewer__loading-indicator'),

		this.currentIndex = null;
		this.images = typeof galleryImages !== 'undefined' ? galleryImages : [];

    if (!this.mediaViewer || this.images.length === 0) {
			console.error('Gallery media viewer: Missing required elements or gallery data');
			return;
		}

		this.bindEvents();
		this.initializeFromUrl();
		this.setInitialHistoryState();
	}

	bindEvents() {
		// Gallery button clicks
    this.mediaTiles.forEach((button, index) => {
      button.addEventListener('click', e => this.showViewer(index, e));
    });

    // Close on background, not content
    this.mediaViewer.addEventListener('click', e => {
        if (e.target === this.mediaViewer) { // Only background
            this.hideViewer();
        }
    });

		// Navigation buttons
		this.nextBtn.addEventListener('click', e => this.nextImage(e));
		this.prevBtn.addEventListener('click', e => this.prevImage(e) );
    this.closeBtn.addEventListener('click', e => this.hideViewer(e));

		// Image interactions
		this.image.addEventListener('click', e => this.handleImageClick(e));

		// Keyboard navigation
		document.addEventListener('keydown', e => this.handleKeydown(e));

		// Browser back/forward
		window.addEventListener('popstate', e => this.handlePopState(e));
	}

	setInitialHistoryState() {
		if (!window.history.state) {
			window.history.replaceState({ viewer: false, image: null }, '', window.location);
		}
	}

	initializeFromUrl() {
		const params = this.getUrlParams();

		if (params.viewer && params.image !== null && params.image < this.images.length) {
			this.showViewer(params.image, false);
		}
	}

	getUrlParams() {
		const params = new URLSearchParams(window.location.search);
		return {
			image: parseInt(params.get('image')) || null,
			viewer: params.get('viewer') === 'true'
		};
	}

	updateUrl(index = null, showViewer = false) {
		const url = new URL(window.location);

		if (showViewer && index !== null) {
			url.searchParams.set('viewer', 'true');
			url.searchParams.set('image', index.toString());
		} else {
			url.searchParams.delete('viewer');
			url.searchParams.delete('image');
		}

		window.history.pushState({ viewer: showViewer, image: index }, '', url);
	}

	showLoading() {
		this.loadingIndicator.classList.add(this.loadingIndicatorActiveClass);
	}

	hideLoading() {
		this.loadingIndicator.classList.remove(this.loadingIndicatorActiveClass);
	}

	showImage(src) {
		this.showLoading();
		this.video.style.display = 'none';

		const newImage = new Image();
		newImage.onload = () => {
			this.image.src = src;
			this.image.style.display = 'block';
			this.hideLoading();
		};
		newImage.onerror = () => {
			this.hideLoading();
			console.error('Failed to load image:', src);
		};
		newImage.src = src;
	}

	showVideo(src) {
		this.showLoading();
		this.image.style.display = 'none';
		this.video.pause();
		this.video.src = src;
		this.video.load();
		this.video.style.setProperty('display', 'block');
		this.video.style.maxWidth = '90vw';
		this.video.style.maxHeight = '85vh';

		const hideLoadingWhenReady = () => {
			this.hideLoading();
			this.video.removeEventListener('canplay', hideLoadingWhenReady);
		};
		this.video.addEventListener('canplay', hideLoadingWhenReady);

		const playVideoWhenReady = () => {
			this.video.play().catch(() => {
				console.log('Auto-play prevented by browser policy');
			});
			this.video.removeEventListener('canplay', playVideoWhenReady);
		};
		this.video.addEventListener('canplay', playVideoWhenReady);

		const handleVideoError = () => {
			this.hideLoading();
			console.error('Failed to load video:', src);
			this.video.removeEventListener('error', handleVideoError);
		};
		this.video.addEventListener('error', handleVideoError);
	}

	showViewer(index, updateHistory = true) {
		this.currentIndex = index;

		if (this.images[index].isVideo) {
			this.showVideo(this.images[index].src);
		} else {
			this.showImage(this.images[index].src);
		}

		this.caption.innerHTML = this.images[index].caption;
		this.mediaViewer.classList.add('overlay--active');
		this.mediaViewer.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';

		if (updateHistory) {
			this.updateUrl(index, true);
		}
	}

	hideViewer(updateHistory = true) {
    this.currentIndex = null;
		this.hideLoading();
		this.closeBtn.blur();
		this.mediaViewer.classList.remove('overlay--active');
		this.mediaViewer.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';

		if (updateHistory) {
			this.updateUrl(null, false);
		}
	}

	nextImage(e) {
		this.currentIndex = (this.currentIndex + 1) % this.images.length;
		this.showViewer(this.currentIndex, true);
	}

	prevImage(e) {
		this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
		this.showViewer(this.currentIndex, true);
	}

	handleImageClick(e) {
		const rect = this.image.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const imageWidth = rect.width;

		if (clickX < imageWidth / 2) {
			this.prevImage();
		} else {
			this.nextImage();
		}
	}

  handleKeydown(e) {
    if (this.currentIndex === null) return;

    const actions = {
      'Escape': () => this.hideViewer(),
      'ArrowRight': () => this.nextImage(),
      'ArrowLeft': () => this.prevImage(),
      ' ': () => this.nextImage()
    };

    const action = actions[e.key];
    if (action) {
        e.preventDefault(); // Only prevent when we actually handle it
        action();
    }
  }

	handlePopState(e) {
		const state = e.state || {};

		if (state.viewer && state.image !== null && state.image !== undefined) {
			this.showViewer(state.image, false);
		} else {
			this.hideViewer(false);
		}
	}

}

document.addEventListener('DOMContentLoaded', () => {
	new GalleryMediaViewer();
});
