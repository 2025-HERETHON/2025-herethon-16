document.addEventListener("DOMContentLoaded", async () => {
  const stepsData = [
    { label: '나의 기본 정보',       desc: '이름과 생년월일, 성별, 전화번호 등 나의 기본 정보를 작성해요.' },
    { label: '가족에 대한 기록',     desc: '부모님과 형제자매의 이름, 생년월일, 연락처 등을 자유롭게 적어주세요.' },
    { label: '나에 대하여',         desc: '내 이름의 뜻과 별명, 좋아한 것들 등 나에 대해 다시 한번 생각해봐요.' },
    { label: '반려동물',           desc: '현재 함께하는 반려동물의 이름과 종, 생일 등을 기록하고 돌봄 책임자도 지정해요.' },
    { label: '장례 관련',           desc: '원하는 장례 방식과 초대할 손님, 희망사항 등을 적어주세요.' },
    { label: '의료와 간병 준비',     desc: '연명의료 의사 여부, 신체 기증 의사 등을 작성하세요.' },
    { label: '유언과 상속',         desc: '부모님/친구에게 남기고 싶은 말을 작성하고 상속 내용을 적어주세요.' },
    { label: '향후 해보고 싶은 것들', desc: '죽기 전, 해보고 싶은 목록을 생각해봐요.' },
    { label: '후견인 선택',         desc: '내 판단력이 흐려질 경우 나를 대신할 후견인을 지정해주세요.' },
    { label: '유품 분배 및 정리',     desc: '사후에 분배 및 정리할 유품 목록을 정리해요.' }
  ];

  let completedStep = 0; // 초기값 설정

  try {
    // 실제 API 호출로 변경
    const response = await fetch('/api/will/progress_step/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // 필요하다면 인증토큰 헤더 추가 ex) 'Authorization': 'Bearer <token>'
      }
    });

    const result = await response.json();

    if (response.ok && result.success) {
      completedStep = result.progress_step;
    } else {
      alert("진행 단계를 불러오지 못했습니다.");
      return; // 에러 발생 시 이후 코드 실행하지 않음
    }
  } catch (error) {
    console.error('API 호출 중 오류:', error);
    alert("서버와 통신 중 오류가 발생했습니다.");
    return; // 네트워크 오류 시 이후 코드 실행하지 않음
  }

  document.getElementById("completedCount").textContent = completedStep;
  const container = document.getElementById("stepsContainer");

  stepsData.forEach((step, i) => {
    const num = i + 1;
    let state = num < completedStep
      ? "completed"
      : num === completedStep
        ? "current"
        : "pending";

    const iconPath = state === "completed"
      ? "../static/images/icons/icon-progress-20=Done.svg"
      : state === "pending"
        ? "../static/images/icons/icon-progress-20=Not Started.svg"
        : "";

    const wrapper = document.createElement("div");
    wrapper.className = `step ${state}`;
    wrapper.innerHTML = `
      <div class="marker">
        ${state !== "current"
          ? `<img class="icon" src="${iconPath}" alt="${state} 아이콘">`
          : `<div class="icon"></div>`
        }
        ${num < stepsData.length ? `<div class="line"></div>` : ""}
      </div>
      <div class="content">
        <div class="title">${step.label}</div>
        <div class="desc">${step.desc}</div>
      </div>
    `;
    container.appendChild(wrapper);
  });

  document.querySelector(".btn-back").addEventListener("click", () => {
    window.location.href = "main-page.html";
  });
});
