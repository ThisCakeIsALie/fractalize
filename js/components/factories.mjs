export const method = fn => host => fn.bind(host, host);

export const effect = fn => host => fn(host);

export const domEffect = (fn, deps = []) => ({
    connect: host => {
        let cleanUp;


        const rootChecker = setInterval(() => {
            if (!host.shadowRoot) {
                return;
            }

            if (!deps.every(dep => host.shadowRoot.querySelector(dep))) {
                return;
            }

            cleanUp = fn(host);
            clearInterval(rootChecker);
        }, 10);
        

        return () => {
            cleanUp();
        };
    }
});

export const listener = (target, event, listener) => domEffect(host => {
    const actualListener = event => {
        return listener(host, event);
    };

    target.addEventListener(event, actualListener);

    return () => target.removeEventListener(event, actualListener);
});
