document.addEventListener('DOMContentLoaded', () => {
  const params     = new URLSearchParams(location.search);
  const memorialId = params.get('memorial_id');
  if (!memorialId) {
    alert('잘못된 접근입니다.');
    return;
  }

  const btnBack     = document.getElementById('btnBack');
  const currentUsername = window.currentUsername || '';
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
  
  // 내가 만든 공간인지 확인하고 연필 아이콘 보여주기
fetch(`/api/memorial/space/${memorialId}/`)
  .then(res => res.json())
  .then(data => {
    const memorial = data.memorial;
    const username = data.memorial.creator_username;
    
    // // 서버가 전달한 현재 로그인 유저명 (추정)
    // const currentUsername = '{{ user.username }}'; // 서버 렌더링 변수 삽입 필요

    if (username === currentUsername) {
      const editForm = document.getElementById('editForm');
      const idInput = document.getElementById('editFormId');
      idInput.value = memorialId;
      editForm.style.display = 'block';
    }
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
