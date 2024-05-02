import { urlFragments } from "./lib/url-fragments.js";

export class GeocamViewerUrlFragments extends HTMLElement {
  constructor() {
    super();
    this.plugin = null;
    // this.yaw = this.getAttribute('yaw') || 0;
    console.log("url-fragments init");
  }

  connectedCallback() {
    console.log("url-fragments connected");
    const node = this;
    const parent = this.parentNode;
    if (parent.viewer && parent.viewer.plugin) {
      // Call a method on the parent
      //  new urlFragments({stores: ['fov','facing','horizon','shot','sli','visible','left','top','width','height','mode','autorotate','autobrightness','zoom','center']}),
      const params = this.getAttribute("params") || "";
      const stores = params.split(",");
      this.plugin = new urlFragments({ stores: stores });
      parent.viewer.plugin(this.plugin);
    } else {
      console.error(
        "GeocamViewerUrlFragments must be a child of GeocamViewer"
      );
    }
  }

  disconnectedCallback() {
    this.plugin = null;
    console.log("url-fragments disconnected");
    // Clean up the viewer
  }
}

window.customElements.define(
  "geocam-viewer-url-fragments",
  GeocamViewerUrlFragments
);
