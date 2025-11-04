const S = function(l = {}) {
  let n = new URLSearchParams(window.location.hash.substr(1));
  const o = l.stores || "*";
  let s, c, r = "", u, d = {};
  const m = 100, p = function() {
    let e = n.toString();
    e !== r && (r = e, history.pushState(null, "", `#${e}`));
  }, v = function() {
    clearTimeout(c), c = setTimeout(p, m);
  }, h = function() {
    for (let [e, t] of n.entries())
      if (o === "*" || o.includes(e)) {
        let i;
        try {
          i = JSON.parse(t);
        } catch (a) {
          if (a instanceof SyntaxError)
            i = t, console.warn(
              `urlFragments: could not parse JSON value for ${e} in URL hash: ${t}`
            );
          else
            throw a;
        }
        s.stores[e] ? s.stores[e](i) : s.store(e, i);
      }
  }, b = function(e) {
    for (let t in e)
      if ((o === "*" || o.includes(t)) && !d[t]) {
        const i = e[t];
        d[t] = i((a) => {
          const g = JSON.stringify(a);
          n.get(t) !== g && (n.set(t, g), v());
        });
      }
  }, w = function(e) {
    n = new URLSearchParams(window.location.hash.substr(1)), h();
  }, f = function(e) {
    console.log("windowMessage", e), e.data.message === "updateHash" && (window.location = e.data.value);
  };
  this.init = function(e) {
    s = e, h(), u = s.newstoreadded((t) => {
      b(s.stores);
    }), window.addEventListener("popstate", w), window.addEventListener("message", f);
  }, this.destroy = function() {
    window.removeEventListener("popstate", f), window.removeEventListener("popstate", w), u();
  };
};
class y extends HTMLElement {
  constructor() {
    super(), this.plugin = null, this.viewer = null, console.log("url-fragments init");
  }
  connectedCallback() {
    console.log("url-fragments connected");
    const n = this.closest("geocam-viewer");
    if (!n) {
      console.error(
        "GeocamViewerUrlFragments must be a child of GeocamViewer"
      );
      return;
    }
    const o = () => {
      const s = n.viewer;
      if (s && typeof s.plugin == "function") {
        if (this.plugin) return;
        this.viewer = s;
        const r = (this.getAttribute("params") || "").split(",");
        this.plugin = new S({ stores: r }), this.viewer.plugin(this.plugin);
      } else
        setTimeout(o, 50);
    };
    o();
  }
  disconnectedCallback() {
    this.plugin && typeof this.plugin.destroy == "function" && this.plugin.destroy(), this.plugin = null, this.viewer = null, console.log("url-fragments disconnected");
  }
}
window.customElements.define(
  "geocam-viewer-url-fragments",
  y
);
export {
  y as GeocamViewerUrlFragments
};
