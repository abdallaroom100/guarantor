import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
const Landing: React.FC = () => {

  useEffect(() => {
    const link = document.createElement("link"); 
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link); // مسح وقت الانتقال لصفحة تانية
    };
  }, []);
  useEffect(() => {
    // External scripts and styles are loaded via index.html

    // Ensure Bootstrap navbar functionality
    const initNavbar = () => {
      // Close mobile menu when clicking on nav links
      const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
      const navbarCollapse = document.querySelector('.navbar-collapse');
      
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new (window as any).bootstrap.Collapse(navbarCollapse, {
              toggle: false
            });
            bsCollapse.hide();
          }
        });
      });
    };

    // Initialize navbar after Bootstrap is loaded
    setTimeout(initNavbar, 1000);

    // Create animated background particles
    const particleContainer = document.querySelector('.bg-particles');
    if (particleContainer) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = (Math.random() * 3 + 1) + 'px';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particleContainer.appendChild(particle);
      }
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar-futuristic');
    const onScrollNavbar = () => {
      if (!navbar) return;
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScrollNavbar);

    // Initialize Swipers after scripts are loaded
    const initializeSwiper = () => {
      // @ts-ignore - Swiper is loaded via CDN
      if (typeof window !== 'undefined' && (window as any).Swiper) {
        const Swiper = (window as any).Swiper;
      const heroSwiper = new Swiper('.hero-swiper', {
        effect: 'fade',
        loop: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        speed: 600,
        pagination: {
          el: '.hero-swiper .swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.hero-swiper .hero-button-next',
          prevEl: '.hero-swiper .hero-button-prev',
        },
        on: {
          slideChangeTransitionStart: function (this: any) {
            const activeSlide = this.slides[this.activeIndex];
            const caption = activeSlide?.querySelector('.hero-caption-3d') as HTMLElement | null;
            if (caption) {
              caption.style.transform = 'none';
              caption.style.opacity = '1';
            }
          },
          slideChangeTransitionEnd: function (this: any) {
            const activeSlide = this.slides[this.activeIndex];
            const caption = activeSlide?.querySelector('.hero-caption-3d') as HTMLElement | null;
            if (caption) {
              caption.style.transform = 'none';
              caption.style.opacity = '1';
            }
          },
        },
      });

      const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        // loop: true,
        centeredSlides: false,
        pagination: {
          el: ' .swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.testimonials-swiper .swiper-button-next',
          prevEl: '.testimonials-swiper .swiper-button-prev',
        },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        speed: 800,
        effect: 'slide',
        grabCursor: true,
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
      });
      }
    };
    
    // Wait for Swiper to load, then initialize
    const checkSwiper = () => {
      if ((window as any).Swiper) {
        initializeSwiper();
      } else {
        setTimeout(checkSwiper, 100);
      }
    };
    setTimeout(checkSwiper, 500);

    // Advanced scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    } as IntersectionObserverInit;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 200);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const onClick = (e: Event) => {
      e.preventDefault();
      const target = document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute('href') || '');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    navLinks.forEach((link) => link.addEventListener('click', onClick));

    // Add dynamic hover effects to service cards
    const cards = document.querySelectorAll('.service-card-3d, .why-item, .testimonial-card-modern');
    const onEnter = function (this: Element) {
      (this as HTMLElement).style.transform = 'translateY(-20px) rotateX(10deg) rotateY(5deg) scale(1.05)';
    };
    const onLeave = function (this: Element) {
      (this as HTMLElement).style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    };
    cards.forEach((card) => {
      card.addEventListener('mouseenter', onEnter as any);
      card.addEventListener('mouseleave', onLeave as any);
    });

    // Add parallax effect to hero section
    const onScrollParallax = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector('.hero-swiper') as HTMLElement | null;
      if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
      }
    };
    window.addEventListener('scroll', onScrollParallax);

    // Add CSS for character animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('scroll', onScrollNavbar);
      window.removeEventListener('scroll', onScrollParallax);
      navLinks.forEach((link) => link.removeEventListener('click', onClick));
      cards.forEach((card) => {
        card.removeEventListener('mouseenter', onEnter as any);
        card.removeEventListener('mouseleave', onLeave as any);
      });
    };
  }, []);

  return (
    <div>
        <div className="bg-particles"></div>
        <nav className="navbar navbar-expand-lg navbar-futuristic py-2 flex nav-gli">
          <div className="container">
            {/* Logo */}
            <a className="navbar-brand" href="#">⚡ حقيبة الإنجاز</a>
            
            {/* Mobile Toggle Button */}
            <button 
              className="navbar-toggler border-0" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="تبديل التنقل"
            >
              <i className="bi bi-list" style={{ color: '#1a4d2e', fontSize: '2rem' }}></i>
            </button>
            
            {/* Navigation Links */}
            <div className=" navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item">
                  <a className="nav-link" href="#home">🏠 الرئيسية</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about">ℹ️ من نحن</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#services">🛠️ خدماتنا</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#why">⭐ لماذا نحن</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#testimonials">💬 آراء العملاء</a>
                </li>
              </ul>
              
              {/* Contact Button */}
              <a className="btn btn-contact ms-3 text-nowrap"   href="#contact">
                📞 تواصل معنا
              </a>
            </div>
          </div>
        </nav>

      <section id="home" className="hero-3d">
        <div className="swiper hero-swiper" dir="rtl">
          <div className="swiper-wrapper">
            <div className="swiper-slide ">
              <img className="hero-image" loading='lazy' src="/yousef/HOME.webp" alt="الشريحة 1" />
              <div className="hero-caption-3d">
                <div className="hero-bg"></div>
                <h1>🏆 خدمات تعقيب معتمدة ومضمونة</h1>
                <p>✨ نقدم خدمات تعقيب احترافية على جميع المعاملات الحكومية بأحدث التقنيات</p>
              </div>
            </div>
            <div className="swiper-slide">
              <img className="hero-image" loading='lazy' src="" alt="الشريحة 2" />
              <div className="hero-caption-3d">
                <div className="hero-bg"></div>
                <h1>🌐 نخدمك في جميع المنصات الحكومية</h1>
                <p>🔗 أبشر، بلدي، طاقات، وجميع المنصات الرسمية بخبرة متقدمة</p>
              </div>
            </div>
            <div className="swiper-slide">
              <img className="hero-image" loading='lazy' src="" alt="الشريحة 3" />
              <div className="hero-caption-3d">
                <div className="hero-bg"></div>
                <h1>⚡ احترافية وسرعة في إنجاز المعاملات</h1>
                <p>🚀 سرعة فائقة مع ضمان الجودة والموثوقية في كل خدمة</p>
              </div>
            </div>
          </div>
          <div className="swiper-pagination"></div>
          <div className="hero-nav-button hero-button-prev"><i className="bi bi-chevron-right"></i></div>
          <div className="hero-nav-button hero-button-next"><i className="bi bi-chevron-left"></i></div>
        </div>
      </section>

      <section id="about" className="section-modern fade-in-up">
        <div className="container">
          <div className="section-title-3d">
            <span className="title-shadow">من نحن</span>
            <h2 className="title-main">🌟 من نحن</h2>
          </div>
          <div className="about-content">
          
            <p>
              💼 نحن فريق متخصص في تقديم خدمات التعقيب على المعاملات الحكومية والتجارية بخبرة واسعة واحترافية عالية، 
              ⏰ نسعى لتوفير الوقت والجهد على عملائنا من خلال إنجاز المعاملات بدقة وسرعة. 
              🤝 نتميز بالخبرة الطويلة والثقة المتبادلة مع عملائنا الكرام، ونستخدم أحدث التقنيات لضمان أفضل النتائج.
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="section-modern fade-in-up">
        <div className="container">
          <div className="section-title-3d">
            <span className="title-shadow">خدماتنا</span>
            <h2 className="title-main">🛠️ خدماتنا المتميزة</h2>
          </div>
          <div className="services-grid">
            <div className="service-card-3d">
              <img src="/yousef/ابشر.png" alt="أبشر" height={80} />
              <h5>🏛️ خدمة أبشر</h5>
              <p>🔐 خدمات التفعيل، التفاويض، البلاغات، وكل ما يتعلق بمنصة أبشر الحكومية بأحدث الطرق الآمنة.</p>
            </div>
            <div className="service-card-3d">
              <img src="/yousef/بلدي.jpg" alt="بلدي" height={80} />
              <h5>🏢 خدمة بلدي</h5>
              <p>📋 إصدار وتجديد الرخص، خدمات الأنشطة التجارية عبر منصة بلدي الرسمية بسرعة واحترافية.</p>
            </div>
            <div className="service-card-3d">
              <img src="" alt="طاقات" height={80} />
              <h5>💼 طاقات</h5>
              <p>👥 تسجيل الباحثين عن عمل، إدارة ملف المنشأة، وتحديث البيانات الرسمية بدقة عالية.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="section-modern fade-in-up">
        <div className="container">
          <div className="section-title-3d">
            <span className="title-shadow">لماذا نحن؟</span>
            <h2 className="title-main">⭐ لماذا تختارنا؟</h2>
          </div>
          <div className="why-grid">
            <div className="why-item" data-icon="🎯">
              <span className="why-icon">🎯</span>
              <p>خبرة طويلة في مجال التعقيب والخدمات الحكومية مع فريق متخصص ومحترف</p>
            </div>
            <div className="why-item" data-icon="⚡">
              <span className="why-icon">⚡</span>
              <p>سرعة فائقة في إنجاز المعاملات والطلبات مع ضمان الجودة والدقة</p>
            </div>
            <div className="why-item" data-icon="🏛️">
              <span className="why-icon">🏛️</span>
              <p>تعامل رسمي مع جميع الجهات والمنصات الحكومية بأحدث الطرق القانونية</p>
            </div>
            <div className="why-item" data-icon="💰">
              <span className="why-icon">💰</span>
              <p>أسعار تنافسية وخدمة عملاء ممتازة على مدار الساعة لراحتكم</p>
            </div>
            <div className="why-item" data-icon="✅">
              <span className="why-icon">✅</span>
              <p>ضمان الجودة والموثوقية في جميع الخدمات المقدمة مع متابعة مستمرة</p>
            </div>
            <div className="why-item" data-icon="👥">
              <span className="why-icon">👥</span>
              <p>فريق متخصص ومحترف في جميع أنواع المعاملات مع خبرة متراكمة</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="section-modern fade-in-up">
        <div className="container">
          <div className="section-title-3d">
            <span className="title-shadow">آراء العملاء</span>
            <h2 className="title-main">💬 آراء عملائنا الكرام</h2>
          </div>
          <div className="swiper testimonials-swiper" dir="rtl">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="testimonial-card-modern">
                  <img src="https://cdn.pixabay.com/photo/2017/08/30/12/45/girl-2696947_1280.jpg" loading='lazy' alt="أحمد محمد" className="testimonial-image-modern" />
                  <p className="testimonial-text-modern">"💯 خدمة ممتازة وسرعة فائقة في إنجاز المعاملات. أنصح الجميع بالتعامل معهم لأنهم محترفون حقاً"</p>
                  <h5 className="testimonial-author-modern">أحمد محمد</h5>
                  <p className="testimonial-position-modern">مدير شركة</p>
                  <div className="testimonial-rating-modern">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="testimonial-card-modern">
                  <img src="https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg" loading='lazy' alt="سارة أحمد" className="testimonial-image-modern" />
                  <p className="testimonial-text-modern">"🌟 فريق محترف ومتخصص. ساعدوني في إنجاز جميع معاملاتي بسهولة تامة ودون أي تعقيدات"</p>
                  <h5 className="testimonial-author-modern">سارة أحمد</h5>
                  <p className="testimonial-position-modern">مستثمرة</p>
                  <div className="testimonial-rating-modern">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="testimonial-card-modern">
                  <img src="https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg" loading='lazy' alt="محمد علي" className="testimonial-image-modern" />
                  <p className="testimonial-text-modern">"👌 أسعار معقولة وخدمة عملاء ممتازة. أوصي بالتعامل معهم بكل ثقة لجودة خدماتهم"</p>
                  <h5 className="testimonial-author-modern">محمد علي</h5>
                  <p className="testimonial-position-modern">رجل أعمال</p>
                  <div className="testimonial-rating-modern">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-pagination"></div>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-modern fade-in-up">
        <div className="container">
          <div className="section-title-3d">
            <span className="title-shadow">تواصل معنا</span>
            <h2 className="title-main">📞 تواصل معنا</h2>
          </div>
          <div className="contact-grid-modern">
            <div className="contact-item-modern">
              <div className="contact-icon-wrapper-modern">
                <i className="bi bi-telephone-fill"></i>
              </div>
              <div className="contact-details-modern">
                <h4>📞 اتصل بنا</h4>
                <p className="phone-number">0500000000</p>
                <span className="availability">متاح على مدار الساعة 24/7</span>
              </div>
            </div>
            <div className="contact-item-modern">
              <div className="contact-icon-wrapper-modern">
                <i className="bi bi-whatsapp"></i>
              </div>
              <div className="contact-details-modern">
                <h4>💬 واتساب</h4>
                <p className="phone-number">0500000000</p>
                <span className="availability">للتواصل السريع والفوري</span>
              </div>
            </div>
            <div className="contact-item-modern">
              <div className="contact-icon-wrapper-modern">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <div className="contact-details-modern">
                <h4>📧 البريد الإلكتروني</h4>
                <p className="email">info@example.com</p>
                <span className="availability">رد خلال 24 ساعة مضمون</span>
              </div>
            </div>
            <div className="contact-item-modern">
              <div className="contact-icon-wrapper-modern">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div className="contact-details-modern">
                <h4>📍 العنوان</h4>
                <p className="address">الرياض، المملكة العربية السعودية</p>
                <span className="availability">مكتب رئيسي حديث</span>
              </div>
            </div>
            <div className="contact-item-modern">
              <div className="contact-icon-wrapper-modern">
                <i className="bi bi-clock-fill"></i>
              </div>
              <div className="contact-details-modern">
                <h4>🕐 ساعات العمل</h4>
                <p className="working-hours">الأحد - الخميس</p>
                <span className="availability">8:00 صباحاً - 8:00 مساءً</span>
              </div>
            </div>
            <div className="contact-item-modern">
              <div className="contact-icon-wrapper-modern">
                <i className="bi bi-chat-dots-fill"></i>
              </div>
              <div className="contact-details-modern">
                <h4>🛠️ الدعم الفني</h4>
                <p className="support">دعم فني متخصص ومحترف</p>
                <span className="availability">متاح 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-modern">
        <div className="container">
          <p>✨ جميع الحقوق محفوظة &copy; 2025 حقيبة الإنجاز - نحو مستقبل رقمي أفضل 🚀</p>
        </div>
      </footer>

      <style>{`
        :root { --primary-gold-star: #edd00f; --primary-gold: #2ab466; --primary-green: #1a4d2e; --gradient-primary: #0F8E46; --gradient-secondary: linear-gradient(135deg, #1a4d2e 0%, #2d7d32 50%, #1a4d2e 100%); --glass-bg: rgba(255, 255, 255, 0.1); --glass-border: rgba(255, 255, 255, 0.2); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Almarai','Tajawal',sans-serif; line-height: 1.8; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%); min-height: 100vh; overflow-x: hidden; }
        .bg-particles { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; }
        .particle { position: absolute; background: var(--primary-gold); border-radius: 50%; opacity: 0.1; animation: float 6s infinite ease-in-out; }
        @keyframes float { 0%,100% { transform: translateY(0) rotate(0deg);} 50% { transform: translateY(-20px) rotate(180deg);} }
        /* ========== NAVBAR STYLES ========== */
        .navbar-futuristic {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(237, 208, 15, 0.2);
          border-bottom: 2px solid var(--primary-gold);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1050;
          transition: all 0.4s ease;
          padding: 0;
        }
        
        .navbar-futuristic.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 12px 40px rgba(237, 208, 15, 0.3);
        }
        
        /* Logo */
        .navbar-futuristic .navbar-brand {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 900;
          font-size: 2.2rem;
          font-family: 'Changa', sans-serif;
          position: relative;
          margin-right: auto;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .navbar-futuristic .navbar-brand:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
        }
        
        /* Mobile Toggle Button */
        .navbar-futuristic .navbar-toggler {
          padding: 0.5rem;
          border: none;
          outline: none;
          background: transparent;
          transition: all 0.3s ease;
          display: none;
        }
        
        @media (max-width: 991.98px) {
          .navbar-futuristic .navbar-toggler {
            display: block;
          }
        }
        
        .navbar-futuristic .navbar-toggler:hover {
          background: rgba(26, 77, 46, 0.1);
          border-radius: 8px;
        }
        
        .navbar-futuristic .navbar-toggler:focus {
          box-shadow: 0 0 0 0.2rem rgba(26, 77, 46, 0.25);
        }
        
        /* Navigation Container */
        .navbar-futuristic .navbar-collapse {
          flex-grow: 1;
        }
        
        /* Navigation List */
        .navbar-futuristic .navbar-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
        }
        
        /* Navigation Links */
        .navbar-futuristic .nav-link {
          color: #1a4d2e;
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          font-weight: 600;
          font-family: 'Almarai', sans-serif;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          display: block;
        }
        
        .navbar-futuristic .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: var(--gradient-primary);
          transition: left 0.3s ease;
          z-index: -1;
        }
        
        .navbar-futuristic .nav-link:hover {
          color: #ffffff !important;
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 30px rgba(15, 142, 70, 0.4);
        }
        
        .navbar-futuristic .nav-link:hover::before {
          left: 0;
        }
        
        /* Contact Button */
        .navbar-futuristic .btn-contact {
        max-width:300px;

        margin:0 !important;
          background: var(--gradient-primary);
          color: #ffffff;
          font-weight: 700;
          padding: 0.8rem 2rem;
          border-radius: 30px;
          border: none;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          font-family: 'Almarai', sans-serif;
          text-decoration: none;
          display: inline-block;
          white-space: nowrap;
          box-shadow: 0 8px 25px rgba(15, 142, 70, 0.3);
        }
        
        .navbar-futuristic .btn-contact:hover {
          color: #ffffff;
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 15px 40px rgba(15, 142, 70, 0.5);
          filter: brightness(1.2);
        }
        
        /* Enhanced Responsive Navbar */
        .navbar-futuristic .container { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
        .navbar-futuristic .navbar-collapse { flex-grow: 1; justify-content: flex-end; }
        .navbar-futuristic .navbar-nav { margin-left: auto; gap: 0.5rem; }
        .navbar-futuristic .btn-contact { white-space: nowrap; }
        
        @media (max-width: 991.98px) {
        
          .navbar-futuristic .navbar-collapse { 
            margin-top: 1rem;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          .navbar-futuristic .navbar-collapse:not(.show) {
            display: none;
          }
          .navbar-futuristic .navbar-nav { 
            flex-direction: column; 
            gap: 0.25rem; 
            width: 100%; 
            margin-bottom: 1rem;
          }
          .navbar-futuristic .nav-item { 
            width: 100%; 
            text-align: center; 
          }
          .navbar-futuristic .btn-contact { 
            margin-top: 1rem; 
            width: 100%; 
            text-align: center; 
          }
        }
        
        @media (min-width: 992px) {
          .navbar-futuristic .navbar-nav { flex-direction: row; }
          .navbar-futuristic .nav-item { margin: 0 0.25rem; }
        }
        
        /* Contact and Testimonials Icons */
        #contact .bi::before { color: white; }
        .testimonials-swiper .bi::before { color: var(--primary-gold-star) !important; }
        .hero-3d { height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; perspective: 1000px; }
        .hero-swiper { width: 100%; height: 100%; }
        .hero-swiper .swiper-slide { position: relative; display: flex; align-items: center; justify-content: center; background: linear-gradient(45deg, #ffffff, #f8f9fa, #e9ecef); }
        .hero-swiper .hero-image { position: absolute; inset: 0; width: 100vw !important; height: 100vh !important; object-fit: fill; filter: brightness(0.7) contrast(1.1); transition: transform 8s ease; }
        .hero-swiper .swiper-slide-active .hero-image { transform: scale(1.05); }
        .hero-swiper .swiper-slide::before { content: ''; position: absolute; inset: 0; background: linear-gradient(45deg, rgba(255,255,255,0.85), rgba(237,208,15,0.1)); z-index: 1; }
        .hero-caption-3d { position: relative; z-index: 10; text-align: center; max-width: 900px; margin: 0 2rem; transform-style: preserve-3d; }
        .hero-caption-3d .hero-bg { position: absolute; inset: -2rem; background: rgba(255, 255, 255, 0.95); border-radius: 30px; border: 2px solid rgba(237, 208, 15, 0.5); box-shadow: 0 25px 50px rgba(0,0,0,0.15); }
        .hero-caption-3d h1 { position: relative; font-size: 4rem; font-weight: 900; font-family: 'Changa', sans-serif; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1.5rem; }
        .hero-caption-3d p { position: relative; color: #1a4d2e; font-size: 1.4rem; font-family: 'Almarai', sans-serif; text-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .hero-swiper .swiper-pagination-bullet { width: 15px; height: 15px; background: transparent; border: 2px solid var(--primary-gold); opacity: 1; margin: 0 8px; transition: all 0.4s ease; }
        .hero-swiper .swiper-pagination-bullet-active { background: var(--primary-gold); transform: scale(1.3); box-shadow: 0 0 20px var(--primary-gold); }
        .hero-nav-button { position: absolute; top: 50%; transform: translateY(-50%); width: 60px; height: 60px; border-radius: 50%; background: rgba(237,208,15,0.1); backdrop-filter: blur(10px); border: 2px solid var(--primary-gold); display: flex; align-items: center; justify-content: center; color: var(--primary-gold); z-index: 10; transition: all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55); cursor: pointer; }
        .hero-nav-button:hover { background: var(--primary-gold); color: #000; transform: translateY(-50%) scale(1.2); box-shadow: 0 10px 30px rgba(237,208,15,0.5); }
        .hero-button-prev { left: 30px; } .hero-button-next { right: 30px; }
        .section-modern { padding: 120px 0; position: relative; background: rgba(255,255,255,0.9); border: 1px solid rgba(237,208,15,0.2); box-shadow: 0 20px 60px rgba(0,0,0,0.1); overflow: hidden; }
        .section-modern::before { content: ''; position: absolute; top: 0; left: -50%; width: 200%; height: 2px; background: var(--gradient-primary); animation: shimmer 3s infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%);} 100% { transform: translateX(100%);} }
        .section-title-3d { text-align: center; font-weight: 900; font-size: 3.5rem; font-family: 'Changa', sans-serif; margin-bottom: 80px; position: relative; transform-style: preserve-3d; }
        .section-title-3d .title-main { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; position: relative; display: inline-block; margin-bottom: 0; }
        .section-title-3d .title-shadow { position: absolute; top: 3px; left: 3px; color: rgba(0,0,0,0.3); z-index: -1; }
        .section-title-3d::after { content: ''; position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 120px; height: 6px; background: var(--gradient-primary); border-radius: 3px; box-shadow: 0 0 20px var(--primary-gold); }
        #about .about-content { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border-radius: 25px; padding: 3rem; border: 2px solid rgba(15, 237, 15, 0.3); box-shadow: 0 15px 35px rgba(0,0,0,0.1); max-width: 900px; margin: 0 auto; position: relative; overflow: hidden; }
        #about .about-content::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(transparent, rgba(237, 208, 15, 0.05), transparent); animation: rotate 10s linear infinite; }
        @keyframes rotate { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
        #about .about-content p { position: relative; font-size: 1.3rem; color: #1a4d2e; font-family: 'Almarai', sans-serif; text-align: center; line-height: 2; z-index: 1; }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; margin-top: 50px; }
        .service-card-3d { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-radius: 25px; padding: 2.5rem; border: 2px solid rgba(33, 237, 15, 0.3); text-align: center; transition: all 0.6s cubic-bezier(0.175,0.885,0.32,1.275); position: relative; overflow: hidden; transform-style: preserve-3d; }
        .service-card-3d::before { content: ''; position: absolute; inset: 0; background: var(--gradient-primary); opacity: 0; transition: opacity 0.6s ease; }
        .service-card-3d:hover { transform: translateY(-20px) rotateX(10deg) rotateY(5deg); box-shadow: 0 30px 60px rgba(71, 194, 34, 0.3); }
        .service-card-3d:hover::before { opacity: 0.1; }
        .service-card-3d img { height: 120px;margin:auto; border-radius: 12px; margin-bottom: 1.5rem; transition: transform 0.6s ease; filter: brightness(1.2); }
        .service-card-3d:hover img { transform: scale(1.2) rotateY(360deg); }
        .service-card-3d h5 { color: #1a4d2e; font-weight: 800; font-size: 1.5rem; font-family: 'Changa', sans-serif; margin-bottom: 1rem; position: relative; }
        .service-card-3d p { color: #555; font-size: 1.1rem; font-family: 'Almarai', sans-serif; position: relative; }
        .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 50px; }
        .why-item { background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border-radius: 20px; padding: 2rem; border: 2px solid rgba(78,237,15,0.3); text-align: center; transition: all 0.3s ease-in-out; position: relative; overflow: hidden; }
        .why-item::before { content: attr(data-icon); position: absolute; top: -20px; right: -20px; font-size: 4rem; opacity: 0.1; transform: rotate(15deg); }
        .why-item:hover { transform: translateY(-15px) scale(1.05); box-shadow: 0 25px 50px rgba(15, 237, 15, 0.2); background: rgba(15, 237, 89, 0.1); }
        .why-icon { font-size: 3rem; margin-bottom: 1rem; display: block; }
        .why-item p { color: #1a4d2e; font-size: 1.1rem; font-family: 'Almarai', sans-serif; margin: 0; position: relative; }
        .testimonials-swiper { 
          padding: 0px 10px; 
          overflow: visible; 
        }
        .testimonials-swiper .swiper-wrapper {
          align-items: stretch;
        }
        .testimonials-swiper .swiper-slide {
          height: auto;
          display: flex;
          align-items: stretch;
        }
        .testimonial-card-modern { 
          background: rgba(255,255,255,0.9); 
          backdrop-filter: blur(10px); 
          border-radius: 25px; 
          padding: 2rem; 
          max-width: 350px;
          width: 100%;
          margin: 0 auto;
          border: 2px solid rgba(91,197,4,0.3); 
          text-align: center; 
          transition: all 0.6s cubic-bezier(0.175,0.885,0.32,1.275); 
          height: fit-content;
          
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative; 
          overflow: hidden; 
        }
        .testimonial-card-modern::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(transparent, rgba(237,208,15,0.05), transparent); animation: rotate 8s linear infinite; opacity: 0; transition: opacity 0.6s ease; }
        .testimonial-card-modern:hover::before { opacity: 1; }
        .testimonial-card-modern:hover { transform: translateY(-20px); box-shadow: 0 10px 30px rgba(36,207,13,0.3); }
        .testimonial-image-modern { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid var(--primary-gold); margin: 0 auto 1.5rem; display: block; transition: all 0.6s ease; position: relative; z-index: 1; }
        .testimonial-card-modern:hover .testimonial-image-modern { transform: scale(1.1); box-shadow: 0 0 30px var(--primary-gold); }
        .testimonial-text-modern { 
          font-size: 1rem; 
          color: #1a4d2e; 
          font-family: 'Almarai', sans-serif; 
          margin-bottom: 1.5rem; 
          font-style: italic; 
          position: relative; 
          z-index: 1; 
          line-height: 1.6;
          flex-grow: 1;
          display: flex;
          align-items: center;
        }
        .testimonial-author-modern { 
          font-size: 1.1rem; 
          color: var(--primary-gold); 
          font-weight: 800; 
          font-family: 'Changa', sans-serif; 
          margin-bottom: 0.5rem; 
          position: relative; 
          z-index: 1; 
        }
        .testimonial-position-modern { 
          font-size: 0.9rem; 
          color: rgba(7, 7, 7, 0.7); 
          font-family: 'Almarai', sans-serif; 
          position: relative; 
          z-index: 1; 
          margin-bottom: 1rem;
        }
        .testimonial-rating-modern i { 
          color: var(--primary-gold); 
          font-size: 1.1rem; 
          margin: 0.3rem 0.1rem 0; 
        }
        .contact-grid-modern { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; margin-top: 50px; }
        .contact-item-modern { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-radius: 20px; padding: 2rem; border: 2px solid rgba(115,237,15,0.3); display: flex; align-items: center; gap: 1.5rem; transition: all 0.5s cubic-bezier(0.68,-0.55,0.265,1.55); position: relative; overflow: hidden; }
        .contact-item-modern::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(96,237,15,0.1), transparent); transition: left 0.6s ease; }
        .contact-item-modern:hover { transform: translateX(10px); box-shadow: 0 15px 40px rgba(41,237,15,0.2); }
        .contact-item-modern:hover::before { left: 100%; }
        .contact-icon-wrapper-modern { width: 70px; height: 70px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.6s ease; box-shadow: 0 0 20px rgba(237,208,15,0.3); }
        .contact-item-modern:hover .contact-icon-wrapper-modern { transform: rotate(360deg) scale(1.1); }
        .contact-icon-wrapper-modern i { color: #ffffff; font-size: 2rem; }
        .contact-details-modern h4 { color: #1a4d2e; font-size: 1.3rem; font-family: 'Changa', sans-serif; margin-bottom: 0.5rem; }
        .contact-details-modern p, .contact-details-modern span { color: #666; font-size: 1rem; font-family: 'Almarai', sans-serif; margin: 0 !important; }
        .footer-modern { background: var(--gradient-primary); border-top: 3px solid #1a4d2e; color: white; padding: 30px 0; margin: 0; text-align: center; position: relative; overflow: hidden; }
        .footer-modern::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="%231a4d2e" opacity="0.1"/></svg>'); animation: twinkle 4s infinite; }
        @keyframes twinkle { 0%,100% { opacity: 0.3;} 50% { opacity: 0.8;} }
        .footer-modern p { font-size: 1.3rem; font-family: 'Almarai', sans-serif; position: relative; z-index: 1; margin: 0; font-weight: 600; }
        .fade-in-up { opacity: 0; transform: translateY(50px); transition: all 0.8s cubic-bezier(0.25,0.46,0.45,0.94); }
        .fade-in-up.visible { opacity: 1; transform: translateY(0); }
        @media (max-width: 992px) { .hero-caption-3d h1 { font-size: 2.8rem; } .section-title-3d { font-size: 2.8rem; } .services-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); } }
        @media (max-width: 768px) { 
          .hero-caption-3d h1 { font-size: 2.2rem; } 
          .hero-caption-3d p { font-size: 1.1rem; } 
          .section-modern {  padding: 80px 0; } 
          .section-title-3d { font-size: 2.4rem; } 
          .navbar-futuristic .navbar-brand { font-size: 1.8rem; } 
          body { padding-top: 70px; }
          .navbar-futuristic .nav-link { margin: 0.25rem 0; padding: 0.6rem 1rem; }
          .navbar-futuristic .container { padding: 0.5rem 1rem; }
        }
        @media (max-width: 576px) { .hero-caption-3d { margin: 0 1rem; } .hero-caption-3d .hero-bg { inset: -1rem; } .contact-item-modern { flex-direction: column; text-align: center; } .services-grid,.why-grid,.contact-grid-modern { grid-template-columns: 1fr; gap: 20px; } }
        /* Responsive Design for Testimonials */
        @media (max-width: 768px) {
          .testimonial-card-modern {
            max-width: 280px;
            padding: 1.5rem;
            min-height: 350px;
          }
          .testimonial-text-modern {
            font-size: 0.9rem;
          }
          .testimonial-author-modern {
            font-size: 1rem;
          }
          .testimonial-position-modern {
            font-size: 0.8rem;
          }
        }
          .navbar-brand{
          margin:0 !important;
          }
          .collapse{
          visibility: visible !important;
          }
        

          @media (max-width: 768px) {
           
          
          #about .about-content {
            padding: 15px !important;
           
          }
            #about .about-content p {
              font-size: 16px !important;
            }
         
              .swiper-slide img {
              width:80px !important;
              min-height:80px !important; 
              }
          }
              .swiper-slide img {
              width:100px !important;
              height:100px !important; 
              }
              .swiper-pagination {
              display:none;
              }

              .nav-gli .container{
              justify-content:center ;
              }
  @media (max-width: 991px) {
   .title-shadow{
              display: none !important;
              }
           .nav-gli .container{
              justify-content:space-between ;
              }
          }
              `}</style>
    </div>
  );
};

export default Landing; 

