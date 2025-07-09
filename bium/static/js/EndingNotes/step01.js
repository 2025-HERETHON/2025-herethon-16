window.onload = function () {
  const nameVal = document.getElementById("name");
  const birthDateVal = document.getElementById("birth_date");
  const phoneVal = document.getElementById("phone_number");
  const birthPlaceVal = document.getElementById("birth_place");
  const registerVal = document.getElementById("registered_domicile");
  const currentDiseasesVal = document.getElementById("current_diseases");
  const pastDiseasesVal = document.getElementById("past_diseases");
  const constitutionVal = document.getElementById("constitution");
  const familyVal = document.getElementById("family_tree");

  const modal = document.querySelector(".modal");
  const cancelBtn = document.getElementById("CancelBtn");
  const modalDelete = document.querySelector(".modal-delete");
  const modalSave = document.querySelector(".modal-button .modal-text");

  function getGenderValue() {
    const genderRadios = document.getElementsByName("gender");
    for (let radio of genderRadios) {
      if (radio.checked) {
        return radio.id;
      }
    }
    return "";
  }

  function saveBasicInfo(should_save = true) {
    return fetch("/api/will/basic_info/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        name: nameVal.value,
        birth_date: birthDateVal.value,
        gender: getGenderValue(),
        phone_number: phoneVal.value,
        birth_place: birthPlaceVal.value,
        registered_domicile: registerVal.value,
        current_diseases: currentDiseasesVal.value,
        past_diseases: pastDiseasesVal.value,
        constitution: constitutionVal.value,
        family_tree: familyVal.value,
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

  document.getElementById("NextBtn").addEventListener("click", function () {
    saveBasicInfo(true)
      .then((Response) => Response.json())
      .then((data) => {
        console.log("step01 저장 성공");
        window.location.href = "/will/step02/";
      })
      .catch((error) => console.error("step01 저장 Error", error));
  });
};
