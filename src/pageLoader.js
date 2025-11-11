let load = "main";
const url = window.location.href;

let settings = {};

// DETECT IF URL IS OLD
if (url.includes('?')) {
    const oldUrlParams = (url.match(/\?/g) || []);

    if (oldUrlParams.length > 1) {
        load = "error";
        document.body.innerHTML = `<h1>Invalid URL</h1><p>Please go to chat.unii.dev/convert to fix your link</p><p><strong>We can't change URL</br>Please update browser source manually</strong></p>`;

        document.body.style.fontSize = "7dvh";
        document.body.style.fontWeight = "bold";
        document.body.style.fontFamily = "Inter, sans-serif";
        document.body.style.textAlign = "center";
        document.body.style.color = "white";
        document.body.style.textShadow = `
            -1px -1px 0 black,
            1px -1px 0 black,
            -1px  1px 0 black,
            1px  1px 0 black
        `;
    }
}

async function appendScript(src, script_type) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;

        if (script_type) {
            script.type = script_type;
        }

        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

        document.body.appendChild(script);
    });
}

const params = Object.fromEntries(new URLSearchParams(window.location.search));

if (params.channel || params.id) {
    if (load !== "error") {
        load = "chat";

        document.title = `UChat Chat • ${params.channel || params.id || "None"}`;
    }
} else if (Object.keys(params).length) {
    alert("No channel specified in the URL. Defaulting to main page.");
}

(async () => {
    await appendScript('src/appendSettings.js');
    
    if (load === "main") {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'main/homepage.css';

        document.head.appendChild(link);

        const link1 = document.createElement('link');
        link1.rel = 'stylesheet';
        link1.href = 'main/chatStyle.css';

        document.head.appendChild(link1);

        appendScript('src/landingPage/settingsV2.js');
        appendScript('src/landingPage/twitchLogin.js');
        appendScript('src/landingPage/events.js');

        // NEEDED FOR CHAT PREVIEW
        appendScript('src/thirdParty/SevenTVCosmeticsV2.js')
            .then(async () => {
                await pushCosmeticUserUsingGQL("01GAK4CXN00002Z53DR6PAWQVE"); // uni
                await pushCosmeticUserUsingGQL("01FDSMJ8MG0005Y8ZGBVC26NJ6"); // ftk
            });

        await appendScript('src/thirdParty/7TV/main.js');

        // CHAT INDEX
        appendScript('src/chatIndex.js')
            .then(async () => {
                await appendScript('src/landingPage/index.js');

                TTVUsersData.push({
                    "name": "@uniidev",
                    "color": "#FFB3FF",
                    "userId": "528761326"
                });

                TTVUsersData.push({
                    "name": "@ftk789",
                    "color": "#8A3DE2",
                    "userId": "166427338"
                });

                setUpPreview();
            })
            .catch(console.error);

        // SETTINGS 
        appendSettings(document.getElementById("ChatDisplay"));
    } else if (load === "chat") {
        var chatDiv = document.createElement('div');

        chatDiv.id = 'ChatDisplay';
        chatDiv.className = 'chat-messages';

        document.body.appendChild(chatDiv);

        Object.entries(params).forEach(([key, value]) => {
            if (["userBL", "prefixBL"].includes(String(key))) {
                const parts = String(value).split(' ');
                settings[key] = parts;
            } else {
                settings[key] = value;
            }
        });

        console.log(settings);

        document.body.innerHTML = `<div id="ChatDisplay" class="chat-messages"></div>`;

        const scripts = document.querySelectorAll('script');

        scripts.forEach(script => {
            if (!script.hasAttribute('src')) {
                script.remove();
            }
        });

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'main/chatStyle.css';

        document.head.appendChild(link);

        await appendScript('src/thirdParty/7TV/main.js');
        await appendScript('src/thirdParty/7TV/websocket.js');
        await appendScript('src/thirdParty/SevenTVCosmeticsV2.js');
        await appendScript('src/thirdParty/BTTV/main.js');
        await appendScript('src/thirdParty/BTTV/websocket.js');
        await appendScript('src/thirdParty/FFZ/main.js');
        await appendScript('src/TwitchIRC.js');
        await appendScript('src/chatIndex.js');

        // UPDATE DETECTOR - Removed because the chat is no longer hosted on GitHub, though still used on the outdated GitHub site.
        //appendScript('src/detectUpdate.js');

        // SETTINGS 
        appendSettings(document.getElementById("ChatDisplay"));
    }
})();
