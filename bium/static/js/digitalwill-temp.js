// 단계 데이터 (실제 API 에 맞춰 교체 필요)
const stepsData = [
  {
    title: "나의 기본 정보",
    desc:  "이름과 생년월일, 성별, 전화번호 등 나의 기본 정보를 작성해요.",
    status:"done",
    url:   "/memorial/my-info"
  },
  {
    title: "가족에 대한 기록",
    desc:  "부모님과 형제자매의 이름, 생년월일, 연락처 등을 자유롭게 적어주세요.",
    status:"done",
    url:   "/memorial/family"
  },
  {
    title: "나에 대하여",
    desc:  "내 이름의 뜻과 별명, 좋아한 것들 등 나에 대해 다시 한 번 생각해봐요.",
    status:"current",
    url:   "/memorial/about-me"
  },
  {
    title: "반려동물",
    desc:  "현재 함께하고 있는 반려동물의 이름과 종, 생일 등을 기록하고, 내가 맡길 수 없는 상황이 되었을 떄의 돌봄 책임자 등을 지정해주세요",
    status:"upcoming",
    url:   "/memorial/pets"
  },
  {
    title: "장례 관련",
    desc:  "원하는 장례 방식과 초대하고 싶은 손님, 희망사항 등을 적어주세요.",
    status:"upcoming",
    url:   "/memorial/pets"
  },
    {
    title: "의료와 간병에 대한 준비",
    desc:  "종말 의료, 신체 기증의 신청 여부나 연명치료의 희망 유무 등을 작성해주세요.",
    status:"upcoming",
    url:   "/memorial/pets"
  },
    {title: "유언과 상속",
    desc:  "부모님께, 친구에게 남기고 싶은 말을 작성하고 상속에 대해 작성해주세요.",
    status:"upcoming",
    url:   "/memorial/pets"
  },
    {title: "향후 해보고 싶은 것들",
    desc:  "죽기 전, 해보고 싶은 목록을 생각해봐요.",
    status:"upcoming",
    url:   "/memorial/pets"
  },
    {title: "후견인 선택",
    desc:  "내가 판단력이 흐려질 경우 나를 대신할 후견인을 지정해주세요",
    status:"upcoming",
    url:   "/memorial/pets"
  },
  {title: "유품 분배 및 정리",
    desc:  "사후에 버려졌으면 하는 목록과 분배되었으면 하는 유품을 정리해봐요",
    status:"upcoming",
    url:   "/memorial/pets"
  }
];

function renderSteps() {
  const container = document.getElementById("steps");
  const doneCount  = stepsData.filter(s => s.status === "done").length;
  document.getElementById("done-count").textContent = doneCount;

  stepsData.forEach((step, idx) => {
    const el = document.createElement("article");
    el.className = `step ${step.status}`;
    el.onclick   = () => location.href = step.url;

    // 인디케이터
    const ind = document.createElement("div");
    ind.className = "indicator";
    const icon = document.createElement("img");
    icon.src     = step.status === "done"
      ? "/static/images/icons/check-circle.svg"
      : "/static/images/icons/circle.svg";
    icon.alt     = step.status;
    ind.appendChild(icon);

    // 커넥터
    if (idx < stepsData.length - 1) {
      const conn = document.createElement("div");
      conn.className = "connector";
      ind.appendChild(conn);
    }

    // 컨텐츠
    const content = document.createElement("div");
    content.className = "content";
    content.innerHTML = `
      <h3 class="title">${step.title}</h3>
      <p  class="desc">${step.desc}</p>
    `;

    el.append(ind, content);
    container.append(el);
  });
}

window.addEventListener("DOMContentLoaded", renderSteps);
