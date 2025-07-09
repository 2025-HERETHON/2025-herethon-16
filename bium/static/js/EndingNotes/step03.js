const nameMeaningVal = document.getElementById("name_meaning");
const nickVal = document.getElementById("nickname");
const favVal = document.getElementById("favorites");
const preferencesVal = document.getElementById("preferences");
const schoolVal = document.getElementById("school_days");
const workVal = document.getElementById("work_and_social_life");
const writingsVal = document.getElementById("writings");

const modal = document.querySelector(".modal");
const cancelBtn = document.getElementById("CancelBtn");
const modalDelete = document.querySelector(".modal-delete");
const modalSave = document.querySelector(".modal-button .modal-text");

function save(should_save = true) {
  return fetch("/api/will/family_record/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      name_meaning: nameMeaningVal.value,
      nickname: nickVal.value,
      favorites: favVal.value,
      preferences: preferencesVal.value,
      school_days: schoolVal.value,
      work_and_social_life: workVal.value,
      writings: writingsVal.value,
      should_save: should_save.toString(),
    }),
  });
}

cancelBtn.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "flex";
});

// 모달 닫기 (삭제하기)
modalDelete.addEventListener("click", function () {
  modal.style.display = "none";
  window.location.href = "/main-page/";
});

// 모달 닫기 (임시저장하기)
modalSave.addEventListener("click", function () {
  modal.style.display = "none";

  save(true)
    .then((Response) => Response.json())
    .then((data) => console.log("임시저장 성공"))
    .catch((error) => console.error("임시저장 Error", error));
});

window.onload = function () {
  document.getElementById("BeforeBtn").addEventListener("click", function () {
    window.location.href = "/will/step02/";
  });

  document.getElementById("NextBtn").addEventListener("click", function () {
    save(true)
      .then((Response) => Response.json())
      .then((data) => {
        console.log("step04 저장 성공");
        window.location.href = "/will/step04/";
      })
      .catch((error) => console.error("step04저장 Error", error));
  });
};
