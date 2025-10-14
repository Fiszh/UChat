console.log("chatIndex.js hooked up!")

const custom_bots = [
    "poland_bot",
    "ftk789_bot",
    "mrsmalvic",
    "gofishgame",
    "reapsex",
    "timeoutwithbits", // from speedyemperor
    "soundalerts", // from speedyemperor
]
/*
If you want your bot added, open a PR on the repo.
I’ll probably accept it, but no guarantees.
Make sure your bot isn’t on the FFZ bots list or doesn't have the Twitch Chat Bot badge before submitting
*/

const services = {
    "7TV": {
        "main": window.seventv.main,
        "ws": null
    },
    "BTTV": {
        "main": null,
        "ws": null
    },
    "FFZ": {
        "ws": null
    },
};

const manifest_path = 'manifest.json';
let chat_version;

if (window.location.href.includes("?channel=")) {
    // PREPARE SERVICES
    services["7TV"]["ws"] = new window.seventv.ws({ reconnect: true });
    services["BTTV"]["ws"] = new window.bttv.ws({ reconnect: true });

    services["BTTV"]["main"] = window.bttv.main;
    services["FFZ"]["main"] = window.ffz.main

    // OPENING
    irc.events.addEventListener('opening', e => {
        createLoadingUI();
    });

    // RECONNECT LIMIT REACHED
    irc.events.addEventListener('reconnect_limit_reached', e => {
        createLoadingUI("Twitch IRC failed to reconnect after 10 tries. Refresh the page or the source to retry.");
    });

    // OPEN
    irc.events.addEventListener('open', e => {
        const loadingUI = document.getElementById('loadingUI');

        if (loadingUI) {
            createLoadingUI("Connected!");
            loadingUI.style.opacity = '0';

            setTimeout(() => loadingUI.remove(), 300);
        }
    });

    // MESSAGE
    irc.events.addEventListener('PRIVMSG', e => {
        const event_details = e.detail;

        //console.log(event_details);

        onMessage(event_details["channel"], event_details["tags"], event_details["message"], false);
    });

    // CHEER

    /*client.on("cheer", (channel, userstate, message) => { // USERNOTICE - NOT SURE SAID BY CHAT GPT
        handleMessage(userstate, message, channel);
    });*/

    irc.events.addEventListener('USERNOTICE', e => {
        let event_details = e.detail;

        console.log(event_details); // Still needed for future updates

        if (event_details?.["tags"]?.["login"]) {
            event_details["tags"]["username"] = event_details["tags"]["login"];
        }

        if (event_details?.["message"]?.trim()?.length && event_details?.["tags"] && event_details?.["channel"]) {
            handleMessage(event_details["tags"], event_details["message"], event_details["channel"]);
        }
    });

    // MODERATION ACTIONS

    irc.events.addEventListener('CLEARMSG', e => { // REMOVE MESSAGE
        const event_details = e.detail;

        if (!event_details?.["tags"]?.["target-msg-id"]) { return; };

        deleteMessages("message_id", String(event_details["tags"]["target-msg-id"]));
    });

    irc.events.addEventListener('CLEARCHAT', e => { // CLEAR CHAT, BAN & TIMEOUT
        const event_details = e.detail;

        if (event_details?.["tags"]?.["target-user-id"]) {
            deleteMessages("sender_id", event_details["tags"]["target-user-id"]);
        } else {
            deleteMessages();
        }
    });

    if (!chat_version) {
        (async () => {
            try {
                const response = await fetch(manifest_path);

                if (!response.ok) {
                    throw new Error("Failed to load in manifest.json");
                }

                const data = await response.json();

                if (Object.keys(data).length < 1) {
                    throw new Error("manifest.json was loaded but it seems to be empty");
                }

                chat_version = `${data["version"]} (${new Date().toLocaleDateString()})`;

                console.log(`Chat version: ${chat_version}`);
            } catch (err) {
                console.error(`Failed to load in manifest.json, please try reloading the page. Error: ${err.message}`);
            } finally {
                irc.connect(settings.channel);

                loadChat();
                setInterval(removeInvisibleElements, 500);
                setInterval(loadCustomBadges, 300000);
            }
        })();
    }
}

function createLoadingUI(custom_message, remove_interval) {
    if (document.getElementById('loadingUI')) {
        if (custom_message) {
            const loadingMessage = document.getElementById('loadingMessage');
            if (loadingMessage) {
                loadingMessage.textContent = custom_message;
            } else {
                console.warn("Loading message element not found, unable to update message.");
            }
        }

        return;
    };

    const loadingUI = document.createElement('div');
    loadingUI.id = 'loadingUI';

    const img = document.createElement('img');
    img.src = 'https://cdn.7tv.app/emote/6297ed14d1b61557a52b21cb/4x.png';
    img.alt = 'loading';

    const loadingMessage = document.createElement('span');
    loadingMessage.textContent = custom_message || `Connecting to ${settings.channel} chat...`;
    loadingMessage.id = 'loadingMessage';

    const versionText = document.createElement('span');
    versionText.id = 'versionText';
    versionText.textContent = `Version: ${chat_version || 'unknown'}`;

    loadingUI.appendChild(img);
    loadingUI.appendChild(loadingMessage);
    loadingUI.appendChild(versionText);

    document.body.appendChild(loadingUI);

    if (remove_interval) {
        setTimeout(() => {
            loadingUI.style.opacity = '0';

            setTimeout(() => loadingUI.remove(), 300);
        }, remove_interval);
    }
}

async function onMessage(channel, userstate, message, self) {
    //console.log(userstate);

    // MOD COMMANDS
    if (String(userstate["user-id"]) == "528761326" || userstate?.mod || userstate?.['badges-raw']?.includes('broadcaster/1')) {
        switch (message.toLowerCase()) {
            case "!reloadchat":
                window.location.reload(true);

                break;
            case "!refreshchat":
                loadChat();

                break;
            case "!reloadws":
                try {
                    SevenTVWebsocket.close();
                    BTTVWebsocket.close();
                } catch (err) { }; // HERE JUST IN CASE THE WEBSOCKET IS NOT OPEN

                break;
            case "!reconnectchat":
                irc.disconnect();

                break;
            case "!chatversion":
                createLoadingUI(` `, 5000);

                break;
            default:

                break;
        }
    }

    // TEST COMMANDS 

    if (String(userstate["user-id"]) === "528761326") {
        if (message.toLowerCase().startsWith("!adduser")) {
            if (message.split(" ")[1]) {
                pushCosmeticUserUsingGQL(message.split(" ")[1])
            }
        }
    }

    // BLOCK BOTS
    const FFZBadge = FFZBadgeData.find(badge => badge.owner_username == userstate.username);

    if (((FFZBadge?.id == "bot") || (FFZUserBadgeData?.user_badges?.[userstate["user-id"]] === "2")) || custom_bots.includes(userstate.username) || userstate?.badges?.["bot-badge"]) {
        if (!getSetting("bots")) {
            return;
        }
    }

    // BLOCK USERS

    if (getSetting("userBL", { action: "includes", include: userstate.username })) {
        return;
    }

    const foundUser = TTVUsersData.find(user => user.name === `@${userstate.username}`);

    if (!foundUser) {
        let userColor = userstate.color

        if (userstate.color === null || userstate.color === undefined || !userstate.color) {
            userColor = getRandomTwitchColor();
        }

        let user = {
            name: `@${userstate.username}`,
            color: userColor,
            userId: userstate["user-id"]
        };

        TTVUsersData.push(user);
    } else {
        if (foundUser.color && userstate && userstate.color) {
            foundUser.color = userstate.color
        }
    }

    handleMessage(userstate, message, channel);
}

let chatDisplay = document.getElementById("ChatDisplay");

//CUSTOM 
let customBadgeData = [];

let config_path = 'src/landingPage/defaultConfig.json';
let config = {};

//CONSOLE COLORS
const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

//TWITCH
let channelTwitchID = "0";
let TTVSubBadgeData = [];
let TTVGlobalBadgeData = [];
let TTVBitBadgeData = [];
let TTVUsersData = [];
let TTVBitsData = [];
let channelBadges = {};
let version;

const twitchColors = [
    "#0000FF", // Blue
    "#8A2BE2", // Blue Violet
    "#5F9EA0", // Cadet Blue
    "#D2691E", // Chocolate
    "#FF7F50", // Coral
    "#1E90FF", // Dodger Blue
    "#B22222", // Firebrick
    "#DAA520", // Golden Rod
    "#008000", // Green
    "#FF69B4", // Hot Pink
    "#FF4500", // Orange Red
    "#FF0000", // Red
    "#2E8B57", // Sea Green
    "#00FF7F", // Spring Green
    "#9ACD32"  // Yellow Green
];

//7TV
let SevenTVID = '0';
let SevenTVemoteSetId = '0';
let SevenTVWebsocket;

let SevenTVGlobalEmoteData = [];
let SevenTVEmoteData = {};

//FFZ
let FFZGlobalEmoteData = [];
let FFZEmoteData = {};

let FFZBadgeData = [];
let FFZUserBadgeData = [];

//BTTV
let BTTVWebsocket;
let BTTVGlobalEmoteData = [];
let BTTVEmoteData = {};
let BTTVBadgeData = [];

//const BTTVZeroWidth = ["SoSnowy", "IceCold", "SantaHat", "TopHat", "ReinDeer", "CandyCane", "cvMask", "cvHazmat"];

//OTHER
let ChatterinoBadgeData = [];
let ChatterinoHomiesBadgeData = [];

async function trimPart(text) {
    if (text) {
        return text.trim();
    } else {
        return text;
    }
}

function getSetting(setting_name, action) {
    const value = settings[setting_name];

    if (value !== undefined) {
        if (action?.action === "includes") {
            return value.includes(action.include);
        }

        return value === "0" ? false : value;
    }

    const sourceKey = (config && Object.keys(config).find(k => config[k].param === setting_name))
        || (defaultConfig && Object.keys(defaultConfig).find(k => defaultConfig[k].param === setting_name));

    if (!sourceKey) {
        console.log(setting_name, "not found");

        return false;
    }

    const source = settings[sourceKey] !== undefined
        ? settings
        : (config && config[sourceKey] !== undefined)
            ? config
            : defaultConfig;
    const sourceValue = source[sourceKey].value;

    return sourceValue === "0" ? false : sourceValue;
}

let processing_ids = [];
async function getChannelEmotesViaTwitchID(twitchID) {
    if (!twitchID || twitchID === "preview" || processing_ids.includes(twitchID)) return;

    processing_ids.push(twitchID); // prevent API spam

    // 7TV
    try {
        if (!SevenTVEmoteData[twitchID]) {
            SevenTVEmoteData[twitchID] = await fetch7TVEmoteSetDataViaTwitchID(twitchID);
        }
    } catch (e) {
        console.error(`7TV error for ${twitchID}:`, e);
    }

    // BTTV
    try {
        if (!BTTVEmoteData[twitchID]) {
            await fetchBTTVEmoteData(twitchID);
        }
    } catch (e) {
        console.error(`BTTV error for ${twitchID}:`, e);
    }

    // FFZ
    try {
        if (!FFZEmoteData[twitchID]) {
            FFZEmoteData[twitchID] = await fetchFFZEmoteSetDataViaTwitchID(twitchID);
        }
    } catch (e) {
        console.error(`FFZ error for ${twitchID}:`, e);
    }

    // CHANNEL BADGE
    try {
        if (!channelBadges[twitchID]) {
            const avatar = await getAvatarViaID(twitchID);
            if (avatar) channelBadges[twitchID] = avatar;
        }
    } catch (e) {
        console.error(`Badge error for ${twitchID}:`, e);
    }

    // remove from processing
    processing_ids = processing_ids.filter(id => id !== twitchID);
}


async function getAvatarViaID(user_id) {
    const response = await fetch(`https://api.unii.dev/avatar?id=${user_id}`);

    if (!response.ok) {
        return false;
    }

    const data = await response.json();

    return data?.avatar || false;
}

function fixNameColor(name_color) {
    if (tinycolor(name_color).getBrightness() <= 50) {
        return tinycolor(name_color).lighten(30).toString();
    } else {
        return name_color;
    }
}

function setNameColor(element, color) {
    if (!twitchColors.includes(color)) {
        color = fixNameColor(color);
    }

    element.style.color = color;
}

// NOTE IN NEXT UPDATE LOOK INTO THIS FUNCTION TO OPTIMIZE IT MORE
async function handleMessage(userstate, message, channel) {
    if (!message) { return; };

    // GET CONNECTED CHAT EMOTE DATA

    getChannelEmotesViaTwitchID(userstate["source-room-id"]);

    // BLOCK PREFIX, REDEEMS AND USERS

    const messagePrefix = message.charAt(0);

    const isPrefixBlocked = getSetting("prefixBL", { action: "includes", include: messagePrefix });
    const isRedeemBlocked = getSetting("redeem");
    const isUserBlocked = getSetting("userBL", { action: "includes", include: userstate.username });

    if (isPrefixBlocked || (!isRedeemBlocked && userstate["custom-reward-id"]) || isUserBlocked) { return; };

    // PROCESS MESSAGE

    message = sanitizeInput(String(message).trimStart());

    const tagsReplaced = message;
    let rendererMessage = tagsReplaced;

    let username = await trimPart(userstate.username);
    let displayname = await trimPart(userstate["display-name"]);
    let finalUsername = await trimPart(userstate.username);
    const message_id = userstate.id || "0"

    if (username && displayname) {
        if (username.toLowerCase() == displayname.toLowerCase()) {
            finalUsername = `${displayname}`
        } else {
            finalUsername = `${username} (${displayname})`
        }
    }

    const messageElement = document.createElement("div");
    messageElement.classList.add('message');

    messageElement.setAttribute("message_id", message_id);
    messageElement.setAttribute("sender", username);
    messageElement.setAttribute("sender_id", userstate["user-id"] || "0");

    if (userstate?.["action"]) {
        messageElement.style.color = fixNameColor(userstate["color"]);
    }

    // Append the new message element
    chatDisplay.appendChild(messageElement);

    let TTVMessageEmoteData = [];

    if (userstate.emotes) {
        TTVMessageEmoteData = Object.entries(userstate.emotes).flatMap(([emoteId, positions]) =>
            positions.map(position => {
                const [start, end] = position.split('-').map(Number);

                const name = Array.from(message).slice(start, end + 1).join('');

                return {
                    name,
                    url: `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/3.0`,
                    site: 'TTV'
                };
            })
        );
    }

    let badges = [];

    // SHARE CHAT BADGES

    if (channelBadges[[userstate["source-room-id"]]]) {
        badges.push({
            badge_url: channelBadges[[userstate["source-room-id"]]],
            alt: userstate["source-room-id"],
            background_color: undefined,
        });
    }

    // CUSTOM BADGES

    customBadgeData.forEach(custom_badge => {
        if (custom_badge.users.includes(userstate["user-id"]) || userstate["user-id"] == "185965290") {
            badges.push({
                badge_url: custom_badge.url,
                alt: custom_badge.title,
                background_color: undefined,
            });
        }
    });

    // TWITCH BADGES

    if (userstate['badges-raw'] && Object.keys(userstate['badges-raw']).length) {
        let rawBadges = userstate['badges-raw'];
        let badgesSplit = rawBadges.split(',');

        for (const Badge of badgesSplit) {
            let badgeSplit = Badge.split("/");

            if (badgeSplit[0] === 'subscriber') {
                if (userstate.badges) {
                    if (userstate.badges.subscriber) {
                        const badge = TTVSubBadgeData.find(badge => badge.id === userstate.badges.subscriber);

                        if (badge) {
                            badges.push({
                                badge_url: badge.url,
                                alt: badge.title,
                                background_color: undefined
                            });

                            continue;
                        }
                    }
                }
            } else if (badgeSplit[0] === "bits") {
                if (userstate.badges.bits) {
                    const badge = TTVBitBadgeData.find(badge => badge.id === userstate.badges.bits);

                    if (badge) {
                        badges.push({
                            badge_url: badge.url,
                            alt: badge.title,
                            background_color: undefined
                        });

                        continue;
                    }

                }
            }

            const badge = TTVGlobalBadgeData.find(badge => badge.id === `${badgeSplit[0]}_${badgeSplit[1]}`);

            if (badge && badge.id) {
                if (badge.id === "moderator_1" && FFZUserBadgeData["mod_badge"]) {
                    badges.push({
                        badge_url: FFZUserBadgeData["mod_badge"],
                        alt: "Moderator",
                        background_color: "#00ad03"
                    });

                    continue;
                }

                if (badge.id === "vip_1" && FFZUserBadgeData["vip_badge"]) {
                    badges.push({
                        badge_url: FFZUserBadgeData["vip_badge"],
                        alt: "VIP",
                        background_color: "#e005b9"
                    });

                    continue;
                }
            }

            if (badge) {
                badges.push({
                    badge_url: badge.url,
                    alt: badge.title,
                    background_color: undefined
                });
            }
        }
    }

    // Want badges from your app here?
    // Send me a message via discord or twitch whisper

    // Chatterino & Chatterino Homies Badges

    const foundChatterinoBadges = [...ChatterinoBadgeData, ...ChatterinoHomiesBadgeData].filter(badge => badge.owners.includes(String(userstate["user-id"])));

    if (foundChatterinoBadges) {
        foundChatterinoBadges.forEach(foundChatterinoBadge => {
            badges.push({
                tooltip_name: foundChatterinoBadge.title,
                badge_url: foundChatterinoBadge.url,
                alt: foundChatterinoBadge.title,
                background_color: undefined,
            });
        })
    }

    // FFZ Badges

    const foundFFZBadges = FFZBadgeData.filter(badge => badge.owner_username == userstate.username);

    foundFFZBadges.forEach(foundFFZBadge => {
        badges.push({
            badge_url: foundFFZBadge.url,
            alt: foundFFZBadge.title,
            background_color: foundFFZBadge.color,
        });
    });

    if (FFZUserBadgeData["user_badges"] && FFZUserBadgeData["user_badges"][userstate["user-id"]]) {
        const ffz_url = `https://cdn.frankerfacez.com/badge/${FFZUserBadgeData["user_badges"][userstate["user-id"]]}/4`;

        const foundBadge = FFZBadgeData.find(badge => badge.url === ffz_url);

        if (foundBadge) {
            badges.push({
                badge_url: foundBadge.url,
                alt: foundBadge.title,
                background_color: foundBadge.color,
            });
        }
    }

    // BTTV Badges 

    const foundBTTVBadge = BTTVBadgeData.find(badge => badge.providerId == userstate?.["user-id"]);

    if (foundBTTVBadge) {
        badges.push({
            badge_url: foundBTTVBadge?.badge?.svg,
            alt: foundBTTVBadge?.badge?.description,
            background_color: undefined
        });
    }

    // 7TV Badges

    const found7TVBadge = Object.values(sevenTV_cosmetics.badges).find(badge => badge.owner.find(o => o.id === String(userstate['user-id'])));

    if (found7TVBadge) {
        badges.push({
            badge_url: found7TVBadge.urls[found7TVBadge.urls.length - 1].url,
            alt: found7TVBadge.name,
            background_color: undefined
        });
    }

    // FINALIZE BADGES

    badges = badges.filter((badge, index, self) =>
        index === self.findIndex(b => b.badge_url === badge.badge_url)
    );

    if (!getSetting("badges")) {
        badges = [];
    }

    const badges_wrapper = document.createElement("span");
    badges_wrapper.classList.add("badge-wrapper");
    badges_wrapper.innerHTML = `${badges.map(badge => `
                                    <img
                                        style="background-color: ${badge.background_color || 'transparent'};"
                                        src="${badge.badge_url}"
                                        alt="${badge.alt}"
                                        class="badge"
                                        loading="lazy"
                                    >
                                `).join("")}`;

    const name_wrapper = document.createElement("span");
    name_wrapper.classList.add("name-wrapper");
    name_wrapper.classList.add("sender-name");

    const name_display = document.createElement("strong");
    name_display.id = "username-strong";
    name_display.textContent = finalUsername;

    setNameColor(name_display, userstate["color"]);

    name_wrapper.appendChild(name_display);

    name_wrapper.appendChild(document.createTextNode(userstate?.["action"] ? "" : ":"));

    const message_text = document.createElement("div");
    message_text.classList.add("message-text");

    message_text.innerHTML = rendererMessage;

    // APPEND EVERYTHING

    if (badges.length) { messageElement.appendChild(badges_wrapper); };
    messageElement.appendChild(name_wrapper);
    messageElement.appendChild(message_text);

    fadeOut(messageElement);

    let results = await replaceWithEmotes(message, TTVMessageEmoteData, userstate, userstate?.["source-room-id"] || channelTwitchID);

    message_text.innerHTML = results; // CHANGE MESSAGE TEXT TO EMOTES

    // DISPLAY PAINT FOR MENTIONS
    messageElement.querySelectorAll('.name-wrapper')?.forEach(async el => {
        const strong = el.querySelector('strong');
        if (!strong) { return; };

        const name = `@${strong.innerHTML.replace(/[@,:]|\s*\(.*\)/g, '')}`.toLowerCase();
        const user = TTVUsersData.find(u => u.name === name);

        let displayedPaint;

        if (user) {
            displayedPaint = await displayCosmeticPaint(user.userId, user.color, strong);
        }

        if (!displayedPaint) {
            let color = getRandomTwitchColor(name.slice(1));
            if (userstate?.username?.toLowerCase() === name.slice(1) && userstate.color) {
                color = userstate.color;
            }
            setNameColor(strong, color);
        }
    });
}

async function fadeOut(element) {
    if (!getSetting("fadeOut")) { return; }
    if (!document.location.href.includes("?channel=")) { return; }

    const fadeOutTime = getSetting("fadeOut") * 1000

    setTimeout(() => {
        element.style.transition = 'opacity 1s ease';
        element.classList.add('fade');

        setTimeout(() => {
            element.remove();
        }, 1000);

    }, fadeOutTime || 30000);
}

function getRandomTwitchColor(name) {
    if (!name) {
        const randomIndex = Math.floor(Math.random() * twitchColors.length);
        return twitchColors[randomIndex];
    }

    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    hash = Math.abs(hash);

    const colorIndex = hash % twitchColors.length;

    return twitchColors[colorIndex];
}

function splitTextWithTwemoji(text) {
    const parsedText = twemoji.parse(text, {
        base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/',
        folder: 'svg',
        ext: '.svg'
    });

    const div = document.createElement('div');
    div.innerHTML = parsedText;

    const result = [];
    const nodes = div.childNodes;

    nodes.forEach(node => {
        if (node.nodeName === 'IMG') {
            if (node.getAttribute('src')) {
                result.push({ emoji: node.getAttribute('alt'), image: node.getAttribute('src') });
            } else {
                result.push(...node.textContent.split(" ").filter(word => word.trim() !== ""));
            }
        } else if (node.nodeType === 3) {
            result.push(...node.textContent.split(" ").filter(word => word.trim() !== ""));
        }
    });

    return result;
}

function sanitizeInput(input) {
    if (typeof input !== "string") return input;

    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\//g, "&#x2F;");
}

// NOTE IN NEXT UPDATE LOOK INTO THIS FUNCTION TO OPTIMIZE IT MORE
async function replaceWithEmotes(inputString, TTVMessageEmoteData, userstate, originChannelID) {
    if (!inputString) { return inputString };

    //updateAllEmoteData();

    inputString = sanitizeInput(inputString);

    try {
        const globalEmotesData = [
            ...SevenTVGlobalEmoteData,
            ...BTTVGlobalEmoteData,
            ...FFZGlobalEmoteData,
        ];

        const nonGlobalEmoteData = [
            ...SevenTVEmoteData?.[originChannelID] || [],
            ...BTTVEmoteData?.[originChannelID] || [],
            ...FFZEmoteData?.[originChannelID] || [],
        ];

        const foundPersonalSets = Object.values(sevenTV_cosmetics.sets)
            .filter(set => set.owner.some(o => o.id === String(userstate['user-id'])));

        const emoteData = [
            ...TTVMessageEmoteData,
            ...foundPersonalSets.flatMap(set => set.emotes || []),
            ...nonGlobalEmoteData,
            ...globalEmotesData,
            ...TTVBitsData
        ];

        if (emoteData.length === 0) return inputString;

        let EmoteSplit = await splitTextWithTwemoji(inputString);

        let foundParts = [];
        const replacedParts = [];

        for (const part of EmoteSplit) {
            let foundEmote;
            let foundUser;

            // Detect emoji
            if (!foundEmote && part.emoji) {
                foundEmote = {
                    name: part.emoji,
                    url: part.image,
                    emote_link: part.image,
                    emoji: true
                };
            }

            // Detect bits
            if (!foundEmote && (userstate && userstate['bits'])) {
                let match = part.match(/^([a-zA-Z]+)(\d+)$/);

                if (match) {
                    let prefix = match[1]; // Prefix
                    let bits = match[2]; // Amount

                    let result = findEntryAndTier(prefix, bits);

                    if (result) {
                        foundEmote = {
                            name: result.name,
                            url: result.tier.url,
                            site: 'TTV',
                            color: result.tier.color,
                            bits: `<div class="bits-number">${bits}</div>`
                        };
                    }
                }
            }

            // Other emotes
            if (!foundEmote) {
                foundEmote = emoteData.find(emote => emote.name && part === sanitizeInput(emote.name));
            }

            // Search for user if no emote is found
            if (!foundEmote && (getSetting("mentionColor"))) { // check if mention color is enabled
                foundUser = TTVUsersData.find(user => {
                    const userName = user.name.toLowerCase();
                    return [userName, userName.slice(1), `${userName},`, `${userName.slice(1)},`].some(val => part.toLowerCase() == val);
                });
            }

            if (foundEmote) {
                if (foundEmote?.bits) {
                    foundParts.push({
                        "type": "bits",
                        "bits": foundEmote,
                    });
                } else {
                    if (!foundParts.length || foundParts[foundParts.length - 1]?.type !== "emote" || foundEmote?.flags !== 256) {
                        foundParts.push({
                            "type": "emote",
                            "primary": foundEmote,
                            "overlapped": []
                        });
                    } else {
                        const overlappedArray = foundParts[foundParts.length - 1].overlapped;
                        overlappedArray.push({ ...foundEmote, "overlap_index": overlappedArray.length });
                    }
                }
            } else if (foundUser) {
                foundParts.push({
                    "type": "user",
                    "input": part,
                    "user": foundUser,
                });
            } else {
                foundParts.push({
                    "type": "other",
                    "other": part,
                });
            }
        }

        for (const part of foundParts) {
            switch (part["type"]) {
                case 'emote':
                    let emoteHTML = "";

                    const primary = part["primary"];

                    emoteHTML += `<span class="emote-wrapper">
                        <img src="${primary?.url || ''}" alt="${primary?.name || ''}" class="emote${primary?.emoji ? ' emoji' : ''}" loading="lazy">`;

                    if (part["overlapped"].length) {
                        emoteHTML += part["overlapped"]
                            .map(overlapped => `<img src="${overlapped?.url || ''}" alt="${overlapped?.name || ''}" class="emote" loading="lazy">`)
                            .join('\n');
                    }

                    replacedParts.push(`${emoteHTML}\n</span>`);

                    break;
                case 'bits':
                    const bitsInfo = part["bits"];

                    const bitsHTML = `<span class="bits-wrapper" style="color:${bitsInfo?.color || 'white'}">
                                <img src="${bitsInfo?.url || ''}" alt="${bitsInfo?.name || ''}" class="emote" loading="lazy">
                                ${bitsInfo?.bits || ''}
                        </span>`;

                    replacedParts.push(bitsHTML);

                    break;
                case 'user':
                    const userHTML = `<span class="name-wrapper">
                            <strong style="color: ${part["user"].color}">${part["input"]}</strong>
                        </span>`;

                    replacedParts.push(userHTML);

                    break;
                case 'other':
                    let otherHTML = part["other"];

                    if (otherHTML && typeof otherHTML === "string") {
                        otherHTML = twemoji.parse(part["other"], {
                            base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
                            folder: 'svg',
                            ext: '.svg',
                            className: 'twemoji'
                        });
                    }

                    replacedParts.push(otherHTML);

                    break;
                default:
                    return inputString;
            }
        }

        return replacedParts.join(' ');
    } catch (error) {
        console.log('Error replacing words with images:', error);
        return inputString;
    }
}

function decodeEmojiToUnified(emoji) {
    return [...emoji]
        .map(char => char.codePointAt(0).toString(16).toUpperCase())
        .join('-');
}

function encodeUnifiedToEmoji(unified) {
    return String.fromCodePoint(
        ...unified.split('-').map(code => parseInt(code, 16))
    );
}

function findEntryAndTier(prefix, bits) {
    prefix = prefix.toLowerCase();

    for (let entry of TTVBitsData) {
        if (entry.name.toLowerCase() !== prefix) continue;

        for (let i = 0; i < entry.tiers.length; i++) {
            let currentTier = entry.tiers[i];
            let nextTier = entry.tiers[i + 1];

            if (!nextTier && bits >= currentTier.min_bits) {
                return { name: entry.name, tier: currentTier };
            }

            if (bits >= currentTier.min_bits && bits < nextTier.min_bits) {
                return { name: entry.name, tier: currentTier };
            }
        }
    }

    return null;
}

async function load7TV() {
    try {
        await services["7TV"].ws.connect();

        const SevenTV_user_data = await services["7TV"].main.getUserViaTwitchID(channelTwitchID);

        SevenTVGlobalEmoteData = await services["7TV"].main.emoteSet.bySetID("global");

        SevenTVEmoteData[channelTwitchID] = SevenTV_user_data?.emote_data;

        console.log(SevenTVEmoteData);

        //WEBSOCKETS
        services["7TV"].ws.subscribe(channelTwitchID, "entitlement.create"); // 7TV account not needed to recieve cosmetic info

        if (SevenTV_user_data?.id) {
            services["7TV"].ws.subscribe(SevenTV_user_data.id, "user.*");
            if (SevenTV_user_data?.emote_set_id) { services["7TV"].ws.subscribe(SevenTV_user_data.emote_set_id, "emote_set.update"); };
        }
    } catch (err) {
        console.log(err);
    }
}

async function loadBTTV() {
    try {
        await services["BTTV"].ws.connect();

        BTTVEmoteData[channelTwitchID] = await services["BTTV"].main.getEmoteData(channelTwitchID);

        BTTVGlobalEmoteData = await services["BTTV"].main.getGlobalEmoteSet();

        BTTVBadgeData = await services["BTTV"].main.getBadgeData();

        if (BTTVEmoteData[channelTwitchID]?.length) {
            services['BTTV'].ws.subscribe(channelTwitchID);
        }
    } catch (err) {
        console.log(err);
    }
}

async function loadFFZ() {
    try {
        FFZGlobalEmoteData = await services["FFZ"].main.getGlobalEmotes();

        const ffzData = await services["FFZ"].main.getUserData(channelTwitchID);
        FFZEmoteData[channelTwitchID] = ffzData?.set || [];

        if (ffzData?.badges?.vip?.length) {
            FFZUserBadgeData['vip_badge'] = ffzData.badges.vip[ffzData.badges.vip.length - 1];
        }

        if (ffzData?.badges?.mod?.length) {
            FFZUserBadgeData['mod_badge'] = ffzData.badges.mod[ffzData.badges.mod.length - 1];
        }

        if (ffzData?.badges?.user_badge_ids) {
            const transformedBadges = {};

            Object.entries(ffzData?.badges?.user_badge_ids).forEach(([badge, users]) => {
                users.forEach(user => {
                    transformedBadges[user] = badge;
                });
            });

            FFZUserBadgeData['user_badges'] = transformedBadges;
        }

        FFZBadgeData = await services["FFZ"].main.getBadges();
    } catch (err) {
        console.log(err);
    }
}

async function loadOther() {
    try {
        getChatterinoBadges();
        getChatterinoHomiesBadges();
    } catch (err) {
        console.log(err);
    }
}

async function getChatterinoBadges() {
    const response = await fetch(`https://api.chatterino.com/badges`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    ChatterinoBadgeData = data.badges.map(badge => ({
        id: badge.tooltip.replace(/\s+/g, '_').toLowerCase(),
        url: badge["image3"] || badge["image2"] || badge["image1"] || undefined,
        title: badge.tooltip,
        owners: badge.users
    }));
}

async function getChatterinoHomiesBadges() {
    let badge_data = [];

    const response0 = await fetch(`https://itzalex.github.io/badges`, {
        method: 'GET'
    });

    if (response0.ok) {
        const data = await response0.json();

        if (data?.badges) {
            badge_data = [...data.badges];
        }
    }

    const response1 = await fetch(`https://itzalex.github.io/badges2`, {
        method: 'GET'
    });

    if (response1.ok) {
        const data = await response1.json();

        if (data?.badges) {
            badge_data = [...badge_data, ...data.badges];
        }
    }

    ChatterinoHomiesBadgeData = badge_data.map(badge => ({
        id: badge?.id || badge.tooltip.replace(/\s+/g, '_').toLowerCase(),
        url: badge["image3"] || badge["image2"] || badge["image1"] || undefined,
        title: badge.tooltip,
        owners: badge.users
    }));
}

async function loadChat() {
    try {
        const response = await fetch(config_path);

        if (!response.ok) {
            throw new Error("Failed to load in defaultConfig.json");
        }

        const data = await response.json();

        if (Object.keys(data).length < 1) {
            throw new Error("defaultConfig.json was loaded but it seems to be empty");
        }

        config = data;

        config = Object.keys(data).reduce((acc, key) => {
            acc[key] = {
                value: data[key].value,
                param: data[key].param
            };
            return acc;
        }, {});
    } catch (err) {
        chatDisplay.innerHTML = `Failed to load in defaultConfig.json, please try reloading the page. <br> Error: ${err.message}`;

        chatDisplay.style.webkitTextStroke = '1.3px black';

        return;
    };

    // SET ALL USERNAMES TO LOWER CASE
    if (settings?.userBL) {
        settings.userBL = settings.userBL.map(b => b.toLowerCase());
    }

    // OVERLAY

    loadCustomBadges();

    // TTV - NEW API

    const data_loaded = await loadTTV();

    if (!data_loaded && channelTwitchID == "0") { return; };

    // LOAD SAVED SETTINGS 

    await LoadSavedSettings();

    // THIRD PARTY

    // 7TV

    load7TV();

    // BTTV

    loadBTTV();

    // FFZ

    loadFFZ();

    // OTHER

    loadOther();
}

async function LoadSavedSettings() {
    const has_settings_saved = await fetch(`https://api.unii.dev/settings/${channelTwitchID}`);

    if (!has_settings_saved.ok) {
        return;
    }

    const settings_data = await has_settings_saved.json();

    if (settings_data?.["settings"]) {
        settings = { ...settings_data["settings"], ...settings };

        appendSettings(chatDisplay);
    }
}

async function loadTTV() {
    try {
        const response = await fetch(`https://api.unii.dev/channel?name=${settings.channel}`);

        if (!response.ok) {
            console.error("Fetch error:", response.status, response.statusText);
            return false;
        }

        const response_data = await response.json();

        if (!response_data?.channel?.data || Object.keys(response_data?.channel?.data)?.length < 5) {
            console.error("Invalid or incomplete data structure:", response_data);
            return false;
        }

        const channel_data = response_data.channel.data

        const data = {
            channel_info: channel_data?.["channel_info"],
            channel_badges: channel_data?.["channel_badges"],
            channel_bits: channel_data?.["channel_cheer_emotes"],
            global_badges: channel_data?.["global_badges"],
            global_bits: channel_data?.["global_cheer_emotes"]
        };

        // CHANNEL INFO LOGIN
        channelTwitchID = data?.channel_info?.id || null;
        const channel_color = data?.channel_info?.color || "white";

        // CHANNEL BADGES
        const broadcastBadges = data?.channel_badges?.broadcastBadges || [];
        try {
            const channel_subscriber_badges = broadcastBadges.filter(badge => badge?.setID === "subscriber");

            TTVSubBadgeData = channel_subscriber_badges.map(badge => ({
                id: badge.version,
                url: badge.image4x || badge.image3x || badge.image2x || badge.image1x,
                title: badge.title
            }));
        } catch (err) {
            console.error("Error loading channel badges:", err);
            TTVSubBadgeData = [];
        }

        try {
            const channel_bits_badges = broadcastBadges.filter(badge => badge?.setID === "bits");

            TTVBitBadgeData = channel_bits_badges.map(badge => ({
                id: badge.version,
                url: badge.image4x || badge.image3x || badge.image2x || badge.image1x,
                title: badge.title
            }));
        } catch (err) {
            console.error("Error loading channel bits badges:", err);
            TTVBitBadgeData = [];
        }

        // CHANNEL BITS
        let channel_bit_emotes = [];
        try {
            const cheerGroups = data?.channel_bits?.cheer?.cheerGroups || [];
            channel_bit_emotes = cheerGroups.map(group => {
                const node = group.nodes?.[0];
                const prefix = node?.prefix?.toLowerCase() || "prefix";
                const templateURL = group.templateURL || "https://d3aqoihi2n8ty8.cloudfront.net/actions/PREFIX/BACKGROUND/ANIMATION/TIER/SCALE.EXTENSION";

                return {
                    name: prefix,
                    tiers: node?.tiers?.map(tier => {
                        const tierURL = templateURL.replace(/PREFIX|BACKGROUND|ANIMATION|TIER|SCALE\.EXTENSION/g, match => {
                            const replacements = {
                                PREFIX: prefix,
                                BACKGROUND: "dark",
                                ANIMATION: "animated",
                                TIER: tier?.bits || "TIER",
                                "SCALE.EXTENSION": "4.gif"
                            };
                            return replacements[match];
                        });

                        return {
                            min_bits: tier?.bits,
                            url: tierURL,
                            emote_link: tierURL,
                            color: channel_color
                        };
                    }) || [],
                    site: 'TTV'
                };
            });
        } catch (err) {
            console.error("Error loading channel bit emotes:", err);
            channel_bit_emotes = [];
        }

        // GLOBAL BADGES
        try {
            TTVGlobalBadgeData = (data?.global_badges || []).map(badge => ({
                id: badge.setID + "_" + badge.version,
                url: badge.image4x || badge.image3x || badge.image2x || badge.image1x,
                title: badge.title
            }));
        } catch (err) {
            console.error("Error loading global badges:", err);
            TTVGlobalBadgeData = [];
        }

        // GLOBAL BITS
        let global_bit_emotes = [];
        try {
            const global_groups = data?.global_bits?.groups || [];
            const displayConfig = data?.global_bits?.displayConfig?.colors || [];

            global_bit_emotes = global_groups[0]?.nodes?.map(group => {
                const prefix = group?.prefix?.toLowerCase() || "prefix";
                const templateURL = global_groups[0]?.templateURL || "https://d3aqoihi2n8ty8.cloudfront.net/actions/PREFIX/BACKGROUND/ANIMATION/TIER/SCALE.EXTENSION";

                return {
                    name: prefix,
                    tiers: group?.tiers?.map(tier => {
                        const tierURL = templateURL.replace(/PREFIX|BACKGROUND|ANIMATION|TIER|SCALE\.EXTENSION/g, match => {
                            const replacements = {
                                PREFIX: prefix,
                                BACKGROUND: "dark",
                                ANIMATION: "animated",
                                TIER: tier?.bits || "TIER",
                                "SCALE.EXTENSION": "4.gif"
                            };
                            return replacements[match];
                        });

                        return {
                            min_bits: tier?.bits,
                            url: tierURL,
                            emote_link: tierURL,
                            color: displayConfig.find(color => color.bits === tier?.bits)?.color || "white"
                        };
                    }) || [],
                    site: 'TTV'
                };
            }) || [];
        } catch (err) {
            console.error("Error loading global bit emotes:", err);
            global_bit_emotes = [];
        }

        TTVBitsData = [...global_bit_emotes, ...channel_bit_emotes];

        // SETTINGS
        try {
            if (response_data?.["user_settings"]) {
                settings = { ...response_data["user_settings"], ...settings };

                appendSettings(chatDisplay);
            }
        } catch (err) {
            console.error("Error loading saved settings:", err);
        }

        return true;
    } catch (err) {
        console.error("Unexpected error in loadTTV:", err);
        return false;
    }
}

function getBestImageUrl(badge) {
    const sizes = ["4x", "3x", "2x", "1x"];

    for (let size of sizes) {
        if (badge.imgs.animated && badge.imgs.animated[size]) {
            return badge.imgs.animated[size];
        }
        if (badge.imgs.static && badge.imgs.static[size]) {
            return badge.imgs.static[size];
        }
    }
    return null;
}

async function loadCustomBadges() {
    const response = await fetch('https://api.unii.dev/badges');

    if (!response.ok) { return; };

    let data = await response.json();

    if (!data || !data["UChat"]) { return; };

    customBadgeData = [
        ...data["UChat"],
        ...data["YAUTC"]
    ].map(badge => ({
        ...badge,
        url: getBestImageUrl(badge)
    }));
}

function removeInvisibleElements() {
    const elements = chatDisplay.children;

    for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        const rect = element.getBoundingClientRect();
        const chatDisplayRect = chatDisplay.getBoundingClientRect();

        if (
            rect.bottom < chatDisplayRect.top ||
            rect.top > chatDisplayRect.bottom
        ) {
            chatDisplay.removeChild(element);
        }
    }
}

async function deleteMessages(attribute, value) {
    if (!getSetting("modAction")) { return; }

    if (attribute) {
        const elementsToDelete = chatDisplay.querySelectorAll(`[${attribute}="${value}"]`);

        elementsToDelete.forEach(element => {
            element.remove();
        });
    } else {
        chatDisplay.innerHTML = '';
    }
}

function handleImageRetries() {
    document.querySelectorAll('img').forEach((img, index) => {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            setTimeout(() => {
                img.src = img.src.split('?')[0] + '?retry=' + new Date().getTime();
            }, 500 * index);
        }
    });
}

setInterval(handleImageRetries, 10000);

window.addEventListener('beforeunload', () => {
    irc.events.removeEventListener('opening', createLoadingUI);
    irc.events.removeEventListener('reconnect_limit_reached', createLoadingUI);
    irc.events.removeEventListener('open', onOpenHandler);
    irc.events.removeEventListener('PRIVMSG', onPrivMsgHandler);
    irc.events.removeEventListener('USERNOTICE', onUserNoticeHandler);
    irc.events.removeEventListener('CLEARMSG', onClearMsgHandler);
    irc.events.removeEventListener('CLEARCHAT', onClearChatHandler);
});

// HANDLE 7TV & BTTV WEBSOCKET

if (window.location.href.includes("?channel=")) {
    // 7TV WEBSOCKET MESSAGES
    services["7TV"].ws.on("add_emote", (id, actor, data) => {
        if (sevenTV_cosmetics.sets[id]) { // PERSONAL SETS
            data.set = "7TV Personal";

            sevenTV_cosmetics.sets[id].emotes.push(data);
        } else { // CHANNEL SET
            SevenTVEmoteData[channelTwitchID].push(data);

            console.log("7TV Emote added:", id, data);
        }
    });

    services["7TV"].ws.on("remove_emote", (id, actor, data) => {
        if (sevenTV_cosmetics.sets[id]) { // PERSONAL SETS
            sevenTV_cosmetics.sets[id].emotes = sevenTV_cosmetics.sets[id].emotes.filter(emote => emote.url !== data.url);
        } else { // CHANNEL SET
            SevenTVEmoteData[channelTwitchID] = SevenTVEmoteData[channelTwitchID].filter(emote => emote.url !== data.url);

            console.log("Emote removed:", id, data);
        }
    });

    services["7TV"].ws.on("rename_emote", (id, actor, data) => {
        let foundEmote = SevenTVEmoteData[channelTwitchID].find(emote => emote.emote_id === (data.old.id || data.new.id));

        if (sevenTV_cosmetics.sets[id]) { // PERSONAL SETS
            foundEmote = sevenTV_cosmetics.sets[id].emotes.find(emote => emote.emote_id === (data.old.id || data.new.id));
        }

        if (foundEmote) {
            foundEmote.name = data.new.name;
        }

        console.log("Emote renamed:", id, data);
    });

    services["7TV"].ws.on("set_change", async (actor, data) => { // no need to resub to a new set id, already done via the websocket client
        SevenTVEmoteData[channelTwitchID] = await services["7TV"].main.emoteSet.bySetID(data.new_set.id);

        console.log("Emote set changed:", data);
    });

    services["7TV"].ws.on("create_badge", (data) => {
        if (!sevenTV_cosmetics.badges[data.id]) {
            sevenTV_cosmetics.badges[data.id] = data;
        }
    });

    services["7TV"].ws.on("create_paint", (data) => {
        if (!sevenTV_cosmetics.paints[data.id]) {
            sevenTV_cosmetics.paints[data.id] = data;
        }
    });

    services["7TV"].ws.on("create_personal_set", (data) => { // CREATE PERSONAL SET
        if (!sevenTV_cosmetics.sets[data.id]) {
            sevenTV_cosmetics.sets[data.id] = {
                id: data.id,
                name: data.name,
                flags: data.flags,
                owner: data?.flags == 4 ? [data.owner] : [],
                emotes: []
            };
        }
    });

    // PERSONAL SETS SHOULD NOT REMOVE THE OWNER, RIGHT 7TV?
    services["7TV"].ws.on("create_entitlement", (data) => { // BIND A BADGE, PAINT OR SET TO A USER
        if (sevenTV_cosmetics.sets[data.id] && sevenTV_cosmetics.sets[data.id]?.flags != 4) { // SET
            const alreadyOwner = sevenTV_cosmetics.sets[data.id].owner.find(owner => owner.id == data.owner.id);

            if (!alreadyOwner) {
                sevenTV_cosmetics.sets[data.id].owner.push(data.owner);
            }
        } else if (sevenTV_cosmetics.badges[data.id]) { // BADGE
            for (const badge of Object.values(sevenTV_cosmetics.badges)) { // REMOVE BADGE OWNER
                badge.owner = badge.owner.filter(o => o.id !== String(data?.owner.id));
            }

            sevenTV_cosmetics.badges[data.id].owner.push(data.owner);
        } else if (sevenTV_cosmetics.paints[data.id]) { // PAINT
            for (const paint of Object.values(sevenTV_cosmetics.paints)) { // REMOVE PAINT OWNER
                paint.owner = paint.owner.filter(o => o.id !== String(data?.owner.id));
            }

            sevenTV_cosmetics.paints[data.id].owner.push(data.owner);

            updatePaint(data.owner.id); // CHANGE USER PAINT ON PREVIOUS MESSAGES
        }
    });

    services["7TV"].ws.on("delete_entitlement", (data) => {
        let whatToDelete = {};

        if (sevenTV_cosmetics.badges[data.id]) { // BADGE
            whatToDelete = sevenTV_cosmetics.badges;
        } else if (sevenTV_cosmetics.paints[data.id]) { // PAINT
            whatToDelete = sevenTV_cosmetics.paints;
        }

        for (const entitlement of Object.values(whatToDelete)) {
            entitlement.owner = entitlement.owner.filter(o => o.id !== String(data?.owner.id));
        }

        // CHANGE USER PAINT ON PREVIOUS MESSAGES
        if (sevenTV_cosmetics.paints[data.id]) {
            updatePaint(data.owner.id);
        }
    });

    function updatePaint(id) {
        const found_messages = chatDisplay.querySelectorAll(`[sender_id="${id}"]`);

        if (found_messages) {
            for (const index of Object.keys(found_messages)) {
                const message = found_messages[index];

                const found_name_wrapper = message.querySelector(".sender-name strong");

                if (found_name_wrapper) {
                    displayCosmeticPaint(id, (found_name_wrapper.style?.color || getRandomTwitchColor(message.getAttribute("sender"))), found_name_wrapper);
                }
            }
        }
    }

    // BTTV WEBSOCKET MESSAGES
    services["BTTV"].ws.on("add_emote", (id, data) => {
        BTTVEmoteData[channelTwitchID].push(data);

        console.log("BTTV Emote added:", id, data);
    });

    services["BTTV"].ws.on("remove_emote", (id, data) => {
        BTTVEmoteData[channelTwitchID].emotes = BTTVEmoteData[channelTwitchID].filter(emote => emote.emote_id !== data);

        console.log("BTTV Emote removed:", id, data);
    });

    services["BTTV"].ws.on("rename_emote", (id, data) => {
        const foundEmote = BTTVEmoteData[channelTwitchID].find(emote => emote.emote_id === data.id);

        if (foundEmote) {
            foundEmote.name = table.newName;
        }

        console.log("BTTV Emote renamed:", id, data);
    });
}