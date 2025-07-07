// memorial-page.js
document.addEventListener('DOMContentLoaded', () => {
  const openBtn   = document.getElementById('openSidebar');
  const closeBtn  = document.getElementById('closeSidebar');
  const searchBtn = document.getElementById('searchBtn');
  const sidebar   = document.getElementById('sidebar');
  const mainFrame = document.querySelector('.main-frame');

  // 1) 카드·버튼 클릭 시 이동
  document.querySelectorAll('.create-btn').forEach(el => {
    el.addEventListener('click', () => {
      const href = el.dataset.href;
      if (href) window.location.href = 'mymemorial.html';
    });
  });

    document.querySelectorAll('.card').forEach(el => {
    el.addEventListener('click', () => {
      const href = el.dataset.href;
      if (href) window.location.href = href;
    });
  });

  // 2) 사이드바 열기/닫기 & 회색 오버레이 토글
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

  // 3) 검색 아이콘 클릭 → 검색 페이지로 이동
  searchBtn.addEventListener('click', () => {
    window.location.href = 'memorial-search.html';
  });

  // 4) 현재 페이지와 매칭되는 메뉴에 active 클래스 달기
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-menu a').forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (linkPath === currentPath) {
      link.parentElement.classList.add('active');               // <li>
      link.closest('.sidebar-section').classList.add('active'); // <section>
    }
  });
});
