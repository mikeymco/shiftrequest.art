// Gallery overlay functionality with URL state
(function() {
	const overlay = document.getElementById('image-overlay');
	const overlayImage = document.getElementById('overlay-image');
	const overlayVideo = document.getElementById('overlay-video');
	const overlayCaption = document.getElementById('overlay-caption');
	const galleryLinks = document.querySelectorAll('.gallery-link');
	
	// Images array will be populated by the template
	if (typeof galleryImages === 'undefined') {
		console.error('Gallery images not found. Make sure galleryImages is defined.');
		return;
	}
	
	const images = galleryImages;
	let currentIndex = 0;
	let isOverlayOpen = false;
	
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
	
	// Show overlay with specific image or video
	function showOverlay(index, updateHistory = true) {
		currentIndex = index;
		isOverlayOpen = true;
		
		// Hide both image and video first
		overlayImage.style.display = 'none';
		overlayVideo.style.display = 'none';
		
		if (images[index].isVideo) {
			// Show video
			overlayVideo.pause();
			overlayVideo.src = images[index].src;
			overlayVideo.load();
			overlayVideo.style.setProperty('display', 'block');
			overlayVideo.style.maxWidth = '90vw';
			overlayVideo.style.maxHeight = '85vh';
			
			// Auto-play video once it can play
			const playVideoWhenReady = () => {
				overlayVideo.play().catch(error => {
					// Handle autoplay restrictions gracefully
					console.log('Auto-play prevented by browser policy');
				});
				overlayVideo.removeEventListener('canplay', playVideoWhenReady);
			};
			overlayVideo.addEventListener('canplay', playVideoWhenReady);
		} else {
			// Show image
			overlayImage.src = images[index].src;
			overlayImage.style.display = 'block';
		}
		
		overlayCaption.innerHTML = images[index].caption + '. <a class="clearing-link" href="/contact/">Ask me about this work</a>';
		overlay.classList.add('active');
		document.body.style.overflow = 'hidden';
		
		if (updateHistory) {
			updateUrl(index, true);
		}
	}
	
	// Hide overlay
	function hideOverlay(updateHistory = true) {
		isOverlayOpen = false;
		overlay.classList.remove('active');
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
	
	// Event listeners
	galleryLinks.forEach((link, index) => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			showOverlay(index);
		});
	});
	
	// Close overlay
	document.querySelector('.overlay-close').addEventListener('click', hideOverlay);
	document.querySelector('.overlay-background').addEventListener('click', hideOverlay);
	
	// Navigation buttons
	document.querySelector('.overlay-next').addEventListener('click', nextImage);
	document.querySelector('.overlay-prev').addEventListener('click', prevImage);
	
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
	
	// Click on image to go to next
	overlayImage.addEventListener('click', nextImage);
	
	// Click on video to toggle play/pause
	overlayVideo.addEventListener('click', (e) => {
		e.stopPropagation(); // Prevent event bubbling
		if (overlayVideo.paused) {
			overlayVideo.play();
		} else {
			overlayVideo.pause();
		}
	});
	
	// Browser back/forward button support
	window.addEventListener('popstate', handlePopState);
	
	// Initialize state from URL on page load
	initializeFromUrl();
	
	// Set initial history state if not already set
	if (!window.history.state) {
		window.history.replaceState({ overlay: false, image: null }, '', window.location);
	}
})();