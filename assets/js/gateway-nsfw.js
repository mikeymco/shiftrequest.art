/**
 * NSFW Content Gateway
 * Stateless age verification for artistic content
 * No tracking, no storage, no bullshit
 */

class ContentGateway {
  constructor() {
    this.init();
  }

  init() {
    // Hide all site content
    document.body.style.overflow = 'hidden';

    // Create consent gateway
    this.createGateway();
  }

  createGateway() {
    // Template is already rendered in HTML by Jekyll
    const gateway = document.querySelector('.gateway-nsfw');
    if (gateway) {
      document.querySelector('.gallery-grid').style.display = '';
    }
  }

  verifyAge(isAdult) {
    if (isAdult) {
      this.enterSite();
    } else {
      // Redirect minors to a safe space
      window.location.href = 'https://disney.com';
    }
  }

  enterSite() {
    // Remove gate gateway
    document.querySelector('.gateway-nsfw').remove();
    document.body.style.overflow = '';
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.contentGate = new ContentGateway();
});
