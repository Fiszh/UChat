import { globals } from '$stores/global';

import { getPersonalSets } from "$lib/services/7TV/cosmetics";

import twemoji from 'twemoji';

function splitTextWithTwemoji(text: string) {
    const parsedText = twemoji.parse(text, {
        base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/',
        folder: 'svg',
        ext: '.svg'
    });

    const div = document.createElement('div');
    div.innerHTML = parsedText;

    const result: any[] = [];
    const nodes = div.childNodes;

    nodes.forEach((node) => {
        if (node.nodeType === 1) { // ELEMENT_NODE
            const el = node as HTMLElement;
            if (el.nodeName === 'IMG') {
                const src = (el as HTMLImageElement).src;
                const alt = (el as HTMLImageElement).alt;
                if (src) {
                    result.push({ emoji: alt, image: src });
                } else {
                    result.push(...(el.textContent || "").split(" ").filter(w => w.trim() !== ""));
                }
            } else {
                result.push(...(el.textContent || "").split(" ").filter(w => w.trim() !== ""));
            }
        } else if (node.nodeType === 3) { // TEXT_NODE
            result.push(...(node.textContent || "").split(" ").filter(w => w.trim() !== ""));
        }
    });

    return result;
}

function sanitizeInput(input: string) {
    if (typeof input !== "string") return input;

    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\//g, "&#x2F;");
}

function findEntryAndTier(prefix: string, bits: number) {
    prefix = prefix.toLowerCase();

    for (let entry of globals.emotes["BITS"]) {
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

interface FoundEmote {
    type: string;
    primary: any;
    overlapped: any[];
}

interface FoundBits {
    type: string;
    bits: Record<string, any>
}

interface FoundUser {
    type: string;
    user: Record<string, any>;
    input: string;
}

interface FoundOther {
    type: string;
    other: any;
}

function parseTwitchEmotes(message: string, userstate: Record<string, any>): any[] {
    if (userstate.emotes) {
        return Object.entries(userstate.emotes).flatMap(([emoteId, positions]) => {
            const posStr = positions as string;
            const [start, end] = posStr.split('-').map(Number);
            const name = Array.from(message).slice(start, end + 2).join('');

            return {
                name,
                url: `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/3.0`,
                set: 'Twitch'
            };
        });
    } else {
        return [];
    }
}

export async function replaceWithEmotes(inputString: string, userstate: Record<string, any>, originChannelID: string | number): Promise<string> {
    if (!inputString) { return inputString };

    //updateAllEmoteData();

    inputString = sanitizeInput(inputString);

    console.log(userstate);

    try {
        const globalEmotesData = [
            ...globals.emotes["7TV"].global,
            ...globals.emotes["BTTV"].global,
            ...globals.emotes["FFZ"].global,
        ];

        const nonGlobalEmoteData = [
            ...globals.emotes["7TV"].channel?.[originChannelID] || [],
            ...globals.emotes["BTTV"].channel?.[originChannelID] || [],
            ...globals.emotes["FFZ"].channel?.[originChannelID] || [],
        ];

        const foundPersonalSets = getPersonalSets(userstate['user-id']);

        const TTVMessageEmoteData = parseTwitchEmotes(inputString, userstate);

        const emoteData = [
            ...TTVMessageEmoteData,
            ...foundPersonalSets.flatMap((set: any) => set.emotes || []),
            ...nonGlobalEmoteData,
            ...globalEmotesData,
        ];

        //if (!emoteData.length) { return inputString; }; MIGHT NOT BE USEFULL ANYMORE DUE TO TWEMOJIS NOT WORKING IF NO EMOTES

        let EmoteSplit = await splitTextWithTwemoji(inputString);
        //console.log(EmoteSplit);

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
            // TODO ADD THIS BACK
            // if (!foundEmote && (getSetting("mentionColor"))) { // check if mention color is enabled
            //     foundUser = TTVUsersData.find(user => {
            //         const userName = user.name.toLowerCase();
            //         return [userName, userName.slice(1), `${userName},`, `${userName.slice(1)},`].some(val => part.toLowerCase() == val);
            //     });
            // }

            if (foundEmote) {
                if (foundEmote?.bits) {
                    foundParts.push({
                        "type": "bits",
                        "bits": foundEmote,
                    } as FoundBits);
                } else {
                    if (foundParts?.[foundParts.length - 1]?.type !== "emote" || foundEmote?.flags !== 256) {
                        foundParts.push({
                            "type": "emote",
                            "primary": foundEmote,
                            "overlapped": []
                        } as FoundEmote);
                    } else {
                        const last = foundParts?.[foundParts.length - 1] as FoundEmote;
                        if (last?.overlapped) {
                            const overlappedArray = last.overlapped;

                            overlappedArray.push({ ...foundEmote, "overlap_index": overlappedArray.length });
                        }
                    }
                }
            } else if (foundUser) {
                foundParts.push({
                    "type": "user",
                    "input": part,
                    "user": foundUser,
                } as FoundUser);
            } else {
                foundParts.push({
                    "type": "other",
                    "other": part,
                } as FoundOther);
            }
        }

        for (let part of foundParts) {
            switch (part["type"]) {
                case 'emote':
                    part = part as FoundEmote;
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
                    part = part as FoundBits;
                    const bitsInfo = part["bits"];

                    const bitsHTML = `<span class="bits-wrapper" style="color:${bitsInfo?.color || 'white'}">
                                <img src="${bitsInfo?.url || ''}" alt="${bitsInfo?.name || ''}" class="emote" loading="lazy">
                                ${bitsInfo?.bits || ''}
                        </span>`;

                    replacedParts.push(bitsHTML);

                    break;
                case 'user':
                    part = part as FoundUser;
                    const userHTML = `<span class="name-wrapper">
                            <strong style="color: ${part["user"].color}">${part["input"]}</strong>
                        </span>`;

                    replacedParts.push(userHTML);

                    break;
                case 'other':
                    part = part as FoundOther;
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
        console.error('Error replacing words with images:', error);
        return inputString;
    }
}