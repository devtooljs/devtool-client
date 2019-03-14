/**
 * Communication 通信
 */

import { CommType } from '../../types/types';
import { initSocket, IInitSocketRawOptions } from '../lib/socket';
import { getConsole } from './console';
import { IDevToolClientOptions } from '../index';

export class Comm {
    private type: CommType = 'ws';
    private commIns: WebSocket | undefined;

    constructor() {}

    async init(options: IDevToolClientOptions, onEvnet) {
        this.type = options.commType || 'ws';
        if (this.type === 'ws')
            return await this.initSocket(options.wsConfig, onEvnet);
        if (this.type === 'http') return await this.initHttp();
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

    send(event: string, data: any = {}) {
        data.clientInfo = {
            url: location.href,
            port: location.port,
            type: 'devtool-client',
        };
        if (this.type === 'ws' && this.commIns) {
            this.commIns.send(JSON.stringify({ event, data }));
        }
    }
}
