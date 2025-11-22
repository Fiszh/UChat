import main from './main.js';
const { parseSetData } = main;

const blocked_events = ["broadcast_me", "lookup_user"];

interface Options {
    url?: string;
    reconnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    autoSubscribeToNewSetId?: boolean;
    resubscribeOnReconnect?: boolean;
}

type Events = {
    open: () => void;
    close: () => void;
    error: (data: any) => void;
    sent: (data: any) => void;
    send_error: (data: any) => void;
    raw: (data: any) => void;
    subscribed: (id: string|number) => void;
    unsubscribed: (id: string|number) => void;
    add_emote: (channel: string, data: any) => void;
    remove_emote: (channel: string, id: string) => void;
    rename_emote: (channel: string, data: any) => void;
}

// WEBSOCKET
class BTTVWebSocket {
    url: string;
    ws: WebSocket | null;
    setting: {
        reconnect: boolean;
        reconnectInterval: number;
        maxReconnectAttempts: number;
        resubscribeOnReconnect: boolean;
    };
    subscriptions: any[]
    listeners: Record<string, Function[]>;;

    /**
    * @param {Object} [options={}]
    * @property {boolean} [reconnect=false] - Automatically reconnect if connection closes
    * @property {number} [reconnectInterval=1000] - Time in ms between reconnect attempts
    * @property {number} [maxReconnectAttempts=Infinity] - Max number of reconnect tries before giving up
    * @property {boolean} [resubscribeOnReconnect=true] - Re-subscribe to previous subscriptions after reconnecting
    */
    constructor(options: Options = {}) {
        this.url = 'wss://sockets.betterttv.net/ws';
        this.ws = null;
        this.setting = {
            reconnect: options.reconnect ?? false,
            reconnectInterval: options.reconnectInterval || 1000,
            maxReconnectAttempts: options.maxReconnectAttempts || Infinity,
            resubscribeOnReconnect: options.resubscribeOnReconnect ?? true,
        };
        this.subscriptions = [];
        this.listeners = {};
    }

    /**
    * Listen to a event
    */
    on<K extends keyof Events>(event: K, cb: Events[K]) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event]!.push(cb);
    }

    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) {
        if (!this.listeners[event]) return;
        for (const cb of this.listeners[event]!) cb(...args);
    }

    /**
    * Connect to the WebSocket.
    */
    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener('open', async (event) => {
            console.log("BTTV WS OPEN");
            this.emit("open");

            if (this.setting.resubscribeOnReconnect) {
                for (const id of this.subscriptions) {
                    this.subscribe(id);
                }
            }
        });

        this.ws.addEventListener('message', async (event) => {
            let data = JSON.parse(event.data);

            this.emit("raw", data);

            if (!data?.name || blocked_events.includes(data["name"])) { return; };

            switch (data["name"]) {
                case "emote_create":
                    const parsed_emote_data = await parseSetData([data?.data?.emote]);

                    for (const emote of parsed_emote_data) { // TWITCH ID IS WAY TO TELL THE SET
                        this.emit("add_emote", data?.data?.channel?.replace("twitch:", ""), emote); // EVENT, TWITCH ID, EMOTE DATA
                    }

                    break;
                case "emote_delete":
                    this.emit("remove_emote", data?.data?.channel?.replace("twitch:", ""), data?.data?.emoteId);

                    break;
                case "emote_update":
                    const emote_update = data?.data?.emote;

                    this.emit("rename_emote", data?.data?.channel?.replace("twitch:", ""), emote_update);

                    break;
                default:
                    console.log("Unknown message from BTTV WebSocket: ", data);

                    break;
            }
        });

        this.ws.addEventListener('close', async (event) => {
            this.ws = null;

            console.log("closed");
            this.emit("close");

            if (this.setting.reconnect) {
                console.log(`reconnecting in ${this.setting.reconnectInterval / 1000}s`);

                setTimeout(() => this.connect(), this.setting.reconnectInterval);
            } else {
                this.subscriptions = [];
            }
        });

        this.ws.addEventListener('error', async (event) => {
            console.error(event);

            this.emit("error", event);
        });
    }

    /**
    * Disconnect the WebSocket.
    */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    /**
    * Subscribe to BTTV channel events.
    *
    * @param {string} id - Twitch user id.
    * @param {boolean} force - Forces the client to subscribe.
    */
    async subscribe(id: string|number, force?: boolean) {
        if (!id) { throw new Error("Missing 'id' parameter"); };

        if (this.subscriptions?.includes(id) && !force) {
            throw new Error(`Already subscribed`);
        }

        if (this.ws && this.ws.readyState !== this.ws.OPEN) {
            await new Promise<void>((resolve, reject) => {
                const handleOpen = () => {
                    cleanup();
                    resolve();
                };
                const handleClose = () => {
                    cleanup();
                    reject(new Error("WebSocket closed before subscription"));
                };
                const cleanup = () => {
                    if (this.ws) {
                        this.ws.removeEventListener("open", handleOpen);
                        this.ws.removeEventListener("close", handleClose);
                    }
                };
                if (this.ws) {
                    this.ws.addEventListener("open", handleOpen);
                    this.ws.addEventListener("close", handleClose);
                }
            });
        }

        const message = {
            name: "join_channel",
            data: {
                name: `twitch:${id}`
            }
        };

        if (this.ws) {
            this.ws.send(JSON.stringify(message));
        }

        if (!this.subscriptions.includes(id)) {
            this.subscriptions.push(id);
        }

        this.emit("subscribed", id);

        return true;
    }

    /**
    * Unsubscribe from BTTV channel events.
    *
    * @param {string} id - Twitch user id.
    */
    async unsubscribe(id: string|number) {
        if (!id) { throw new Error("Missing 'id' parameter"); };

        if (!this.subscriptions?.includes(id)) {
            throw new Error(`${id} is not subscribed`);
        }

        const message = {
            name: "part_channel",
            data: {
                name: `twitch:${id}`
            }
        };

        if (this.ws) {
            this.ws.send(JSON.stringify(message));
        }

        this.subscriptions = this.subscriptions.filter(subId => subId !== id);

        this.emit("unsubscribed", id);

        return true;
    }

    /**
    * Sends a message over the WebSocket if it’s open.
    *
    * Emits 'sent' event on success or 'send_error' event on failure.
    *
    * @param {string} message - The message to send.
    */
    send(message: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
            this.emit('sent', message);
        } else {
            const err = new Error('WebSocket is not open. Cannot send message.');

            this.emit('send_error', err);
        }
    }
}

export default BTTVWebSocket;