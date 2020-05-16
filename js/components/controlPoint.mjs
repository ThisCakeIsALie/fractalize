import { CONTROL_POINT_SIZE } from "../constants.mjs";

const { html, define } = window.hybrids;

export const ControlPoint = {
    render: () => html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                width: ${CONTROL_POINT_SIZE}px;
                height: ${CONTROL_POINT_SIZE}px;
            }

            :host([ hidden ]) {
                display: none;
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