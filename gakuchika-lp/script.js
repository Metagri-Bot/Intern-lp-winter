/**
 * AI時代のガクチカづくり - Metagri研究所インターンLP
 * JavaScript
 */

(function() {
    'use strict';

    /**
     * DOMContentLoaded時に初期化
     */
    document.addEventListener('DOMContentLoaded', function() {
        initFAQ();
        initScrollAnimations();
        initSmoothScroll();
        initHeaderScroll();
    });

    /**
     * FAQアコーディオン
     */
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');

            if (question) {
                question.addEventListener('click', function() {
                    const isOpen = item.classList.contains('is-open');

                    // 他のFAQを閉じる
                    faqItems.forEach(function(otherItem) {
                        if (otherItem !== item) {
                            otherItem.classList.remove('is-open');
                            const otherQuestion = otherItem.querySelector('.faq-question');
                            if (otherQuestion) {
                                otherQuestion.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });

                    // 現在のFAQをトグル
                    item.classList.toggle('is-open');
                    question.setAttribute('aria-expanded', !isOpen);
                });
            }
        });
    }

    /**
     * スクロールアニメーション
     */
    function initScrollAnimations() {
        const animationTargets = [
            '.question-card',
            '.experience-card',
            '.episode-card',
            '.overview-card',
            '.voice-card',
            '.step',
            '.faq-item',
            '.insight-box',
            '.activities-section'
        ];

        animationTargets.forEach(function(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(function(el, index) {
                el.classList.add('fade-in');
                el.style.transitionDelay = (index * 0.1) + 's';
            });
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    /**
     * スムーススクロール
     */
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // フォーカス管理
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                }
            });
        });
    }

    /**
     * ヘッダーのスクロール効果
     */
    function initHeaderScroll() {
        const header = document.querySelector('.site-header');
        let lastScrollY = 0;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.pageYOffset;

            if (scrollY > 100) {
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * カウントアップアニメーション
     */
    function initCountUp() {
        const counters = document.querySelectorAll('[data-count]');

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    animateCount(el, 0, target, 2000);
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        counters.forEach(function(counter) {
            observer.observe(counter);
        });
    }

    /**
     * カウントアップアニメーション関数
     */
    function animateCount(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + range * easeOut);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Reduced motion対応
     */
    function initAccessibility() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');

            const animatedElements = document.querySelectorAll('.fade-in');
            animatedElements.forEach(function(el) {
                el.classList.add('is-visible');
                el.style.transition = 'none';
            });
        }
    }

    /**
     * 追加の初期化
     */
    document.addEventListener('DOMContentLoaded', function() {
        initAccessibility();
    });

})();
