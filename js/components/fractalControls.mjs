const { html, define, children } = window.hybrids;
import { FractalViewer } from './FractalViewer.mjs';
import { domEffect } from './factories.mjs';
import { listener } from './factories.mjs';


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


const updateDragged = listener(document, 'mousemove', (host, e) => {
    const { _activeViewer, _draggedPoint } = host;

    if (!_activeViewer || !_draggedPoint) {
        return;
    }

    const { width, height } = _activeViewer.getBoundingClientRect();
    
    const moveX = e.movementX / width;
    const moveY = e.movementY / height;

    const newPoint = {
        x: _draggedPoint.x + moveX,
        y: _draggedPoint.y + moveY
    };

    _activeViewer.removeControlPoint(_draggedPoint.x, _draggedPoint.y);
    _activeViewer.addControlPoint(newPoint.x, newPoint.y);
    host._draggedPoint = newPoint;
});


const clearDragged = listener(document, 'mouseup', (host, e) => {
    host._activeViewer = null;
    host._draggedPoint = null;
});



const handleNewPoint = listener(document, 'mousedown', (host, e) => {
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


const renderControlPoints = (host, viewer) => {
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

        const style = {
            position: 'fixed',
            top: pos.top + window.scrollY + offsetY - 8 + 'px',
            left: pos.left + window.scrollX + offsetX - 8 + 'px',
        };

        return html`
            <control-point onmousedown=${onMouseDown} style=${style}></control-point>
        `;
    });
};


export const FractalControls = {
    _activeViewer: null,
    _draggedPoint: null,
    cancelContextMenu,
    updateDragged,
    clearDragged,
    handleNewPoint,
    viewers: children(FractalViewer),
    render: (host) => html`
        <slot></slot>
        ${host.viewers.map(viewer => renderControlPoints(host, viewer))}
    `
};

define('fractal-controls', FractalControls);
