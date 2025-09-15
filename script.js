// Bhagwati Logistics - Complete JavaScript - REBUILT FROM SCRATCH
console.log('🚛 Bhagwati Logistics JavaScript Loading...');

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
    
    // MOBILE MENU FUNCTIONALITY
    initializeMobileMenu();
    
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
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
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
    
    const mailtoLink = `mailto:bhagwatilogistics02@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    
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
<script>
function toggleMobileMenu() {
    const menu = document.querySelector('nav ul');
    const btn = document.querySelector('.mobile-menu-btn');
    
    if (menu && btn) {
        if (menu.classList.contains('mobile-active')) {
            menu.classList.remove('mobile-active');
            btn.innerHTML = '☰';
        } else {
            menu.classList.add('mobile-active');
            btn.innerHTML = '✕';
        }
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.querySelector('nav ul');
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (menu && btn && nav && !nav.contains(event.target) && !btn.contains(event.target)) {
        if (menu.classList.contains('mobile-active')) {
            menu.classList.remove('mobile-active');
            btn.innerHTML = '☰';
        }
    }
});
</script>
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

