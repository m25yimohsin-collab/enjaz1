/* ─────────────────────────────────────────
   Enjaz Real Estate Valuation – App Engine
   Modern Interactive JavaScript 2026
───────────────────────────────────────── */

(function () {
  'use strict';

  // ── 1. Dark / Light Mode ──────────────
  const htmlEl = document.documentElement;
  const THEME_KEY = 'enjaz_theme';

  function applyTheme(theme) {
    htmlEl.classList.toggle('dark', theme === 'dark');
  }

  const savedTheme = localStorage.getItem(THEME_KEY)
    || (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const isDark = htmlEl.classList.toggle('dark');
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
        showToast(isDark ? '🌙 الوضع الليلي الفاخر' : '☀️ الوضع النهاري', 'info');
      });
    });

    // ── 2. Navbar scroll shadow ──────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ── 3. Back to top ───────────────────
    const backTop = document.querySelector('.back-top');
    window.addEventListener('scroll', () => {
      if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── 4. Mobile Drawer ─────────────────
    const hamburger     = document.querySelector('.hamburger');
    const overlay       = document.querySelector('.mobile-overlay');
    const drawer        = document.querySelector('.mobile-drawer');
    const drawerClose   = document.querySelector('.drawer-close');
    const drawerLinks   = document.querySelectorAll('.drawer-nav a');

    function openDrawer() {
      overlay?.classList.add('open');
      drawer?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      overlay?.classList.remove('open');
      drawer?.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger?.addEventListener('click', openDrawer);
    overlay?.addEventListener('click', closeDrawer);
    drawerClose?.addEventListener('click', closeDrawer);
    drawerLinks.forEach(l => l.addEventListener('click', closeDrawer));

    // ── 5. FAQ Accordion ─────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const answer  = btn.nextElementSibling;
        const isOpen  = btn.classList.contains('open');

        document.querySelectorAll('.faq-question.open').forEach(b => {
          b.classList.remove('open');
          b.nextElementSibling?.classList.remove('open');
        });

        if (!isOpen) {
          btn.classList.add('open');
          answer?.classList.add('open');
        }
      });
    });

    // ── 6. Animated Counters ─────────────
    function animateCounters() {
      document.querySelectorAll('[data-count]').forEach(el => {
        const target  = parseFloat(el.getAttribute('data-count'));
        const suffix  = el.getAttribute('data-suffix') || '';
        const dur     = 1800;
        const start   = performance.now();

        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const cur  = target * ease;
          el.textContent = (Number.isInteger(target) ? Math.round(cur) : cur.toFixed(1)).toLocaleString('ar-SA') + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }

    const statsEl = document.querySelector('.stats-bar, #statsSection');
    if (statsEl) {
      new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
      }, { threshold: 0.3 }).observe(statsEl);
    }

    // ── 7. Active Nav Link ───────────────
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .drawer-nav a, .dock-item[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });

    // ── 8. Contact Form → Direct WhatsApp ───────────────
    const contactForm = document.getElementById('contactForm');
    const WHATSAPP_PHONE = '966503312183'; // رقم واتساب الشركة

    contactForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = contactForm.querySelector('[name="name"]')?.value.trim();
      const phone = contactForm.querySelector('[name="phone"]')?.value.trim();
      const email = contactForm.querySelector('[name="email"]')?.value.trim();
      const subjectSelect = contactForm.querySelector('[name="subject"]');
      const subject = subjectSelect?.options[subjectSelect.selectedIndex]?.text || '';
      const message = contactForm.querySelector('[name="message"]')?.value.trim();

      if (!name || !phone) {
        showToast('⚠️ يرجى إدخال الاسم ورقم الجوال للمتابعة', 'error');
        return;
      }

      const btn = contactForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري فتح واتساب...';

      // بناء نص الرسالة المنسقة لواتساب
      let waText = `*طلب تقييم عقاري جديد - شركة إنجاز القيمة*%0A`;
      waText += `━━━━━━━━━━━━━━━━━━━━%0A`;
      waText += `👤 *الاسم الكريم:* ${encodeURIComponent(name)}%0A`;
      waText += `📱 *رقم الجوال:* ${encodeURIComponent(phone)}%0A`;
      if (email) waText += `✉️ *البريد:* ${encodeURIComponent(email)}%0A`;
      if (subject && subjectSelect.value) waText += `📋 *نوع الخدمة:* ${encodeURIComponent(subject)}%0A`;
      if (message) waText += `📝 *التفاصيل:* ${encodeURIComponent(message)}%0A`;
      waText += `━━━━━━━━━━━━━━━━━━━━%0A`;
      waText += `_تم الإرسال عبر الموقع الإلكتروني_`;

      showToast('✅ تم تجهيز الطلب! جاري التحويل إلى واتساب مباشرة...', 'success');

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الرسالة';
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${waText}`, '_blank');
        contactForm.reset();
      }, 1000);
    });

    // ── 9. Toast helper ──────────────────
    window.showToast = function (msg, type = 'info') {
      let t = document.querySelector('.toast');
      if (!t) {
        t = document.createElement('div');
        t.className = 'toast';
        document.body.appendChild(t);
      }
      t.className = `toast ${type}`;
      t.innerHTML = msg;
      t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.remove('show'), 3500);
    };

    // ── 10. Smooth scroll for anchors ────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

  });
})();
