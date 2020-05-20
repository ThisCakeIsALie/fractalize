# Fractalize
Fractalize is a small website for generating fractals using the chaos game method. You can check out the live version [here](https://thiscakeisalie.github.io/fractalize/).

Fractalize is built using web components and as such is pretty easy to hack and manipulate. If you feel like it open the website and spin up your DevTools console alongside it.

```javascript
// First we select our fractal-viewer. The component that actually does the rendering
const viewer = document.querySelector('fractal-viewer');

// And then we can play around with the control points and jumpSize however we please
// All values are scaled from 0 to 1 so everything should be easy to calculate
viewer.addControlPoint(0.4, 0.3);
viewer.addControlPoint(0.2, 0.8);

viewer.jumpSize = 0.2;

// Go wild... there are some pretty cool control point patterns you can make your computer generate...
// This barebones API is still WIP so if you have any suggestions feel free to open an issue :)
```
