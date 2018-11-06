import { Comm } from './comm';

const myConsole: any = {};

export const overrideConsole = (
    comm: Comm,
    hook?: (obj: { key: string; arguments: IArguments }) => void,
) => {
    const consoleMethods = Object.keys(console);
    consoleMethods.forEach(key => {
        myConsole[key] = console[key];
        if (typeof console[key] === 'function') {
            console[key] = function() {
                hook && hook({ key, arguments });
                myConsole[key].apply(this, arguments);
            };
        }
    });
};

const getConsole = () => (myConsole.log ? myConsole : console) as Console;

export { getConsole };
