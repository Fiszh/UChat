import { get, writable } from 'svelte/store';
import { settings } from "$stores/settings";

const currentSettings = get(settings) || [];
const modActions = (currentSettings.find(setting => setting.param == "modAction") || { "value": true }).value;

interface ParsedMessage {
  raw: string;
  tags: {
    rawTags: Record<string, any>;
    tags: Record<string, any>;
    merged: Record<string, any>;
  } | Record<string, any>;
  prefix: Record<string, string>;
  command: string;
  channel: string;
  message: string;
}

export const messages = writable<Record<string, any>[]>([]);
export const connectionStatus = writable<string>('');

let TTV_IRC_WS: WebSocket | null;
let IRC_is_connected = false;

let reconnectAttempts = 0;
const MAX_RECONNECTS = 10;

let heartbeatInterval: number | undefined = undefined;
let heartbeatTimeout: number | undefined = undefined;

export function connect(channel_name: string) {
  if (!channel_name || IRC_is_connected) { return; };

  connectionStatus.set('connecting');

  TTV_IRC_WS = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

  TTV_IRC_WS.addEventListener('open', () => {
    reconnectAttempts = 0;

    TTV_IRC_WS?.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
    TTV_IRC_WS?.send(`NICK justinfan${Math.floor(Math.random() * 9999)}`);
    TTV_IRC_WS?.send(`JOIN #${channel_name}`);
    console.log('Connected to Twitch IRC WebSocket');

    connectionStatus.set('open');

    IRC_is_connected = true;

    // FIX TRY
    heartbeatInterval = setInterval(() => {
      if (TTV_IRC_WS?.readyState === WebSocket.OPEN) {
        TTV_IRC_WS?.send('PING');

        clearTimeout(heartbeatTimeout);
        heartbeatTimeout = setTimeout(() => {
          console.warn('No PONG, reconnecting...');
          TTV_IRC_WS?.close();
        }, 20000);
      }
    }, 20000);
  });

  TTV_IRC_WS.addEventListener('message', (event) => {
    try {
      const messagesSplit = event.data.split('\r\n');

      for (const line of messagesSplit) {
        if (!line) { continue; };
        const parsed = parseIrcLine(line);

        switch (parsed.command) {
          case "PING":
            TTV_IRC_WS?.send('PONG :tmi.twitch.tv');

            break;
          case "RECONNECT":
            disconnect();

            return;
          case "PONG":
            clearTimeout(heartbeatTimeout);

            break;
          case "CLEARMSG":
            if (!modActions) { break; };
            messages.update(arr => arr.filter(item => item.tags["id"] !== parsed.tags.merged["target-msg-id"]));

            break;
          case "CLEARCHAT":
            if (!modActions) { break; };
            messages.update(arr => arr.filter(item => item.tags["user-id"] !== parsed.tags.merged["target-user-id"]));

            break;
          default:
            //console.log("UNKNOWN PARSED COMMAND", parsed.command, parsed);

            if (parsed.tags.rawTags) { parsed.tags = parsed.tags.merged; };

            messages.update(msgs => [...msgs.slice(-99), parsed]);

            break;
        }
      }
    } catch (err) {
      console.error('Error in message handler:', err);
    }
  });

  TTV_IRC_WS.addEventListener('close', () => {
    console.log('Disconnected from Twitch IRC');

    clearInterval(heartbeatInterval);
    clearTimeout(heartbeatTimeout);

    IRC_is_connected = false;

    reconnectAttempts++;

    if (reconnectAttempts <= MAX_RECONNECTS) {
      setTimeout(() => connect(channel_name), 1000 * reconnectAttempts);

      connectionStatus.set('close');
    } else {
      connectionStatus.set('reconnect_limit_reached');
      return;
    }
  });

  TTV_IRC_WS.addEventListener('error', (err) => {
    console.error('WebSocket error:', err);
  });
}

function disconnect() {
  if (TTV_IRC_WS) {
    TTV_IRC_WS.close();
    TTV_IRC_WS = null;
  }
  IRC_is_connected = false;
  clearInterval(heartbeatInterval);
  clearTimeout(heartbeatTimeout);
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

/*FIXME PARSING DONT WORK

MIGHT BE WORKING NOW
*/
function parseIrcLine(raw: string): ParsedMessage {
  let parsed = {
    raw,
    "tags": {
      rawTags: {},
      tags: {},
      merged: {}
    },
    prefix: {},
    command: "",
    channel: "",
    message: ""
  };

  try {
    // SPLIT TAGS AND REST
    let lineTags = "";
    let rawPrefix = "";
    let line = raw;

    if (line.startsWith('@')) {
      const [tagsPart, ...restParts] = line.split(" ");
      lineTags = tagsPart.slice(1);
      line = restParts.join(" ");

      rawPrefix = line.split(" ")[0];

      const end = line.indexOf(' ');
      line = line.slice(end + 1);
    }

    if (line.startsWith(':')) {
      const end = line.indexOf(' ');
      line = line.slice(end + 1);
    }

    const space = line.indexOf(' ');
    const command = space === -1 ? line : line.slice(0, space);
    const trailing = space === -1 ? null : line.slice(space + 1).replace(/^:/, '');

    // GET PARTS OF REST
    const [channel, ...messageParts] = (trailing || "").split(" ");

    // GET AND CLEAN MESSAGE
    const message = messageParts.join(" ");
    let cleanMessage = message.startsWith(":") ? message.slice(1) : message;

    // CLEAN AND GET PREFIX
    const clean = rawPrefix.startsWith(":") ? rawPrefix.slice(1) : rawPrefix;

    const [nickPart, host] = clean.split("@");
    const [nick, user] = nickPart.split("!");

    const prefix = { nick, user, host };

    // GENERATE RAW AND PARSED TAGS
    const ircEscapedChars: Record<string, string> = { s: " ", n: "\n", r: "\r", ":": ";", "\\": "\\" };

    const tagsSplit = lineTags.split(";");

    const rawTags = Object.fromEntries(
      tagsSplit.map((tag: string) => {
        const [key, value] = tag.split("=");
        const unescaped = value?.replace(/\\(.)/g, (_, c) => ircEscapedChars[c] ?? c) ?? null;
        return [key, unescaped];
      })
    );

    const isNumber = (str: string) => !isNaN(Number(str));

    const tags: Record<string, any> = {};
    const TAG_VALUE_REGEX = /([^,\/]+)\/([^,]+)/g;
    const EMOTE_POSITIONS_REGEX = /([^\/:]+):([\d,-]+)/g;

    Object.entries(rawTags).forEach(([key, value]) => {
      if (isNumber(value) && value !== "") {
        const numberValue = Number(value);
        tags[key] = numberValue > 1 ? numberValue : Boolean(numberValue);
      } else {
        let matches = [];
        let matchesType = "TAG_VALUE_REGEX";
        if (value.includes(':')) {
          matches = [...value.matchAll(EMOTE_POSITIONS_REGEX)];

          matchesType = "EMOTE_POSITIONS_REGEX";
        } else {
          matches = [...value.matchAll(TAG_VALUE_REGEX)];
        }

        if (matches.length) {
          for (const match of matches) {
            const [, id, nums] = match;

            if (matchesType == "TAG_VALUE_REGEX") {
              if (!tags[key]) { tags[key] = {} };
              tags[key][id] = nums;
            } else if (matchesType == "EMOTE_POSITIONS_REGEX") {
              if (!tags[key]) { tags[key] = [] };
              tags[key][id] = [...nums.split(",")];
            }
          }
        } else {
          tags[key] = value;
        }
      }
    });

    function addTag(key: string, value: any) {
      if (Object.values(rawTags).length) {
        rawTags[key] = value;
      }

      if (Object.values(tags).length) {
        tags[key] = value;
      }
    }

    // INSTERT USERNAME INTO TAGS
    if (prefix["nick"]) {
      addTag("username", prefix["nick"]);
    }

    // ADD ACTION TAG
    if (typeof cleanMessage === "string" && cleanMessage.startsWith('\x01ACTION') && cleanMessage.endsWith('\x01')) {
      addTag("action", true);
      cleanMessage = cleanMessage.slice(8, -1);
    } else {
      addTag("action", false);
    }

    // MERGE RAW AND NORMAL TAGS
    const merged = {
      ...Object.fromEntries(Object.entries(rawTags).map(([key, value]) => [`${key}-raw`, value])),
      ...tags
    };

    // REMOVE HTML TAGS
    cleanMessage = sanitizeInput(cleanMessage);

    // RETURN PARSED
    parsed = {
      "raw": line,
      "tags": {
        rawTags,
        tags,
        merged
      },
      prefix,
      command,
      channel,
      message: cleanMessage
    };
  } catch (err) {
    console.error("Failed parsing:", raw, " With the error:", err);
  } finally {
    return parsed;
  }
}