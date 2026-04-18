document.addEventListener("DOMContentLoaded", function () {
    
    /* ====== GLOBAL THEME TOGGLE (DARK/LIGHT MODE - SYNCS WITH CHATBOT) ====== */
    const themeToggleBtn = document.getElementById('global-theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const chatWindow = document.getElementById('chat');

    if (localStorage.getItem('portfolioTheme') === 'light') {
        document.body.classList.add('light-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        if(chatWindow) {
            chatWindow.classList.remove('dark');
            chatWindow.classList.add('light');
        }
    } else {
        document.body.classList.remove('light-theme');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        if(chatWindow) {
            chatWindow.classList.remove('light');
            chatWindow.classList.add('dark');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('portfolioTheme', 'light');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            if(chatWindow) {
                chatWindow.classList.remove('dark');
                chatWindow.classList.add('light');
            }
        } else {
            localStorage.setItem('portfolioTheme', 'dark');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            if(chatWindow) {
                chatWindow.classList.remove('light');
                chatWindow.classList.add('dark');
            }
        }
    });

    /* ====== Nav active state on click ====== */
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    /* ====== Scroll spy ====== */
    const sections = document.querySelectorAll('section[id]');
    function onScroll() {
        const scrollPos = window.scrollY + 130; 
        let currentId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = sec.id;
            }
        });
        if (currentId) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();

    /* ====== Make entire project card clickable ====== */
    const projectCards = document.querySelectorAll('.project-card-modern');
    projectCards.forEach(card => {
        const link = card.querySelector('.project-link-modern');
        if (!link) return;
        card.style.cursor = 'pointer';
        card.addEventListener('click', function (e) {
            if (e.target.closest('a.project-link-modern')) return;
            window.open(link.href, '_blank');
        });
    });

    /* ====== Glass Modal (About Learn More) ====== */
    const learnMoreBtn = document.getElementById('aboutLearnMoreBtn');
    const glassModal = document.getElementById('glassModal');
    const glassModalBg = document.getElementById('glassModalBg');
    const glassModalClose = document.getElementById('glassModalClose');

    function openModal() {
        glassModalBg.style.display = 'block';
        glassModal.style.display = 'block';
        setTimeout(() => {
            glassModalBg.classList.add('active');
            glassModal.classList.add('active');
            glassModal.focus();
        }, 10);
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        glassModalBg.classList.remove('active');
        glassModal.classList.remove('active');
        setTimeout(() => {
            glassModalBg.style.display = 'none';
            glassModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    }

    if (learnMoreBtn && glassModal && glassModalBg && glassModalClose) {
        learnMoreBtn.addEventListener('click', openModal);
        glassModalClose.addEventListener('click', closeModal);
        glassModalBg.addEventListener('click', closeModal);
        document.addEventListener('keydown', function (e) {
            if (glassModal.style.display === 'block' && (e.key === "Escape" || e.key === "Esc")) {
                closeModal();
            }
        });
    }

    /* ====== Hobby gallery & Photo viewer ====== */
    const hobbyGalleryModal = document.getElementById('hobbyGalleryModal');
    const hobbyGalleryModalBg = document.getElementById('hobbyGalleryModalBg');
    const hobbyGalleryModalClose = document.getElementById('hobbyGalleryModalClose');
    const hobbyGalleryModalTitle = document.getElementById('hobbyGalleryModalTitle');
    const hobbyGalleryModalContent = document.getElementById('hobbyGalleryModalContent');

    const photographyCard = document.getElementById('photographyCard');
    const webseriesCard = document.getElementById('webseriesCard');

    const photoViewerModal = document.getElementById('photoViewerModal');
    const photoViewerModalBg = document.getElementById('photoViewerModalBg');
    const photoViewerClose = document.getElementById('photoViewerClose');
    const photoViewerPrev = document.getElementById('photoViewerPrev');
    const photoViewerNext = document.getElementById('photoViewerNext');
    const photoViewerImg = document.getElementById('photoViewerImg');

    const photoList = [
        { src: "photo1.jpeg", alt: "Photo 1" },
        { src: "photo2.jpeg", alt: "Photo 2" },
        { src: "photo3.jpeg", alt: "Photo 3" },
        { src: "photo4.jpeg", alt: "Photo 4" },
        { src: "photo5.jpeg", alt: "Photo 5" }
    ];
    const seriesList = [
        { src: "series1.jpg", alt: "Series 1" },
        { src: "series2.jpg", alt: "Series 2" },
        { src: "series3.jpg", alt: "Series 3" }
    ];

    let currentGallery = [];
    let currentIndex = 0;

    function openHobbyGallery(type) {
        hobbyGalleryModalBg.style.display = 'block';
        hobbyGalleryModal.style.display = 'flex';
        setTimeout(() => {
            hobbyGalleryModal.classList.add('active');
            hobbyGalleryModalBg.classList.add('active');
        }, 10);
        
        // Lock background scrolling
        document.body.style.overflow = 'hidden';

        if (type === 'photography') {
            hobbyGalleryModalTitle.textContent = 'My Photography';
            hobbyGalleryModalContent.innerHTML = `
                <div class="hobby-gallery-thumbs">
                    ${photoList.map((p, i) => `
                        <div class="hobby-thumb" tabindex="0" data-index="${i}">
                            <img src="${p.src}" alt="${p.alt}">
                        </div>
                    `).join('')}
                </div>
            `;
            currentGallery = photoList;
        } else if (type === 'webseries') {
            hobbyGalleryModalTitle.textContent = 'My Favorite Web Series';
            hobbyGalleryModalContent.innerHTML = `
                <div class="hobby-gallery-thumbs">
                    ${seriesList.map((p, i) => `
                        <div class="hobby-thumb" tabindex="0" data-index="${i}">
                            <img src="${p.src}" alt="${p.alt}">
                        </div>
                    `).join('')}
                </div>
            `;
            currentGallery = seriesList;
        }

        setTimeout(() => {
            document.querySelectorAll('.hobby-thumb').forEach(function (thumb) {
                thumb.addEventListener('click', function () {
                    openPhotoViewer(parseInt(thumb.getAttribute('data-index'), 10));
                });
            });
        }, 50);
    }

    function closeHobbyGallery() {
        hobbyGalleryModalBg.classList.remove('active');
        hobbyGalleryModal.classList.remove('active');
        setTimeout(() => {
            hobbyGalleryModalBg.style.display = 'none';
            hobbyGalleryModal.style.display = 'none';
        }, 300);
        
        // Unlock background scrolling ONLY when exiting the entire gallery
        document.body.style.overflow = '';
    }

    function showPhoto() {
        if (currentGallery.length === 0) return;
        photoViewerImg.src = currentGallery[currentIndex].src;
        photoViewerImg.alt = currentGallery[currentIndex].alt;
    }

    function openPhotoViewer(index) {
        currentIndex = index;
        showPhoto();

        hobbyGalleryModal.style.display = 'none';
        hobbyGalleryModalBg.style.display = 'none';
        hobbyGalleryModal.classList.remove('active');
        hobbyGalleryModalBg.classList.remove('active');

        photoViewerModalBg.style.display = 'block';
        photoViewerModal.style.display = 'flex';
        setTimeout(() => {
            photoViewerModalBg.classList.add('active');
            photoViewerModal.classList.add('active');
            photoViewerModal.focus();
        }, 10);
    }

    function closePhotoViewer() {
        photoViewerModalBg.classList.remove('active');
        photoViewerModal.classList.remove('active');
        setTimeout(() => {
            photoViewerModalBg.style.display = 'none';
            photoViewerModal.style.display = 'none';

            hobbyGalleryModal.style.display = 'flex';
            hobbyGalleryModalBg.style.display = 'block';
            setTimeout(() => {
                hobbyGalleryModal.classList.add('active');
                hobbyGalleryModalBg.classList.add('active');
            }, 10);
        }, 300);
        
        // BUG FIXED: Do NOT reset document overflow here! 
        // The gallery modal is still open behind it.
    }

    function prevPhoto() {
        if (currentGallery.length === 0) return;
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        showPhoto();
    }

    function nextPhoto() {
        if (currentGallery.length === 0) return;
        currentIndex = (currentIndex + 1) % currentGallery.length;
        showPhoto();
    }

    if (photographyCard) {
        photographyCard.addEventListener('click', () => openHobbyGallery('photography'));
    }
    if (webseriesCard) {
        webseriesCard.addEventListener('click', () => openHobbyGallery('webseries'));
    }

    if (hobbyGalleryModalClose && hobbyGalleryModalBg) {
        hobbyGalleryModalClose.addEventListener('click', closeHobbyGallery);
        hobbyGalleryModalBg.addEventListener('click', closeHobbyGallery);
    }

    if (photoViewerModal && photoViewerModalBg && photoViewerClose && photoViewerPrev && photoViewerNext) {
        photoViewerClose.addEventListener('click', closePhotoViewer);
        photoViewerModalBg.addEventListener('click', closePhotoViewer);
        photoViewerPrev.addEventListener('click', prevPhoto);
        photoViewerNext.addEventListener('click', nextPhoto);

        document.addEventListener('keydown', function (e) {
            if (photoViewerModal.style.display === 'flex') {
                if (e.key === "Escape" || e.key === "Esc") closePhotoViewer();
                if (e.key === "ArrowLeft") prevPhoto();
                if (e.key === "ArrowRight") nextPhoto();
            }
        });
    }
});