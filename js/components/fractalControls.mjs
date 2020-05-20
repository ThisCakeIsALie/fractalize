const { html, define, children } = window.hybrids;
import { FractalViewer } from './fractalViewer.mjs';
import { domEffect } from './factories.mjs';
import { listener } from './factories.mjs';
import { DEFAULT_POINT_SIZE } from './controlPoint.mjs';

const cancelContextMenu = domEffect(({ viewers }) => {
    const listeners = [];

    viewers.forEach(viewer => {
        const listener = e => {
            e.preventDefault();
            return false;
        };

        listeners.push(listener);
        viewer.addEventListener('contextmenu', listener);
    });

    return () => {
        viewers.forEach((viewer, idx) => {
            viewer.removeEventListener('contextmenu', listeners[idx]);
        });
    }
});


const handleMouseMove = listener(document, 'mousemove', (host, e) => {
    const { _activeViewer: viewer, _draggedPoint: point } = host;

    if (!viewer || !point) {
        return;
    }

    const target = e.target;
    if (target !== viewer) {
        return;
    }
    
    const newPoint = {
        x: e.offsetX / viewer.offsetWidth,
        y: e.offsetY / viewer.offsetHeight,
    };

    viewer.removeControlPoint(point.x, point.y);
    viewer.addControlPoint(newPoint.x, newPoint.y);
    host._draggedPoint = newPoint;
});


const handleMouseUp = listener(document, 'mouseup', (host, _) => {
    host._activeViewer = null;
    host._draggedPoint = null;
});



const handleMouseDown = listener(document, 'mousedown', (host, e) => {
    if (!host.viewers.includes(e.target)) {
        return;
    }

    const viewer = e.target;


    const screenDistance = (point1, point2) => {
        const xDiff = (point2.x - point1.x) * viewer.offsetWidth;
        const yDiff = (point2.y - point1.y) * viewer.offsetHeight;

        return Math.sqrt(xDiff**2 + yDiff**2);
    };

    const mousePoint = {
        x: e.offsetX / viewer.offsetWidth,
        y: e.offsetY / viewer.offsetHeight,
    }

    const overlappingPoints = viewer.controlPoints.filter(point => screenDistance(point, mousePoint) < DEFAULT_POINT_SIZE / 2);
    const selectedPoint = overlappingPoints[overlappingPoints.length - 1];

    switch (e.which) {
        case 1:
            if (selectedPoint) {
                viewer.removeControlPoint(selectedPoint.x, selectedPoint.y);
            }
            viewer.addControlPoint(mousePoint.x, mousePoint.y);

            host._activeViewer = viewer;
            host._draggedPoint = mousePoint;
            break;

        case 3:
            if (selectedPoint) {
                viewer.removeControlPoint(selectedPoint.x, selectedPoint.y);
            }
            break;
        
        default:
            break;
    }
});


const viewers = children(FractalViewer);
const reactiveViewers = {
    ...viewers,
    connect: (host, key, invalidate) => {
        const cleanUp = viewers.connect(host, key, invalidate);

        window.addEventListener('resize', invalidate);

        return () => {
            cleanUp();
            window.removeEventListener('resize', invalidate);
        };
    }
};


const renderControlPoints = viewer => {
    const pos = viewer.getBoundingClientRect();
    const { controlPoints } = viewer;

    return controlPoints.map(point => {
        const offsetX = point.x * pos.width;
        const offsetY = point.y * pos.height;

        const viewerTop = pos.top + window.scrollY;
        const viewerLeft = pos.left + window.scrollY;

        const pointTop = offsetY - DEFAULT_POINT_SIZE / 2;
        const pointLeft = offsetX - DEFAULT_POINT_SIZE / 2;

        const style = {
            position: 'fixed',
            top: viewerTop + pointTop + 'px',
            left: viewerLeft + pointLeft + 'px',
        };

        return html`
            <control-point class="unselectable fade-in" style=${style}></control-point>
        `;
    });
};


export const FractalControls = {
    _activeViewer: null,
    _draggedPoint: null,
    cancelContextMenu,
    handleMouseMove,
    handleMouseUp,
    handleMouseDown,
    viewers: reactiveViewers,
    render: (host) => html`
        <style>
            .unselectable {
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -o-user-select: none;
                user-select: none;
                pointer-events: none;
            }

            .fade-in {
                animation: fade-in-anim 0.4s ease-in-out;
            }

            @keyframes fade-in-anim {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        </style>
        <slot></slot>
        ${host.viewers.map(viewer => renderControlPoints(viewer))}
    `
};

define('fractal-controls', FractalControls);
