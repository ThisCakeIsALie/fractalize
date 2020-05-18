const { html, define } = window.hybrids;

export const DEFAULT_POINT_SIZE = 32;

export const ControlPoint = {
    size: DEFAULT_POINT_SIZE,
    render: host => html`
        <style>
            :host {
                display: inline-block;
                width: ${host.size}px;
                height: ${host.size}px;
            }

            :host([ hidden ]) {
                display: none;
            }

            #wrapper {
                display: flex;
                alignItems: center;
                justifyContent: center;
                position: relative;
                width: 100%;
                height: 100%;
            }

            .circle {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                margin: auto;
            }

            #innermostCircle {
                width: 25%;
                height: 25%;
                border-radius: 50%;
                background: black;
            }

            #innerCircle {
                position: absolute;
                width: 75%;
                height: 75%;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
                background: white;
            }

            #outerCircle {
                position: absolute;
                width: 85%;
                height: 85%;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
                background: black;
            }

            #outermostCircle {
                position: absolute;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
                background: white;
            }



        </style>
        <div id="wrapper">
            <div class="circle" id="outermostCircle"></div>
            <div class="circle" id="outerCircle"></div>
            <div class="circle" id="innerCircle"></div>
            <div class="circle" id="innermostCircle"></div>
        </div>
    `
};

define('control-point', ControlPoint);
