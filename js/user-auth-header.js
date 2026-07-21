(function() {
  // Inject CSS styles for User Badge & Dropdown
  const style = document.createElement('style');
  style.textContent = `
    .tvlk-user-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      z-index: 100000;
    }
    .tvlk-user-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(12px);
      color: #ffffff;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(255, 255, 255, 0.22);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .tvlk-user-badge:hover {
      background: rgba(255, 255, 255, 0.28);
      border-color: rgba(255, 255, 255, 0.45);
      transform: translateY(-1px);
    }
    .tvlk-avatar-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0194F3 0%, #0066CC 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(1, 148, 243, 0.35);
    }
    .tvlk-user-sep {
      opacity: 0.4;
      font-weight: 300;
      margin: 0 2px;
    }
    .tvlk-points-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-weight: 600;
    }
    .tvlk-coin-icon {
      width: 18px;
      height: 18px;
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #ffffff;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 800;
      box-shadow: 0 2px 5px rgba(245, 158, 11, 0.35);
    }
    .tvlk-caret {
      display: inline-flex;
      align-items: center;
      margin-left: 2px;
      transition: transform 0.22s ease;
      opacity: 0.85;
    }
    .tvlk-user-wrapper.active .tvlk-caret {
      transform: rotate(180deg);
    }
    .tvlk-user-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 320px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      display: none;
      flex-direction: column;
      z-index: 999999;
      animation: tvlkDdIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .tvlk-user-wrapper.active .tvlk-user-dropdown {
      display: flex;
    }
    @keyframes tvlkDdIn {
      from { opacity: 0; transform: translateY(-10px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .tvlk-dd-header {
      background: linear-gradient(135deg, #b88354 0%, #8e5831 100%);
      color: #ffffff;
      padding: 20px;
      position: relative;
    }
    .tvlk-dd-name {
      font-size: 18px;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 6px;
      color: #ffffff;
      letter-spacing: -0.3px;
    }
    .tvlk-dd-tier {
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.92);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .tvlk-dd-tier:hover {
      opacity: 1;
      text-decoration: underline;
    }
    .tvlk-dd-menu {
      padding: 8px 0;
      list-style: none;
      margin: 0;
    }
    .tvlk-dd-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 11px 20px;
      font-size: 14px;
      font-weight: 500;
      color: #23262F;
      cursor: pointer;
      transition: all 0.18s ease;
      text-decoration: none;
    }
    .tvlk-dd-item:hover {
      background: #F4F6F9;
      color: #0194F3;
      padding-left: 23px;
    }
    .tvlk-dd-icon {
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #0194F3;
      flex-shrink: 0;
    }
    .tvlk-dd-badge-new {
      margin-left: auto;
      background: #FFF3EA;
      color: #FF5E1F;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      letter-spacing: 0.2px;
    }
    .tvlk-dd-divider {
      height: 1px;
      background: #E5E7EB;
      margin: 6px 0;
    }
    .tvlk-dd-item.logout {
      color: #EF4444;
    }
    .tvlk-dd-item.logout .tvlk-dd-icon {
      color: #EF4444;
    }
    .tvlk-dd-item.logout:hover {
      background: #FEF2F2;
      color: #DC2626;
    }
  `;
  document.head.appendChild(style);

  function initUserAuthHeader() {
    let user = null;
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) user = JSON.parse(stored);
    } catch(e) {}

    const allBtns = document.querySelectorAll('[role="button"], button, a');
    let loginEl = null, registerEl = null;

    allBtns.forEach(function(el) {
      const txt = el.textContent.trim();
      if (!loginEl && (txt === 'Đăng Nhập' || txt === 'Đăng nhập' || txt === 'Log in' || txt === 'Login')) {
        loginEl = el;
      }
      if (!registerEl && (txt === 'Đăng ký' || txt === 'Register')) {
        registerEl = el;
      }
    });

    if (!user) {
      if (loginEl && !loginEl._tvlk_bound) {
        loginEl._tvlk_bound = true;
        loginEl.style.cursor = 'pointer';
        loginEl.addEventListener('click', function(e) {
          e.preventDefault(); e.stopPropagation();
          window.location.href = 'auth.html?tab=login';
        }, true);
      }
      if (registerEl && !registerEl._tvlk_bound) {
        registerEl._tvlk_bound = true;
        registerEl.style.cursor = 'pointer';
        registerEl.addEventListener('click', function(e) {
          e.preventDefault(); e.stopPropagation();
          window.location.href = 'auth.html?tab=register';
        }, true);
      }
    } else {
      if (registerEl) {
        registerEl.style.display = 'none';
      }

      if (loginEl && !document.getElementById('tvlk-user-badge-container')) {
        const shortName = user.shortName || user.fullName || 'Yến';
        const fullName  = user.fullName || 'Yến Nguyễn';
        const points    = user.points !== undefined ? user.points : 0;
        const tier      = user.tier || 'Bronze Priority';

        const wrapper = document.createElement('div');
        wrapper.id = 'tvlk-user-badge-container';
        wrapper.className = 'tvlk-user-wrapper';

        wrapper.innerHTML = `
          <div class="tvlk-user-badge" id="tvlk-badge-btn">
            <div class="tvlk-avatar-circle">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <span>${shortName}</span>
            <span class="tvlk-user-sep">|</span>
            <div class="tvlk-points-badge">
              <span class="tvlk-coin-icon">P</span>
              <span>${points} Điểm</span>
            </div>
            <span class="tvlk-caret">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </div>

          <div class="tvlk-user-dropdown" id="tvlk-dropdown-panel">
            <div class="tvlk-dd-header">
              <div class="tvlk-dd-name">${fullName}</div>
              <div class="tvlk-dd-tier">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Bạn là thành viên <strong>${tier}</strong> &gt;
              </div>
            </div>
            <div class="tvlk-dd-menu">
              <a class="tvlk-dd-item" href="#">
                <span class="tvlk-dd-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v12M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5 1.34 2.5 3 2.5 3 1.12 3 2.5-1.34 2.5-3 2.5-3-1.12-3-2.5"/></svg>
                </span>
                <span>${points} Điểm</span>
              </a>
              <a class="tvlk-dd-item" href="#">
                <span class="tvlk-dd-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <span>Chỉnh sửa hồ sơ</span>
              </a>
              <a class="tvlk-dd-item" href="#">
                <span class="tvlk-dd-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </span>
                <span>Thẻ của tôi</span>
              </a>
              <a class="tvlk-dd-item" href="#">
                <span class="tvlk-dd-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </span>
                <span>Danh sách giao dịch</span>
              </a>
              <a class="tvlk-dd-item" href="#">
                <span class="tvlk-dd-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><line x1="12" y1="5" x2="12" y2="19" stroke-dasharray="2 2"/></svg>
                </span>
                <span>Đặt chỗ của tôi</span>
              </a>
              <a class="tvlk-dd-item" href="#">
                <span class="tvlk-dd-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                </span>
                <span>Hoàn tiền</span>
                <span class="tvlk-dd-badge-new">Mới!</span>
              </a>
              <a class="tvlk-dd-item" href="#">
                <span class="tvlk-dd-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </span>
                <span>Thông báo giá vé máy bay</span>
              </a>
              <a class="tvlk-dd-item" href="#">
                <span class="tvlk-dd-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-3-3.87"/><path d="M9 21v-2a4 4 0 0 0-4-4H3a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="3"/></svg>
                </span>
                <span>Thông tin hành khách đã lưu</span>
              </a>
              <a class="tvlk-dd-item" href="#">
                <span class="tvlk-dd-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                </span>
                <span>Khuyến mãi</span>
              </a>
              <div class="tvlk-dd-divider"></div>
              <a class="tvlk-dd-item logout" id="tvlk-logout-btn" href="#">
                <span class="tvlk-dd-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </span>
                <span>Đăng xuất</span>
              </a>
            </div>
          </div>
        `;

        if (loginEl.parentNode) {
          loginEl.parentNode.replaceChild(wrapper, loginEl);
        }

        const badgeBtn = document.getElementById('tvlk-badge-btn');
        badgeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          wrapper.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
          if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('active');
          }
        });

        document.getElementById('tvlk-logout-btn').addEventListener('click', function(e) {
          e.preventDefault();
          localStorage.removeItem('currentUser');
          window.location.reload();
        });
      }
    }

    if ((!loginEl || !registerEl) && (document._tvlk_retry || 0) < 50) {
      document._tvlk_retry = (document._tvlk_retry || 0) + 1;
      setTimeout(initUserAuthHeader, 250);
    }
  }

  document.addEventListener('DOMContentLoaded', initUserAuthHeader);
  window.addEventListener('load', function() { setTimeout(initUserAuthHeader, 500); });
})();
