document.addEventListener("DOMContentLoaded", () => {
  const backBtn     = document.getElementById("backBtn");
  const searchBtn   = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsEl   = document.getElementById("results");
  const noResEl     = document.getElementById("noResults");

  // 뒤로가기 버튼
  backBtn.addEventListener("click", () => {
    window.location.href = "memorial-page.html";
  });

  // 🔍 검색 실행
  async function doSearch() {
    const term = searchInput.value.trim().toLowerCase();
    resultsEl.innerHTML = "";

    if (!term) {
      noResEl.style.display = "none";
      return;
    }

    try {
      const res = await fetch("/api/memorial/space/", {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error("API 요청 실패");

      const filtered = data.memorials.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );

      if (filtered.length === 0) {
        noResEl.style.display = "block";
      } else {
        noResEl.style.display = "none";
        filtered.forEach(item => {
          const card = document.createElement("a");
          card.href = `memorial-detail.html?memorial_id=${item.id}`;
          card.className = "card other-card";
          card.innerHTML = `
            <img class="avatar" src="${item.profile_image || '../static/images/assets/profile.jpg'}" alt="프로필"/>
            <div class="info">
              <h3 class="name">${item.name}</h3>
              <p class="desc">${item.description}</p>
              <p class="dates">${formatDate(item.birth_date)} – ${formatDate(item.death_date)}</p>
            </div>
          `;
          resultsEl.appendChild(card);
        });
      }
    } catch (e) {
      console.error("검색 중 오류:", e);
      noResEl.textContent = "검색에 실패했습니다.";
      noResEl.style.display = "block";
    }
  }

  function formatDate(isoStr) {
    const d = new Date(isoStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }

  searchBtn.addEventListener("click", e => {
    e.preventDefault();
    doSearch();
  });

  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  });
});
