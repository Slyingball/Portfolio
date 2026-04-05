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
    const projectToggleButtons = document.querySelectorAll('.projects-toggle .toggle-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

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

    // Tableau de synthese preview & download
    const synthesisBtn = document.getElementById('openSynthesisPreview');
    const synthesisPreview = document.getElementById('synthesisPreview');
    const closeSynthesisBtn = document.getElementById('closeSynthesisPreview');
    const downloadSynthesisBtn = document.getElementById('downloadSynthesisPdf');
    const synthesisContent = document.getElementById('synthesisPreviewContent');

    if (synthesisBtn && synthesisPreview) {
        let isExcelLoaded = false;

        const openPreview = async () => {
            synthesisPreview.hidden = false;
            requestAnimationFrame(() => {
                synthesisPreview.classList.add('is-visible');
            });
            synthesisPreview.setAttribute('aria-hidden', 'false');
            synthesisBtn.setAttribute('aria-expanded', 'true');

            if (!isExcelLoaded && window.XLSX) {
                try {
                    synthesisContent.innerHTML = `<div style="text-align: center; padding: 2rem;"><i class='bx bx-loader-alt bx-spin' style='font-size: 3rem; color: #a78bfa; margin-bottom: 1rem;'></i><p>Chargement de l'aperçu...</p></div>`;

                    let workbook;
                    if (typeof synthesisExcelBase64 !== 'undefined') {
                        workbook = XLSX.read(synthesisExcelBase64, { type: 'base64' });
                    } else {
                        const response = await fetch('Tableau de synthèse.xlsx');
                        const arrayBuffer = await response.arrayBuffer();
                        workbook = XLSX.read(arrayBuffer, { type: 'array' });
                    }

                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    const htmlStr = XLSX.utils.sheet_to_html(worksheet, { id: 'synthesis-table' });

                    synthesisContent.innerHTML = `<div class="excel-preview-wrapper" style="overflow-x: auto; max-width: 100%; border-radius: 8px; background: rgba(255,255,255,0.05); padding: 10px;">${htmlStr}</div>`;

                    // Basic styling for the injected table
                    const table = synthesisContent.querySelector('table');
                    if (table) {
                        table.style.width = '100%';
                        table.style.borderCollapse = 'collapse';
                        table.style.color = '#e0e7ff';
                        const tds = table.querySelectorAll('td, th');
                        tds.forEach(td => {
                            td.style.border = '1px solid rgba(102, 126, 234, 0.3)';
                            td.style.padding = '8px';
                        });
                    }
                    isExcelLoaded = true;
                } catch (error) {
                    console.error("Erreur lors du chargement de l'Excel", error);
                    synthesisContent.innerHTML = `<div style="text-align: center; padding: 2rem;"><i class='bx bxs-error-circle' style='font-size: 3rem; color: #ef4444; margin-bottom: 1rem;'></i><p style="margin:0;line-height:1.5;">Impossible de lire l'aperçu du fichier.<br>Le tableau reste disponible au téléchargement.</p></div>`;
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

        downloadSynthesisBtn?.addEventListener('click', () => {
            const printableContent = synthesisContent?.innerHTML?.trim() || '<p>Aucun contenu disponible pour le moment.</p>';
            const printWindow = window.open('', '_blank', 'width=900,height=650');

            if (!printWindow) {
                alert('Veuillez autoriser les fen\u00EAtres pop-up pour t\u00E9l\u00E9charger le tableau.');
                return;
            }

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Tableau de synth\u00E8se</title>
                        <style>
                            body {
                                font-family: 'Segoe UI', Arial, sans-serif;
                                padding: 40px;
                                color: #0f172a;
                                background: #f8fafc;
                            }
                            h1 {
                                margin-bottom: 24px;
                                color: #111827;
                            }
                            .synthesis-wrapper {
                                border: 1px solid #e5e7eb;
                                border-radius: 16px;
                                padding: 24px;
                                background: #fff;
                                box-shadow: 0 15px 40px rgba(15, 23, 42, 0.08);
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Tableau de synth\u00E8se</h1>
                        <div class="synthesis-wrapper">
                            ${printableContent}
                        </div>
                    </body>
                </html>
            `);

            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        });
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
