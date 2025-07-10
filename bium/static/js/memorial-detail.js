document.addEventListener('DOMContentLoaded', () => {
  const params     = new URLSearchParams(location.search);
  const memorialId = params.get('memorial_id');
  if (!memorialId) {
    alert('잘못된 접근입니다.');
    return;
  }

  const btnBack     = document.getElementById('btnBack');
  const flowersEl   = document.getElementById('flowers');
  const commentForm = document.getElementById('commentForm');

  // form action 설정 (optional)
  commentForm.action = `/api/memorial/space/${memorialId}/messages/`;

  btnBack.addEventListener('click', () => history.back());

  flowersEl.addEventListener('click', e => {
    const f = e.target.closest('.flower');
    if (!f) return;
    flowersEl.querySelectorAll('.flower').forEach(x => x.classList.remove('selected'));
    f.classList.add('selected');
    const radio = f.querySelector('input[type=radio]');
    radio.checked = true;
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = btn.dataset.id;
      const current = document.getElementById(`text-${id}`).textContent;
      const newMsg  = prompt('댓글을 수정하세요:', current);
      if (newMsg === null) return;
      document.getElementById(`edit-input-${id}`).value = newMsg.trim();
      btn.closest('form').submit();
    });
  });
});
