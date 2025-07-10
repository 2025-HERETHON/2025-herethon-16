let account = {};
const id = document.getElementById("username");
const passwd = document.getElementById("password");
const ErrorMsgEl = document.querySelector(".id-error-msg");

id.addEventListener("input", () => {
  const idRegExp = /^[a-zA-Z0-9]{4,}$/; // 4글자 이상의 영문 소문자와 숫자
  if (idRegExp.test(id.value)) {
    // 유효성 검사 성공
    ErrorMsgEl.textContent = "";
    account.id = id.value;
    id.classList.remove("Input-ErrorBox");
  } else {
    // 유효성 검사 실패
    ErrorMsgEl.textContent = errMsg.id.invalid;
    account.id = null;
    id.classList.add("Input-ErrorBox");
  }
  console.log(account);
});

passwd.addEventListener("input", () => {
  const passwdRegExp = /^[a-zA-Z0-9]{6,}$/; // 4글자 이상의 영문 소문자와 숫자
  if (passwdRegExp.test(passwd.value)) {
    // 유효성 검사 성공
    ErrorMsgEl.textContent = "";
    account.passwd = passwd.value;
    passwd.classList.remove("Input-ErrorBox");
  } else {
    // 유효성 검사 실패
    ErrorMsgEl.textContent = errMsg.passwd.invalid;
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

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("BackBtn").addEventListener("click", function () {
    window.location.href = "/users/login/";
  });

  document.getElementById("SignupForm").addEventListener("submit", function () {
    console.log("회원가입 완료!");
    window.location.href = "/admin/";
  });
});
