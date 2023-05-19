# Multiview Window
A plugin for the geocam-viewer.
### NPM Installation:
```
npm install 'https://gitpkg.now.sh/geocamxyz/plugin-url-fragments/src?v1.0.0'
```
or for a particual commit version:
```
npm install 'https://gitpkg.now.sh/geocamxyz/plugin-url-fragmentssrc?c7d31be'
```
### Import Map (External Loading):
```
https://cdn.jsdelivr.net/gh/geocamxyz/plugin-url-fragments@v1.0.0/dist/url-fragments.js
```
or for a particual commit version:
```
https://cdn.jsdelivr.net/gh/geocamxyz/plugin-url-fragments@c7d31be/dist/url-fragments.js
```
### Usage:
The .js file can be imported into your .html file using the below code (This can be ignored if your using the NPM package).
```
<script type="importmap">
  {
    "imports": {
      "url-fragments": "https://cdn.jsdelivr.net/gh/geocamxyz/plugin-url-fragments@v1.0.0/dist/url-fragments.js"
    }
  }
</script>
```
The plugin can be imported via a module script or using the npm package and using the below import statement.
```
import { urlFragments } from "url-fragments"
```
### Setup:
The plugin can then be added into the plugins array for the init of the viewer class as seen below
```
const viewer = new geocamViewer(node, {
	plugins: [
        new urlFragments({stores: ['fov','facing','horizon','shot','capture','visible','left','top','width','height','mode','autorotate','autobrightness','zoom','center','camLat','camLng','camAlt','camHdg','camTilt','camFov']}),
      ],
});
```