// 배경 클릭 → 업로드
document.getElementById('coverFrame').addEventListener('click', _=>{
  document.getElementById('coverInput').click();
});
document.getElementById('coverInput').addEventListener('change', e=>{
  const f=e.target.files[0]; if(!f)return;
  document.getElementById('coverFrame').style.backgroundImage=
    `url(${URL.createObjectURL(f)})`;
});

const btnBack = document.querySelector(".btn-back");
  btnBack.addEventListener("click", () => {
    window.location.href= "memorial-page.html";
  });

// 프로필 업로드
document.getElementById('profileUploadBtn').addEventListener('click', _=>{
  document.getElementById('profileInput').click();
});
document.getElementById('profileInput').addEventListener('change', e=>{
  const f=e.target.files[0]; if(!f)return;
  document.getElementById('profileImg').src=URL.createObjectURL(f);
});

// 내용 수정 토글
const editToggle=document.getElementById('editToggle');
const desc=document.getElementById('description');
editToggle.addEventListener('click', ()=>{
  const edit=desc.getAttribute('contenteditable')==='true';
  desc.setAttribute('contenteditable', !edit);
  editToggle.querySelector('span').textContent = edit? '내용 수정하기':'저장하기';
  if(!edit){ desc.focus(); document.execCommand('selectAll',false,null); document.getSelection().collapseToEnd(); }
});

// 대리인 지정하기
const delegateBtn = document.getElementById('delegateBtn');
const overlay = document.getElementById('overlay');
delegateBtn.addEventListener('click', ()=>{
  overlay.classList.remove('hidden');
  setTimeout(()=>overlay.classList.add('hidden'),1500);
});
