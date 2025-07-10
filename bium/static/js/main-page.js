// ── 세션 기반 로그인 확인 ──
async function checkLogin() {
  try {
    const res = await fetch('/api/users/check_login/', {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) return false;
    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error('로그인 상태 조회 중 오류:', err);
    return false;
  }
}

// ── 사이드바 & 토글 로직 ──
const sidebar   = document.getElementById('sidebar');
const mainFrame = document.querySelector('.main-frame');
const openBtn   = document.getElementById('openSidebar');
const closeBtn  = document.getElementById('closeSidebar');

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

// “내 공간” 아이콘 클릭 → form 제출
const myspaceBtn = document.querySelector('.icon-myspace');
if (myspaceBtn) {
  myspaceBtn.addEventListener('click', () => {
    const form = document.getElementById('goMyspaceForm');
    if (form) form.submit();
  });
}

// ── 유언장 진행 단계 조회 → 커버 이미지 토글 ──
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/will/progress_step/', {
      method: 'GET',
      credentials: 'include'
    });
    const json = await res.json();
    if (json.success && json.progress_step >= 10) {
      document.getElementById('coverImg').src =
        './static/images/assets/will-image-after.png';
    }
  } catch (e) {
    console.error('진행 단계 조회 실패:', e);
  }

  // ── 체크리스트 초기 상태 반영 ──
    let checklistData = [];

  // 체크박스 클릭 → UI 토글 + 카운트 + 폼 제출
  document.querySelectorAll('.item').forEach(label => {
    label.addEventListener('click', () => {
      const input = label.querySelector('input[type="checkbox"]');
      const icon  = label.querySelector('.checkbox-icon');

      input.checked = !input.checked;
      icon.src = input.checked
        ? './static/images/icons/icon-checkbox-12=Activate.svg'
        : './static/images/icons/icon-checkbox-12=Deactivate.svg';

      const groupEl = label.closest('.checklist-group');
      const boxes   = groupEl.querySelectorAll('input[type="checkbox"]');
      const countEl = groupEl.querySelector('.group-count');
      const checkedCount = [...boxes].filter(cb => cb.checked).length;
      countEl.textContent = `${checkedCount}/${boxes.length}`;

      document.getElementById('checklistSubmit').click();
    });
  });
});

  // ── 체크박스 클릭 → UI 토글 + 카운트 + 폼 제출 ──
  document.querySelectorAll('.item').forEach(label => {
    label.addEventListener('click', () => {
      const input = label.querySelector('input[type="checkbox"]');
      const icon  = label.querySelector('.checkbox-icon');

      // 1) UI 토글
      input.checked = !input.checked;
      icon.src = input.checked
        ? './static/images/icons/icon-checkbox-12=Activate.svg'
        : './static/images/icons/icon-checkbox-12=Deactivate.svg';

      // 2) 그룹 카운트 갱신
      const groupEl = label.closest('.checklist-group');
      const boxes   = groupEl.querySelectorAll('input[type="checkbox"]');
      const countEl = groupEl.querySelector('.group-count');
      const checkedCount = [...boxes].filter(cb => cb.checked).length;
      countEl.textContent = `${checkedCount}/${boxes.length}`;

      // 3) 자동 폼 제출 (리다이렉트)
      document.getElementById('checklistSubmit').click();
    });
  });

  // ── FAQ 토글 & 아이콘 교체 (필요 시 유지) ──
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn  = item.querySelector('.faq-question');
    const icon = btn.querySelector('.icon-dropdown');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      icon.src = isOpen
        ? './static/images/icons/icon-dropdown-20=up.svg'
        : './static/images/icons/icon-dropdown-20=down.svg';
    });
  });