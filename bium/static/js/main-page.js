// script.js

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

const myspaceBtn = document.querySelector('.icon-myspace');
if (myspaceBtn) {
  myspaceBtn.addEventListener('click', () => {
    // 원하는 경로로 변경하세요
    window.location.href = '../templates/mymemorial.html';
  });
}

// ── FAQ 토글 & 아이콘 교체 ──
document.querySelectorAll('.faq-item').forEach(item => {
  const btn  = item.querySelector('.faq-question');
  const icon = btn.querySelector('.icon-dropdown');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    icon.src = isOpen
      ? '../static/images/icons/icon-dropdown-20=up.svg'
      : '../static/images/icons/icon-dropdown-20=down.svg';
  });
});

// ── 체크리스트 카운트 업데이트 ──
document.querySelectorAll('.item').forEach(label => {
  const icon  = label.querySelector('.checkbox-icon');
  const input = label.querySelector('input[type="checkbox"]');

  // 라벨 혹은 아이콘 클릭 시
  label.addEventListener('click', e => {
    // 체크박스 state 토글
    input.checked = !input.checked;

    // 아이콘 src 교체
    icon.src = input.checked
      ? '../static/images/icons/icon-checkbox-12=activate.svg'
      : '../static/images/icons/icon-checkbox-12=deactivate.svg';

    // 체크리스트 카운트도 업데이트
    const group = label.closest('.checklist-group');
    const boxes = group.querySelectorAll('input[type="checkbox"]');
    const countE = group.querySelector('.group-count');
    const total = boxes.length;
    const checked = [...boxes].filter(cb => cb.checked).length;
    countE.textContent = `${checked}/${total}`;
  });
});

// main-page.js 맨 아래에
window.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-section').forEach(sec => {
    const hrefs = Array.from(sec.querySelectorAll('a')).map(a => a.href.split('/').pop());
    if (hrefs.includes(current)) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });
});

