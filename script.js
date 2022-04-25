VK.init({
    apiId: 8146587
});


function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 262144); // 262144 — доступ к группам пользователя
    });
}


function callAPI(method, params) {
    params.v = '5.81'; // версия

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    })
}


(async () => {
    try {
        await auth();

        document.body.onclick = (e) => {
            const elem = e.target;
            if (elem.getAttribute("data-role") === "clipboard") {
                const text = elem.previousElementSibling.innerHTML;
                console.log(text);
                navigator.clipboard.writeText(text);
            }
        }

        const groups = await callAPI('groups.get', {
            // fields: 'id, name, screen_name, photo_200',
            extended: 1
        });

        groups.items.sort(function (a, b) {
            if (a.name < b.name) return -1
        });

        const template = document.querySelector('#groups-template').textContent;
        const render = Handlebars.compile(template);
        const html = render(groups);
        const results = document.querySelector('#results');
        results.innerHTML = html;
    } catch (e) {
        console.log(e);
    }
})();