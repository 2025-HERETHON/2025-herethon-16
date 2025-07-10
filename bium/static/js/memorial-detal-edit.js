// memorial-detail.js
document.addEventListener('DOMContentLoaded', () => {
  // — 꽃 선택 & count 업데이트 변수 선언 —
  const flowersEl   = document.getElementById('flowers');
  const infoEl      = document.querySelector('.comment-info');
  let selectedFlowerUrl = null;

  // — 꽃 클릭 이벤트 —
  flowersEl.addEventListener('click', e => {
    const f = e.target.closest('.flower');
    if (!f) return;
    // 기존 선택 해제
    flowersEl.querySelectorAll('.flower').forEach(el => el.classList.remove('selected'));
    // 새로 선택
    f.classList.add('selected');
    // background-image:url('…') → '…'
    selectedFlowerUrl = f.style.backgroundImage.slice(5, -2);
  });

  // — 뒤로가기 버튼 —
  const btnBack = document.querySelector('.btn-back');
  btnBack.addEventListener('click', () => {
    window.location.href = 'memorial-page.html';
  });

  // — 댓글 등록 관련 변수 선언 —
  const sendBtn     = document.getElementById('send-btn');
  const inputEl     = document.getElementById('comment-input');
  const commentList = document.getElementById('comment-list');

  // — 댓글 전송 클릭 —
  sendBtn.addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (!text || !selectedFlowerUrl) {
      // 메시지 혹은 꽃이 선택되지 않았으면 아무 동작도 하지 않습니다.
      return;
    }

    // 날짜 포맷 (YYYY.MM.DD)
    const date = new Date().toISOString().slice(0,10).replace(/-/g,'.');

    // 댓글 카드 엘리먼트 생성
    const card = document.createElement('div');
    card.className = 'comment-card';
    card.innerHTML = `
      <img src="${selectedFlowerUrl}" alt="꽃"/>
      <div class="comment-content">
        <div class="meta">
          <span class="name">이름없음</span>
          <span class="date">${date}</span>
        </div>
        <div class="comment-actions">
          <button class="edit-btn">수정</button>
          <span class="separator">|</span>
          <button class="delete-btn">삭제</button>
        </div>
      </div>
      <div class="text">${text}</div>
      </div>
    `;

    // 카드 붙이기
    commentList.append(card);
    // 입력창 초기화
    inputEl.value = '';

    // 꽃·입력 비활성화
    selectedFlowerUrl = null;
    flowersEl.querySelectorAll('.flower').forEach(el => el.classList.remove('selected'));

    // 댓글 수 업데이트
    const count = commentList.children.length;
    infoEl.textContent = `${count}명이 함께 꽃으로 기억을 이어가고 있습니다.`;

    // — 등록된 카드에 수정/삭제 이벤트 달기 —
    const editBtn   = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    const textEl    = card.querySelector('.text');

    editBtn.addEventListener('click', () => {
      const newText = prompt('댓글을 수정하세요:', textEl.textContent);
      if (newText !== null) {
        textEl.textContent = newText.trim();
      }
    });

    deleteBtn.addEventListener('click', () => {
      if (confirm('정말 삭제하시겠습니까?')) {
        card.remove();
        const newCount = commentList.children.length;
        infoEl.textContent = `${newCount}명이 함께 꽃으로 기억을 이어가고 있습니다.`;
      }
    });
  });
});
