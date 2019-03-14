const myConsole: any = {};

const getConsole = () => (myConsole.log ? myConsole : console) as Console;

export const overrideConsole = (
    hook?: (obj: { key: string; arguments: any[] }) => void,
) => {
    const consoleMethods = Object.keys(console);
    (Function.prototype as any).toJSON = function() {
        return this.toString();
    };
    consoleMethods.forEach(key => {
        myConsole[key] = console[key];
        if (typeof console[key] === 'function') {
            console[key] = function() {
                hook && hook({ key, arguments: Array.from(arguments) });
                myConsole[key].apply(this, arguments);
            };
        }
    });
};

export { getConsole };
