// main-page.js
// ── CSRF 헬퍼 ──
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    document.cookie.split(';').forEach(cookie => {
      const [k, v] = cookie.trim().split('=');
      if (k === name) cookieValue = decodeURIComponent(v);
    });
  }
  return cookieValue;
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. 사이드바 토글
  const sidebar = document.getElementById('sidebar');
  const mainFrame = document.querySelector('.main-frame');
  document.getElementById('openSidebar').addEventListener('click', () => {
    sidebar.classList.add('open');
    mainFrame.classList.add('blurred');
  });
  document.getElementById('closeSidebar').addEventListener('click', () => {
    sidebar.classList.remove('open');
    mainFrame.classList.remove('blurred');
  });

  // 2) 체크리스트 저장
  const form    = document.getElementById('checklistForm');
  const saveUrl = form.action;
  const csrftoken = getCookie('csrftoken');

  document.querySelectorAll('.checklist-wrapper input[type="checkbox"]')
    .forEach(input => {
      const icon  = input.closest('.item').querySelector('.checkbox-icon');
      const group = input.closest('.checklist-group');

      input.addEventListener('change', async () => {
        // UI 업데이트
        icon.src = input.checked
          ? '/static/images/icons/icon-checkbox-12=Activate.svg'
          : '/static/images/icons/icon-checkbox-12=Deactivate.svg';

        const total   = group.querySelectorAll('input[type="checkbox"]').length;
        const checked = [...group.querySelectorAll('input[type="checkbox"]')]
                          .filter(cb => cb.checked).length;
        group.querySelector('.group-count').textContent = `${checked}/${total}`;

        // AJAX 저장
        try {
          const res = await fetch(saveUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
              checklist: [
                { item_id: +input.value, is_checked: input.checked }
              ]
            })
          });
          const json = await res.json();
          if (!json.success) console.error('저장 실패:', json.message);
        } catch (err) {
          console.error('네트워크 오류:', err);
        }
      });
    });

  // 3. FAQ 토글 (클릭하면 답변 보이기/숨기기 + 아이콘 교체)
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const icon = btn.querySelector('.icon-dropdown');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      icon.src = `/static/images/icons/icon-dropdown-20=${isOpen ? 'up' : 'down'}.svg`;
    });
  });
});
