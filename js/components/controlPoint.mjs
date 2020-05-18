const { html, define } = window.hybrids;

export const DEFAULT_POINT_SIZE = 32;

export const ControlPoint = {
    size: DEFAULT_POINT_SIZE,
    render: host => html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                width: ${host.size}px;
                height: ${host.size}px;
            }

            :host([ hidden ]) {
                display: none;
            }

            #container {
                width: 100%;
                heigth: 100%;
            }

        </style>
        <svg id="container" viewBox="0 0 100 100">
            <circle cx=50 cy=50 r=50 fill=white></circle>
            <circle cx=50 cy=50 r=40 fill=black></circle>
            <circle cx=50 cy=50 r=35 fill=white></circle>
            <circle cx=50 cy=50 r=12 fill=black></circle>
        </svg>
    `
};

define('control-point', ControlPoint);
