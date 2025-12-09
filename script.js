/**
 * Metagri研究所 インターン募集ページ - JavaScript
 * ========================================================================== */

(function() {
    'use strict';

    /**
     * DOMContentLoaded時に初期化
     */
    document.addEventListener('DOMContentLoaded', function() {
        initAccordion();
        initScrollAnimations();
        initSmoothScroll();
        initHeroParallax();
    });

    /**
     * FAQアコーディオン
     */
    function initAccordion() {
        const accordionButtons = document.querySelectorAll('.mg-acc-btn');

        accordionButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const content = this.nextElementSibling;

                // 他のアコーディオンを閉じる（オプション）
                accordionButtons.forEach(function(otherButton) {
                    if (otherButton !== button) {
                        otherButton.setAttribute('aria-expanded', 'false');
                        const otherContent = otherButton.nextElementSibling;
                        if (otherContent) {
                            otherContent.classList.remove('is-open');
                        }
                    }
                });

                // 現在のアコーディオンをトグル
                this.setAttribute('aria-expanded', !isExpanded);
                if (content) {
                    content.classList.toggle('is-open');
                }
            });
        });
    }

    /**
     * スクロールアニメーション
     */
    function initScrollAnimations() {
        // アニメーション対象の要素にクラスを追加
        const animationTargets = [
            '.mg-card',
            '.mg-feature-box',
            '.mg-activity-item',
            '.mg-voice-card',
            '.mg-step',
            '.mg-split-image',
            '.mg-split-text',
            '.mg-stats-row',
            '.mg-req-box',
            '.mg-header-image-wrapper'
        ];

        animationTargets.forEach(function(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(function(el, index) {
                el.classList.add('fade-in');
                // 遅延を追加してスタッガー効果を作成
                el.style.transitionDelay = (index * 0.1) + 's';
            });
        });

        // Intersection Observer の設定
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // 一度表示されたら監視を解除
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 全てのfade-in要素を監視
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

                // #のみの場合はスキップ
                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerOffset = 20;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // フォーカス管理（アクセシビリティ）
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                }
            });
        });
    }

    /**
     * ヒーローセクションのパララックス効果
     */
    function initHeroParallax() {
        const heroBg = document.querySelector('.mg-hero-bg');
        const heroContent = document.querySelector('.mg-hero-content');

        if (!heroBg || !heroContent) return;

        let ticking = false;

        function updateParallax() {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.mg-hero').offsetHeight;

            if (scrolled < heroHeight) {
                // 背景のパララックス
                heroBg.style.transform = 'translateY(' + (scrolled * 0.4) + 'px)';

                // コンテンツのフェードアウト効果
                const opacity = 1 - (scrolled / heroHeight) * 1.5;
                heroContent.style.opacity = Math.max(0, opacity);
                heroContent.style.transform = 'translateY(' + (scrolled * 0.2) + 'px)';
            }

            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * ボタンのホバーエフェクト強化
     */
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.mg-btn');

        buttons.forEach(function(button) {
            button.addEventListener('mouseenter', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                this.style.setProperty('--mouse-x', x + 'px');
                this.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    /**
     * カウントアップアニメーション（統計数値用）
     */
    function initCountUp() {
        const statNumbers = document.querySelectorAll('.mg-stat-number');

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent;
                    const match = text.match(/^([\d,]+)/);

                    if (match) {
                        const target = parseInt(match[1].replace(/,/g, ''), 10);
                        const suffix = text.replace(match[0], '');

                        animateCount(el, 0, target, 2000, suffix);
                    }

                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        statNumbers.forEach(function(el) {
            observer.observe(el);
        });
    }

    /**
     * カウントアップアニメーション関数
     */
    function animateCount(element, start, end, duration, suffix) {
        const range = end - start;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // イージング関数（ease-out）
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + range * easeOut);

            element.innerHTML = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * スクロールプログレスバー（オプション）
     */
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #1a5d3a, #4caf50);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        }, { passive: true });
    }

    /**
     * 画像の遅延読み込み強化
     */
    function initLazyLoad() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('is-loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * キーボードナビゲーション対応
     */
    function initKeyboardNav() {
        // アコーディオンのキーボード操作
        const accordionButtons = document.querySelectorAll('.mg-acc-btn');

        accordionButtons.forEach(function(button, index) {
            button.addEventListener('keydown', function(e) {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % accordionButtons.length;
                        accordionButtons[nextIndex].focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (index - 1 + accordionButtons.length) % accordionButtons.length;
                        accordionButtons[prevIndex].focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        accordionButtons[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        accordionButtons[accordionButtons.length - 1].focus();
                        break;
                }
            });
        });
    }

    /**
     * フォーム送信トラッキング（Airtable iframe用）
     */
    function initFormTracking() {
        const iframe = document.querySelector('.airtable-embed');

        if (iframe) {
            // iframeがロードされたことを検知
            iframe.addEventListener('load', function() {
                console.log('Airtable form loaded');
            });
        }
    }

    /**
     * パフォーマンス最適化: 画面外の要素のアニメーション停止
     */
    function initPerformanceOptimizations() {
        // Reduced motion の設定を尊重
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');

            // 全てのアニメーション要素を即座に表示
            const animatedElements = document.querySelectorAll('.fade-in');
            animatedElements.forEach(function(el) {
                el.classList.add('is-visible');
                el.style.transition = 'none';
            });
        }
    }

    // 追加の初期化（オプション機能）
    document.addEventListener('DOMContentLoaded', function() {
        initCountUp();
        initKeyboardNav();
        initPerformanceOptimizations();
        initLazyLoad();
        // initScrollProgress(); // 必要に応じてコメント解除
    });

})();
