import { getConsole } from './console';

let socket: WebSocket;

export interface IInitSocketOptions {
    host?: string;
    port?: string;
    onConnected?: () => void;
    onDisconnected?: () => void;
}

export interface IInitSocketRawOptions extends IInitSocketOptions {
    onEvent: (event: string, ...data: any) => void;
}

export const initSocket = (options: IInitSocketRawOptions) => {
    return new Promise<WebSocket>(resolve => {
        socket = new WebSocket(`${options.host}:${options.port}`);

        socket.onopen = () => {
            getConsole().log('connected');
            resolve(socket);
        };

        socket.onclose = () => {
            options.onDisconnected && options.onDisconnected();
        };

        socket.onmessage = res => {
            const { data } = res;
            const parsed = JSON.parse(data);
            options.onEvent(parsed.event, parsed.data);
        };
    });
};

export { socket };
