let account = {};
const name = document.getElementById("Name");
const birth = document.getElementById("Birth");
const phone = document.getElementById("Phone");
const id = document.getElementById("Id");
const passwd = document.getElementById("Passwd");
const idErrorMsgEl = document.querySelector(".id-error-msg");
const passwdErrorMsgEl = document.querySelector(".passwd-error-msg");

id.addEventListener("change", () => {
  const idRegExp = /^[a-zA-Z0-9]{4,}$/; // 4글자 이상의 영문 소문자와 숫자
  if (idRegExp.test(id.value)) {
    // 유효성 검사 성공
    idErrorMsgEl.textContent = "";
    account.id = id.value;
    id.classList.remove("Input-ErrorBox");
  } else {
    // 유효성 검사 실패
    idErrorMsgEl.textContent = errMsg.id.invalid;
    account.id = null;
    id.classList.add("Input-ErrorBox");
  }
  console.log(account);
});

passwd.addEventListener("change", () => {
  const passwdRegExp = /^[a-zA-Z0-9]{6,}$/; // 4글자 이상의 영문 소문자와 숫자
  if (passwdRegExp.test(passwd.value)) {
    // 유효성 검사 성공
    passwdErrorMsgEl.textContent = "";
    account.id = passwd.value;
    passwd.classList.remove("Input-ErrorBox");
  } else {
    // 유효성 검사 실패
    passwdErrorMsgEl.textContent = errMsg.passwd.invalid;
    account.passwd = null;
    passwd.classList.add("Input-ErrorBox");
  }
  console.log(account);
});

const errMsg = {
  id: {
    invalid: "아이디는 4자 이상 작성해주세요",
  },
  passwd: {
    invalid: "비밀번호는 영문과 숫자를 포함하여 6자 이상 작성해주세요",
  },
};

document.getElementById("signupForm").addEventListener("submit", function (e) {
  const nameVal = name.value;
  const birthVal = birth.value;
  const phoneVal = phone.value;
  const idVal = id.value;
  const passwdVal = passwd.value;

  // 조건 별로 추가적으로 뜨게 할지.. 흠
  fetch("/api/users/signup/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      username: idVal,
      password: passwdVal,
      name: nameVal,
      birth_date: birthVal,
      phone_number: phoneVal,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success === false) {
        if (result.message === "이미 존재하는 아이디입니다.") {
          idErrorMsgEl.textContent = "이미 존재하는 아이디입니다.";
          account.id = null;
          id.classList.add("Input-ErrorBox");
        }
      } else {
        //성공
        idErrorMsgEl.textContent = "";
        account.id = id.value;
        id.classList.remove("Input-ErrorBox");
        window.location.href = "main-page.html";
      }
    });
});

window.onload = function () {
  document.getElementById("BackBtn").addEventListener("click", function () {
    window.location.href = "login.html";
  });
};
