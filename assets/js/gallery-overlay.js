// Gallery overlay functionality with URL state
(function() {
	// Constants and DOM elements
	const DOM = {
		overlay: document.getElementById('image-overlay'),
		image: document.getElementById('overlay-image'),
		video: document.getElementById('overlay-video'),
		caption: document.getElementById('overlay-caption'),
		links: document.querySelectorAll('.gallery-link'),
		closeBtn: document.querySelector('.overlay-close'),
		background: document.querySelector('.overlay-background'),
		nextBtn: document.querySelector('.overlay-next'),
		prevBtn: document.querySelector('.overlay-prev')
	};
	
	// State
	let currentIndex = 0;
	let isOverlayOpen = false;
	
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
			overlay: params.get('overlay') === 'true'
		};
	}
	
	// Update URL without reloading page
	function updateUrl(index = null, showOverlay = false) {
		const url = new URL(window.location);
		
		if (showOverlay && index !== null) {
			url.searchParams.set('overlay', 'true');
			url.searchParams.set('image', index.toString());
		} else {
			url.searchParams.delete('overlay');
			url.searchParams.delete('image');
		}
		
		window.history.pushState({ overlay: showOverlay, image: index }, '', url);
	}
	
	// Media display functions
	function showImage(src) {
		DOM.video.style.display = 'none';
		DOM.image.src = src;
		DOM.image.style.display = 'block';
	}
	
	function showVideo(src) {
		DOM.image.style.display = 'none';
		DOM.video.pause();
		DOM.video.src = src;
		DOM.video.load();
		DOM.video.style.setProperty('display', 'block');
		DOM.video.style.maxWidth = '90vw';
		DOM.video.style.maxHeight = '85vh';
		
		// Auto-play video once it can play
		const playVideoWhenReady = () => {
			DOM.video.play().catch(error => {
				console.log('Auto-play prevented by browser policy');
			});
			DOM.video.removeEventListener('canplay', playVideoWhenReady);
		};
		DOM.video.addEventListener('canplay', playVideoWhenReady);
	}
	
	// Show overlay with specific image or video
	function showOverlay(index, updateHistory = true) {
		currentIndex = index;
		isOverlayOpen = true;
		
		// Display the appropriate media type
		if (images[index].isVideo) {
			showVideo(images[index].src);
		} else {
			showImage(images[index].src);
		}
		
		DOM.caption.innerHTML = images[index].caption + '. <a class="clearing-link" href="/contact/">Ask me about this work</a>';
		DOM.overlay.classList.add('active');
		document.body.style.overflow = 'hidden';
		
		if (updateHistory) {
			updateUrl(index, true);
		}
	}
	
	// Hide overlay
	function hideOverlay(updateHistory = true) {
		isOverlayOpen = false;
		DOM.overlay.classList.remove('active');
		document.body.style.overflow = '';
		
		if (updateHistory) {
			updateUrl(null, false);
		}
	}
	
	// Navigate to next image
	function nextImage() {
		currentIndex = (currentIndex + 1) % images.length;
		showOverlay(currentIndex, true);
	}
	
	// Navigate to previous image
	function prevImage() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
		showOverlay(currentIndex, true);
	}
	
	// Handle browser back/forward
	function handlePopState(event) {
		const state = event.state || {};
		
		if (state.overlay && state.image !== null && state.image !== undefined) {
			showOverlay(state.image, false);
		} else {
			hideOverlay(false);
		}
	}
	
	// Initialize from URL on page load
	function initializeFromUrl() {
		const params = getUrlParams();
		
		if (params.overlay && params.image !== null && params.image < images.length) {
			showOverlay(params.image, false);
		}
	}
	
	// Event listeners setup
	function setupEventListeners() {
		// Gallery link clicks
		DOM.links.forEach((link, index) => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				showOverlay(index);
			});
		});
		
		// Close overlay
		DOM.closeBtn.addEventListener('click', hideOverlay);
		DOM.background.addEventListener('click', hideOverlay);
		
		// Navigation buttons
		DOM.nextBtn.addEventListener('click', nextImage);
		DOM.prevBtn.addEventListener('click', prevImage);
		
		// Media-specific interactions
		DOM.image.addEventListener('click', nextImage);
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
			if (!isOverlayOpen) return;
			
			switch(e.key) {
				case 'Escape':
					hideOverlay();
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
			window.history.replaceState({ overlay: false, image: null }, '', window.location);
		}
	}
	
	// Start the gallery
	init();
})();