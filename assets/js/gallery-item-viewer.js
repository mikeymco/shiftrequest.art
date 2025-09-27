// Gallery item viewer functionality with URL state
(function() {
	// Constants and DOM elements
	const DOM = {
		overlay: document.getElementById('gallery-item-viewer'),
		image: document.getElementById('viewer-image'),
		video: document.getElementById('viewer-video'),
		caption: document.getElementById('viewer-caption'),
		loadingIndicator: document.getElementById('loading-indicator'),
		links: document.querySelectorAll('.gallery-item--link'),
		closeBtn: document.querySelector('.viewer-close'),
		background: document.querySelector('.viewer-background'),
		nextBtn: document.querySelector('.viewer-next'),
		prevBtn: document.querySelector('.viewer-prev')
	};
	
	// State
	let currentIndex = 0;
	let isViewerOpen = false;
	
	// Check if gallery data exists
	if (typeof galleryImages === 'undefined') {
		console.error('Gallery images not found. Make sure galleryImages is defined.');
		return;
	}
	
	const images = galleryImages;
	
	// Get URL parameters
	function getUrlParams() {
		const params = new URLSearchParams(window.location.search);
		return {
			image: parseInt(params.get('image')) || null,
			viewer: params.get('viewer') === 'true'
		};
	}
	
	// Update URL without reloading page
	function updateUrl(index = null, showViewer = false) {
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
	
	// Loading indicator functions
	function showLoading() {
		DOM.loadingIndicator.classList.add('active');
	}
	
	function hideLoading() {
		DOM.loadingIndicator.classList.remove('active');
	}
	
	// Media display functions
	function showImage(src) {
		showLoading();
		DOM.video.style.display = 'none';
		
		// Create a new image to preload
		const newImage = new Image();
		newImage.onload = function() {
			DOM.image.src = src;
			DOM.image.style.display = 'block';
			hideLoading();
		};
		newImage.onerror = function() {
			hideLoading();
			console.error('Failed to load image:', src);
		};
		newImage.src = src;
	}
	
	function showVideo(src) {
		showLoading();
		DOM.image.style.display = 'none';
		DOM.video.pause();
		DOM.video.src = src;
		DOM.video.load();
		DOM.video.style.setProperty('display', 'block');
		DOM.video.style.maxWidth = '90vw';
		DOM.video.style.maxHeight = '85vh';
		
		// Hide loading when video can play
		const hideLoadingWhenReady = () => {
			hideLoading();
			DOM.video.removeEventListener('canplay', hideLoadingWhenReady);
		};
		DOM.video.addEventListener('canplay', hideLoadingWhenReady);
		
		// Auto-play video once it can play
		const playVideoWhenReady = () => {
			DOM.video.play().catch(error => {
				console.log('Auto-play prevented by browser policy');
			});
			DOM.video.removeEventListener('canplay', playVideoWhenReady);
		};
		DOM.video.addEventListener('canplay', playVideoWhenReady);
		
		// Handle video loading errors
		const handleVideoError = () => {
			hideLoading();
			console.error('Failed to load video:', src);
			DOM.video.removeEventListener('error', handleVideoError);
		};
		DOM.video.addEventListener('error', handleVideoError);
	}
	
	// Show viewer with specific image or video
	function showViewer(index, updateHistory = true) {
		currentIndex = index;
		isViewerOpen = true;
		
		// Display the appropriate media type
		if (images[index].isVideo) {
			showVideo(images[index].src);
		} else {
			showImage(images[index].src);
		}
		
		DOM.caption.innerHTML = images[index].caption + '. <a class="clearing-link" href="/contact/">Ask me about this work</a>';
		DOM.overlay.classList.add('active');
		DOM.overlay.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		
		// Focus management for accessibility
		DOM.closeBtn.focus();
		
		if (updateHistory) {
			updateUrl(index, true);
		}
	}
	
	// Hide viewer
	function hideViewer(updateHistory = true) {
		isViewerOpen = false;
		hideLoading(); // Ensure loading indicator is hidden
		DOM.overlay.classList.remove('active');
		DOM.overlay.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		
		if (updateHistory) {
			updateUrl(null, false);
		}
	}
	
	// Navigate to next image
	function nextImage() {
		currentIndex = (currentIndex + 1) % images.length;
		showViewer(currentIndex, true);
	}
	
	// Navigate to previous image
	function prevImage() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
		showViewer(currentIndex, true);
	}
	
	// Handle browser back/forward
	function handlePopState(event) {
		const state = event.state || {};
		
		if (state.viewer && state.image !== null && state.image !== undefined) {
			showViewer(state.image, false);
		} else {
			hideViewer(false);
		}
	}
	
	// Initialize from URL on page load
	function initializeFromUrl() {
		const params = getUrlParams();
		
		if (params.viewer && params.image !== null && params.image < images.length) {
			showViewer(params.image, false);
		}
	}
	
	// Event listeners setup
	function setupEventListeners() {
		// Gallery link clicks
		DOM.links.forEach((link, index) => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				showViewer(index);
			});
		});
		
		// Close viewer
		DOM.closeBtn.addEventListener('click', hideViewer);
		DOM.background.addEventListener('click', hideViewer);
		
		// Navigation buttons
		DOM.nextBtn.addEventListener('click', nextImage);
		DOM.prevBtn.addEventListener('click', prevImage);
		
		// Media-specific interactions
		DOM.image.addEventListener('click', (e) => {
			// Calculate click position relative to image
			const rect = DOM.image.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const imageWidth = rect.width;
			
			// Left half goes to previous, right half goes to next
			if (clickX < imageWidth / 2) {
				prevImage();
			} else {
				nextImage();
			}
		});
		DOM.video.addEventListener('click', (e) => {
			e.stopPropagation();
			if (DOM.video.paused) {
				DOM.video.play();
			} else {
				DOM.video.pause();
			}
		});
		
		// Keyboard navigation
		document.addEventListener('keydown', (e) => {
			if (!isViewerOpen) return;
			
			switch(e.key) {
				case 'Escape':
					hideViewer();
					break;
				case 'ArrowRight':
				case ' ':
					e.preventDefault();
					nextImage();
					break;
				case 'ArrowLeft':
					e.preventDefault();
					prevImage();
					break;
			}
		});
		
		// Browser back/forward button support
		window.addEventListener('popstate', handlePopState);
	}
	
	// Initialize the gallery
	function init() {
		setupEventListeners();
		initializeFromUrl();
		
		// Set initial history state if not already set
		if (!window.history.state) {
			window.history.replaceState({ viewer: false, image: null }, '', window.location);
		}
	}
	
	// Start the gallery
	init();
})();