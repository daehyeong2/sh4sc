import env from "/js/env.js";

const local_cache = localStorage.getItem("gh-cache");
const cache = local_cache ? JSON.parse(local_cache) : {};

const scores = {
    1: 0,
    2: 0,
    3: 0,
    4: 0
}

const classmate = [
    // 1반 Github Ids
    [
        "daehyeong2",
        "Finefinee"
    ],
    // 2반 Github IDs
    [

    ],
    // 3반 Github IDs
    [

    ],
    // 4반 Github IDs
    [

    ]
]

const data = {};

const headers = {
    Authorization: `Bearer ${env.GHP_TOKEN}`
}

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

const get_contributions = async (username) => {
    if(cache[username]) {
        return cache[username].contributions
    }
    console.log("new request");
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
    const contributions = body.data.user?.contributionsCollection?.contributionCalendar?.totalContributions;
    if(contributions == null) alert("깃허브 데이터를 불러오는 중 오류가 발생했습니다.");
    cache[username] = {
        contributions,
        expiredAt: new Date().getTime() + (1000 * 60 * 60)
    };
    return contributions
}

async function fetchData() {
    try {
        for(let i = 0; i < 4; i++){
            const cls = classmate[i];
            for(let stuIdx = 0; stuIdx < cls.length; stuIdx++){
                if(!cls[stuIdx]) continue;
                data[cls[stuIdx]] = await get_contributions(cls[stuIdx]);
                scores[i+1] += data[cls[stuIdx]];
            }
        }
        const sprouts = document.getElementsByClassName("sprout");
        for(let i = 0; i < 4; i++){
            sprouts[i].style.scale = (1 + (scores[i+1] * 0.003)).toString();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
fetchData();

setInterval(() => {
    const newCache = {}
    for(let c in cache){
        const ca = cache[c];
        if(ca.expiredAt > new Date().getTime()) newCache[c] = cache[c];
    }
    localStorage.setItem("gh-cache", JSON.stringify(newCache));
}, 1000);
