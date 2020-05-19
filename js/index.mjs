import { download } from "./util.mjs";

const openMenu = () => {
    document.querySelector('#menu').classList.remove('hidden');
}

const closeMenu = () => {
    document.querySelector('#menu').classList.add('hidden');
}

const main = async () => {
    // Setup the main fractal viewer once it is ready
    const viewer = document.querySelector('#fractal-viewer');

    viewer.addEventListener('ready', () => {
        viewer.addControlPoint(0.5, 0.3);
        viewer.addControlPoint(0.3, 0.7);
        viewer.addControlPoint(0.7, 0.7);

        viewer.jumpSize = 0.5;
    }, { once: true });


    // Setup the event listeners inside the menu
    const jumpSizeSlider = document.querySelector('#jump-size-slider');
    jumpSizeSlider.addEventListener('input', () => {
        viewer.jumpSize = jumpSizeSlider.value;
    });

    const generationSpeedSlider = document.querySelector('#generation-speed-slider');
    generationSpeedSlider.addEventListener('input', () => {
        viewer.generationSpeed = generationSpeedSlider.value;
    });

    const cameraButton = document.querySelector('#camera-button');
    cameraButton.addEventListener('click', () => {
        const fractalImage = viewer.snapshot();
        download('fractal.png', fractalImage);
    });


    // Manage the help text
    const helpText = document.querySelector('#help-text');
    document.addEventListener('mousedown', () => {
        helpText.classList.add('hidden');
    });


    // Make it possible to open the menu...
    const menuOpenButton = document.querySelector('#menu-open-button');

    menuOpenButton.addEventListener('click', openMenu);

    // And make it closable too
    const menuCloseButton = document.querySelector('#menu-close-button');

    menuCloseButton.addEventListener('click', closeMenu);
};

main();
