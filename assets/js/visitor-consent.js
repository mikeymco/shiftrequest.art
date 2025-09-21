/**
 * Visitor Consent & Content Management System
 * Handles GDPR compliance, age verification, and content filtering
 * Pure client-side localStorage implementation for sovereignty
 */

class VisitorConsent {
    constructor() {
        this.storageKeys = {
            hasVisited: 'shiftrequest_has_visited',
            consentLevel: 'shiftrequest_consent_level',
            gdprAccepted: 'shiftrequest_gdpr_accepted',
            ageVerified: 'shiftrequest_age_verified'
        };
        
        this.consentLevels = {
            SFW: 'sfw',           // All ages but potentially "contagious" 
            NSFW: 'nsfw',         // Sexual content, nudity (18+)
            DA: 'drugs_alcohol'   // Drugs, alcohol, explicit content (21+)
        };
        
        this.init();
    }
    
    init() {
        // Check if user needs to go through consent flow
        if (!this.hasCompletedConsent()) {
            this.showConsentFlow();
        } else {
            this.initializeVisitorExperience();
        }
    }
    
    hasCompletedConsent() {
        return localStorage.getItem(this.storageKeys.hasVisited) === 'true' &&
               localStorage.getItem(this.storageKeys.gdprAccepted) === 'true' &&
               localStorage.getItem(this.storageKeys.ageVerified) === 'true';
    }
    
    showConsentFlow() {
        // Hide all site content
        document.body.style.overflow = 'hidden';
        
        // Create consent overlay
        this.createConsentOverlay();
    }
    
    async createConsentOverlay() {
        // Load template from external HTML file
        const templateResponse = await fetch('/assets/templates/visitor-consent.html');
        const templateHTML = await templateResponse.text();
        
        const overlay = document.createElement('div');
        overlay.className = 'consent-overlay';
        overlay.innerHTML = templateHTML;
        
        document.body.appendChild(overlay);
    }
    
    nextStep(stepName) {
        // Hide current step
        document.querySelector('.consent-step:not(.hidden)').classList.add('hidden');
        
        // Show next step
        document.getElementById(`step-${stepName}`).classList.remove('hidden');
    }
    
    setAge(ageRange) {
        this.selectedAge = ageRange;
        
        // Handle age-restricted content options
        if (ageRange === 'under18') {
            // Force SFW mode for minors
            document.querySelector('input[value="sfw"]').checked = true;
            document.querySelector('input[value="nsfw"]').disabled = true;
            document.getElementById('da-option').style.display = 'none';
        } else if (ageRange === '18-20') {
            // Enable NSFW, but not D+A
            document.getElementById('da-option').style.display = 'none';
            document.querySelector('input[value="nsfw"]').checked = true;
        } else {
            // 21+ gets all options
            document.getElementById('da-option').style.display = 'block';
            document.querySelector('input[value="drugs_alcohol"]').checked = true;
        }
        
        localStorage.setItem(this.storageKeys.ageVerified, 'true');
        this.nextStep('content');
    }
    
    completeConsent(acceptAnalytics) {
        // Store consent choices
        const contentLevel = document.querySelector('input[name="content-level"]:checked').value;
        
        localStorage.setItem(this.storageKeys.hasVisited, 'true');
        localStorage.setItem(this.storageKeys.consentLevel, contentLevel);
        localStorage.setItem(this.storageKeys.gdprAccepted, acceptAnalytics.toString());
        
        // Initialize analytics if accepted
        if (acceptAnalytics) {
            this.initializeAnalytics();
        }
        
        this.nextStep('complete');
    }
    
    enterSite() {
        // Remove consent overlay
        document.querySelector('.consent-overlay').remove();
        document.body.style.overflow = '';
        
        // Initialize the visitor experience
        this.initializeVisitorExperience();
    }
    
    initializeVisitorExperience() {
        // Set body class for content filtering
        const consentLevel = localStorage.getItem(this.storageKeys.consentLevel) || 'sfw';
        document.body.classList.add(`consent-${consentLevel}`);
        
        // Initialize analytics if previously accepted
        if (localStorage.getItem(this.storageKeys.gdprAccepted) === 'true') {
            this.initializeAnalytics();
        }
        
        // Initialize content filtering
        this.initializeContentFiltering();
    }
    
    initializeAnalytics() {
        // Google Analytics initialization (only if consented)
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }
    
    initializeContentFiltering() {
        // Hide content based on consent level
        const consentLevel = localStorage.getItem(this.storageKeys.consentLevel);
        
        // This will be expanded when we implement the gallery filtering
        console.log(`Visitor consent level: ${consentLevel}`);
    }
    
    // Public method to change content preferences
    changeContentLevel(newLevel) {
        localStorage.setItem(this.storageKeys.consentLevel, newLevel);
        document.body.className = document.body.className.replace(/consent-\w+/, `consent-${newLevel}`);
        this.initializeContentFiltering();
    }
    
    // Public method to reset all consent (for testing/changes)
    resetConsent() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        location.reload();
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.visitorConsent = new VisitorConsent();
});