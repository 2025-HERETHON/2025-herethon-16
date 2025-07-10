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

document.querySelectorAll('.sidebar-menu a').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('open');
    mainFrame.classList.remove('blurred');
  });
});
openBtn.addEventListener('click', () => {
  sidebar.classList.add('open');
  mainFrame.classList.add('blurred');
});
closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('open');
  mainFrame.classList.remove('blurred');
});

// ── “내 공간” 아이콘 클릭 분기 ──
const myspaceBtn = document.querySelector('.icon-myspace');
if (myspaceBtn) {
  myspaceBtn.addEventListener('click', async () => {
    const loggedIn = await checkLogin();
    window.location.href = loggedIn
      ? '../templates/mymemorial-edit.html'
      : '../templates/login.html';
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
  try {
    const res2 = await fetch('/api/checklist/check/', {
      method: 'GET',
      credentials: 'include'
    });
    if (res2.ok) {
      const json2 = await res2.json();
      checklistData = json2.data;  // [{category, items:[{id,content,is_checked},…]},…]
    }
  } catch (e) {
    console.error('체크리스트 조회 실패:', e);
  }

  //  초기 화면 체크 상태 & 카운트 갱신
  document.querySelectorAll('.checklist-group').forEach(groupEl => {
    const category = groupEl.querySelector('.group-title').textContent.trim();
    const catData  = checklistData.find(c => c.category === category);
    if (!catData) return;
    catData.items.forEach(item => {
      const label = [...groupEl.querySelectorAll('.item')]
        .find(l => l.querySelector('span').textContent.trim() === item.content);
      if (!label) return;
      const input = label.querySelector('input[type="checkbox"]');
      const icon  = label.querySelector('.checkbox-icon');
      input.checked = item.is_checked;
      icon.src = item.is_checked
        ? './static/images/icons/icon-checkbox-12=Activate.svg'
        : './static/images/icons/icon-checkbox-12=Deactivate.svg';
    });
    const boxes   = groupEl.querySelectorAll('input[type="checkbox"]');
    const countEl = groupEl.querySelector('.group-count');
    const checked = [...boxes].filter(cb => cb.checked).length;
    countEl.textContent = `${checked}/${boxes.length}`;
  });

  // ── 체크박스 클릭 → UI 토글 + 그룹 카운트 + 폼 제출 ──
  document.querySelectorAll('.item').forEach(label => {
    label.addEventListener('click', () => {
      const input = label.querySelector('input[type="checkbox"]');
      const icon  = label.querySelector('.checkbox-icon');
      // 토글
      input.checked = !input.checked;
      icon.src = input.checked
        ? './static/images/icons/icon-checkbox-12=Activate.svg'
        : './static/images/icons/icon-checkbox-12=Deactivate.svg';
      // 그룹 카운트 갱신
      const groupEl = label.closest('.checklist-group');
      const boxes   = groupEl.querySelectorAll('input[type="checkbox"]');
      const countEl = groupEl.querySelector('.group-count');
      const checkedCount = [...boxes].filter(cb => cb.checked).length;
      countEl.textContent = `${checkedCount}/${boxes.length}`;
      // 폼 제출 (리다이렉트)
      document.getElementById('checklistSubmit').click();
    });
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
});
