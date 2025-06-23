scores = {
    1: 19000,
    2: 10000,
    3: 5000,
    4: 1000
}

// const browser = await puppeteer.launch();
// const page = await browser.newPage();
//
// const url = "https://github.com/daehyeong2";
//
// async function fetchData() {
//     try {
//         await page.goto(url);
//         console.log(await page.locator("#js-contribution-activity-description"))
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }
// fetchData();

setTimeout(() => {
    sprouts = document.getElementsByClassName("sprout");
    for(let i = 0; i < 4; i++){
        sprouts[i].style.scale = (1 + (scores[i+1] * 0.01)).toString();
    }
}, 300);

await browser.close();