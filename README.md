# Url Fragments
A web component plugin for the [geocamxyz/geocam-viewer](https://github.com/geocamxyz/geocam-viewer) which stores viewer state in the url hash so the address bar contents can be copied and loading that url will return the viewer to the exact same shot view (depending on the properties being tracked)
### NPM Installation:
```
npm install 'https://gitpkg.now.sh/geocamxyz/plugin-url-fragments/src?v2.0.3'
```
or for a particual commit version:
```
npm install 'https://gitpkg.now.sh/geocamxyz/plugin-url-fragmentssrc?25b9da6'
```
### Import Map (External Loading):
```
https://cdn.jsdelivr.net/gh/geocamxyz/plugin-url-fragments@v2.0.3/dist/url-fragments.js
```
or for a particual commit version:
```
https://cdn.jsdelivr.net/gh/geocamxyz/plugin-url-fragments@25b9da6/dist/url-fragments.js
```
### Usage:
The .js file can be imported into your .html file using the below code (This can be ignored if your using the NPM package).
```
 <script type="module" src="https://cdn.jsdelivr.net/gh/geocamxyz/plugin-url-fragments@v2.0.3/dist/url-fragments.js"></script>
 ```

 Or with an importmap
 ```
<script type="importmap">
  {
    "imports": {
      "compass-needle": "https://cdn.jsdelivr.net/gh/geocamxyz/plugin-url-fragments@v2.0.3/dist/url-fragments.js"
    }
  }
</script>
```
The plugin can then be imported via a module script or using the npm package and using the below import statement.
```
import "compass-needle"
```
### Setup:
The plugin can then be added to the viewer by making the custom element a child of the viewer parent element.  

```
<geocam-viewer>
    <geocam-viewer-url-fragments
    params="fov,facing,horizon,shot,sli,visible,left,top,width,height,mode,autorotate,autobrightness,zoom,center"></geocam-viewer-url-fragments>
</geocam-viewer>
```

There is a single readonly attribute:
- params *defines which of the viewer stores will be tracked in the url.  The string must be comma separated with each value matching a store name*

In the example above pretty much everything that defines how the viewer looks with a map (including its position relative to the map) is included.  So of these parameters wont be relevant if you are not using the plugins that manipulate those stores.