/**
 * Gallery Access Panel Gateway
 * Theatrical but _entirely insecure_
 * NSFW gallery access via access code entry
 */

class GalleryAccessPanel {
	constructor() {
		this.trigger = document.querySelector('.gallery__tile-link--locked');

    if (!this.trigger) return;

		this.gateway = document.querySelector('.overlay.gateway__access-panel');
		this.input = document.querySelector('.gateway__access-panel__input');
		this.message = document.querySelector('.gateway__access-panel__message');
		this.submitButton = document.querySelector('.gateway__access-panel__submit');
		this.closeButton = this.gateway.querySelector('.gateway__access-panel__close');

		this.bindEvents();
	}

	bindEvents() {
		this.trigger.addEventListener('click', e => {
			e.preventDefault();
			this.showGateway();
		});

		this.submitButton.addEventListener('click', e => {
			e.preventDefault();
			this.handleSubmission();
		});

		// this.input.addEventListener('keydown', e => {
		// 	if (e.key === 'Enter') {
		// 		e.preventDefault();
		// 		this.handleSubmission();
		// 	}
		// });

    // Close on background, not content
    this.mediaViewer.addEventListener('click', e => {
        if (e.target === this.mediaViewer) { // Only background
            this.hideViewer();
        }
    });

    this.closeButton.addEventListener('click', () => this.hideOverlay());

		document.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				this.hideOverlay();
			}
		});
	}

	showGateway() {
		this.gateway.setAttribute('aria-hidden', 'false');
    this.gateway.classList.add('overlay--active');
		document.body.style.overflow = 'hidden';

    this.input.value = '';
		this.showMessage('❤️‍🩹📸❤️‍🔥', 'love');
	}

	hideOverlay() {
		this.gateway.setAttribute('aria-hidden', 'true');
    this.gateway.classList.remove('overlay--active');
		document.body.style.overflow = '';

		this.input.value = '';
		this.showMessage('', '');
	}

	showMessage(message = '', type = '') {
		this.message.textContent = message;
    this.message.className = 'gateway__access-panel__message';

		if (type) {
			this.message.classList.add(`gateway__access-panel__message--${type}`);
			this.submitButton.classList.add(`gateway__access-panel__submit--${type}`);
		}
	}

	handleSubmission() {
		const code = this.input.value.trim();

		if (!code) {
			this.showMessage('Please enter an access code', 'error');
			return;
		}

		this.submitButton.disabled = true;
		this.showMessage('Checking access...', '');

		setTimeout(() => {
			this.submitButton.disabled = false;

			if (code === 'void') {
				this.showMessage('💚 Access Granted 😈', 'success');
				setTimeout(() => {
					window.location.href = '../' + code;
				}, 1500);
			} else {
				this.showMessage('Access denied. This incident will be reported.', 'error');
			}
		}, 1000);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new GalleryAccessPanel();
});
