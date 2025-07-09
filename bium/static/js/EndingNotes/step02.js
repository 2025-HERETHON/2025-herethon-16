window.onload = function () {
  const motherVal = document.getElementById("mother_record");
  const fatherVal = document.getElementById("father_record");
  const siblingsVal = document.getElementById("sibligs_record");

  const modal = document.querySelector(".modal");
  const cancelBtn = document.getElementById("CancelBtn");
  const modalDelete = document.querySelector(".modal-delete");
  const modalSave = document.querySelector(".modal-button .modal-text");

  function saveFamilyRecord(should_save = true) {
    return fetch("/api/will/family_record/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        mother_record: motherVal.value,
        father_record: fatherVal.value,
        siblings_record: siblingsVal.value,
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

    saveBasicInfo(true)
      .then((Response) => Response.json())
      .then((data) => console.log("임시저장 성공"))
      .catch((error) => console.error("임시저장 Error", error));
  });

  document.getElementById("BeforeBtn").addEventListener("click", function () {
    window.location.href = "/will/step01/";
  });

  document.getElementById("NextBtn").addEventListener("click", function () {
    // saveFamilyRecord(true)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("step02 저장 성공");
    //     window.location.href = "/will/step03/";
    //   })
    //   .catch((error) => console.error("step02 저장 오류", error));
    window.location.href = "/will/step03/";
  });
};
