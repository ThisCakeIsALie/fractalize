const { html, define, dispatch } = window.hybrids;
import { method, domEffect } from './factories.mjs';
import { calculateGameStep } from '../chaosGame.mjs';
import { observedProp } from './factories.mjs';

const addControlPoint = method((host, x, y) => {
    const oldPoints = host.controlPoints;

    host.controlPoints = [ ...oldPoints, { x, y } ];
});

const clear = method(host => {
    const canvas = host.shadowRoot.querySelector('canvas');

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

const removeControlPoint = method((host, x, y) => {
    const oldPoints = host.controlPoints;

    // We select a specific point to remove if there are multiple points
    // at x and y
    const targetPoint = oldPoints.find(point => point.x == x && point.y == y);
    const newPoints = oldPoints.filter(point => point !== targetPoint);

    host.controlPoints = newPoints;
});

// Adapted from https://stackoverflow.com/questions/10673122/how-to-save-canvas-as-an-image-with-canvas-todataurl
const snapshot = method(host => {
    const canvas = host.shadowRoot.querySelector('canvas');

    if (!canvas) {
        return null;
    }

    return canvas.toDataURL('image/png').replace('image/octet-stream');
});

const drawFractals = domEffect(host => {
    // Once we can draw we are ready
    dispatch(host, 'ready');

    const canvas = host.shadowRoot.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    let currPos = {
        x: Math.random(),
        y: Math.random()
    };

    const interval = setInterval(() => {
        const width = canvas.width;
        const height = canvas.height;

        const { controlPoints, jumpSize } = host;

        if (controlPoints.length < 2) {
            return;
        }

        for (let i = 0; i < host.generationSpeed; i++) {
            currPos = calculateGameStep(currPos, controlPoints, jumpSize);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(currPos.x * width, currPos.y * height, 1, 1);
        }

    }, 50);

    return () => clearInterval(interval);
}, [ 'canvas' ]);


const resizeCanvas = domEffect(host => {
    const listener = () => {
        const canvas = host.shadowRoot.querySelector('canvas');
        const { width, height } = host.getBoundingClientRect();

        canvas.width = width;
        canvas.height = height;
    };

    listener();
    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
}, [ 'canvas' ]);


const controlPoints = observedProp([], host => host.selfCleaning && host.clear());
const jumpSize = observedProp(0, host => host.selfCleaning && host.clear());
const generationSpeed = observedProp(1000, host => host.selfCleaning && host.clear());


export const FractalViewer = {
    clear,
    snapshot,
    drawFractals,
    addControlPoint,
    removeControlPoint,
    jumpSize,
    controlPoints,
    generationSpeed,
    selfCleaning: false,
    resizeCanvas,
    render: () => html`
        <style>
            :host {
                display: block;
            }

            :host[hidden] {
                display: hidden;
            }

            canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%
            }
        </style>
        <canvas></canvas>
    `
};

define('fractal-viewer', FractalViewer);
