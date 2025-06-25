const data = JSON.parse(localStorage.getItem("gh-cache"));
const users = []

for(let key in data) {
    const user = data[key];
    users.push({
        username: user.username,
        avatarUrl: user.avatarUrl,
        contributions: user.contributions,
    })
}

users.sort((a,b) => b.contributions - a.contributions);

for(let i = 0; i < users.length; i++) {
    const user = users[i];
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <tr>
            <td class="rank-num">${i+1}</td>
            <td class="username"><img src="${user.avatarUrl}" class="icon"></img>${user.username}</td>
            <td class="commit">${user.contributions.toLocaleString()}</td>
        </tr>
    `
    tr.addEventListener("click", () => {
        localStorage.setItem("view-user", user.username);
        const a = document.createElement("a");
        a.href = "./user.html";
        document.body.appendChild(a);
        a.click();
    })
    document.querySelector("tbody").appendChild(tr);
}