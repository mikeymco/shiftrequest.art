/**
 * Gallery Media Viewer
 * Full-screen image and video viewer
 * Uses window.location for URL based state management
 */

class GalleryMediaViewer {
  constructor() {
    this.mediaViewer = document.querySelector('.overlay.gallery__media-viewer');
    this.media = document.querySelectorAll('.gallery__tile--media');

    this.image = document.querySelector('.gallery__media-viewer__image');
    this.video = document.querySelector('.gallery__media-viewer__video');
    this.caption = document.querySelector('.gallery__media-viewer__caption');
    this.loadingIndicator = document.querySelector('.gallery__media-viewer__loading-indicator');
    this.loadingIndicatorActiveClass = 'gallery__media-viewer__loading-indicator--active';

    this.closeButton = document.querySelector('.gallery__media-viewer__close');
    this.nextButton = document.querySelector('.gallery__media-viewer__next');
    this.prevButton = document.querySelector('.gallery__media-viewer__prev');

    if (!this.mediaViewer || this.media.length === 0) {
      console.error('Gallery media viewer: Missing required elements or gallery data');
      return;
    }

    this.bindEvents();

    const index = this.getUrlParam();
    if (index !== null && index < this.media.length) {
      this.showViewer(index);
    }
  }

  bindEvents() {
    // Gallery tile clicks
    this.media.forEach((tile, index) => {
      tile.addEventListener('click', e => this.showViewer(index, e));
    });

    // Close on background, not content
    this.mediaViewer.addEventListener('click', e => {
      if (e.target === this.mediaViewer) { // Only background
        this.hideViewer();
      }
    });

    // Navigation buttons
    this.nextButton.addEventListener('click', e => this.nextImage(e));
    this.prevButton.addEventListener('click', e => this.prevImage(e));
    this.closeButton.addEventListener('click', e => this.hideViewer(e));

    // Image interactions
    this.image.addEventListener('click', e => this.handleImageClick(e));

    // Keyboard navigation
    document.addEventListener('keydown', e => this.handleKeydown(e));

    // Browser back/forward
    window.addEventListener('popstate', e => this.handlePopState(e));
  }

  getUrlParam() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('media'));
  }

  setUrlParam(index = null) {
    const url = new URL(window.location);

    if (index !== null) {
      url.searchParams.set('media', index.toString());
    } else {
      url.searchParams.delete('media');
    }

    window.history.pushState({ media: index }, '', url);
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

  showViewer(index) {
    if (index < 0) { index = this.media.length - 1; } // loop around to end
    if (index === this.media.length) { index = 0; } // loop around to start

    const tile = this.media[index];
    const src = tile.dataset.src;
    const caption = tile.dataset.caption || '';
    const isVideo = tile.dataset.isVideo === 'true';

    if (isVideo) {
      this.showVideo(src);
    } else {
      this.showImage(src);
    }

    this.caption.innerHTML = caption;
    this.mediaViewer.classList.add('overlay--active');
    this.mediaViewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    this.setUrlParam(index);
  }

  hideViewer() {
    this.hideLoading();
    // this.closeButton.blur();
    this.mediaViewer.classList.remove('overlay--active');
    this.mediaViewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.setUrlParam();
  }

  nextImage(e) {
    this.showViewer(this.getUrlParam() + 1);
  }

  prevImage(e) {
    this.showViewer(this.getUrlParam() - 1);
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
    // if (this.currentIndex === null) return;

    const actions = {
      'Escape': () => this.hideViewer(),
      'ArrowRight': () => this.nextImage(),
      'ArrowLeft': () => this.prevImage(),
      // ' ': () => this.nextImage()
    };

    const action = actions[e.key];
    if (action) {
      e.preventDefault(); // Only prevent when we actually handle it
      action();
    }
  }

  handlePopState(e) {
    console.log('popstate', e.state);
    const state = e.state || {};

    if (state.image !== null && state.image !== undefined) {
      this.showViewer(state.image);
    } else {
      this.hideViewer();
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  new GalleryMediaViewer();
});
