const header = document.querySelector('.site-header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');
const revealElements = document.querySelectorAll('.reveal');
const backToTop = document.querySelector('.back-to-top');

if (hamburger && navLinks) {
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMenu();
        }
    });
}

navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = targetId ? document.querySelector(targetId) : null;

        if (target) {
            const headerHeight = header ? header.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight + 2;

            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        }

        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }

    let currentSection = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 180;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = section.id;
        }
    });

    navAnchors.forEach((anchor) => {
        anchor.classList.toggle('active', anchor.getAttribute('href') === `#${currentSection}`);
    });

    if (backToTop) {
        backToTop.classList.toggle('show', window.scrollY > 560);
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -70px 0px'
    }
);

revealElements.forEach((element) => revealObserver.observe(element));

const metricNumbers = document.querySelectorAll('.metric-number[data-counter]');
const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const element = entry.target;
            const target = Number(element.dataset.counter || 0);
            const duration = 1300;
            const startTime = performance.now();

            const animate = (time) => {
                const progress = Math.min((time - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                element.textContent = Math.round(target * eased).toString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
            counterObserver.unobserve(element);
        });
    },
    { threshold: 0.45 }
);

metricNumbers.forEach((counter) => counterObserver.observe(counter));

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter || 'all';

        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        projectCards.forEach((card) => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            card.classList.toggle('hidden', !shouldShow);
        });
    });
});

const testimonials = document.querySelectorAll('.testimonial-card');
const prevTestimonial = document.getElementById('prevTestimonial');
const nextTestimonial = document.getElementById('nextTestimonial');
let testimonialIndex = 0;
let testimonialTimer;

const showTestimonial = (index) => {
    testimonials.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
};

const moveTestimonial = (step) => {
    testimonialIndex = (testimonialIndex + step + testimonials.length) % testimonials.length;
    showTestimonial(testimonialIndex);
};

const startTestimonialAutoPlay = () => {
    if (!testimonials.length) {
        return;
    }

    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(() => moveTestimonial(1), 5500);
};

if (testimonials.length) {
    showTestimonial(testimonialIndex);
    startTestimonialAutoPlay();

    prevTestimonial?.addEventListener('click', () => {
        moveTestimonial(-1);
        startTestimonialAutoPlay();
    });

    nextTestimonial?.addEventListener('click', () => {
        moveTestimonial(1);
        startTestimonialAutoPlay();
    });
}

const copyEmailButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');

if (copyEmailButton && copyStatus) {
    copyEmailButton.addEventListener('click', async () => {
        const email = copyEmailButton.dataset.email;

        if (!email) {
            return;
        }

        try {
            await navigator.clipboard.writeText(email);
            copyStatus.textContent = 'Email copied to clipboard.';
        } catch (error) {
            copyStatus.textContent = 'Unable to copy automatically.';
        }

        setTimeout(() => {
            copyStatus.textContent = '';
        }, 2400);
    });
}

const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');
const messageInput = contactForm?.querySelector('textarea[name="message"]');
const charCounter = document.querySelector('.char-counter');

if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
        charCounter.textContent = `${messageInput.value.length} / 500`;
    });
}

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);
        const originalText = submitButton?.textContent || 'Get in Touch';

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (response.ok && data.success) {
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                formStatus.style.color = 'var(--success)';
                contactForm.reset();
                if (charCounter) {
                    charCounter.textContent = '0 / 500';
                }
            } else {
                formStatus.textContent = 'Message failed. Please try again in a moment.';
                formStatus.style.color = 'var(--danger)';
            }
        } catch (error) {
            formStatus.textContent = 'Network issue. Please check your connection and retry.';
            formStatus.style.color = 'var(--danger)';
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }

            formStatus.style.display = 'block';
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 4200);
        }
    });
}
