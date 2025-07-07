// memorial-page.js
document.addEventListener('DOMContentLoaded', () => {
  // 카드 클릭 시 이동
  document.querySelectorAll('.card, .create-btn').forEach(el => {
    el.addEventListener('click', () => {
      const href = el.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });
  });
});


// ── 사이드바 메뉴 링크 클릭 시 닫기 ──
document.querySelectorAll('.sidebar-menu a').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('open');
    mainFrame.classList.remove('blurred');
  });
});


// ── 사이드바 토글 ──
const openBtn   = document.getElementById('openSidebar');
const closeBtn  = document.getElementById('closeSidebar');
const sidebar   = document.getElementById('sidebar');
const mainFrame = document.querySelector('.main-frame');

openBtn.addEventListener('click', () => {
  sidebar.classList.add('open');
  mainFrame.classList.add('blurred');
});
closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('open');
  mainFrame.classList.remove('blurred');
});

document.addEventListener('DOMContentLoaded', () => {
  // 1) 카드·버튼 클릭 이동 (기존)
  document.querySelectorAll('.card, .create-btn').forEach(el => {
    el.addEventListener('click', () => {
      const href = el.dataset.href;
      if (href) window.location.href = href;
    });
  });

  // 2) 토글·링크 클릭 시 blur 처리
  const openBtn   = document.getElementById('openSidebar');
  const closeBtn  = document.getElementById('closeSidebar');
  const sidebar   = document.getElementById('sidebar');
  const mainFrame = document.querySelector('.main-frame');

  openBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    mainFrame.classList.add('blurred');
  });
  closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    mainFrame.classList.remove('blurred');
  });
  document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('open');
      mainFrame.classList.remove('blurred');
    });
  });

  // 3) 현재 URL과 매칭되는 메뉴에 active 클래스 달기
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-menu a').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.parentElement.classList.add('active');               // li
      link.closest('.sidebar-section').classList.add('active'); // section
    }
  });
});
