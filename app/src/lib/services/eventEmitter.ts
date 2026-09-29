export class TypedEventEmitter<
    Events extends {
        [Key in keyof Events]: (...args: any[]) => void;
    },
> {
    listeners = new Map<keyof Events, Function[]>();

    on<K extends keyof Events>(event: K, callback: Events[K]) {
        const callbacks = this.listeners.get(event) ?? [];
        callbacks.push(callback);
        this.listeners.set(event, callbacks);
    }

    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) {
        for (const callback of this.listeners.get(event) ?? [])
            callback(...args);
    }
}

export function closeWebSocket(ws: WebSocket | null) {
    if (!ws || ws.readyState != WebSocket.OPEN) return ws;

    ws.close();
    return null;
}
