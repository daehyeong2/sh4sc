import env from "./env.js";

// 로컬스토리지에서 점수 및 깃허브 사용자 캐시 불러오기
let scores = localStorage.getItem("scores");
let data = localStorage.getItem("gh-cache");
const view_user = localStorage.getItem("view-user");

// openai api 이용 시 사용할 헤더 정의
const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.OPENAI_KEY}`
}

const generateAnalysis = async (username) => {
    const user_grass_data = await(await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)).json();
    user_grass_data.contributions = user_grass_data.contributions.slice(0, 365);
    // openai api를 이용해 데이터 가져오기
    const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers,
        body: JSON.stringify({
            model: "gpt-4.1-nano",
            "input": `
                아래에 깃허브 사용자의 잔디 로그를 보고 최근 잔디 상태를 분석해서 커밋 전략을 수립해줘.
                (현재 날짜: ${new Date().toISOString()})
                위의 현재 날짜를 기반으로 최근 커밋을 분석하고, 분석 대상자가 고등하굑 1학년이라는걸 감안해서 작성해줘.
                글자는 200자 이하로 작성해줘. (마크다운 형식이 아닌 줄글 형식으로 핵심 요약을 해줘)
                
                데이터:
                ${JSON.stringify(user_grass_data)}
            `
        }),
    })
    if(!res.ok) alert("AI 생성 중 오류가 발생했습니다.");
    const body = await res.json();
    return body.output[0].content[0].text
}

// 예외 처리를 위한 플래그 (기본: false)
let flag = false;

// 사용자 정보 또는 점수 정보가 없거나, 유저 정보가 캐시에 없다면 flag → true
if(data != null || scores != null || (username != null || view_user != null)){
    scores = JSON.parse(scores);
    data = JSON.parse(data);
    if(data[username] == null && data[view_user] == null) flag = true;
} else flag = true;
// 유효하지 않은 경우 홈으로 리다이렉트
if(flag){
    localStorage.removeItem("username");
    alert("github username 정보가 없거나 데이터 로딩이 되지 않았습니다. 홈으로 이동합니다.")
    window.location.href = "../html/main.html";
}

// 개인 랭킹을 통해 유저 페이지에 들어온 경우 view_user가 존재하므로 해당 유저로 user를 정의하고, 그렇지 않다면 현재 로그인한 계정의 정보로 정의함
let user;
if(view_user){
    if(data[view_user]) {
        user = data[view_user];
        document.getElementById("grass").src = `https://ghchart.rshah.org/${view_user}`;
        setTimeout(async() => {
            document.getElementById("user-details__ai-analysis").innerText = await generateAnalysis(view_user);
        })
    }
    localStorage.removeItem("view-user");
} else {
    user = data[username];
    document.getElementById("grass").src = `https://ghchart.rshah.org/${username}`;
    setTimeout(async() => {
        document.getElementById("user-details__ai-analysis").innerText = await generateAnalysis(username);
    })
}


const avatar = document.querySelector(".user-info__profile");
const username_element = document.querySelector(".user-info__name");
const personal_contributions_element = document.querySelector(".user-info__contributions_value");
const level = document.querySelector(".user-stats__level");
const class_contributions = document.querySelector(".user-details__class-contribution_value");
const githubLink = document.getElementById("github-link");


// 화면에 사용자 데이터 출력
avatar.src = user.avatarUrl;
username_element.innerText = user.username;
personal_contributions_element.innerText = user.contributions;
level.innerText = Math.floor(user.contributions / 10);
class_contributions.innerText = `${(user.contributions / scores[user.classNo - 1].score * 100).toFixed(1)}%`;
githubLink.href = `https://github.com/${user.username}`;