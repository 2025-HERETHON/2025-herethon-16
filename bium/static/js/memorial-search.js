// memorial-search.js
document.addEventListener("DOMContentLoaded", () => {
  const backBtn     = document.getElementById("backBtn");
  const searchBtn   = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsEl   = document.getElementById("results");
  const noResEl     = document.getElementById("noResults");

  // 모의 데이터: 실제로는 API 호출하시면 됩니다.
  const mockData = [
    {
      id: 1,
      name: "김이름",
      desc: "이 추모공간은 우리가 사랑했던 김이름님을 위해 만들어졌습니다.",
      dates: "2001년 1월 1일 – 2025년 5월 5일",
      avatar: "../static/images/assets/profile.jpg"
    },
    {
      id: 2,
      name: "박철수",
      desc: "추모 내용, 2줄 넘어가면 말줄임표",
      dates: "1990년 6월 10일 – 2023년 12월 24일",
      avatar: "../static/images/assets/profile2.jpg"
    },
    // 이 아래에 더 추가…
  ];

  // 뒤로가기
  backBtn.addEventListener("click", () => {
    window.location.href= "memorial-page.html";
  });

  // 검색 실행 함수
  function doSearch() {
    const term = searchInput.value.trim().toLowerCase();
    resultsEl.innerHTML = "";

    if (!term) {
      // 아무것도 입력 안 하면 빈 화면 (아무것도 안 보임)
      noResEl.style.display = "none";
      return;
    }

    // 필터링
    const filtered = mockData.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.desc.toLowerCase().includes(term)
    );

    if (filtered.length === 0) {
      noResEl.style.display = "block";
    } else {
      noResEl.style.display = "none";
      filtered.forEach(item => {
        const card = document.createElement("a");
        card.href = `/memorial/${item.id}`;
        card.className = "card other-card";
        card.innerHTML = `
          <img class="avatar" src="${item.avatar}" alt="프로필"/>
          <div class="info">
            <h3 class="name">${item.name}</h3>
            <p class="desc">${item.desc}</p>
            <p class="dates">${item.dates}</p>
          </div>
        `;
        resultsEl.append(card);
      });
    }
  }

  // 검색 버튼 / Enter 키
  searchBtn.addEventListener("click", doSearch);
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") doSearch();
  });
});
