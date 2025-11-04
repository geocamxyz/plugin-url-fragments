import { urlFragments } from "./lib/url-fragments.js";

export class GeocamViewerUrlFragments extends HTMLElement {
  constructor() {
    super();
    this.plugin = null;
    this.viewer = null;
    // this.yaw = this.getAttribute('yaw') || 0;
    console.log("url-fragments init");
  }

  connectedCallback() {
    console.log("url-fragments connected");
    const host = this.closest("geocam-viewer");
    if (!host) {
      console.error(
        "GeocamViewerUrlFragments must be a child of GeocamViewer"
      );
      return;
    }

    const attach = () => {
      const viewer = host.viewer;
      if (viewer && typeof viewer.plugin === "function") {
        if (this.plugin) return;
        this.viewer = viewer;
        const params = this.getAttribute("params") || "";
        const stores = params.split(",");
        this.plugin = new urlFragments({ stores });
        this.viewer.plugin(this.plugin);
      } else {
        setTimeout(attach, 50);
      }
    };

    attach();
  }

  disconnectedCallback() {
    if (this.plugin && typeof this.plugin.destroy === "function") {
      this.plugin.destroy();
    }
    this.plugin = null;
    this.viewer = null;
    console.log("url-fragments disconnected");
    // Clean up the viewer
  }
}

window.customElements.define(
  "geocam-viewer-url-fragments",
  GeocamViewerUrlFragments
);
