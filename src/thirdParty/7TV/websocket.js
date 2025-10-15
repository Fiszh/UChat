const parseSetData7TV = window.seventv.main.parseSetData;
const parseBadge = window.seventv.main.parse.badge;
const parsePaint = window.seventv.main.parse.paint;

const id_types = {
    'entitlement.create': "id", // COSMETICS
    'user.*': "object_id", // SET CHANGES
    'emote_set.update': "object_id", // EMOTE CHANGES
};

const condition_types = {
    'entitlement.create': { platform: 'TWITCH', ctx: 'channel' },
};

class SevenTVWebSocket {
    constructor(options = {}) {
        this.url = 'wss://events.7tv.io/v3';
        this.ws = null;
        this.setting = {
            reconnect: options.reconnect ?? false,
            reconnectInterval: options.reconnectInterval || 1000,
            maxReconnectAttempts: options.maxReconnectAttempts || Infinity,
            autoSubscribeToNewSetId: options.autoSubscribeToNewSetId ?? true,
            resubscribeOnReconnect: options.resubscribeOnReconnect ?? true,
        };
        this.subscriptions = {};
        this.caughtPersonalSets = [];
        this.listeners = {};
    }

    on(event, cb) {
        if (!this.listeners[event]) { this.listeners[event] = []; };
        this.listeners[event].push(cb);
    }

    emit(event, ...args) {
        if (!this.listeners[event]) { return; };
        for (const cb of this.listeners[event]) cb(...args);
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener('open', () => {
            console.log("7TV WS OPEN");
            this.emit("open");

            // RESUB TO EVERY TOPIC
            if (this.setting.resubscribeOnReconnect) {
                for (const id in this.subscriptions) {
                    for (const type in this.subscriptions[id]) {
                        const condition = this.subscriptions[id][type];
                        this.subscribe(id, type, condition, true);
                    }
                }
            }
        });

        this.ws.addEventListener('message', async (event) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch {
                console.error('Failed to parse JSON:', event.data);
                return;
            }

            this.emit("raw", data);

            if (data?.d?.command == "SUBSCRIBE") {
                this.emit("subscribed", data?.t, data?.d?.data);
            }

            if (!data?.d?.type || !data?.d?.body) { return; };

            const message_data = data.d;
            let message_body = message_data.body;

            switch (message_data.type) {
                case "emote_set.update":
                    const actor = message_body?.actor ? { username: message_body.actor?.username, display_name: message_body.actor?.display_name } : "UNKNOWN";

                    if (message_body.pushed) {
                        const emote_data = message_body.pushed.map(emote => emote.value);
                        const parsed_emote_data = await parseSetData7TV(emote_data);
                        for (const emote of parsed_emote_data) {
                            this.emit("add_emote", message_body.id, actor, emote); // SET ID, EMOTE INFO
                        }
                    } else if (message_body.pulled) {
                        const emote_data = message_body.pulled.map(emote => emote.old_value);
                        const parsed_emote_data = await parseSetData7TV(emote_data);
                        for (const emote of parsed_emote_data) {
                            this.emit("remove_emote", message_body.id, actor, emote); // SET ID, EMOTE INFO
                        }
                    } else if (message_body.updated) {
                        for (const emote of message_body.updated) {
                            const new_emote_data = await parseSetData7TV([emote.value]);
                            const old_value = emote.old_value;
                            const new_value = emote.value;
                            this.emit("rename_emote",
                                message_body.id,
                                actor,
                                {
                                    old: { name: old_value.name, id: old_value.id },
                                    new: { name: new_value.name, id: new_value.id },
                                    emote_data: new_emote_data[0],
                                }
                            ); // SET ID, { OLD INFO, NEW INFO }
                        }
                    } else {
                        console.log("Unknown set update message from 7TV WebSocket: ", data);
                    }

                    break;
                case "user.update": // RESUB TO NEW SET ID
                    if (message_body.updated) {
                        const actor = message_body?.actor ? { username: message_body.actor?.username, display_name: message_body.actor?.display_name } : "UNKNOWN";

                        const unique = [];
                        const seen = new Set();

                        for (const item of message_body.updated) {
                            const copy = { ...item };
                            delete copy.index;

                            const key = JSON.stringify(copy);

                            if (!seen.has(key)) {
                                seen.add(key);
                                unique.push(item);
                            }
                        }

                        message_body.updated = unique;

                        for (const emote_set_update of message_body.updated) {
                            if (emote_set_update?.key === "style") { continue; };

                            const set_data = {
                                old_set: { name: emote_set_update.value[0].old_value.name, id: emote_set_update.value[0].old_value.id },
                                new_set: { name: emote_set_update.value[0].value.name, id: emote_set_update.value[0].value.id },
                                SevenTV_user_id: message_body.id
                            };

                            this.emit("set_change", actor, set_data);

                            if (this.setting.autoSubscribeToNewSetId) {
                                this.unsubscribe(set_data.old_set.id, "emote_set.update");
                                this.subscribe(set_data.new_set.id, "emote_set.update");
                            }
                        }
                    }

                    break;
                case "cosmetic.create":
                    if (!message_body.object?.kind) { return; };

                    switch (message_body.object.kind) {
                        case "BADGE":
                            const badge_data = message_body.object.data;
                            if (!badge_data) { return; };

                            this.emit("create_badge", await parseBadge(badge_data));

                            break;
                        case "PAINT":
                            let paint_data = message_body.object.data;
                            if (!paint_data) { return; };

                            this.emit("create_paint", await parsePaint(paint_data));

                            break;
                        default:
                            console.log(`New cosmetic kind: ${message_body.object.kind}`, message_body.object);

                            break;
                    }
                    
                    break;
                case "emote_set.create":
                    const set_object = message_body.object;

                    const set_data = {
                        id: set_object.id,
                        name: set_object.name,
                        owner: set_object.owner?.connections?.find(c => c.platform === "TWITCH"),
                        flags: message_body.object?.flags || 0
                    };

                    this.caughtPersonalSets.push(set_data);

                    /*
                    4 - PERSONAL SETS
                    11 - SPECIAL SETS (LIKE NNYS)
                    */

                    if (![4, 11].includes(message_body.object?.flags)) {
                        this.emit("create_set", set_data);
                    } else {
                        this.emit("create_personal_set", set_data);
                    }

                    break;
                case "entitlement.create":
                case "entitlement.delete":
                    const entitlement_object = message_body.object;

                    const entitlement_data = {
                        id: Number(entitlement_object.id) ? entitlement_object.id : entitlement_object.ref_id,
                        kind: entitlement_object.kind,
                        owner: entitlement_object.user?.connections?.find(c => c.platform === "TWITCH"),
                    };

                    this.emit(`${message_data.type.split(".")[1]}_entitlement`, entitlement_data);

                    break;
                default:
                    console.log("Unknown message from 7TV WebSocket: ", data);

                    break;
            }
        });

        this.ws.addEventListener('close', () => {
            this.ws = null;
            console.log("closed");
            this.emit("close");

            if (this.setting.reconnect) {
                console.log(`reconnecting in ${this.setting.reconnectInterval / 1000}s`);
                setTimeout(() => this.connect(), this.setting.reconnectInterval);
            } else {
                this.subscriptions = {};
            }
        });

        this.ws.addEventListener('error', (error) => {
            console.error(error);
            this.emit("error", error);
        });
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    async subscribe(id, type, force) {
        if (!id) throw new Error("Missing 'id' parameter");
        if (!type) throw new Error("Missing 'type' parameter");

        if (this.subscriptions?.[id]?.[type] && !force) {
            throw new Error("Already subscribed");
        }

        if (this.ws.readyState !== this.ws.OPEN) {
            await new Promise((resolve, reject) => {
                const handleOpen = () => {
                    cleanup();
                    resolve();
                };
                const handleClose = () => {
                    cleanup();
                    reject(new Error("WebSocket closed before subscription"));
                };
                const cleanup = () => {
                    this.ws.removeEventListener("open", handleOpen);
                    this.ws.removeEventListener("close", handleClose);
                };
                this.ws.addEventListener("open", handleOpen);
                this.ws.addEventListener("close", handleClose);
            });
        }

        let id_type = { id };
        if (id_types[type]) {
            id_type = { [id_types[type]]: id };
        }

        const condition = { ...condition_types[type], ...id_type };

        const message = {
            op: 35,
            t: Date.now(),
            d: {
                type,
                condition,
            },
        };

        this.ws.send(JSON.stringify(message));

        if (!this.subscriptions[id]) {
            this.subscriptions[id] = {};
        }

        this.subscriptions[id][type] = condition;

        this.emit("subscribed", id);

        return true;
    }

    async unsubscribe(id, type) {
        if (!id) { throw new Error("Missing 'id' parameter"); };
        if (!type) { throw new Error("Missing 'type' parameter"); };

        if (!this.subscriptions[id]) {
            throw new Error(`${id} is not subscribed to anything`);
        }

        if (!this.subscriptions[id][type]) {
            throw new Error(`${id} is not subscribed to ${type}`);
        }

        const message = {
            op: 36,
            t: Date.now(),
            d: {
                type,
                condition: this.subscriptions[id][type],
            },
        };

        this.ws.send(JSON.stringify(message));

        delete this.subscriptions[id][type];

        this.emit("unsubscribed", id);

        return true;
    }

    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
            this.emit('sent', message);
        } else {
            const err = new Error('WebSocket is not open. Cannot send message.');
            this.emit('send_error', err);
        }
    }
}

function argbToRgba(color) {
    if (color < 0) {
        color = color >>> 0;
    }

    const red = (color >> 24) & 0xff;
    const green = (color >> 16) & 0xff;
    const blue = (color >> 8) & 0xff;
    return `rgba(${red}, ${green}, ${blue}, 1)`;
}

window.seventv.ws = SevenTVWebSocket;