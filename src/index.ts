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
    commType?: 'ws' | 'http';

    /**
     * ws 配置
     */
    wsConfig?: IInitSocketOptions;
}

export const devTool = {
    init: async (opts: IDevToolClientOptions = {}) => {
        const comm = new Comm();
        const onEvent = (event: string, data) => {
            if (event === 'statement') {
                parseStatement(data);
            }
        };
        await comm.init(opts, onEvent);
        // 发送已连接事件
        comm.send('clientConnected');

        // 重写原生方法
        overrideConsole(val => comm.send('console', val));
        overrideXhr();
    },
};
