// Sticky header adjustments
document.addEventListener('DOMContentLoaded', () => {
    const fixedHeader = document.getElementById('fixed-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href').slice(1); // Remove the "#" to get the ID
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            event.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Projects Section and Navigation Highlight
document.addEventListener('DOMContentLoaded', () => {
    const projectSection = document.getElementById('projects');
    const projectLink = document.querySelector('nav ul li a[href="#projects"]');
    const headerHeight = document.getElementById('fixed-header').offsetHeight || 0;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    projectLink.classList.add('active');
                } else {
                    projectLink.classList.remove('active');
                }
            });
        },
        {
            rootMargin: `-${headerHeight}px 0px 0px 0px`, // Offset for sticky header
            threshold: 0.5 // Trigger when 50% of the section is visible
        }
    );

    observer.observe(projectSection);
});

// Intersection Observer for Project Cards (in-view animation)
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, { threshold: 1.0 }); // Full visibility

    projectCards.forEach(card => observer.observe(card));
});
