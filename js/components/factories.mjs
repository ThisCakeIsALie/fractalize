const { property } = window.hybrids;

export const method = fn => host => fn.bind(host, host);

export const effect = fn => host => fn(host);

export const domEffect = (fn, deps = []) => ({
    connect: host => {
        let cleanUp;

        // Busy waiting right now is the only reliable method to check for an existing shadowDOM
        // Sadly this is a shortcoming stemming from Hybridsjs design choices...
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
            if (cleanUp) {
                cleanUp();
            }
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

export const observedProp = (initialValue, observerCallback, connectedCallback) => ({
    ...property(initialValue, connectedCallback),
    observe: observerCallback
});
