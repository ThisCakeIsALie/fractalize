const main = async () => {
    const viewer = document.querySelector("#fractal-viewer");

    viewer.addEventListener('ready', () => {
        viewer.addControlPoint(0.5, 0.3);
        viewer.addControlPoint(0.3, 0.7);
        viewer.addControlPoint(0.7, 0.7);

        viewer.jumpSize = 0.5;
    }, { once: true });
};

main();
