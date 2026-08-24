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

    // ── 11. Realistic Leaflet Coverage Map Engine ────
    const mapContainer = document.getElementById('realCoverageMap');
    if (mapContainer && typeof L !== 'undefined') {
      
      const coverageCities = [
        {
          id: 'madinah',
          name: 'المدينة المنورة',
          isHQ: true,
          lat: 24.4672,
          lng: 39.6111,
          icon: 'fas fa-star',
          badge: 'المقر الرئيسي ★',
          desc: 'حي الإسكان – طريق الهجرة | المركز الرئيسي وإدارة العمليات',
          services: 'تقييم عقاري شامل، عقارات تجارية وسكنية وزراعية وخبرة قضائية معتمدة'
        },
        {
          id: 'yanbu',
          name: 'ينبع',
          isHQ: false,
          lat: 24.0895,
          lng: 38.0637,
          icon: 'fas fa-industry',
          badge: 'تغطية معتمدة',
          desc: 'محافظة ينبع، الهيئة الملكية، الموانئ والمنطقة الصناعية',
          services: 'تقييم المنشآت الصناعية والمستودعات والمباني التجارية والسكنية'
        },
        {
          id: 'jeddah',
          name: 'جدة',
          isHQ: false,
          lat: 21.5433,
          lng: 39.1728,
          icon: 'fas fa-city',
          badge: 'تغطية معتمدة',
          desc: 'عروس البحر الأحمر، الأبراج والمراكز التجارية واللوجستية',
          services: 'تقييم المراكز التجارية والمجمعات السكنية والمستودعات والمشاريع الكبرى'
        },
        {
          id: 'alula',
          name: 'العلا',
          isHQ: false,
          lat: 26.6080,
          lng: 37.9220,
          icon: 'fas fa-mountain-sun',
          badge: 'تغطية معتمدة',
          desc: 'محافظة العلا، الوجهات التراثية والمشاريع السياحية',
          services: 'تقييم المنتجعات الفندقية والأصول التراثية والمزارع والأراضي الفضاء'
        },
        {
          id: 'riyadh',
          name: 'الرياض',
          isHQ: false,
          lat: 24.7136,
          lng: 46.6753,
          icon: 'fas fa-building-columns',
          badge: 'تغطية معتمدة',
          desc: 'العاصمة والمركز المالي، مقرات الصناديق والشركات الكبرى',
          services: 'تقييم المحافظ الاستثمارية، الصناديق العقارية (REITs)، والأبراج والمجمعات'
        },
        {
          id: 'makkah',
          name: 'مكة المكرمة',
          isHQ: false,
          lat: 21.3891,
          lng: 39.8579,
          icon: 'fas fa-kaaba',
          badge: 'تغطية معتمدة',
          desc: 'العاصمة المقدسة، المنطقة المركزية، الأوقاف والمنشآت الفندقية',
          services: 'تقييم الفنادق والأبراج الوقفية والمشاريع التطويرية ونزع الملكية'
        },
        {
          id: 'eastern',
          name: 'المنطقة الشرقية',
          isHQ: false,
          lat: 26.4207,
          lng: 50.0888,
          icon: 'fas fa-oil-well',
          badge: 'تغطية معتمدة',
          desc: 'الدمام، الخبر، الظهران، الجبيل، والأحساء',
          services: 'تقييم الأصول اللوجستية والصناعية والأبراج والمجمعات التجارية والسكنية'
        },
        {
          id: 'hafar',
          name: 'حفر الباطن',
          isHQ: false,
          lat: 28.4328,
          lng: 45.9708,
          icon: 'fas fa-location-arrow',
          badge: 'تغطية معتمدة',
          desc: 'محافظة حفر الباطن والمراكز الحيوية بالشمال الشرقي',
          services: 'تقييم العقارات السكنية والتجارية والمزارع والمشاريع الخدمية'
        }
      ];

      // KSA Bounds
      const ksaBounds = L.latLngBounds(
        L.latLng(16.5, 34.5),
        L.latLng(32.2, 55.5)
      );

      // Initialize Leaflet Map
      const map = L.map('realCoverageMap', {
        center: [24.5, 44.5],
        zoom: 6,
        minZoom: 5,
        maxZoom: 17,
        zoomControl: false,
        scrollWheelZoom: false
      });

      // Add Custom Styled Zoom Control at bottom-left
      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      // Fit KSA view on load
      map.fitBounds(ksaBounds, { padding: [30, 30] });

      // Available Map Layers
      const layers = {
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '&copy; Esri & Maxar',
          maxZoom: 18
        }),
        terrain: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CartoDB & OpenStreetMap',
          maxZoom: 18
        }),
        dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CartoDB & OpenStreetMap',
          maxZoom: 18
        })
      };

      // Default Layer: Satellite for maximum realism
      let currentLayer = layers.satellite.addTo(map);

      // Layer Switcher Buttons
      document.querySelectorAll('.map-tool-btn[data-layer]').forEach(btn => {
        btn.addEventListener('click', () => {
          const layerKey = btn.getAttribute('data-layer');
          if (layers[layerKey] && currentLayer !== layers[layerKey]) {
            map.removeLayer(currentLayer);
            currentLayer = layers[layerKey].addTo(map);
            document.querySelectorAll('.map-tool-btn[data-layer]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          }
        });
      });

      // Reset View Button
      const resetBtn = document.getElementById('btnResetKsaView');
      resetBtn?.addEventListener('click', () => {
        map.flyToBounds(ksaBounds, { padding: [30, 30], duration: 1.2 });
        clearCityHighlight();
      });

      // Add Glowing Flight/Network Lines from Madinah (HQ) to all branches
      const hqCity = coverageCities.find(c => c.isHQ);
      coverageCities.forEach(city => {
        if (!city.isHQ) {
          // Create a curved arc via midpoint offset
          const midLat = (hqCity.lat + city.lat) / 2 + (city.lng - hqCity.lng) * 0.06;
          const midLng = (hqCity.lng + city.lng) / 2 - (city.lat - hqCity.lat) * 0.06;
          const curvePoints = [
            [hqCity.lat, hqCity.lng],
            [midLat, midLng],
            [city.lat, city.lng]
          ];
          L.polyline(curvePoints, {
            color: '#f4b41a',
            weight: 2,
            opacity: 0.75,
            dashArray: '6, 8',
            lineCap: 'round',
            smoothFactor: 1
          }).addTo(map);
        }
      });

      // Add Custom Markers
      const markers = {};
      const cityCards = document.querySelectorAll('.city-card-item');

      function highlightCity(cityId) {
        cityCards.forEach(card => {
          card.classList.toggle('is-active', card.getAttribute('data-city') === cityId);
        });
        Object.keys(markers).forEach(k => {
          const el = document.getElementById(`mapPin-${k}`);
          if (el) el.classList.toggle('is-active', k === cityId);
        });
      }

      function clearCityHighlight() {
        cityCards.forEach(card => card.classList.remove('is-active'));
        Object.keys(markers).forEach(k => {
          const el = document.getElementById(`mapPin-${k}`);
          if (el) el.classList.remove('is-active');
        });
      }

      coverageCities.forEach(city => {
        const pinHtml = `
          <div class="realistic-pin ${city.isHQ ? 'hq' : ''}" id="mapPin-${city.id}">
            <div class="realistic-pin-badge">
              <i class="${city.isHQ ? 'fas fa-crown' : 'fas fa-location-dot'}"></i>
              <span>${city.name}</span>
              ${city.isHQ ? '<span class="realistic-hq-tag">المقر الرئيسي</span>' : ''}
            </div>
            <div class="realistic-pin-icon">
              <div class="realistic-pulse-ring"></div>
              <i class="${city.icon}"></i>
            </div>
          </div>
        `;

        const pinIcon = L.divIcon({
          html: pinHtml,
          className: 'leaflet-div-icon',
          iconSize: [120, 50],
          iconAnchor: [60, 50]
        });

        const popupHtml = `
          <div class="popup-card">
            <div class="popup-head ${city.isHQ ? 'hq' : ''}">
              <div class="popup-icon"><i class="${city.icon}"></i></div>
              <div>
                <h4 class="popup-title">${city.name}</h4>
                <span class="popup-badge">${city.badge}</span>
              </div>
            </div>
            <p class="popup-desc" style="color:var(--text);font-weight:700;margin-bottom:.35rem">${city.desc}</p>
            <p class="popup-desc">${city.services}</p>
            <a href="https://wa.me/966503312183?text=${encodeURIComponent('السلام عليكم، أود طلب تقييم عقاري في مدينة ' + city.name)}" target="_blank" rel="noopener noreferrer" class="popup-btn">
              <i class="fab fa-whatsapp"></i> طلب تقييم في ${city.name}
            </a>
          </div>
        `;

        const marker = L.marker([city.lat, city.lng], { icon: pinIcon }).addTo(map);
        marker.bindPopup(popupHtml, { maxWidth: 280, closeButton: true });
        markers[city.id] = marker;

        marker.on('click', () => {
          highlightCity(city.id);
          const card = document.querySelector(`.city-card-item[data-city="${city.id}"]`);
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      });

      // Synchronize Side Cards with Map
      cityCards.forEach(card => {
        const cityId = card.getAttribute('data-city');
        const cityObj = coverageCities.find(c => c.id === cityId);

        card.addEventListener('mouseenter', () => {
          highlightCity(cityId);
        });

        card.addEventListener('mouseleave', () => {
          // Keep active if popup is open
        });

        card.addEventListener('click', () => {
          highlightCity(cityId);
          if (cityObj && markers[cityId]) {
            map.flyTo([cityObj.lat, cityObj.lng], 10, { duration: 1.2 });
            setTimeout(() => {
              markers[cityId].openPopup();
            }, 600);
          }
        });
      });

      // Invalidate map size on window resize to ensure crisp tile rendering
      window.addEventListener('resize', () => {
        map.invalidateSize();
      });
    }

  });
})();


