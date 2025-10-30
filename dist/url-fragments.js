const S = function(r = {}) {
  let s = new URLSearchParams(window.location.hash.substr(1));
  const a = r.stores || "*";
  let n, c, l = "", u, d = {};
  const f = 100, p = function() {
    let e = s.toString();
    e !== l && (l = e, /* console.log("pushing state", e) */ history.pushState(null, "", `#${e}`));
  }, v = function() {
    clearTimeout(c), c = setTimeout(p, f);
  }, h = function() {
    for (let [e, t] of s.entries())
      if (a === "*" || a.includes(e)) {
        let o;
        try {
          o = JSON.parse(t);
        } catch (i) {
          if (i instanceof SyntaxError)
            o = t, console.warn(
              `urlFragments: could not parse JSON value for ${e} in URL hash: ${t}`
            );
          else
            throw i;
        }
        n.stores[e] ? n.stores[e](o) : n.store(e, o);
      }
  }, b = function(e) {
    for (let t in e)
      if ((a === "*" || a.includes(t)) && !d[t]) {
        const o = e[t];
        d[t] = o((i) => {
          const g = JSON.stringify(i);
          s.get(t) !== g && (s.set(t, g), v());
        });
      }
  }, w = function(e) {
    s = new URLSearchParams(window.location.hash.substr(1)), h();
  }, m = function(e) {
    console.log("windowMessage", e), e.data.message === "updateHash" && (window.location = e.data.value);
  };
  this.init = function(e) {
    n = e, h(), u = n.newstoreadded((t) => {
      b(n.stores);
    }), window.addEventListener("popstate", w), window.addEventListener("message", m);
  }, this.destroy = function() {
    window.removeEventListener("popstate", m), window.removeEventListener("popstate", w), u();
  };
};
class L extends HTMLElement {
  constructor() {
    super(), this.plugin = null, console.log("url-fragments init");
  }
  connectedCallback() {
    console.log("url-fragments connected");
    const s = this.parentNode;
    if (s.viewer && s.viewer.plugin) {
      const n = (this.getAttribute("params") || "").split(",");
      this.plugin = new S({ stores: n }), s.viewer.plugin(this.plugin);
    } else
      console.error(
        "GeocamViewerUrlFragments must be a child of GeocamViewer"
      );
  }
  disconnectedCallback() {
    this.plugin = null, console.log("url-fragments disconnected");
  }
}
window.customElements.define(
  "geocam-viewer-url-fragments",
  L
);
export {
  L as GeocamViewerUrlFragments
};
