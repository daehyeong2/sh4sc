const form = document.querySelector("form");
const username = document.getElementById("username");
const button_close = document.getElementById("close");

const onSubmit = (e) => {
    e.preventDefault();
    if(username.value == "") {
        alert("값을 입력해 주세요.");
        return;
    }
    localStorage.setItem("username", username.value);
    alert(`${username.value}님, 환영합니다!`)
    parent.window.location.reload();
}

form.addEventListener("submit", onSubmit);

const onClose = () => {
    parent.document.querySelector("iframe").remove();
}

button_close.addEventListener("click", onClose)

const open_popup = document.getElementById("open_popup");
