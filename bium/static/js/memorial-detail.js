document.addEventListener('DOMContentLoaded', async () => {
  // — URL에서 memorial_id 꺼내기 —
  const params = new URLSearchParams(location.search);
  const memorialId = params.get('memorial_id');
  if (!memorialId) {
    alert('잘못된 접근입니다.');
    return;
  }

  // — 요소 참조 —
  const btnBack        = document.getElementById('btnBack');
  const coverFrame     = document.getElementById('coverFrame');
  const profileImg     = document.getElementById('profileImg');
  const memorialTitle  = document.getElementById('memorialTitle');
  const memorialName   = document.getElementById('memorialName');
  const memorialDates  = document.getElementById('memorialDates');
  const profileDescSec = document.getElementById('profileDescription');
  const openedDate     = document.getElementById('openedDate');
  const commentInfo    = document.getElementById('commentInfo');
  const flowersEl      = document.getElementById('flowers');
  const commentList    = document.getElementById('comment-list');
  const sendBtn        = document.getElementById('send-btn');
  const commentInput   = document.getElementById('comment-input');

  let selectedFlower  = null;  // data-path 값

  // — 뒤로가기 —
  btnBack.addEventListener('click', () => history.back());

  // — 꽃 선택 로직 —
  flowersEl.addEventListener('click', e => {
    const f = e.target.closest('.flower');
    if (!f) return;
    flowersEl.querySelectorAll('.flower').forEach(x => x.classList.remove('selected'));
    f.classList.add('selected');
    selectedFlower = f.dataset.path; 
  });

  // — API: 단일 추모공간 조회 —
  try {
    const res = await fetch(`/api/memorial/space/${memorialId}/`, {
      credentials: 'include'
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || res.statusText);

    const m = json.memorial;
    // 1) 제목 / 이름
    memorialName.textContent  = m.name;
    memorialTitle.textContent = `故 ${m.name} 님의 추모공간`;

    // 2) 날짜
    const bd = new Date(m.birth_date).toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
    const dd = new Date(m.death_date).toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
    memorialDates.textContent  = `${bd} – ${dd}`;

    // 3) 커버 / 프로필
    if (m.background_image) {
      coverFrame.style.backgroundImage =
        `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%), url(${m.background_image})`;
    }
    if (m.profile_image) {
      profileImg.src = m.profile_image;
    }

    // 4) 소개
    profileDescSec.innerHTML = `<p>${m.description}</p>`;

    // 5) 개설일
    const created = new Date(m.created_at).toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
    openedDate.textContent = `이 추모공간은 ${created}에 개설되었습니다.`;

  } catch (err) {
    console.error(err);
    alert('추모공간 정보를 불러오지 못했습니다.');
    return;
  }

  // — API: 댓글 조회 —
  async function loadComments() {
    commentList.innerHTML = '';
    try {
      const res = await fetch(`/api/memorial/space/${memorialId}/messages/`, {
        credentials: 'include'
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      json.messages.forEach(msg => {
        const card = document.createElement('div');
        card.className = 'comment-card';
        card.innerHTML = `
          <img src="${msg.flower_image}" alt="꽃"/>
          <div class="comment-content">
            <div class="meta">
              <span class="name">${msg.writer}</span>
              <span class="date">${new Date(msg.created_at)
                .toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})}</span>
            </div>
            <div class="comment-actions">
              <button class="edit-btn" data-id="${msg.id}">수정</button>
              <span class="separator">|</span>
              <button class="delete-btn" data-id="${msg.id}">삭제</button>
            </div>
          </div>
          <div class="text" data-id="${msg.id}">${msg.message}</div>
        `;
        commentList.append(card);
      });

      // 댓글 수 업데이트
      commentInfo.textContent = `${json.messages.length}명이 함께 꽃으로 기억을 이어가고 있습니다.`;

      // 수정·삭제 핸들러
      commentList.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const textEl = commentList.querySelector(`.text[data-id="${id}"]`);
          const newMsg = prompt('댓글을 수정하세요:', textEl.textContent);
          if (newMsg===null) return;
          const fd = new FormData();
          fd.append('message', newMsg);
          // flower 그대로 re-send
          const flower = textEl.previousElementSibling
                          .previousElementSibling
                          .querySelector('img').src;
          fd.append('flower_image', flower);
          const r = await fetch(`/api/memorial/space/messages/${id}/`, {
            method: 'PUT',
            credentials: 'include',
            body: fd
          });
          const j = await r.json();
          if (r.ok && j.success) {
            textEl.textContent = newMsg;
          } else {
            alert(j.message || '수정에 실패했습니다.');
          }
        });
      });

      commentList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('정말 삭제하시겠습니까?')) return;
          const id = btn.dataset.id;
          const r = await fetch(`/api/memorial/space/messages/${id}/`, {
            method: 'DELETE',
            credentials: 'include'
          });
          const j = await r.json();
          if (r.ok && j.success) {
            loadComments();
          } else {
            alert(j.message || '삭제에 실패했습니다.');
          }
        });
      });

    } catch (err) {
      console.error(err);
      alert('댓글을 불러오지 못했습니다.');
    }
  }

  await loadComments();

  // — 댓글 작성 —
  sendBtn.addEventListener('click', async () => {
    const msg = commentInput.value.trim();
    if (!msg || !selectedFlower) return;
    const fd = new FormData();
    fd.append('message', msg);
    fd.append('flower_image', selectedFlower);

    try {
      const res = await fetch(`/api/memorial/space/${memorialId}/messages/`, {
        method: 'POST',
        credentials: 'include',
        body: fd
      });
      const j = await res.json();
      if (res.ok && j.success) {
        commentInput.value = '';
        flowersEl.querySelectorAll('.flower').forEach(x => x.classList.remove('selected'));
        selectedFlower = null;
        await loadComments();
      } else {
        alert(j.message || '작성에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('작성 중 오류가 발생했습니다.');
    }
  });

});
