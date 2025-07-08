let account = {};

window.onload = function () {
  document.getElementById("Login").addEventListener("click", async function () {
    const userId = document.getElementById("userId").value;
    const userPw = document.getElementById("userPasswd").value;
    const errMsg = "";

    try {
      const response = await fetch("./api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userId, password: userPw }),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        window.location.href = "main.html";
      } else {
        errMsg.textContent =
          result.message || "아이디 또는 비밀번호가 일치하지 않습니다.";
      }
    } catch (err) {
      // errMsg.textContent = 오류처리 메시지
    }
  });

  document.getElementById("SignUp").addEventListener("click", function () {
    window.location.href = "signup.html";
  });
};
