document.addEventListener('DOMContentLoaded', () => {
    const searchTrigger = document.getElementById('search-trigger');
    const searchOverlay = document.getElementById('search-overlay');
    const navMenu = document.querySelector('nav ul');
    const searchInput = document.getElementById('search-input');
    const navBar = document.querySelector('nav');
    const quickLinks = document.getElementById('quick-links');

    if (searchTrigger && searchOverlay && navMenu && navBar) {

        function openSearch() {
            // Show overlay with transition
            searchOverlay.classList.remove('invisible', 'opacity-0', '-translate-y-4');

            // Stagger quick links appearance
            if (quickLinks) {
                setTimeout(() => {
                    quickLinks.classList.remove('opacity-0', 'translate-y-2');
                }, 50);
            }

            // Focus input
            setTimeout(() => {
                searchInput.focus();
            }, 50);
        }

        function closeSearch() {
            // Hide overlay
            searchOverlay.classList.add('invisible', 'opacity-0', '-translate-y-4');

            // Reset quick links state
            if (quickLinks) {
                quickLinks.classList.add('opacity-0', 'translate-y-2');
            }
        }

        searchTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing
            // Toggle logic
            if (searchOverlay.classList.contains('invisible')) {
                openSearch();
            } else {
                closeSearch();
            }
        });

        // Close on clicking outside the search content
        document.addEventListener('click', (e) => {
            if (!searchOverlay.classList.contains('invisible')) {
                if (!searchOverlay.contains(e.target) && !searchTrigger.contains(e.target)) {
                    closeSearch();
                }
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !searchOverlay.classList.contains('invisible')) {
                closeSearch();
            }
        });
    }

    // ========== ENTERTAINMENT SYNCED CAROUSELS - TRUE INFINITE SCROLL ==========
    const heroCarousel = document.getElementById('hero-carousel');
    const serviceCarousel = document.getElementById('service-carousel');
    const heroDots = document.querySelectorAll('.carousel-dot');
    const heroNextBtn = document.getElementById('hero-carousel-next');

    if (heroCarousel) {
        const originalSlides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
        const originalServiceCards = serviceCarousel ? Array.from(serviceCarousel.querySelectorAll('.service-card')) : [];
        const totalSlides = originalSlides.length;
        let currentIndex = totalSlides;
        let autoScrollInterval;
        let isHovering = false;
        let isTransitioning = false;

        // infinite scroll effect
        function setupInfiniteScroll() {

            for (let i = totalSlides - 1; i >= 0; i--) {
                const clone = originalSlides[i].cloneNode(true);
                clone.classList.add('clone');
                heroCarousel.insertBefore(clone, heroCarousel.firstChild);
            }

            for (let i = 0; i < totalSlides; i++) {
                const clone = originalSlides[i].cloneNode(true);
                clone.classList.add('clone');
                heroCarousel.appendChild(clone);
            }


            if (serviceCarousel && originalServiceCards.length > 0) {
                for (let i = originalServiceCards.length - 1; i >= 0; i--) {
                    const clone = originalServiceCards[i].cloneNode(true);
                    clone.classList.add('clone');
                    serviceCarousel.insertBefore(clone, serviceCarousel.firstChild);
                }
                for (let i = 0; i < originalServiceCards.length; i++) {
                    const clone = originalServiceCards[i].cloneNode(true);
                    clone.classList.add('clone');
                    serviceCarousel.appendChild(clone);
                }
            }
        }


        function getHeroSlideWidth() {
            const slide = heroCarousel.querySelector('.hero-slide');
            return slide ? slide.offsetWidth + 16 : 836;
        }

        function getServiceCardWidth() {
            const cards = serviceCarousel.querySelectorAll('.service-card');
            return cards[1] ? cards[1].offsetWidth + 12 : 332;
        }

        function moveToIndex(index, animate = true) {
            if (isTransitioning && animate) return;

            const heroSlideWidth = getHeroSlideWidth();
            const heroTranslateX = -(index * heroSlideWidth);

            if (animate) {
                isTransitioning = true;
                heroCarousel.style.transition = 'transform 500ms ease-out';
            } else {
                heroCarousel.style.transition = 'none';
            }
            heroCarousel.style.transform = `translateX(${heroTranslateX}px)`;

            if (serviceCarousel && originalServiceCards.length > 0) {
                const serviceCardWidth = getServiceCardWidth();
                const serviceTranslateX = -(index * serviceCardWidth);
                if (animate) {
                    serviceCarousel.style.transition = 'transform 500ms ease-out';
                } else {
                    serviceCarousel.style.transition = 'none';
                }
                serviceCarousel.style.transform = `translateX(${serviceTranslateX}px)`;
            }

            currentIndex = index;
            updateDots();
        }

        function handleTransitionEnd() {
            isTransitioning = false;

            if (currentIndex >= totalSlides * 2) {

                currentIndex = totalSlides + (currentIndex - totalSlides * 2);
                moveToIndex(currentIndex, false);
            } else if (currentIndex < totalSlides) {

                currentIndex = totalSlides + currentIndex;
                moveToIndex(currentIndex, false);
            }
        }

        // Update dot navigation - Apple style with pill indicator
        function updateDots() {

            let realSlideIndex = (currentIndex - totalSlides) % totalSlides;
            if (realSlideIndex < 0) realSlideIndex += totalSlides;

            heroDots.forEach((dot) => {
                const dotSlide = parseInt(dot.dataset.slide);
                if (dotSlide === realSlideIndex) {

                    dot.classList.remove('bg-[#d2d2d7]', 'w-[6px]');
                    dot.classList.add('bg-[#1d1d1f]', 'w-[18px]');
                } else {

                    dot.classList.remove('bg-[#1d1d1f]', 'w-[18px]');
                    dot.classList.add('bg-[#d2d2d7]', 'w-[6px]');
                }
            });
        }

        // Go to next slide
        function nextSlide() {
            moveToIndex(currentIndex + 1, true);
        }

        // Go to previous slide
        function prevSlide() {
            moveToIndex(currentIndex - 1, true);
        }

        // Go to specific real slide (0-8)
        function goToRealSlide(slideIndex) {
            const targetIndex = totalSlides + slideIndex;
            moveToIndex(targetIndex, true);
        }

        // Auto-scroll function
        function startAutoScroll() {
            if (autoScrollInterval) clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(() => {
                if (!isHovering && !isTransitioning) {
                    nextSlide();
                }
            }, 4000);
        }

        setupInfiniteScroll();

        // Listen for transition end to handle seamless reset
        heroCarousel.addEventListener('transitionend', handleTransitionEnd);

        moveToIndex(totalSlides, false);
        startAutoScroll();

        // Dot click handlers
        heroDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide);
                goToRealSlide(slideIndex);
                startAutoScroll();
            });
        });

        // Next button handler
        if (heroNextBtn) {
            heroNextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoScroll();
            });
        }

        // Pause on hover
        heroCarousel.addEventListener('mouseenter', () => { isHovering = true; });
        heroCarousel.addEventListener('mouseleave', () => { isHovering = false; });

        if (serviceCarousel) {
            serviceCarousel.addEventListener('mouseenter', () => { isHovering = true; });
            serviceCarousel.addEventListener('mouseleave', () => { isHovering = false; });
        }

        // Touch/swipe support
        let touchStartX = 0;
        heroCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        heroCarousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const swipeDistance = touchStartX - touchEndX;
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoScroll();
            }
        }, { passive: true });

        if (serviceCarousel) {
            serviceCarousel.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            serviceCarousel.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const swipeDistance = touchStartX - touchEndX;
                if (Math.abs(swipeDistance) > 50) {
                    if (swipeDistance > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                    startAutoScroll();
                }
            }, { passive: true });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            moveToIndex(currentIndex, false);
        });
    }

    // ========== MORE FROM APPLE CAROUSEL INFINITE ==========
    const moreCarousel = document.getElementById('more-carousel');
    const moreDots = document.querySelectorAll('.more-dot');
    const moreNextBtn = document.getElementById('more-carousel-next');

    if (moreCarousel) {
        const originalMoreSlides = Array.from(moreCarousel.querySelectorAll('.more-slide'));
        const totalMoreSlides = originalMoreSlides.length;
        let currentMoreIndex = totalMoreSlides;
        let isMoreTransitioning = false;

        function setupMoreInfiniteScroll() {

            originalMoreSlides.forEach((slide) => {
                const clone = slide.cloneNode(true);
                clone.classList.add('more-clone');
                moreCarousel.appendChild(clone);
            });


            originalMoreSlides.slice().reverse().forEach((slide) => {
                const clone = slide.cloneNode(true);
                clone.classList.add('more-clone');
                moreCarousel.insertBefore(clone, moreCarousel.firstChild);
            });

            moveMoreToIndex(currentMoreIndex, false);
        }

        function getMoreSlideWidth() {
            const slide = moreCarousel.querySelector('.more-slide');
            return slide ? slide.offsetWidth + 16 : 946;
        }

        function moveMoreToIndex(index, animate = true) {
            if (isMoreTransitioning && animate) return;

            const slideWidth = getMoreSlideWidth();
            const translateX = -(index * slideWidth);

            if (animate) {
                isMoreTransitioning = true;
                moreCarousel.style.transition = 'transform 500ms ease-out';
            } else {
                moreCarousel.style.transition = 'none';
            }
            moreCarousel.style.transform = `translateX(${translateX}px)`;

            currentMoreIndex = index;
            updateMoreDots();
        }

        function handleMoreTransitionEnd() {
            isMoreTransitioning = false;

            if (currentMoreIndex >= totalMoreSlides * 2) {
                currentMoreIndex = totalMoreSlides;
                moveMoreToIndex(currentMoreIndex, false);
            }

            else if (currentMoreIndex < totalMoreSlides) {
                currentMoreIndex = totalMoreSlides + currentMoreIndex;
                moveMoreToIndex(currentMoreIndex, false);
            }
        }

        moreCarousel.addEventListener('transitionend', handleMoreTransitionEnd);

        function updateMoreDots() {

            const realIndex = ((currentMoreIndex - totalMoreSlides) % totalMoreSlides + totalMoreSlides) % totalMoreSlides;

            moreDots.forEach((dot) => {
                const dotSlide = parseInt(dot.dataset.slide);
                if (dotSlide === realIndex) {
                    dot.classList.remove('bg-[#86868b]', 'w-[6px]');
                    dot.classList.add('bg-white', 'w-[18px]');
                } else {
                    dot.classList.remove('bg-white', 'w-[18px]');
                    dot.classList.add('bg-[#86868b]', 'w-[6px]');
                }
            });
        }

        function nextMoreSlide() {
            moveMoreToIndex(currentMoreIndex + 1, true);
        }

        function prevMoreSlide() {
            moveMoreToIndex(currentMoreIndex - 1, true);
        }

        // Dot click handlers
        moreDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide);

                moveMoreToIndex(totalMoreSlides + slideIndex, true);
            });
        });


        if (moreNextBtn) {
            moreNextBtn.addEventListener('click', () => {
                nextMoreSlide();
            });
        }

        // Touch/swipe support
        let moreTouchStartX = 0;
        moreCarousel.addEventListener('touchstart', (e) => {
            moreTouchStartX = e.touches[0].clientX;
        }, { passive: true });

        moreCarousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const swipeDistance = moreTouchStartX - touchEndX;
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    nextMoreSlide();
                } else {
                    prevMoreSlide();
                }
            }
        }, { passive: true });

        // Handle window resize
        window.addEventListener('resize', () => {
            moveMoreToIndex(currentMoreIndex, false);
        });

        // Auto-scroll functionality
        let moreAutoScrollInterval;

        function startMoreAutoScroll() {
            moreAutoScrollInterval = setInterval(() => {
                nextMoreSlide();
            }, 4000);
        }

        function stopMoreAutoScroll() {
            clearInterval(moreAutoScrollInterval);
        }


        const moreSection = document.querySelector('.more-from-apple-section');
        if (moreSection) {
            moreSection.addEventListener('mouseenter', stopMoreAutoScroll);
            moreSection.addEventListener('mouseleave', startMoreAutoScroll);
        }


        setupMoreInfiniteScroll();
        startMoreAutoScroll();
    }
});
