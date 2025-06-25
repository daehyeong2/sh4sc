// 로컬스토리지에서 점수 및 깃허브 사용자 캐시 불러오기
let scores = localStorage.getItem("scores");
let data = localStorage.getItem("gh-cache");
// 예외 처리를 위한 플래그 (기본: false)
let flag = false;
// 사용자 정보 또는 점수 정보가 없거나, 유저 정보가 캐시에 없다면 flag → true
if(data != null || scores != null || username != null){
    scores = JSON.parse(scores); // 문자열 → 객체
    data = JSON.parse(data);
    if(data[username] == null) flag = true; // 유저 데이터가 캐시에 없음
} else flag = true;
// 유효하지 않은 경우 홈으로 리다이렉트
if(flag){
    alert("github username 정보가 없거나 데이터 로딩이 되지 않았습니다. 홈으로 이동합니다.")
    window.location.href = "../html/main.html";
}
// 정상 데이터 로드: 해당 유저 데이터 가져오기
const user = data[username];
// DOM 요소들 불러오기
const avatar = document.querySelector(".user-info__profile");
const username_element = document.querySelector(".user-info__name");
const personal_contributions_element = document.querySelector(".user-info__contributions_value");
const level = document.querySelector(".user-stats__level");
const class_contributions = document.querySelector(".user-details__class-contribution_value");
const personal_analysis = document.querySelector(".user-details__ai-analysis");

// 화면에 사용자 데이터 출력
avatar.src = user.avatarUrl;
username_element.innerText = user.username;
personal_contributions_element.innerText = user.contributions;
level.innerText = Math.floor(user.contributions / 10);
class_contributions.innerText = `${(user.contributions / scores[user.classNo - 1].score * 100).toFixed(1)}%`;