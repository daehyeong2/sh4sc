// localStorage에서 username 추출
const username = localStorage.getItem("username");
// 만약 username이 존재하지 않는다면 username을 입력받는 로그인 폼을 iframe을 이용한 팝업으로 띄움
if(username == null) {
    const iframe = document.createElement("iframe");
    iframe.src = "./popup_login.html"
    document.querySelector("body").appendChild(iframe);
}


const logoutBtn = document.getElementById("logout");
if(username){
    logoutBtn.style.display = "block";
    logoutBtn.addEventListener("click", () => {
        alert("로그아웃 되었습니다.")
        localStorage.removeItem("username")
        window.location.href = "./main.html";
    })
}