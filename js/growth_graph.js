const username = localStorage.getItem("username");
if(!username) {
    alert("로그인 후 이용해 주세요!");
    window.location.href = "../html/main.html";
}

document.querySelector(".title").innerText = `${username}님의 성장 여정을 살펴보아요!`;

(async function() {
    const user_grass_data = await(await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)).json();
    const year = new Date().getFullYear();
    const start = new Date(year, 0, 0, 0, 0, 0, 0);
    const now = Date.now();
    const passDay = (now - start) / 1000 / 60 / 60 / 24;
    const data = user_grass_data.contributions.slice(0, passDay);

    new Chart(
        document.getElementById('growth'),
        {
            type: 'line',
            data: {
                labels: data.map(row => row.date),
                datasets: [
                    {
                        label: 'contributions by day',
                        data: data.map(row => row.count),
                        pointStyle: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        },
    );
})();
