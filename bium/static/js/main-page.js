// ── 세션 기반 로그인 확인 ──
async function checkLogin() {
  try {
    const res = await fetch('/api/users/check_login/', {
      method: 'GET',
      credentials: 'include'   // 세션 쿠키 자동 포함
    });
    if (!res.ok) {
      return false
    }
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

// ── 체크리스트 API 헬퍼 ──
let checklistData = [];

async function fetchChecklist() {
  const res = await fetch('/api/checklist/check/', {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('체크리스트 조회 실패');
  const json = await res.json();
  return json.data;  // [{ category, items:[{id,content,is_checked},…] }, …]
}

async function saveChecklist(items) {
  await fetch('/api/checklist/save/', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
}

// ── 페이지 로드 이후 초기화 ──
window.addEventListener('DOMContentLoaded', async () => {

  // 1) 사이드바 현재 페이지 강조
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-section').forEach(sec => {
    const hrefs = Array.from(sec.querySelectorAll('a'))
                       .map(a => a.href.split('/').pop());
    sec.classList.toggle('active', hrefs.includes(current));
  });

  // 2) 체크리스트 데이터 불러오기
  try {
    checklistData = await fetchChecklist();
  } catch (e) {
    console.error(e);
    checklistData = [];
  }

  // 3) 초기 화면에 체크 상태 및 카운트 반영
  document.querySelectorAll('.checklist-group').forEach(groupEl => {
    const category = groupEl.querySelector('.group-title').textContent.trim();
    const catData  = checklistData.find(c => c.category === category);
    if (!catData) return;

    // 항목별 상태 설정
    catData.items.forEach(item => {
      const label = [...groupEl.querySelectorAll('.item')]
        .find(l => l.querySelector('span').textContent.trim() === item.content);
      if (!label) return;
      const input = label.querySelector('input[type="checkbox"]');
      const icon  = label.querySelector('.checkbox-icon');
      input.checked = item.is_checked;
      icon.src = item.is_checked
        ? '../static/images/icons/icon-checkbox-12=Activate.svg'
        : '../static/images/icons/icon-checkbox-12=Deactivate.svg';
    });

    // 그룹 카운트 업데이트
    const boxes   = groupEl.querySelectorAll('input[type="checkbox"]');
    const countEl = groupEl.querySelector('.group-count');
    const checked = [...boxes].filter(cb => cb.checked).length;
    countEl.textContent = `${checked}/${boxes.length}`;
  });

  // 4) 체크박스 클릭 핸들러 등록 (상태 토글 & 저장)
  document.querySelectorAll('.item').forEach(label => {
    const input = label.querySelector('input[type="checkbox"]');
    const icon  = label.querySelector('.checkbox-icon');

    label.addEventListener('click', async () => {
      // 4-1) 토글 UI
      input.checked = !input.checked;
      icon.src = input.checked
        ? '../static/images/icons/icon-checkbox-12=Activate.svg'
        : '../static/images/icons/icon-checkbox-12=Deactivate.svg';

      // 4-2) 해당 그룹 카운트 갱신
      const groupEl = label.closest('.checklist-group');
      const boxes   = groupEl.querySelectorAll('input[type="checkbox"]');
      const countEl = groupEl.querySelector('.group-count');
      const checkedCount = [...boxes].filter(cb => cb.checked).length;
      countEl.textContent = `${checkedCount}/${boxes.length}`;

      // 4-3) 전체 항목의 최신 상태 수집
      const updatedItems = [];
      checklistData.forEach(cat => {
        cat.items.forEach(item => {
          const grpEl = [...document.querySelectorAll('.checklist-group')]
            .find(g => g.querySelector('.group-title').textContent.trim() === cat.category);
          const lbl = [...grpEl.querySelectorAll('.item')]
            .find(l => l.querySelector('span').textContent.trim() === item.content);
          const isChecked = lbl.querySelector('input[type="checkbox"]').checked;
          updatedItems.push({ id: item.id, is_checked: isChecked });
        });
      });

      // 4-4) 서버에 저장
      try {
        await saveChecklist(updatedItems);
      } catch (e) {
        console.error('체크리스트 저장 실패:', e);
      }
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
