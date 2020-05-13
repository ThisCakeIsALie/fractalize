const { html, define } = window.hybrids;

export const ControlPoint = {
    render: () => html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                width: 16px;
                height: 16px;
            }

            :host[hidden] {
                display: hidden;
            }

            #innerCircle {
                position: absolute;
                top: 25%;
                left: 25%;
                width: 50%;
                height: 50%;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.4);
            }

            #outerCircle {
                position: absolute;
                z-index: -1;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
            }
        </style>
        <div id="innerCircle"></div>
        <div id="outerCircle"></div>
    `
};

define('control-point', ControlPoint);