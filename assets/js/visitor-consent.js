/**
 * Simple NSFW Content Gate
 * Stateless age verification for artistic content
 * No tracking, no storage, no bullshit
 */

class ContentGate {
    constructor() {
        this.init();
    }
    
    init() {
        // Hide all site content
        document.body.style.overflow = 'hidden';
        
        // Create content gate overlay
        this.createGateOverlay();
    }

    async createGateOverlay() {
        // Load template from external HTML file
        const templateResponse = await fetch('/assets/templates/visitor-consent.html');
        const templateHTML = await templateResponse.text();
        
        const overlay = document.createElement('div');
        overlay.className = 'consent-dialog';
        overlay.innerHTML = templateHTML;
        
        document.body.appendChild(overlay);
        document.body.style.display = '';
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
        // Remove gate overlay
        document.querySelector('.consent-dialog').remove();
        document.body.style.overflow = '';        
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.contentGate = new ContentGate();
});