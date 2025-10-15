/**
 * Gallery Access Panel Gateway
 * Purely theatrical and _entirely insecure_
 * NSFW gallery access via access code entry
 */

class GalleryAccessPanel {
	constructor() {
		this.trigger = document.querySelector('.gallery__tile-link--locked');

    if (!this.trigger) return;

		this.gateway = document.querySelector('.overlay.gateway__access-panel');
		this.form = document.querySelector('.gateway__access-panel__form');
		this.input = document.querySelector('.gateway__access-panel__input');
		this.submitButton = document.querySelector('.gateway__access-panel__submit');
		this.message = document.querySelector('.gateway__access-panel__message');
		this.closeButton = document.querySelector('.gateway__access-panel__close');

    this.bindEvents();
	}

	bindEvents() {
    this.trigger.addEventListener('click', e => {
			this.showGateway();
		});

		this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmission();
		});

    // Close on background, not content
    this.gateway.addEventListener('click', e => {
      if (e.target === this.gateway) { // Only background
        this.hideGateway();
      }
    });

    this.closeButton.addEventListener('click', () => this.hideGateway());

		document.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				this.hideGateway();
			}
		});
	}

	showGateway() {
		this.gateway.setAttribute('aria-hidden', 'false');
    this.gateway.classList.add('overlay--active');
		document.body.style.overflow = 'hidden';

    this.input.value = '';
		this.showMessage('❤️‍🩹📸❤️‍🔥', 'initial');
	}

	hideGateway() {
		this.gateway.setAttribute('aria-hidden', 'true');
    this.gateway.classList.remove('overlay--active');
		document.body.style.overflow = '';

		this.input.value = '';
		this.showMessage('');
	}

	showMessage(message = '', type = '') {
		this.message.textContent = message;
    this.message.className = 'gateway__access-panel__message';
    this.submitButton.className = 'gateway__access-panel__submit';

    this.message.classList.add(`gateway__access-panel__message--${type}`);
    this.submitButton.classList.add(`gateway__access-panel__submit--${type}`);
	}

	handleSubmission() {
		const code = this.input.value.trim();

		if (!code) {
			this.showMessage('Please enter an access code', 'error');
			return;
		}

		this.submitButton.disabled = true;
		this.showMessage('Checking access...');

		setTimeout(() => {
			this.submitButton.disabled = false;

			// Parse link targets (supports both single string and array)
			let linkTargets = this.trigger.dataset.linkTo.split(',');

			// Check if code matches any of the target galleries
			const matchedTarget = linkTargets.find(target => code === target);

			if (matchedTarget) {
				this.showMessage('💚 Access Granted 😈', 'success');
				setTimeout(() => {
					window.location.href = '../' + matchedTarget;
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
