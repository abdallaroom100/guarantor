import React, { useEffect, useState } from 'react';

const Landing: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    // Load modern fonts and dependencies
    const loadDependencies = () => {
      // Google Fonts - Modern Arabic & English fonts
      const fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cairo:wght@300;400;500;600;700;800;900&display=swap";
      document.head.appendChild(fontLink);
      
      // Bootstrap Icons
      const iconLink = document.createElement("link");
      iconLink.rel = "stylesheet";
      iconLink.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css";
      document.head.appendChild(iconLink);
      
      // Swiper CSS
      const swiperCSS = document.createElement("link");
      swiperCSS.rel = "stylesheet";
      swiperCSS.href = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
      document.head.appendChild(swiperCSS);
      
      // Swiper JS
      const swiperJS = document.createElement("script");
      swiperJS.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
      document.head.appendChild(swiperJS);
    };
    
    loadDependencies();
    
    // Modern interactions
    const initModernFeatures = () => {
      // Smooth scroll for navigation
      const navLinks = document.querySelectorAll('a[href^="#"]');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('href') || '');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
      
      // Navbar scroll effect
      const navbar = document.querySelector('.modern-navbar');
      const onScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', onScroll);
      
      // Intersection Observer for animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
      
      // Observe all animated elements
      document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach((el, index) => {
        const delay = el.getAttribute('data-delay');
        if (delay) {
          (el as HTMLElement).style.transitionDelay = `${parseInt(delay)}ms`;
        }
        observer.observe(el);
      });
      
      // Initialize slider
      const initSlider = () => {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        
        const updateSlider = (index: number) => {
          slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            const bg = slide.getAttribute('data-bg');
            if (bg) {
              const slideElement = slide as HTMLElement;
              slideElement.style.backgroundImage = bg;
              slideElement.style.backgroundSize = 'cover';
              slideElement.style.backgroundPosition = 'center';
              slideElement.style.backgroundRepeat = 'no-repeat';
            }
            
            if (i === index) {
              slide.classList.add('active');
            } else if (i === (index - 1 + slides.length) % slides.length) {
              slide.classList.add('prev');
            }
          });
          
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
          });
        };
        
        let autoplayInterval: number;
        
        const startAutoplay = () => {
          clearInterval(autoplayInterval);
          autoplayInterval = setInterval(nextSlide, 3500);
        };
        
        const nextSlide = () => {
          currentSlide = (currentSlide + 1) % slides.length;
          updateSlider(currentSlide);
        };
        
        const prevSlide = () => {
          currentSlide = (currentSlide - 1 + slides.length) % slides.length;
          updateSlider(currentSlide);
        };
        
        nextBtn?.addEventListener('click', () => {
          nextSlide();
          startAutoplay(); // Reset timer
        });
        
        prevBtn?.addEventListener('click', () => {
          prevSlide();
          startAutoplay(); // Reset timer
        });
        
        dots.forEach((dot, index) => {
          dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider(currentSlide);
            startAutoplay(); // Reset timer
          });
        });
        
        // Start auto-play slider
        startAutoplay();
        
        // Initialize first slide
        updateSlider(0);
      };
      
      // Initialize Swiper for testimonials
      const initSwiperTestimonials = () => {
        // Wait for Swiper to load
        const checkSwiper = () => {
          if (typeof (window as any).Swiper !== 'undefined') {
            new (window as any).Swiper('.testimonials-swiper', {
              slidesPerView: 1,
              spaceBetween: 30,
              loop: true,
              autoplay: {
                delay: 6000,
                disableOnInteraction: false,
              },
              pagination: {
                el: '.swiper-pagination',
                clickable: true,
              },
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
              breakpoints: {
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1200: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                }
              },
              effect: 'slide',
              speed: 800,
              grabCursor: true,
            });
          } else {
            setTimeout(checkSwiper, 100);
          }
        };
        checkSwiper();
      };
      
      setTimeout(initSlider, 100);
      setTimeout(initSwiperTestimonials, 1000);
    };
    
    setTimeout(initModernFeatures, 500);
  }, []);

  return (
    <div className="modern-landing">
      {/* Modern Navigation */}
      <nav className="modern-navbar">
        <div className="nav-container">
          <div className="nav-brand">
            {/* <span className="brand-icon">⚡</span> */}
            <span className="brand-text">حقيبة الإنجاز</span>
          </div>
          
          <div className="nav-menu">
            <a href="#home" className="nav-link">الرئيسية</a>
            <a href="#about" className="nav-link">من نحن</a>
            <a href="#services" className="nav-link">خدماتنا</a>
            <a href="#testimonials" className="nav-link">آراء العملاء</a>
            <a href="https://api.whatsapp.com/send/?phone=%2B966546505469&type=phone_number&app_absent=0" 
               target="_blank" className="nav-cta">
              <i className="bi bi-whatsapp"></i>
              تواصل معنا
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-header">
            <div className="mobile-brand">
              <span className="brand-icon">⚡</span>
              <span className="brand-text">حقيبة الإنجاز</span>
            </div>
            <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          
          <div className="mobile-menu-content" style={{background:"white"}}>
            <a href="#home" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <i className="bi bi-house"></i>
              <span>الرئيسية</span>
            </a>
            <a href="#about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <i className="bi bi-info-circle"></i>
              <span>من نحن</span>
            </a>
            <a href="#services" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <i className="bi bi-gear"></i>
              <span>خدماتنا</span>
            </a>
            <a href="#testimonials" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <i className="bi bi-chat-quote"></i>
              <span>آراء العملاء</span>
            </a>
            
            <div className="mobile-menu-divider"></div>
            
            <a href="https://api.whatsapp.com/send/?phone=%2B966546505469&type=phone_number&app_absent=0" 
               target="_blank" className="mobile-cta-btn" onClick={() => setMobileMenuOpen(false)}>
              <span>تواصل معنا عبر واتساب</span>
              <i className="bi bi-whatsapp" style={{scale:"1.3",transform:"translateY(2px)"}}></i>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Slider */}
      <section id="home" className="hero-section">
        <div className="hero-slider">
          <div className="slider-container">
            <div className="slide active" data-bg="url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80')">
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <div className="slide-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h2>خدمات تعقيب معتمدة</h2>
                <p>نقدم خدمات تعقيب احترافية على جميع المعاملات الحكومية</p>
              </div>
            </div>
            <div className="slide" data-bg="url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80')">
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <div className="slide-icon">
                  <i className="bi bi-clock-history"></i>
                </div>
                <h2>سرعة في الإنجاز</h2>
                <p>إنجاز المعاملات في أسرع وقت ممكن مع ضمان الجودة</p>
              </div>
            </div>
            <div className="slide" data-bg="url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80')">
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <div className="slide-icon">
                  <i className="bi bi-people"></i>
                </div>
                <h2>فريق متخصص</h2>
                <p>فريق من الخبراء المتخصصين في جميع أنواع المعاملات</p>
              </div>
            </div>
            <div className="slide" data-bg="url('https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80')">
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <div className="slide-icon">
                  <i className="bi bi-headset"></i>
                </div>
                <h2>دعم مستمر</h2>
                <p>خدمة عملاء متاحة 24/7 لمساعدتك في جميع استفساراتك</p>
              </div>
            </div>
          </div>
          
          <div className="slider-navigation">
            <button className="nav-btn prev-btn">
              <i className="bi bi-chevron-right"></i>
            </button>
            <button className="nav-btn next-btn">
              <i className="bi bi-chevron-left"></i>
            </button>
          </div>
          
          <div className="slider-dots">
            <span className="dot active" data-slide="0"></span>
            <span className="dot" data-slide="1"></span>
            <span className="dot" data-slide="2"></span>
            <span className="dot" data-slide="3"></span>
          </div>
        </div>
        
        {/* <div className="hero-content-overlay">
          <div className="hero-text fade-up">
            <h1 className="hero-title">
              خدمات تعقيب <span className="highlight">معتمدة ومضمونة</span>
            </h1>
            <p className="hero-subtitle">
              نقدم خدمات تعقيب احترافية على جميع المعاملات الحكومية بأحدث التقنيات وأعلى معايير الجودة
            </p>
            <div className="hero-buttons">
              <a href="#services" className="btn-primary">
                <i className="bi bi-arrow-down-circle"></i>
                اكتشف خدماتنا
              </a>
              <a href="https://api.whatsapp.com/send/?phone=%2B966546505469&type=phone_number&app_absent=0" 
                 target="_blank" className="btn-secondary">
                <i className="bi bi-whatsapp"></i>
                تواصل فوري
              </a>
            </div>
          </div>
        </div> */}
        {/* <div className="hero-stats">
          <div className="stat-item fade-up">
            <div className="stat-number">500+</div>
            <div className="stat-label">عميل راضي</div>
          </div>
          <div className="stat-item fade-up">
            <div className="stat-number">24/7</div>
            <div className="stat-label">دعم مستمر</div>
          </div>
          <div className="stat-item fade-up">
            <div className="stat-number">99%</div>
            <div className="stat-label">نسبة نجاح</div>
          </div>
        </div> */}
      </section>

      {/* About Section */}
      <section id="about" className="about-section" style={{overflow:"hidden"}}>
        <div className="container">
          <div className="section-header fade-up">
            <h2 className="section-title">من نحن</h2>
            <p className="section-subtitle">فريق متخصص في خدمات التعقيب الحكومي</p>
          </div>
          <div className="about-content">
            <div className="about-text fade-left">
              <div className="about-card">
                <div className="card-icon">
                  <i className="bi bi-award"></i>
                </div>
                <h3>خبرة واحترافية</h3>
                <p>نحن فريق متخصص في تقديم خدمات التعقيب على المعاملات الحكومية والتجارية بخبرة واسعة واحترافية عالية</p>
              </div>
            </div>
            <div className="about-text fade-right">
              <div className="about-card">
                <div className="card-icon">
                  <i className="bi bi-lightning"></i>
                </div>
                <h3>سرعة ودقة</h3>
                <p>نسعى لتوفير الوقت والجهد على عملائنا من خلال إنجاز المعاملات بدقة وسرعة باستخدام أحدث التقنيات</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header fade-up">
            <h2 className="section-title">خدماتنا المتميزة</h2>
            <p className="section-subtitle">نقدم مجموعة شاملة من خدمات التعقيب الحكومي</p>
          </div>
          <div className="services-grid">
            <div className="service-card fade-up">
              <div className="service-icon">
                <img src="/yousef/ابشر.png" alt="أبشر" />
              </div>
              <h3>خدمة أبشر</h3>
              <p>خدمات التفعيل، التفاويض، البلاغات، وكل ما يتعلق بمنصة أبشر الحكومية بأحدث الطرق الآمنة</p>
              <div className="service-features">
                <span className="feature">تفعيل الحسابات</span>
                <span className="feature">إدارة التفاويض</span>
                <span className="feature">معالجة البلاغات</span>
              </div>
            </div>
            
            <div className="service-card fade-up">
              <div className="service-icon">
                <img src="/yousef/بلدي.jpg" alt="بلدي" />
              </div>
              <h3>خدمة بلدي</h3>
              <p>إصدار وتجديد الرخص، خدمات الأنشطة التجارية عبر منصة بلدي الرسمية بسرعة واحترافية</p>
              <div className="service-features">
                <span className="feature">إصدار الرخص</span>
                <span className="feature">تجديد التراخيص</span>
                <span className="feature">الأنشطة التجارية</span>
              </div>
            </div>
            
            <div className="service-card fade-up">
              <div className="service-icon">
                <i className="bi bi-briefcase"></i>
              </div>
              <h3>طاقات</h3>
              <p>تسجيل الباحثين عن عمل، إدارة ملف المنشأة، وتحديث البيانات الرسمية بدقة عالية</p>
              <div className="service-features">
                <span className="feature">تسجيل الباحثين</span>
                <span className="feature">إدارة المنشآت</span>
                <span className="feature">تحديث البيانات</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="luxury-why-section">
        <div className="luxury-bg-pattern"></div>
        <div className="container">
          <div className="luxury-section-header">
            {/* <div className="luxury-badge">
              <span className="luxury-badge-icon">✨</span>
              <span className="luxury-badge-text">التميز والجودة</span>
            </div> */}
            <h2 className="luxury-title">
              <span className="luxury-title-main">لماذا نحن</span>
              <span className="luxury-title-accent">الخيار الأمثل؟</span>
            </h2>
            {/* <div className="luxury-title-decoration">
              <div className="luxury-line"></div>
              <div className="luxury-diamond">💎</div>
              <div className="luxury-line"></div>
            </div> */}
            <p className="luxury-subtitle">نقدم خدمات استثنائية بمعايير عالمية</p>
          </div>
          
          <div className="luxury-features-container">
            <div className="luxury-feature-card" data-tilt>
              <div className="luxury-card-glow"></div>
              <div className="luxury-card-content">
                <div className="luxury-icon-wrapper">
                  <div className="luxury-icon-bg"></div>
                  <i className="bi bi-gem luxury-icon"></i>
                  <div className="luxury-icon-particles">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <h3 className="luxury-feature-title">جودة استثنائية</h3>
                <p className="luxury-feature-desc">معايير عالمية في تقديم الخدمات مع ضمان الجودة والتميز</p>
                <div className="luxury-card-number">01</div>
              </div>
            </div>

            <div className="luxury-feature-card" data-tilt>
              <div className="luxury-card-glow"></div>
              <div className="luxury-card-content">
                <div className="luxury-icon-wrapper">
                  <div className="luxury-icon-bg"></div>
                  <i className="bi bi-lightning-charge-fill luxury-icon"></i>
                  <div className="luxury-icon-particles">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <h3 className="luxury-feature-title">سرعة فائقة</h3>
                <p className="luxury-feature-desc">إنجاز المعاملات في وقت قياسي مع الحفاظ على أعلى معايير الدقة</p>
                <div className="luxury-card-number">02</div>
              </div>
            </div>

            <div className="luxury-feature-card" data-tilt>
              <div className="luxury-card-glow"></div>
              <div className="luxury-card-content">
                <div className="luxury-icon-wrapper">
                  <div className="luxury-icon-bg"></div>
                  <i className="bi bi-award-fill luxury-icon"></i>
                  <div className="luxury-icon-particles">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <h3 className="luxury-feature-title">خبرة متميزة</h3>
                <p className="luxury-feature-desc">سنوات من الخبرة والتخصص في مجال التعقيب والخدمات الحكومية</p>
                <div className="luxury-card-number">03</div>
              </div>
            </div>

            <div className="luxury-feature-card" data-tilt>
              <div className="luxury-card-glow"></div>
              <div className="luxury-card-content">
                <div className="luxury-icon-wrapper">
                  <div className="luxury-icon-bg"></div>
                  <i className="bi bi-people-fill luxury-icon"></i>
                  <div className="luxury-icon-particles">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <h3 className="luxury-feature-title">فريق محترف</h3>
                <p className="luxury-feature-desc">فريق متخصص ومدرب على أحدث الأساليب والتقنيات المتطورة</p>
                <div className="luxury-card-number">04</div>
              </div>
            </div>

            <div className="luxury-feature-card" data-tilt>
              <div className="luxury-card-glow"></div>
              <div className="luxury-card-content">
                <div className="luxury-icon-wrapper">
                  <div className="luxury-icon-bg"></div>
                  <i className="bi bi-shield-check luxury-icon"></i>
                  <div className="luxury-icon-particles">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <h3 className="luxury-feature-title">أمان وثقة</h3>
                <p className="luxury-feature-desc">حماية كاملة لبياناتكم مع ضمان السرية والمصداقية التامة</p>
                <div className="luxury-card-number">05</div>
              </div>
            </div>

            <div className="luxury-feature-card" data-tilt>
              <div className="luxury-card-glow"></div>
              <div className="luxury-card-content">
                <div className="luxury-icon-wrapper">
                  <div className="luxury-icon-bg"></div>
                  <i className="bi bi-headset luxury-icon"></i>
                  <div className="luxury-icon-particles">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <h3 className="luxury-feature-title">دعم مستمر</h3>
                <p className="luxury-feature-desc">خدمة عملاء متاحة على مدار الساعة لضمان راحتكم ورضاكم</p>
                <div className="luxury-card-number">06</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header fade-up">
            <h2 className="section-title">آراء عملائنا</h2>
            <p className="section-subtitle">ما يقوله عملاؤنا عن خدماتنا</p>
          </div>
          
          <div className="swiper testimonials-swiper">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="testimonial-card">
                  <div className="quote-icon">
                    <i className="bi bi-quote"></i>
                  </div>
                  <div className="testimonial-content">
                    <p className="testimonial-text">
                      "خدمة ممتازة وموثوقة. تم حل مشكلتي بسرعة وكفاءة عالية. أنصح بالتعامل معهم."
                    </p>
                    <div className="testimonial-footer">
                      <div className="author-info">
                        <div className="author-details">
                          <h4>أحمد محمد</h4>
                          <span>عميل راضي</span>
                        </div>
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="swiper-slide">
                <div className="testimonial-card">
                  <div className="quote-icon">
                    <i className="bi bi-quote"></i>
                  </div>
                  <div className="testimonial-content">
                    <p className="testimonial-text">"فريق محترف ومتخصص. ساعدوني في إنجاز جميع معاملاتي بسهولة تامة ودون أي تعقيدات"</p>
                    <div className="testimonial-footer">
                      <div className="author-info">
                        <div className="author-details">
                          <h4>سارة أحمد</h4>
                          <span>مستثمرة</span>
                        </div>
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="swiper-slide">
                <div className="testimonial-card">
                  <div className="quote-icon">
                    <i className="bi bi-quote"></i>
                  </div>
                  <div className="testimonial-content">
                    <p className="testimonial-text">"أسعار معقولة وخدمة عملاء ممتازة. أوصي بالتعامل معهم بكل ثقة لجودة خدماتهم"</p>
                    <div className="testimonial-footer">
                      <div className="author-info">
                        <div className="author-details">
                          <h4>محمد علي</h4>
                          <span>رجل أعمال</span>
                        </div>
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="testimonial-card">
                  <div className="quote-icon">
                    <i className="bi bi-quote"></i>
                  </div>
                  <div className="testimonial-content">
                    <p className="testimonial-text">"خدمة استثنائية وفريق عمل رائع. تم إنجاز جميع معاملاتي في وقت قياسي وبجودة عالية"</p>
                    <div className="testimonial-footer">
                      <div className="author-info">
                        <div className="author-details">
                          <h4>فاطمة الزهراني</h4>
                          <span>صاحبة مشروع</span>
                        </div>
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="testimonial-card">
                  <div className="quote-icon">
                    <i className="bi bi-quote"></i>
                  </div>
                  <div className="testimonial-content">
                    <p className="testimonial-text">"تعامل راقي ومهني. ساعدوني في حل جميع مشاكل معاملاتي الحكومية بكل سهولة"</p>
                    <div className="testimonial-footer">
                      <div className="author-info">
                        <div className="author-details">
                          <h4>خالد العتيبي</h4>
                          <span>مهندس</span>
                        </div>
                        <div className="rating">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
            
            {/* Pagination */}
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header fade-up">
            <h2 className="section-title">تواصل معنا</h2>
            <p className="section-subtitle">نحن هنا لخدمتك على مدار الساعة</p>
          </div>
          <div className="contact-grid">
            <div className="contact-card fade-up">
              <div className="contact-icon">
                <i className="bi bi-telephone"></i>
              </div>
              <h3>اتصل بنا</h3>
              <p>0546505469</p>
              <span>متاح 24/7</span>
            </div>
            
            <div className="contact-card fade-up">
              <div className="contact-icon">
                <i className="bi bi-envelope"></i>
              </div>
              <h3>البريد الإلكتروني</h3>
              <p>a0560864269@gmail.com</p>
              <span>رد خلال 24 ساعة</span>
            </div>
            
            <div className="contact-card fade-up">
              <div className="contact-icon">
                <i className="bi bi-geo-alt"></i>
              </div>
              <h3>العنوان</h3>
              <p>جده، حي الحرازت</p>
              <span>مكتب رئيسي</span>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="luxury-footer">
        <div className="footer-bg-pattern"></div>
        <div className="container">
          <div className="luxury-footer-content">
            {/* Footer Top Section */}
            <div className="footer-top">
              <div className="footer-brand-section">
                <div className="luxury-footer-brand">
                  <div className="footer-brand-icon">
                    <i className="bi bi-briefcase-fill"></i>
                  </div>
                  <div className="footer-brand-text">
                    <h3>حقيبة الإنجاز</h3>
                    <p>شريكك الموثوق في النجاح</p>
                  </div>
                </div>
                <p className="footer-description">
                  نقدم خدمات التعقيب والاستشارات الحكومية بأعلى معايير الجودة والمهنية، 
                  مع فريق متخصص يضمن إنجاز معاملاتكم بسرعة وكفاءة.
                </p>
                <div className="footer-social">
                  <a href="https://api.whatsapp.com/send/?phone=%2B966546505469" className="social-link whatsapp">
                    <i className="bi bi-whatsapp"></i>
                  </a>
                  <a href="tel:0546505469" className="social-link phone">
                    <i className="bi bi-telephone-fill"></i>
                  </a>
                  <a href="mailto:a0560864269@gmail.com" className="social-link email">
                    <i className="bi bi-envelope-fill"></i>
                  </a>
                  <a href="#" className="social-link twitter">
                    <i className="bi bi-twitter"></i>
                  </a>
                </div>
              </div>

              <div className="footer-links-section">
                <div className="footer-column">
                  <h4 className="footer-column-title">خدماتنا</h4>
                  <ul className="footer-links">
                    <li><a href="#services">تأسيس الشركات</a></li>
                    <li><a href="#services">التراخيص التجارية</a></li>
                    <li><a href="#services">المعاملات الحكومية</a></li>
                    <li><a href="#services">الاستشارات القانونية</a></li>
                    <li><a href="#services">تجديد الوثائق</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4 className="footer-column-title">روابط سريعة</h4>
                  <ul className="footer-links">
                    <li><a href="#home">الرئيسية</a></li>
                    <li><a href="#about">من نحن</a></li>
                    <li><a href="#services">خدماتنا</a></li>
                    <li><a href="#testimonials">آراء العملاء</a></li>
                    <li><a href="#contact">تواصل معنا</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4 className="footer-column-title">معلومات التواصل</h4>
                  <div className="footer-contact-info">
                    <div className="footer-contact-item">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>جدة، حي الحرازات</span>
                    </div>
                    <div className="footer-contact-item">
                      <i className="bi bi-telephone-fill"></i>
                      <span>0546505469</span>
                    </div>
                    <div className="footer-contact-item">
                      <i className="bi bi-envelope-fill"></i>
                      <span>a0560864269@gmail.com</span>
                    </div>
                    <div className="footer-contact-item">
                      <i className="bi bi-clock-fill"></i>
                      <span>متاح 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
              {/* <div className="footer-divider"></div> */}
              <div className="footer-bottom-content">
                <p className="footer-copyright">
                  جميع الحقوق محفوظة © 2025 حقيبة الإنجاز  
                </p>
                <div className="footer-badges">
                  <span className="footer-badge">
                    <i className="bi bi-shield-check"></i>
                    موثوق
                  </span>
                  <span className="footer-badge">
                    <i className="bi bi-award"></i>
                    معتمد
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern CSS Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Cairo', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #2d3748;
          overflow-x: hidden;
        }

        .modern-landing {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Modern Navigation */
        .modern-navbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .modern-navbar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 80px;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 800;
          color: #4c51bf;
        }

        .brand-icon {
          font-size: 2rem;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .nav-link {
          text-decoration: none;
          color: #4a5568;
          font-weight: 500;
          padding: 10px 20px;
          border-radius: 25px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          color: #4c51bf;
          background: rgba(76, 81, 191, 0.1);
          transform: translateY(-2px);
        }

        .nav-cta {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          color: white !important;
          padding: 12px 25px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        }

        .nav-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .hamburger-line {
          width: 20px;
          height: 2px;
          background: black;
          margin: 2px 0;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .hamburger-line.active:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger-line.active:nth-child(2) {
          opacity: 0;
        }

        .hamburger-line.active:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          z-index: 998;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 320px;
          height: 100vh;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 999;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
        }

        .mobile-menu.active {
          right: 0;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          border-bottom: 1px solid rgba(102, 126, 234, 0.1);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-brand .brand-icon {
          font-size: 1.5rem;
          color: white;
        }

        .mobile-brand .brand-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
        }

        .mobile-close-btn {
          width: 35px;
          height: 35px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .mobile-menu-content {
          padding: 30px 0;
          height: calc(100vh - 80px);
          overflow-y: auto;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 25px;
          color: #4a5568;
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
          margin-bottom: 5px;
        }

        .mobile-nav-link:hover {
          background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%);
          color: #667eea;
          border-left-color: #667eea;
          transform: translateX(5px);
        }

        .mobile-nav-link i {
          font-size: 1.1rem;
          width: 20px;
          text-align: center;
        }

        .mobile-menu-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.2) 50%, transparent 100%);
          margin: 20px 25px;
        }

        .mobile-cta-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width:250px;
          text-align:center;
          margin: 20px auto;
          padding: 15px 20px;
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        }

        .mobile-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
        }

        .mobile-cta-btn i {
          font-size: 1.2rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .mobile-menu {
            width: 280px;
          }
        }

        @media (max-width: 480px) {
          .mobile-menu {
            width: 100%;
            right: -100%;
          }
            .swiper{
            height:45vh !important;
            }

          .mobile-menu.active {
            right: 0;
          }
        }

        /* Hero Section */
        .hero-section {
              height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          background: linear-gradient(135deg,rgb(74, 75, 78) 0%,rgb(52, 50, 53) 100%);
          color: white;
          padding: 100px 20px 50px;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/yousef/HOME.webp') center/cover;
          opacity: 0.2;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .highlight {
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          margin-bottom: 40px;
          opacity: 0.9;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          padding: 15px 30px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          color: #2d3748;
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
        }
.swiper-button-prev {
 transform:translateX(5px)
}
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(255, 215, 0, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-3px);
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          margin-top: 60px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 900;
          color: #ffd700;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 1rem;
          opacity: 0.8;
        }

        /* Sections */
        .about-section, .services-section, .testimonials-section, .contact-section {
          padding: 50px 0;
          background: white;
        }

        .services-section {
          background: #f7fafc;
        }

        .contact-section {
          background: #edf2f7;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 15px;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #718096;
          max-width: 600px;
          margin: 0 auto;
        }

        /* About Section */
        .about-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 40px;
          margin-top: 40px;
        }

        .about-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .about-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 2rem;
        }

        .about-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 15px;
        }

        .about-card p {
          color: #718096;
          line-height: 1.6;
        }

        /* Services Section */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .service-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: #667eea;
        }

        .service-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 20px;
        }

        .service-icon img {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .service-icon i {
          font-size: 3rem;
          color: #667eea;
        }

        .service-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 15px;
        }

        .service-card p {
          color: #718096;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .service-features {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .feature {
          background: #667eea;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Why Choose Us Section */
        .why-choose-us-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          position: relative;
          overflow: hidden;
        }

        .why-choose-us-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23667eea" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23764ba2" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="%23667eea" opacity="0.05"/><circle cx="10" cy="90" r="0.5" fill="%23764ba2" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
          z-index: 1;
        }

        /* Luxury Why Section */
        .luxury-why-section {
          padding: 50px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          position: relative;
          overflow: hidden;
        }

        .luxury-bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
          z-index: 1;
        }

        .luxury-why-section .container {
          position: relative;
          z-index: 2;
        }

        .luxury-section-header {
          text-align: center;
          margin-bottom: 80px;
          animation: luxuryFadeUp 1s ease-out;
        }

        .luxury-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(102, 126, 234, 0.2);
          padding: 12px 24px;
          border-radius: 50px;
          margin-bottom: 30px;
          animation: luxuryFloat 3s ease-in-out infinite;
        }

        .luxury-badge-icon {
          font-size: 1.2rem;
          animation: luxurySpin 4s linear infinite;
        }

        .luxury-badge-text {
          font-weight: 600;
          color: #667eea;
          font-size: 0.9rem;
        }

        .luxury-title {
          margin-bottom: 30px;
        }

        .luxury-title-main {
          display: block;
          font-size: 3rem;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .luxury-title-accent {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: luxuryGlow 2s ease-in-out infinite alternate;
        }

        .luxury-title-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 30px 0;
        }

        .luxury-line {
          width: 60px;
          height: 2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
        }

        .luxury-diamond {
          font-size: 1.5rem;
          animation: luxuryRotate 4s linear infinite;
        }

        .luxury-subtitle {
          font-size: 1.2rem;
          color: #718096;
          font-weight: 500;
          max-width: 600px;
          margin: 0 auto;
        }

        .luxury-features-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 40px;
          margin-top: 80px;
        }

        .luxury-feature-card {
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 40px 30px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          cursor: pointer;
          animation: luxurySlideUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(50px);
        }

        .luxury-feature-card:nth-child(1) { animation-delay: 0.1s; }
        .luxury-feature-card:nth-child(2) { animation-delay: 0.2s; }
        .luxury-feature-card:nth-child(3) { animation-delay: 0.3s; }
        .luxury-feature-card:nth-child(4) { animation-delay: 0.4s; }
        .luxury-feature-card:nth-child(5) { animation-delay: 0.5s; }
        .luxury-feature-card:nth-child(6) { animation-delay: 0.6s; }

        .luxury-card-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 25px;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .luxury-feature-card:hover .luxury-card-glow {
          opacity: 1;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
        }

        .luxury-feature-card:hover {
          transform: translateY(-12px);
          box-shadow: 
            0 25px 50px rgba(102, 126, 234, 0.2),
            0 0 0 2px rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .luxury-feature-card:hover .luxury-icon-bg {
          transform: scale(1.15);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .luxury-feature-card:hover .luxury-icon {
          transform: translate(-50%, -50%) scale(1.1);
          animation: luxuryBounce 0.6s ease-out;
        }

        .luxury-feature-card:hover .luxury-card-number {
          transform: scale(1.15);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .luxury-feature-card:hover .luxury-feature-title {
          color: #667eea;
          transform: translateY(-2px);
        }

        .luxury-card-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .luxury-icon-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 30px;
        }

        .luxury-icon-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          animation: luxuryPulse 2s ease-in-out infinite;
        }

        .luxury-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2.5rem;
          color: white;
          z-index: 3;
        }

        .luxury-icon-particles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
        }

        .luxury-icon-particles span {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #667eea;
          border-radius: 50%;
          animation: luxuryParticles 3s linear infinite;
        }

        .luxury-icon-particles span:nth-child(1) {
          top: 0;
          left: 50%;
          animation-delay: 0s;
        }

        .luxury-icon-particles span:nth-child(2) {
          top: 50%;
          right: 0;
          animation-delay: 1s;
        }

        .luxury-icon-particles span:nth-child(3) {
          bottom: 0;
          left: 50%;
          animation-delay: 2s;
        }

        .luxury-feature-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 15px;
          transition: color 0.3s ease;
        }

        .luxury-feature-card:hover .luxury-feature-title {
          color: #667eea;
        }

        .luxury-feature-desc {
          color: #718096;
          line-height: 1.7;
          font-size: 1rem;
          margin-bottom: 20px;
        }

        .luxury-card-number {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #667eea;
          font-size: 1.1rem;
          border: 2px solid rgba(102, 126, 234, 0.2);
        }

        /* Luxury Animations */
        @keyframes luxuryFadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes luxurySlideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes luxuryFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes luxurySpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes luxuryRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes luxuryGlow {
          from { text-shadow: 0 0 20px rgba(102, 126, 234, 0.5); }
          to { text-shadow: 0 0 30px rgba(118, 75, 162, 0.7); }
        }

        @keyframes luxuryRotateGlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes luxuryPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes luxuryParticles {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1) rotate(180deg); opacity: 0.5; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }

        @keyframes luxuryBounce {
          0% { transform: translate(-50%, -50%) scale(1.1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1.1); }
        }

        .why-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .why-card:hover::before {
          transform: scaleX(1);
        }

        .why-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .why-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
          color: white;
          font-size: 2rem;
          position: relative;
          transition: all 0.4s ease;
        }

        .why-icon::after {
          content: '';
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          background: #ffd700;
          border-radius: 50%;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s ease;
        }

        .why-card:hover .why-icon {
          transform: rotateY(360deg) scale(1.1);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .why-card:hover .why-icon::after {
          opacity: 1;
          transform: scale(1);
        }

        .why-card h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 15px;
          text-align: center;
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .why-card:hover h3 {
          color: #667eea;
        }

        .why-card p {
          color: #718096;
          text-align: center;
          line-height: 1.6;
          font-size: 1rem;
          transition: color 0.3s ease;
        }

        .why-card:hover p {
          color: #4a5568;
        }

        /* Testimonials Swiper */
        .testimonials-swiper {
          
          padding: 20px 0 60px;
        }

        .testimonials-swiper .swiper-slide {
          height: auto;
              align-items: center;
    justify-content: center;
    display: flex
;
        }

        .testimonial-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.08);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(102, 126, 234, 0.1);
          height: auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 280px;
        }

        .testimonial-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .testimonial-card:hover::before {
          transform: scaleX(1);
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.3);
        }

        /* Swiper Navigation Buttons */
        .testimonials-swiper .swiper-button-next,
        .testimonials-swiper .swiper-button-prev {
          width: 50px;
          height: 50px;
          
          margin-top: -25px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
          color: #667eea;
          transition: all 0.3s ease;
        }
.testimonials-swiper .swiper-button-next{
transform:translateX(12px);
} 
.swiper-pagination.swiper-pagination-clickable.swiper-pagination-bullets.swiper-pagination-horizontal{
 transform:translateY(6px);
}
        .testimonials-swiper .swiper-button-next:after,
        .testimonials-swiper .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }

        .testimonials-swiper .swiper-button-next:hover,
        .testimonials-swiper .swiper-button-prev:hover {
          background: #667eea;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        /* Swiper Pagination */
        .testimonials-swiper .swiper-pagination {
          bottom: 0;
        }

        .testimonials-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(102, 126, 234, 0.3);
          opacity: 1;
          transition: all 0.3s ease;
        }

        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #667eea;
          transform: scale(1.3);
        }

        .quote-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          margin-bottom: 15px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
          flex-shrink: 0;
        }

        .testimonial-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .testimonial-text {
          color: #4a5568;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 20px;
          font-style: italic;
          flex: 1;
        }

        .testimonial-footer {
          margin-top: auto;
        }

        .author-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .author-details {
          flex: 1;
        }

        .author-details h4 {
          margin: 0 0 5px 0;
          color: #2d3748;
          font-size: 1rem;
          font-weight: 600;
        }

        .author-details span {
          color: #718096;
          font-size: 0.85rem;
        }

        .rating {
          color: #ffd700;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        /* Contact Section */
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .contact-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .contact-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 2rem;
        }

        .contact-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 10px;
        }

        .contact-card p {
          color: #4a5568;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .contact-card span {
          color: #718096;
          font-size: 0.9rem;
        }

        /* Footer */
        .modern-footer {
          background: #2d3748;
          color: white;
          padding: 40px 0;
          text-align: center;
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 800;
        }

        /* Hero Section Layout */
        .hero-section {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        /* Hero Slider Styles */
        .hero-slider {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .slider-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transform: scale(1.1);
          transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 1;
        }

        .slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 2;
        }

        .slide.prev {
          opacity: 0;
          transform: scale(0.95);
          z-index: 0;
        }

        .slide-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgb(32 33 35 / 46%) 0%, rgb(28 27 28 / 56%) 100%);
          z-index: 1;
        }

        .slide-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          z-index: 3;
          max-width: 600px;
          padding: 0 0px;
          opacity: 0;
          transition: all 0.8s ease 0.3s;
        }

        .slide.active .slide-content {
          opacity: 1;
          transform: translate(-50%, -50%) translateY(0);
        }

        .slide:not(.active) .slide-content {
          opacity: 0;
          transform: translate(-50%, -50%) translateY(30px);
        }

        .slide-icon {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .slide-icon i {
          font-size: 3rem;
          color: white;
        }

        .slide-content h2 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 20px;
          color:white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .slide-content p {
          font-size: 1.3rem;
          opacity: 0.9;
          line-height: 1.6;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
        }

        .slider-navigation {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 30px;
          z-index: 3;
        }

        .nav-btn {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .slider-dots {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          z-index: 3;
        }

        .dot {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.6);
        }

        .dot.active {
          background: white;
          transform: scale(1.2);
        }

        /* Hero Content Overlay */
        .hero-content-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          z-index: 4;
          padding: 60px 0 40px;
        }

        .hero-content-overlay .hero-text {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          text-align: center;
          color: white;
        }

        /* Animations */
        .fade-up, .fade-left, .fade-right {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }

        .fade-left {
          transform: translateX(-30px);
        }

        .fade-right {
          transform: translateX(30px);
        }

        .fade-up.animate-in, .fade-left.animate-in, .fade-right.animate-in {
          opacity: 1;
          transform: translate(0);
        }

        /* Responsive Design */
        @media (max-width: 768px) {

        .swiper.testimonials-swiper.swiper-initialized.swiper-horizontal.swiper-rtl.swiper-backface-hidden{
        padding-inline:2px !important;
        }
          .service-card{
          padding:25px;  
          }
          .nav-menu {
            display: none;
          }

          /* Hide testimonials arrows on mobile */
          .testimonials-swiper .swiper-button-next,
          .testimonials-swiper .swiper-button-prev {
            display: none !important;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .hero-stats {
            gap: 20px;
          }

          .about-content, .services-grid, .testimonials-grid, .contact-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 2rem;
          }

          /* Slider responsive styles */
          .slide-content h2 {
            font-size: 1.3rem;
          }

          .slide-content p {
            font-size: 0.9rem;
          }
        .hero-section{
        height:70vh
        }
          .slide-icon {
            width: 80px;
            height: 80px;
          }

          .slide-icon i {
            font-size: 2rem;
          }

          .nav-btn {
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
          }

          .slider-navigation {
            padding: 0 20px;
          }

          .slider-dots {
            bottom: 20px;
          }

          .dot {
            width: 12px;
            height: 12px;
          }

          /* Why Choose Us responsive */
          .why-choose-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .why-card {
            padding: 30px 20px;
          }

          .why-icon {
            width: 70px;
            height: 70px;
            font-size: 1.8rem;
          }

          .why-card h3 {
            font-size: 1.2rem;
          }
        }

        /* Luxury Footer Styles */
        .luxury-footer {
          position: relative;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: white;
          padding: 80px 0 0;
          overflow: hidden;
        }

        .footer-bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(119, 198, 255, 0.1) 0%, transparent 50%);
          animation: floatPattern 20s ease-in-out infinite;
        }

        @keyframes floatPattern {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }

        .luxury-footer-content {
          position: relative;
          z-index: 2;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          padding-bottom: 60px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-brand-section {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .luxury-footer-brand {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 10px;
        }

        .footer-brand-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
          animation: brandGlow 3s ease-in-out infinite;
        }

        @keyframes brandGlow {
          0%, 100% { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.6); }
        }

        .footer-brand-text h3 {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 5px;
        }

        .footer-brand-text p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .footer-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.8;
          font-size: 1rem;
          max-width: 400px;
        }

        .footer-social {
          display: flex;
          gap: 15px;
        }

        .social-link {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-link.whatsapp {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          color: white;
        }

        .social-link.phone {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .social-link.email {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        .social-link.twitter {
          background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
          color: white;
        }

        .social-link:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .footer-links-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .footer-column-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        .footer-column-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 1px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          position: relative;
          padding-left: 15px;
        }

        .footer-links a::before {
          content: '→';
          position: absolute;
          left: 0;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          color: #667eea;
        }

        .footer-links a:hover {
          color: white;
          transform: translateX(5px);
        }

        .footer-links a:hover::before {
          opacity: 1;
          transform: translateX(0);
        }

        .footer-contact-info {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
        }

        .footer-contact-item i {
          width: 20px;
          color: #667eea;
          font-size: 16px;
        }

        .footer-bottom {
          padding: 40px 0;
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
          margin-bottom: 30px;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-copyright {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .heart {
          color: #f093fb;
          animation: heartbeat 2s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .footer-badges {
          display: flex;
          gap: 15px;
        }

        .footer-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
        }

        .footer-badge:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .footer-badge i {
          color: #667eea;
        }

        /* Footer Responsive Design */
        @media (max-width: 992px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .footer-links-section {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }

          .luxury-footer-brand {
            justify-content: center;
          }

          .footer-description {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {

       .footer-social{
       justify-content:center;
       }
        
          .luxury-footer {
            padding: 60px 0 0;
          }

          .footer-links-section {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }

          .footer-badges {
            justify-content: center;
          }

          .footer-brand-icon {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }

          .footer-brand-text h3 {
            font-size: 1.5rem;
          }

          .social-link {
            width: 45px;
            height: 45px;
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
