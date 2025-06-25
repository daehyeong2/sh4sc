// 로그인 폼 요소 가져오기
const form = document.querySelector("form");
// 사용자 입력 필드 (GitHub 아이디 입력)
const username = document.getElementById("username");
// '닫기' 버튼 요소
const button_close = document.getElementById("close");

// 로그인 폼 제출 시 실행되는 함수
const onSubmit = (e) => {
    e.preventDefault();
    // 입력값이 비어있으면 경고
    if(username.value == "") {
        alert("값을 입력해 주세요.");
        return;
    }
    // 로컬 스토리지에 GitHub 아이디 저장
    localStorage.setItem("username", username.value);
    // 환영 메시지 표시 후 부모 페이지 새로고침
    alert(`${username.value}님, 환영합니다!`)
    parent.window.location.reload();
}

// 로그인 폼에 이벤트 리스너 등록
form.addEventListener("submit", onSubmit);
// 닫기 버튼 클릭 시 팝업 제거하는 함수
const onClose = () => {
    parent.document.querySelector("iframe").remove();
}
// 닫기 버튼에 이벤트 리스너 등록
button_close.addEventListener("click", onClose)
// 아래 줄은 의미 없는 남은 코드로 추정됨
const open_popup = document.getElementById("open_popup");
