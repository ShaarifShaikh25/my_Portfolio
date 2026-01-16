// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Add active class to navigation on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Form submission handler - Send via Web3Forms to email
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                formStatus.textContent = 'Thank you for your message! I will get back to you soon.';
                formStatus.style.color = '#27ae60';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                formStatus.textContent = 'Oops! There was a problem submitting your form.';
                formStatus.style.color = '#e74c3c';
                formStatus.style.display = 'block';
            }
        } catch (error) {
            formStatus.textContent = 'Oops! There was a problem submitting your form.';
            formStatus.style.color = '#e74c3c';
            formStatus.style.display = 'block';
        }
        
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        
        // Hide status message after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    });
}

// Scroll animations with Intersection Observer
const animationObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, animationObserverOptions);

// Observe all sections and project cards
document.querySelectorAll('section').forEach(section => {
    animationObserver.observe(section);
});

document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animationObserver.observe(card);
});
