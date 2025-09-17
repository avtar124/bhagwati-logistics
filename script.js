// Bhagwati Logistics - Fixed JavaScript to prevent double email sending
console.log('🚛 Bhagwati Logistics JavaScript Loading...');

// Track if form has been initialized to prevent duplicate listeners
let formInitialized = false;
let swipeableHeaderInitialized = false;

// Initialize EmailJS when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init("T_tQAZWQAg3YZzTie");
        console.log('📧 EmailJS Initialized');
    } else {
        console.warn('📧 EmailJS not loaded - form will use mailto fallback');
    }

    // Initialize modules only once
    initializeGallery();
    if (!formInitialized) {
        initializeContactForm();
        formInitialized = true;
    }
    initializeSmoothScrolling();
    
    // Initialize swipeable header only once
    if (!swipeableHeaderInitialized) {
        initializeSwipeableHeader();
        swipeableHeaderInitialized = true;
    }
    
    console.log('✅ All JavaScript modules loaded successfully');
});

// SWIPEABLE HEADER FUNCTIONALITY
function initializeSwipeableHeader() {
    const navTrack = document.getElementById('navTrack');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Check if elements exist
    if (!navTrack || !indicators.length || !prevBtn || !nextBtn) {
        console.log('Swipeable header elements not found - using regular navigation');
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = 2;
    let isAnimating = false;
    
    // Touch/mouse tracking
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let initialTransform = 0;
    const threshold = 50;
    
    // Arrow button events
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Indicator events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Touch events
    navTrack.addEventListener('touchstart', handleStart, { passive: false });
    navTrack.addEventListener('touchmove', handleMove, { passive: false });
    navTrack.addEventListener('touchend', handleEnd, { passive: false });
    
    // Mouse events (for desktop testing)
    navTrack.addEventListener('mousedown', handleStart);
    navTrack.addEventListener('mousemove', handleMove);
    navTrack.addEventListener('mouseup', handleEnd);
    navTrack.addEventListener('mouseleave', handleEnd);
    
    // Navigation link events
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            setActiveLink(link);
            console.log(`Navigated to: ${link.textContent}`);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    function handleStart(e) {
        if (isAnimating) return;
        
        isDragging = true;
        navTrack.classList.add('dragging');
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        startX = clientX;
        currentX = clientX;
        
        const transform = getComputedStyle(navTrack).transform;
        initialTransform = transform === 'none' ? 0 : 
            parseInt(transform.split(',')[4]) || 0;
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        currentX = clientX;
        
        const deltaX = currentX - startX;
        const newTransform = initialTransform + deltaX;
        
        const maxTransform = 0;
        const minTransform = -(totalSlides - 1) * 100;
        const clampedTransform = Math.max(minTransform, Math.min(maxTransform, newTransform));
        
        navTrack.style.transform = `translateX(${clampedTransform}%)`;
    }
    
    function handleEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        navTrack.classList.remove('dragging');
        
        const deltaX = currentX - startX;
        
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0 && currentSlide > 0) {
                prevSlide();
            } else if (deltaX < 0 && currentSlide < totalSlides - 1) {
                nextSlide();
            } else {
                updateSlide();
            }
        } else {
            updateSlide();
        }
    }
    
    function prevSlide() {
        if (isAnimating || currentSlide <= 0) return;
        currentSlide--;
        updateSlide();
    }
    
    function nextSlide() {
        if (isAnimating || currentSlide >= totalSlides - 1) return;
        currentSlide++;
        updateSlide();
    }
    
    function goToSlide(index) {
        if (isAnimating || index === currentSlide) return;
        currentSlide = index;
        updateSlide();
    }
    
    function updateSlide() {
        isAnimating = true;
        
        const translateX = -currentSlide * 100;
        navTrack.style.transform = `translateX(${translateX}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        prevBtn.style.opacity = currentSlide > 0 ? '1' : '0.5';
        nextBtn.style.opacity = currentSlide < totalSlides - 1 ? '1' : '0.5';
        
        setTimeout(() => {
            isAnimating = false;
        }, 300);
        
        console.log(`Navigated to slide: ${currentSlide + 1}`);
    }
    
    function setActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    // Initialize
    updateSlide();
    console.log('✅ Swipeable header navigation initialized');
}

// GALLERY FUNCTIONALITY
function initializeGallery() {
    console.log('🖼️ Initializing Gallery...');
    
    const vehicleTabs = document.querySelectorAll('.vehicle-tab-btn');
    const vehicleGalleries = document.querySelectorAll('.vehicle-gallery');
    
    if (vehicleTabs.length === 0) {
        console.log('No gallery tabs found - skipping gallery initialization');
        return;
    }
    
    vehicleTabs.forEach((tab, index) => {
        // Remove any existing listeners
        tab.replaceWith(tab.cloneNode(true));
    });
    
    // Re-select after cloning (to remove old listeners)
    const freshTabs = document.querySelectorAll('.vehicle-tab-btn');
    
    freshTabs.forEach((tab) => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            
            const vehicleType = this.getAttribute('data-vehicle');
            if (!vehicleType) return;
            
            freshTabs.forEach(t => t.classList.remove('active'));
            vehicleGalleries.forEach(g => g.classList.remove('active'));
            
            this.classList.add('active');
            
            const targetGallery = document.getElementById(vehicleType);
            if (targetGallery) {
                targetGallery.classList.add('active');
            }
        });
    });
    
    console.log('✅ Gallery initialization complete');
}

// CONTACT FORM FUNCTIONALITY - FIXED TO PREVENT DOUBLE SENDING
function initializeContactForm() {
    console.log('📝 Initializing Contact Form...');
    
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
        console.log('No contact form found on this page');
        return;
    }
    
    // Remove any existing listeners by cloning the form
    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);
    
    // Add single event listener to the new form
    newForm.addEventListener('submit', handleFormSubmit);
    
    console.log('✅ Contact form initialization complete');
}

// FORM SUBMIT HANDLER - PREVENTS DOUBLE SUBMISSION
function handleFormSubmit(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    
    // Prevent multiple submissions
    if (submitBtn.disabled) {
        console.log('Form already being submitted, ignoring duplicate request');
        return;
    }
    
    console.log('📤 Form submission started');
    
    // Get form data
    const formData = new FormData(event.target);
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
    
    // Validation
    if (!formDataObj.name || !formDataObj.email || !formDataObj.phone) {
        alert('⚠️ Please fill in all required fields: Name, Email, and Phone.');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formDataObj.email)) {
        alert('⚠️ Please enter a valid email address.');
        return;
    }
    
    // Disable submit button immediately to prevent double submission
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Try EmailJS first, then fallback to mailto
    if (typeof emailjs !== 'undefined') {
        sendViaEmailJS(formDataObj, submitBtn, originalBtnText, event.target);
    } else {
        sendViaMailto(formDataObj, submitBtn, originalBtnText, event.target);
    }
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
    
    emailjs.send('service_9num3id', 'template_hi56aao', templateParams)
        .then(function(response) {
            console.log('✅ EmailJS SUCCESS:', response.status, response.text);
            alert('🎉 Thank you! Your quote request has been sent successfully. We will contact you within 24 hours.');
            form.reset();
        })
        .catch(function(error) {
            console.error('❌ EmailJS FAILED:', error);
            alert('⚠️ There was an issue sending your message via our system. Opening your email client as backup...');
            sendViaMailto(data, submitBtn, originalBtnText, form);
        })
        .finally(function() {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
}

// SEND VIA MAILTO (FALLBACK)
function sendViaMailto(data, submitBtn, originalBtnText, form) {
    const emailSubject = encodeURIComponent(`Quote Request from ${data.name} - Bhagwati Logistics`);
    const emailBody = encodeURIComponent(`
NEW QUOTE REQUEST FROM WEBSITE

Customer Details:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}

Service Requirements:
Service Type: ${data.service}
Urgency: ${data.urgency}
Pickup Location: ${data.pickup}
Delivery Location: ${data.delivery}

Cargo Information:
${data.cargoDetails}

Additional Message:
${data.message}

Date: ${new Date().toLocaleString('en-IN')}
    `.trim());
    
    const mailtoLink = `mailto:bhagwatilogistics02@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    window.open(mailtoLink, '_blank');
    
    alert('📧 Your email client will open with the quote request. Please send the email to complete your inquiry.');
    
    form.reset();
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
}

// SMOOTH SCROLLING
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            event.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

console.log('🎉 Bhagwati Logistics JavaScript fully loaded!');
