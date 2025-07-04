// script.js

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
document.querySelectorAll('.checklist-group').forEach(group => {
  const boxes  = group.querySelectorAll('input[type="checkbox"]');
  const countE = group.querySelector('.group-count');

  function updateCount() {
    const total   = boxes.length;
    const checked = Array.from(boxes).filter(cb => cb.checked).length;
    countE.textContent = `${checked}/${total}`;
  }

  boxes.forEach(cb => cb.addEventListener('change', updateCount));
  updateCount(); // 초기값 세팅
});
