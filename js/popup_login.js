const form = document.getElementById("input-id");
const username = document.getElementById("username");
const button_close = document.getElementById("close");

const onSubmit = () => {
    alert(`${username.value}님, 환영합니다!`)
    window.close()
}

form.addEventListener("submit", onSubmit);

const onClose = () => {
    window.close()
}

button_close.addEventListener("click", onClose)

const open_popup = document.getElementById("open_popup");
