// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle functionality
    const mobileToggle = document.querySelector('#mobile-toggle');
    const navbarCenter = document.querySelector('.navbar-center');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navbarCenter.classList.toggle('active');

            // Change icon
            const icon = mobileToggle.querySelector('i');
            if (navbarCenter.classList.contains('active')) {
                icon.classList.remove('bx-menu');
                icon.classList.add('bx-x');
            } else {
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            // Close mobile menu when a link is clicked
            if (window.innerWidth <= 768) {
                navbarCenter.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }

            // Get the target section
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // Initialize skill progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const value = bar.getAttribute('data-value');
        // Set width with a slight delay for animation
        setTimeout(() => {
            bar.style.width = `${value}%`;
        }, 100);
    });

    // Section animations using Intersection Observer
    const sections = document.querySelectorAll('.section-container');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Basic validation
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }

            // Here you would typically send data to a server
            // For demonstration, show success message
            alert('Message envoyé ! Merci de votre contact, ' + name);

            // Reset form
            contactForm.reset();
        });
    }

    // Add active class to current section in navigation
    window.addEventListener('scroll', function () {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;

            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    // Projects category toggle
    const projectToggleButtons = document.querySelectorAll('#projets .projects-toggle .toggle-btn');
    const projectCards = document.querySelectorAll('#projets .projects-grid .project-card');

    if (projectToggleButtons.length && projectCards.length) {
        const showAllProjects = () => {
            projectCards.forEach(card => card.classList.remove('is-hidden'));
        };

        const updateProjectsDisplay = (category) => {
            projectCards.forEach(card => {
                const isMatch = card.dataset.category === category;
                card.classList.toggle('is-hidden', !isMatch);
            });
        };

        projectToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('active')) {
                    projectToggleButtons.forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                    });
                    showAllProjects();
                    return;
                }

                projectToggleButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });

                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                updateProjectsDisplay(button.dataset.target);
            });
        });

        const defaultCategory = document.querySelector('.projects-toggle .toggle-btn.active')?.dataset.target || projectToggleButtons[0].dataset.target;
        updateProjectsDisplay(defaultCategory);
    }

    // Competences category toggle
    const compToggleButtons = document.querySelectorAll('#competence .competences-toggle .toggle-btn');
    const compCategories = document.querySelectorAll('#competence .competences-container .competence-category');

    if (compToggleButtons.length && compCategories.length) {
        const showAllComps = () => {
            compCategories.forEach(cat => cat.classList.remove('is-hidden'));
        };

        const updateCompsDisplay = (category) => {
            if (category === 'tous') {
                showAllComps();
                return;
            }
            compCategories.forEach(cat => {
                const isMatch = cat.dataset.category === category;
                cat.classList.toggle('is-hidden', !isMatch);
            });
        };

        compToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('active')) {
                    // Si on clique sur un bouton déjà actif (sauf "tous"), on le désélectionne et on affiche tout
                    if (button.dataset.target !== 'tous') {
                        compToggleButtons.forEach(btn => {
                            btn.classList.remove('active');
                            btn.setAttribute('aria-pressed', 'false');
                        });
                        const tousBtn = Array.from(compToggleButtons).find(b => b.dataset.target === 'tous');
                        if (tousBtn) {
                            tousBtn.classList.add('active');
                            tousBtn.setAttribute('aria-pressed', 'true');
                        }
                        showAllComps();
                    }
                    return;
                }

                compToggleButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });

                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                updateCompsDisplay(button.dataset.target);
            });
        });

        const defaultCompCategory = document.querySelector('#competence .competences-toggle .toggle-btn.active')?.dataset.target || compToggleButtons[0].dataset.target;
        updateCompsDisplay(defaultCompCategory);
    }

    // Tableau de synthese preview & download
    const synthesisBtn = document.getElementById('openSynthesisPreview');
    const synthesisPreview = document.getElementById('synthesisPreview');
    const closeSynthesisBtn = document.getElementById('closeSynthesisPreview');
    const downloadSynthesisBtn = document.getElementById('downloadSynthesisPdf');
    const synthesisContent = document.getElementById('synthesisPreviewContent');

    if (synthesisBtn && synthesisPreview) {
        let isPdfLoaded = false;

        const openPreview = async () => {
            synthesisPreview.hidden = false;
            requestAnimationFrame(() => {
                synthesisPreview.classList.add('is-visible');
            });
            synthesisPreview.setAttribute('aria-hidden', 'false');
            synthesisBtn.setAttribute('aria-expanded', 'true');

            if (!isPdfLoaded) {
                try {
                    synthesisContent.innerHTML = `<div style="text-align: center; padding: 2rem;"><i class='bx bx-loader-alt bx-spin' style='font-size: 3rem; color: #a78bfa; margin-bottom: 1rem;'></i><p>Chargement de l'aperçu PDF...</p></div>`;

                    const pdfUrl = 'Tableau de synthèse Terence MARDON.pdf';
                    synthesisContent.innerHTML = `<embed src="${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf" width="100%" height="600px" style="border-radius: 8px;">`;

                    isPdfLoaded = true;
                } catch (error) {
                    console.error("Erreur lors du chargement de l'aperçu", error);
                    synthesisContent.innerHTML = `<div style="text-align: center; padding: 2rem;"><i class='bx bxs-error-circle' style='font-size: 3rem; color: #ef4444; margin-bottom: 1rem;'></i><p style="margin:0;line-height:1.5;">Impossible de lire l'aperçu du fichier.</p></div>`;
                }
            }
        };

        const closePreview = () => {
            synthesisPreview.classList.remove('is-visible');
            synthesisPreview.setAttribute('aria-hidden', 'true');
            synthesisBtn.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                if (!synthesisPreview.classList.contains('is-visible')) {
                    synthesisPreview.hidden = true;
                }
            }, 250);
        };

        synthesisBtn.addEventListener('click', () => {
            if (synthesisPreview.hidden || synthesisPreview.getAttribute('aria-hidden') === 'true') {
                openPreview();
                synthesisPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                closePreview();
            }
        });

        closeSynthesisBtn?.addEventListener('click', closePreview);


    }

    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 768) {
            const isClickInsideNav = navbarCenter.contains(event.target);
            const isClickOnToggle = mobileToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navbarCenter.classList.contains('active')) {
                navbarCenter.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        }
    });
});

// Function to toggle dark/light mode
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-toggle i');

    body.classList.toggle('light-mode');

    // Change icon based on theme
    if (body.classList.contains('light-mode')) {
        themeIcon.classList.remove('bx-moon');
        themeIcon.classList.add('bx-sun');
    } else {
        themeIcon.classList.remove('bx-sun');
        themeIcon.classList.add('bx-moon');
    }
}

// Check for saved theme preference on page load
window.addEventListener('DOMContentLoaded', function () {
    const themeIcon = document.querySelector('.theme-toggle i');

    // You can add localStorage functionality here if needed
    // For now, we'll just ensure the icon matches the current state
    if (document.body.classList.contains('light-mode')) {
        themeIcon.classList.remove('bx-moon');
        themeIcon.classList.add('bx-sun');
    }
});
