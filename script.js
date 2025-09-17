// Bhagwati Logistics - Complete JavaScript - REBUILT FROM SCRATCH
console.log('🚛 Bhagwati Logistics JavaScript Loading...');

// ADD this JavaScript to your existing script.js file

// Swipeable Header Navigation Class
class SwipeableHeader {
    constructor() {
        this.navTrack = document.getElementById('navTrack');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.currentSlide = 0;
        this.totalSlides = 2;
        this.isAnimating = false;
        
        // Touch/mouse tracking
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.initialTransform = 0;
        this.threshold = 50; // Minimum swipe distance
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateSlide();
        console.log('✅ Swipeable header navigation initialized');
    }
    
    bindEvents() {
        // Arrow button events
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Indicator events
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Touch events
        this.navTrack.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
        this.navTrack.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
        this.navTrack.addEventListener('touchend', (e) => this.handleEnd(e), { passive: false });
        
        // Mouse events (for desktop testing)
        this.navTrack.addEventListener('mousedown', (e) => this.handleStart(e));
        this.navTrack.addEventListener('mousemove', (e) => this.handleMove(e));
        this.navTrack.addEventListener('mouseup', (e) => this.handleEnd(e));
        this.navTrack.addEventListener('mouseleave', (e) => this.handleEnd(e));
        
        // Navigation link events
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.setActiveLink(link);
                console.log(`Navigated to: ${link.textContent}`);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    handleStart(e) {
        if (this.isAnimating) return;
        
        this.isDragging = true;
        this.navTrack.classList.add('dragging');
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        this.startX = clientX;
        this.currentX = clientX;
        
        const transform = getComputedStyle(this.navTrack).transform;
        this.initialTransform = transform === 'none' ? 0 : 
            parseInt(transform.split(',')[4]) || 0;
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        this.currentX = clientX;
        
        const deltaX = this.currentX - this.startX;
        const newTransform = this.initialTransform + deltaX;
        
        // Apply transform with boundaries
        const maxTransform = 0;
        const minTransform = -(this.totalSlides - 1) * 100;
        const clampedTransform = Math.max(minTransform, Math.min(maxTransform, newTransform));
        
        this.navTrack.style.transform = `translateX(${clampedTransform}%)`;
    }
    
    handleEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.navTrack.classList.remove('dragging');
        
        const deltaX = this.currentX - this.startX;
        const threshold = this.threshold;
        
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0 && this.currentSlide > 0) {
                this.prevSlide();
            } else if (deltaX < 0 && this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
            } else {
                this.updateSlide(); // Snap back
            }
        } else {
            this.updateSlide(); // Snap back
        }
    }
    
    prevSlide() {
        if (this.isAnimating || this.currentSlide <= 0) return;
        this.currentSlide--;
        this.updateSlide();
    }
    
    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides - 1) return;
        this.currentSlide++;
        this.updateSlide();
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        this.currentSlide = index;
        this.updateSlide();
    }
    
    updateSlide() {
        this.isAnimating = true;
        
        // Update transform
        const translateX = -this.currentSlide * 100;
        this.navTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update arrow visibility
        this.prevBtn.style.opacity = this.currentSlide > 0 ? '1' : '0.5';
        this.nextBtn.style.opacity = this.currentSlide < this.totalSlides - 1 ? '1' : '0.5';
        
        // Reset animation lock after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
        
        console.log(`Navigated to slide: ${this.currentSlide + 1}`);
    }
    
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
}

// Initialize swipeable header when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Your existing code remains here...
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("T_tQAZWQAg3YZzTie");
        console.log('📧 EmailJS Initialized');
    } else {
        console.warn('📧 EmailJS not loaded - form will use mailto fallback');
    }

    // Initialize existing functions
    initializeGallery();
    initializeContactForm();
    initializeSmoothScrolling();
    
    // Initialize new swipeable header
    new SwipeableHeader();
    
    console.log('✅ All JavaScript modules loaded successfully');
});

// Keep all your existing functions below...
// (initializeGallery, initializeContactForm, initializeSmoothScrolling, etc.)
// Just add the SwipeableHeader initialization above

// Initialize EmailJS when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init("T_tQAZWQAg3YZzTie"); // Replace with your actual public key
        console.log('📧 EmailJS Initialized');
    } else {
        console.warn('📧 EmailJS not loaded - form will use mailto fallback');
    }

    // GALLERY TAB FUNCTIONALITY - COMPLETELY REBUILT
    initializeGallery();
    
    // CONTACT FORM FUNCTIONALITY - COMPLETELY REBUILT  
    initializeContactForm();
    
    // SMOOTH SCROLLING
    initializeSmoothScrolling();
    
    console.log('✅ All JavaScript modules loaded successfully');
});

// GALLERY FUNCTIONALITY - REBUILD
function initializeGallery() {
    console.log('🖼️ Initializing Gallery...');
    
    const vehicleTabs = document.querySelectorAll('.vehicle-tab-btn');
    const vehicleGalleries = document.querySelectorAll('.vehicle-gallery');
    
    console.log(`Found ${vehicleTabs.length} tabs and ${vehicleGalleries.length} galleries`);
    
    if (vehicleTabs.length === 0) {
        console.log('No gallery tabs found - skipping gallery initialization');
        return;
    }
    
    // Add click event to each tab
    vehicleTabs.forEach((tab, index) => {
        console.log(`Setting up tab ${index}:`, tab.getAttribute('data-vehicle'));
        
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('🔄 Tab clicked:', this.getAttribute('data-vehicle'));
            
            // Get the vehicle type from data attribute
            const vehicleType = this.getAttribute('data-vehicle');
            
            if (!vehicleType) {
                console.error('❌ No data-vehicle attribute found on tab');
                return;
            }
            
            // Remove active class from all tabs
            vehicleTabs.forEach(t => {
                t.classList.remove('active');
                console.log('Removed active from tab:', t.getAttribute('data-vehicle'));
            });
            
            // Remove active class from all galleries
            vehicleGalleries.forEach(g => {
                g.classList.remove('active');
                console.log('Removed active from gallery:', g.id);
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            console.log('✅ Added active to tab:', vehicleType);
            
            // Find and activate corresponding gallery
            const targetGallery = document.getElementById(vehicleType);
            if (targetGallery) {
                targetGallery.classList.add('active');
                console.log('✅ Activated gallery:', vehicleType);
            } else {
                console.error('❌ Gallery not found for:', vehicleType);
                console.log('Available galleries:', Array.from(vehicleGalleries).map(g => g.id));
            }
        });
    });
    
    console.log('✅ Gallery initialization complete');
}

// CONTACT FORM FUNCTIONALITY - REBUILD
function initializeContactForm() {
    console.log('📝 Initializing Contact Form...');
    
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
        console.log('No contact form found on this page - skipping form initialization');
        return;
    }
    
    console.log('📝 Contact form found, setting up submission handler');
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('📤 Form submission started');
        
        // Get the submit button
        const submitBtn = this.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        
        // Get form data
        const formData = new FormData(this);
        const formDataObj = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            phone: formData.get('phone')?.trim(),
            company: formData.get('company')?.trim() || 'Not provided',
            service: formData.get('service') || 'Not specified',
            urgency: formData.get('urgency') || 'Not specified',
            pickup: formData.get('pickup')?.trim() || 'Not specified',
            delivery: formData.get('delivery')?.trim() || 'Not specified',
            cargoDetails: formData.get('cargo-details')?.trim() || 'Not specified',
            message: formData.get('message')?.trim() || 'No additional message'
        };
        
        console.log('📝 Form data collected:', formDataObj);
        
        // Validation
        if (!formDataObj.name || !formDataObj.email || !formDataObj.phone) {
            alert('❌ Please fill in all required fields: Name, Email, and Phone.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formDataObj.email)) {
            alert('❌ Please enter a valid email address.');
            return;
        }
        
        console.log('✅ Form validation passed');
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Try EmailJS first, then fallback to mailto
        if (typeof emailjs !== 'undefined') {
            console.log('📧 Attempting to send via EmailJS...');
            sendViaEmailJS(formDataObj, submitBtn, originalBtnText, contactForm);
        } else {
            console.log('📧 EmailJS not available, using mailto fallback...');
            sendViaMailto(formDataObj, submitBtn, originalBtnText, contactForm);
        }
    });
    
    console.log('✅ Contact form initialization complete');
}

// SEND VIA EMAILJS
function sendViaEmailJS(data, submitBtn, originalBtnText, form) {
    const templateParams = {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        company: data.company,
        service: data.service,
        urgency: data.urgency,
        pickup: data.pickup,
        delivery: data.delivery,
        cargo_details: data.cargoDetails,
        message: data.message,
        current_date: new Date().toLocaleString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    console.log('📧 Sending email with template params:', templateParams);
    
    // Replace these with your actual EmailJS service and template IDs
    emailjs.send('service_9num3id', 'template_hi56aao', templateParams)
        .then(function(response) {
            console.log('✅ EmailJS SUCCESS:', response.status, response.text);
            alert('🎉 Thank you! Your quote request has been sent successfully. We will contact you within 24 hours.');
            form.reset();
        })
        .catch(function(error) {
            console.error('❌ EmailJS FAILED:', error);
            alert('⚠️ There was an issue sending your message via our system. Opening your email client as backup...');
            // Fallback to mailto
            sendViaMailto(data, submitBtn, originalBtnText, form);
        })
        .finally(function() {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
}

// SEND VIA MAILTO (FALLBACK)
function sendViaMailto(data, submitBtn, originalBtnText, form) {
    console.log('📧 Using mailto fallback');
    
    const emailSubject = encodeURIComponent(`Quote Request from ${data.name} - Bhagwati Logistics`);
    const emailBody = encodeURIComponent(`
NEW QUOTE REQUEST FROM WEBSITE

Customer Details:
-----------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}

Service Requirements:
--------------------
Service Type: ${data.service}
Urgency: ${data.urgency}
Pickup Location: ${data.pickup}
Delivery Location: ${data.delivery}

Cargo Information:
------------------
${data.cargoDetails}

Additional Message:
------------------
${data.message}

Contact Information:
-------------------
Please contact this customer within 24 hours for quote discussion.

Sent from: Bhagwati Logistics Website
Date: ${new Date().toLocaleString('en-IN')}
    `.trim());
    
    const mailtoLink = `mailto:avtardy08@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
    
    alert('📧 Your email client will open with the quote request. Please send the email to complete your inquiry. We will respond within 24 hours.');
    
    // Reset form and button
    form.reset();
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
    
    console.log('✅ Mailto fallback completed');
}

// SMOOTH SCROLLING
function initializeSmoothScrolling() {
    console.log('🔄 Initializing smooth scrolling...');
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors
            if (href === '#' || href === '#!') {
                return;
            }
            
            event.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                console.log('🔄 Smooth scrolling to:', href);
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('✅ Smooth scrolling initialization complete');
}

// MOBILE MENU TOGGLE (if you add mobile menu later)
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-active');
            console.log('📱 Mobile menu toggled');
        });
    }
}

// UTILITY FUNCTIONS
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '9999',
        backgroundColor: type === 'success' ? '#22c55e' : '#ef4444'
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// DEBUG FUNCTIONS (for testing)
function debugGallery() {
    console.log('🔍 GALLERY DEBUG INFO:');
    console.log('Tabs found:', document.querySelectorAll('.vehicle-tab-btn').length);
    console.log('Galleries found:', document.querySelectorAll('.vehicle-gallery').length);
    
    document.querySelectorAll('.vehicle-tab-btn').forEach((tab, i) => {
        console.log(`Tab ${i}:`, {
            text: tab.textContent.trim(),
            dataVehicle: tab.getAttribute('data-vehicle'),
            hasClickListener: tab.onclick !== null
        });
    });
    
    document.querySelectorAll('.vehicle-gallery').forEach((gallery, i) => {
        console.log(`Gallery ${i}:`, {
            id: gallery.id,
            isActive: gallery.classList.contains('active'),
            display: window.getComputedStyle(gallery).display
        });
    });
}

function debugForm() {
    console.log('🔍 FORM DEBUG INFO:');
    const form = document.getElementById('contact-form');
    console.log('Form found:', !!form);
    console.log('EmailJS available:', typeof emailjs !== 'undefined');
    if (form) {
        console.log('Form elements:', form.elements.length);
        console.log('Submit button:', !!form.querySelector('.submit-btn'));
    }
}

// Make debug functions available globally for testing
window.debugGallery = debugGallery;
window.debugForm = debugForm;

console.log('🎉 Bhagwati Logistics JavaScript fully loaded!');
console.log('💡 Use debugGallery() or debugForm() in console to troubleshoot');

