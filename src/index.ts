import { IInitSocketOptions } from './lib/socket';
import { overrideConsole, getConsole } from './lib/console';
import { overrideXhr } from './lib/xhr';
import { Comm } from './lib/comm';
import { parseStatement } from './lib/parser';

export interface IDevToolClientOptions {
    /**
     * 通信方式
     * 默认 websocket
     */
    comm?: 'ws' | 'http';

    /**
     * ws 配置
     */
    wsConfig?: IInitSocketOptions;
}

export const devTool = {
    init: async (opts: IDevToolClientOptions = {}) => {
        const commType = opts.comm || 'ws';
        const comm = new Comm(commType);
        const onEvent = (event: string, data) => {
            if (event === 'statement') {
                parseStatement(data);
            }
        };
        commType === 'ws'
            ? await comm.initSocket(opts.wsConfig, onEvent)
            : comm.initHttp();

        // 重写原生方法
        overrideConsole(comm, val => comm.send('console', val));
        overrideXhr(comm);
    },
};
