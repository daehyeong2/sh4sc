import env from "/js/env.js";

// 깃허브 API를 사용할 때 시간이 소요되므로 캐싱 시스템을 구축
const local_cache = localStorage.getItem("gh-cache");
// localStorage에 저장된 캐시가 존재한다면 그것을 사용하고, 그렇지 않다면 빈 객체를 사용
const cache = local_cache ? JSON.parse(local_cache) : {};
// 새싹 이미지들
const sprouts = document.getElementsByClassName("sprout");
// 새싹 점수들
const sprout_scores = document.getElementsByClassName("sprout-score");

// 반별로 커밋 합계 저장하는 객체
const scores = [
    {
        classNo: 1,
        score: 0
    },
    {
        classNo: 2,
        score: 0
    },
    {
        classNo: 3,
        score: 0
    },
    {
        classNo: 4,
        score: 0
    },
]

const createBadge = (className, text) => {
    const badge = document.createElement("span")
    badge.classList.add("rank");
    badge.classList.add(className);
    badge.innerText = text;
    return badge;
}

const firstBadge = createBadge("first", "1등");
const secondBadge = createBadge("second", "2등");
const thirdBadge = createBadge("third", "3등");


// 각 반별로 깃허브 ID 저장
const classmate = [
    // 1반 Github Ids
    [
        "2-dayeon",
        "daehyeong2",
        "L98293",
        "Finefinee",
        "JJH090501",
        "hsh0622",
    ],
    // 2반 Github IDs
    [
        "chaeyn",
        "uhihi09",
    ],
    // 3반 Github IDs
    [
    ],
    // 4반 Github IDs
    [
        "jdw09",
        "hoshino-love0102",
        "gangmin0716"
    ]
]

// username(string): contributions(int) 형식으로 깃허브 ID를 key로, 커밋 수를 value로 저장하는 객체 생성
const data = {};

// github api 이용 시 사용할 헤더 정의
const headers = {
    Authorization: `Bearer ${env.GHP_TOKEN}`
}

// github api 사용 시 사용할 쿼리 (GraphQL 기반 서버이기 때문에 해당 문법을 사용)
const query = `
    query($login: String!) {
        user(login: $login) {
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                }
            }
        }
    }
`

// 새로 업데이트된 점수들을 새싹 크기와 동기화
const updateSprout = () => {
    scores.sort((a, b) => b.score - a.score);
    for(let i = 0; i < 4; i++){
        const score = scores[i]
        // 화면 상의 커밋 합계를 최신 데이터와 동기화
        sprout_scores[score.classNo - 1].innerText = score.score;
        // 화면 상의 새싹 크기를 최신 커밋 합계 수와 동기화
        sprouts[score.classNo - 1].style.scale = (1 + (score.score * 0.003)).toString();
        const title = document.getElementsByClassName("sprout_container")[score.classNo - 1].querySelector("h2");
        switch(i){
            case 0: {
                title.innerHTML = "";
                title.appendChild(firstBadge);
                title.append(`${i+1}반`);
                break;
            }
            case 1: {
                title.innerHTML = "";
                title.appendChild(secondBadge);
                title.append(`${i+1}반`);
                break;
            }
            case 2: {
                title.innerHTML = "";
                title.appendChild(thirdBadge);
                title.append(`${i+1}반`);
                break;
            }
            default: {
                title.innerHTML = `${i+1}반`;
                break;
            }
        }
    }
}

// username을 입력받아 깃허브 커밋 수를 반환
const get_contributions = async (username) => {
    // 이미 캐시에 데이터가 존재한다면 해당 데이터를 반환
    if(cache[username]) {
        return cache[username].contributions
    }
    // 캐시에 데이터가 존재하지 않아 새로 요청을 할 경우 "new request" 출력
    console.log("new request");
    // github api를 이용해 데이터 가져오기
    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers,
        body: JSON.stringify({
            query,
            variables: {
                login: username
            }
        }),
    })
    if(!res.ok) alert("깃허브 데이터를 불러오는 중 오류가 발생했습니다.");
    const body = await res.json();
    // 받은 데이터에서 커밋 수만 추출
    const contributions = body.data.user?.contributionsCollection?.contributionCalendar?.totalContributions;
    if(contributions == null) alert("깃허브 데이터를 불러오는 중 오류가 발생했습니다.");
    // 가져온 데이터로 캐시 업데이트
    cache[username] = {
        contributions,
        expiredAt: new Date().getTime() + (1000 * 60 * 60)
    };
    // 해당 유저에 대한 커밋 수 반환
    return contributions
}

// 각 반별 모든 학생들에 대한 데이터를 가져오고 화면 상에 그리는 함수 (메인 함수)
async function fetchData() {
    try {
        for(let i = 0; i < 4; i++){
            const cls = classmate[i];
            for(let stuIdx = 0; stuIdx < cls.length; stuIdx++){
                if(!cls[stuIdx]) continue;
                // 학생의 커밋 수를 가져옴
                data[cls[stuIdx]] = await get_contributions(cls[stuIdx]);
                // 학생의 반에 가져온 커밋 수를 더함
                scores[i].score += data[cls[stuIdx]];
                // 바뀐 값을 화면 상에 업데이트
                updateSprout();
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
fetchData();

// 1초에 한번씩 로컬에서 업데이트된 캐시를 localStorage에 업데이트하는 로직
setInterval(() => {
    const newCache = {}
    for(let c in cache){
        const ca = cache[c];
        // 로컬 캐시 중 만료 전인 캐시만 newCache에 추가
        if(ca.expiredAt > new Date().getTime()) newCache[c] = cache[c];
    }
    // 만료된 캐시를 제외한 newCache를 localStorage에 업데이트
    localStorage.setItem("gh-cache", JSON.stringify(newCache));
}, 1000);
