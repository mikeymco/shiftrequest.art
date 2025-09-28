// Gallery Access Overlay JavaScript
(function() {
	// DOM elements
	const DOM = {
		trigger: document.querySelector('.gallery-link-tile--locked'),
		overlay: null, // Will be created dynamically
		input: null,
		submitBtn: null,
		messageEl: null,
		closeBtn: null,
		background: null
	};
	
	// State
	let isOverlayOpen = false;
	
	// Initialize overlay (template already rendered by Jekyll)
	function initializeOverlay() {
		if (DOM.overlay) return; // Already initialized
		
		DOM.overlay = document.getElementById('gallery-access-overlay');
		DOM.input = document.getElementById('access-code');
		DOM.submitBtn = document.querySelector('.gallery-access__submit');
		DOM.messageEl = document.getElementById('access-message');
		DOM.closeBtn = DOM.overlay.querySelector('.gallery-access-overlay__close');
		DOM.background = DOM.overlay.querySelector('.gallery-access-overlay__background');
		
		// Setup event listeners
		setupEventListeners();
	}
	
	// Show overlay
	function showOverlay() {
		if (!DOM.overlay) initializeOverlay();
		
		isOverlayOpen = true;
		DOM.overlay.classList.add('active');
		DOM.overlay.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		
		// Focus the input
		// setTimeout(() => DOM.input.focus(), 100);
		
		// Clear any previous messages
		showMessage('❤️‍🩹📸❤️‍🔥', 'love');
	}
	
	// Hide overlay
	function hideOverlay() {
		if (!DOM.overlay) return;
		
		isOverlayOpen = false;
		DOM.input.blur();
		DOM.overlay.classList.remove('active');
		DOM.overlay.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		
		// Clear form
		DOM.input.value = '';
		showMessage('', '');
	}
	
	// Show message with type
	function showMessage(message, type = '') {
		if (!DOM.messageEl) return;
		
		DOM.messageEl.textContent = message;
		DOM.messageEl.className = 'gallery-access__message';
		
		if (type) {
			DOM.messageEl.classList.add(`gallery-access__message--${type}`);
		}
		
		if (message) {
			DOM.messageEl.classList.add('show');
		} else {
			DOM.messageEl.classList.remove('show');
		}
	}
	
	// Handle form submission
	function handleSubmission() {
		const code = DOM.input.value.trim();
		
		if (!code) {
			showMessage('Please enter an access code', 'error');
			return;
		}
		
		// Disable submit button during processing
		DOM.submitBtn.disabled = true;
		showMessage('Checking access...', '');
		
		// TODO: Add actual validation logic here
		// For now, simulate processing delay
		setTimeout(() => {
			DOM.submitBtn.disabled = false;
			
			// TODO: Replace with actual gallery matching logic
			// Placeholder: always show access denied for now
			showMessage('Access denied', 'error');
			// showMessage('Username is not in the sudoers file. This incident will be reported.', 'error');
			
			// TODO: On success, redirect to gallery:
			// window.location.href = '/gallery-name/';
			
		}, 1000);
	}
	
	// Setup event listeners
	function setupEventListeners() {
		if (!DOM.overlay) return;
		
		// Submit button
		DOM.submitBtn.addEventListener('click', (e) => {
			e.preventDefault();
			handleSubmission();
		});
		
		// Enter key on input
		DOM.input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				handleSubmission();
			}
		});
		
		// Close overlay
		DOM.closeBtn.addEventListener('click', hideOverlay);
		DOM.background.addEventListener('click', hideOverlay);
		
		// Escape key
		document.addEventListener('keydown', (e) => {
			if (isOverlayOpen && e.key === 'Escape') {
				hideOverlay();
			}
		});
	}
	
	// Initialize
	function init() {
		if (!DOM.trigger) return;
		
		DOM.trigger.addEventListener('click', (e) => {
			e.preventDefault();
			showOverlay();
		});
	}
	
	// Start the system
	init();
})();