document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const cursor = document.querySelector('.cursor');
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const modalPdf = document.getElementById("modal-pdf");
    const captionText = document.getElementById("modal-caption");
    const closeBtn = document.querySelector(".modal-close");
    const certCards = document.querySelectorAll(".cert-card");

    // 1. SCROLL REVEAL (Intersection Observer)
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 2. CUSTOM CURSOR LOGIC
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button, .cert-card, .skill-node, .btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // 3. NAVIGATION & MODAL LOGIC
    function scrollToSection(link) {
        const targetId = link.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            let elementPosition = 0;
            let currentElement = targetElement;

            while (currentElement) {
                elementPosition += currentElement.offsetTop;
                currentElement = currentElement.offsetParent;
            }

            const offset = window.innerWidth <= 768 ? 40 : 120;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    function openModal(type, title, source) {
        modal.style.display = "flex";
        captionText.innerText = title;
        document.body.style.overflow = 'hidden'; // Lock scroll

        if (type === 'image') {
            modalImg.style.display = "block";
            modalPdf.style.display = "none";
            modalImg.src = source;
        } else if (type === 'pdf') {
            modalImg.style.display = "none";
            modalPdf.style.display = "block";
            modalPdf.src = source;
        }
    }

    function closeModal() {
        modal.style.display = "none";
        modalImg.src = "";
        modalPdf.src = "";
        document.body.style.overflow = 'auto'; // Unlock scroll
    }

    // Combined Navigation & Resume Listener
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (link.classList.contains('view-resume')) {
                const pdfPath = link.getAttribute('href');
                openModal('pdf', "Rhosley Arman Orozco - Resume", pdfPath);
            } else if (link.getAttribute('data-target')) {
                scrollToSection(link);
            }
        });
    });

    // Certificate Click Listener
    certCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const img = card.querySelector('img');
            const title = card.querySelector('.cert-title').innerText;
            if (img) openModal('image', title, img.src);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // 4. SCROLL EFFECTS & ACTIVE STATE
    window.addEventListener('scroll', () => {
        let current = "";

        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        cards.forEach((card) => {
            const rect = card.getBoundingClientRect();

            if (rect.top < 120) {
                const scrollDistance = Math.abs(rect.top - 120);
                const depth = Math.min(scrollDistance / 400, 1);

                card.style.transform = `scale(${1 - (depth * 0.05)}) translateY(-${depth * 10}px)`;
                card.style.filter = `blur(${depth * 25}px) brightness(${1 - (depth * 0.4)})`;
                card.style.opacity = `${1 - (depth * 0.8)}`;
            } else {
                card.style.transform = `scale(1) translateY(0)`;
                card.style.filter = `blur(0px) brightness(1)`;
                card.style.opacity = `1`;
            }

            if (rect.top <= 250) {
                current = card.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === current) {
                link.classList.add('active');
            }
        });
    });

    // 5. CARD HOVER GRADIENT TRACKING
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
