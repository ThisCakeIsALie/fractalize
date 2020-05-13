import { randomChoice } from './util.mjs';

export const calculateGameStep = (currPos, controlPoints, jumpSize) => {
    const target = randomChoice(controlPoints);

    const diffX = target.x - currPos.x;
    const diffY = target.y - currPos.y;

    return {
        x: currPos.x + jumpSize * diffX,
        y: currPos.y + jumpSize * diffY,
    }
};
