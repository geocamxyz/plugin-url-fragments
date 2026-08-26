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

        // history="off" (also "false"/"none"/"0") stops view changes from
        // leaving Back-button entries — the hash still updates so the URL stays
        // copyable. Absent/anything else keeps history on. Use this on embedded
        // iframes whose Back-button history belongs to the host page.
        const historyAttr = (this.getAttribute("history") || "").toLowerCase();
        const history = !["off", "false", "none", "0"].includes(historyAttr);

        // Optional override for the pause (ms) that ends an interaction, i.e. how
        // aggressively rapid changes collapse into a single history entry.
        const settleDelay = parseInt(this.getAttribute("settle-delay"), 10);

        const config = { stores, history };
        if (!Number.isNaN(settleDelay)) config.settleDelay = settleDelay;
        this.plugin = new urlFragments(config);
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
