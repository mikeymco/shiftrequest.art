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

    createGateOverlay() {
        // Template is already rendered in HTML by Jekyll
        const overlay = document.querySelector('.consent-dialog');
        if (overlay) {
            overlay.style.display = 'block';
        }
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