let scores = localStorage.getItem("scores");
let data = localStorage.getItem("gh-cache");

let flag = false;

if(data != null || scores != null || username != null){
    scores = JSON.parse(scores);
    data = JSON.parse(data);
    if(data[username] == null) flag = true;
} else flag = true;
if(flag){
    alert("github username 정보가 없거나 데이터 로딩이 되지 않았습니다. 홈으로 이동합니다.")
    window.location.href = "../html/main.html";
}

const user = data[username];

const avatar = document.querySelector(".user-info__profile");
const username_element = document.querySelector(".user-info__name");
const personal_contributions_element = document.querySelector(".user-info__contributions_value");
const level = document.querySelector(".user-stats__level");
const class_contributions = document.querySelector(".user-details__class-contribution_value");
const personal_analysis = document.querySelector(".user-details__ai-analysis");


avatar.src = user.avatarUrl;
username_element.innerText = user.username;
personal_contributions_element.innerText = user.contributions;
level.innerText = Math.floor(user.contributions / 10);
class_contributions.innerText = `${(user.contributions / scores[user.classNo - 1].score * 100).toFixed(1)}%`;