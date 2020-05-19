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
    if (e.which !== 1) {
        return;
    }
    
    if (!host.viewers.includes(e.target)) {
        return;
    }

    const viewer = e.target;

    const newPoint = {
        x: e.offsetX / viewer.offsetWidth,
        y: e.offsetY / viewer.offsetHeight,
    };

    viewer.addControlPoint(newPoint.x, newPoint.y);
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

        const onMouseDown = (host, evt) => {
            switch (evt.which) {
                case 1:
                    host._activeViewer = viewer;
                    host._draggedPoint = point;
                    break;

                case 3:
                    viewer.removeControlPoint(point.x, point.y);
                    break;
                
                default:
                    break;
            }
        };

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
            <control-point class="unselectable fade-in" onmousedown=${onMouseDown} style=${style}></control-point>
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
