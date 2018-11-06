/**
 * Communication 通信
 */

import { CommType } from '../../types/types';
import { initSocket, IInitSocketRawOptions } from '../lib/socket';
import { getConsole } from './console';

export class Comm {
    private type: CommType;
    private commIns: WebSocket | undefined;

    constructor(type: CommType) {
        this.type = type;
        if (this.type === 'ws') {
        } else {
            throw Error('Only supporting websocket for now!');
        }
    }

    async initSocket(opts, onEvent) {
        if (this.type === 'ws') {
            const options: IInitSocketRawOptions = {
                host: '',
                port: '',
                onConnected: () => getConsole().log('connected!'),
                onDisconnected: () => getConsole().log('disconnected!'),
                onEvent: (event: string, data) => {
                    onEvent(event, data);
                    opts.onEvent && opts.onEvent(event, data);
                    getConsole().log('received data from Server ', data);
                },
                ...opts,
            };
            this.commIns = await initSocket(options);
        }
        return this;
    }

    async initHttp() {
        if (this.type === 'http') {
        }
        return this;
    }

    send(event: string, data: any) {
        data.clientInfo = {
            host: location.origin,
            port: location.port,
            type: 'devtool-client',
        };
        if (this.type === 'ws' && this.commIns) {
            this.commIns.send(JSON.stringify({ event, data }));
        }
    }
}
