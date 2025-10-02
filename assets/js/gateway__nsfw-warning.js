/**
 * NSFW Content Gateway
 * Stateless age verification for artistic adult content
 * No tracking, no storage, no bullshit
 */

class GatewayNsfw {
  constructor() {
    this.gateway = document.querySelector('.gateway__nsfw-warning');
    this.gallery = document.querySelector('.gallery');

    document.body.style.overflow = 'hidden';
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
    this.gateway.remove();
    this.gallery.style.display = '';
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.gatewayNsfw = new GatewayNsfw();
});
