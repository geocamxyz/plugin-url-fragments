const k = function(r = {}) {
  let n = new URLSearchParams(window.location.hash.substr(1));
  const o = r.stores || "*";
  let s, d, a, l = !1, h = "", c, u = {};
  const v = 100, f = r.history !== !1, b = r.settleDelay || 500, S = r.allowedOrigins || [
    window.location.origin,
    /^https:\/\/([\w-]+\.)*geocam\.io$/
  ], T = function(e) {
    return S.some(
      (t) => t instanceof RegExp ? t.test(e) : t === e
    );
  }, L = function() {
    let e = n.toString();
    e !== h && (h = e, f && !l ? (history.pushState(null, "", `#${e}`), l = !0) : history.replaceState(null, "", `#${e}`));
  }, E = function() {
    clearTimeout(d), d = setTimeout(L, v), f && (clearTimeout(a), a = setTimeout(() => {
      l = !1;
    }, b));
  }, m = function() {
    for (let [e, t] of n.entries())
      if (o === "*" || o.includes(e)) {
        let i;
        try {
          i = JSON.parse(t);
        } catch (g) {
          if (g instanceof SyntaxError)
            i = t, console.warn(
              `urlFragments: could not parse JSON value for ${e} in URL hash: ${t}`
            );
          else
            throw g;
        }
        s.stores[e] ? s.stores[e](i) : s.store(e, i);
      }
  }, H = function(e) {
    for (let t in e)
      if ((o === "*" || o.includes(t)) && !u[t]) {
        const i = e[t];
        u[t] = i((g) => {
          const y = JSON.stringify(g);
          n.get(t) !== y && (n.set(t, y), E());
        });
      }
  }, w = function(e) {
    n = new URLSearchParams(window.location.hash.substr(1)), m();
  }, p = function(e) {
    if (!T(e.origin)) {
      console.warn("urlFragments: ignoring message from origin", e.origin);
      return;
    }
    console.log("windowMessage", e), (e.data && e.data.message) === "updateHash" && (f ? window.location = e.data.value : window.location.replace(e.data.value));
  };
  this.init = function(e) {
    s = e, m(), c = s.newstoreadded((t) => {
      H(s.stores);
    }), window.addEventListener("popstate", w), window.addEventListener("hashchange", w), window.addEventListener("message", p);
  }, this.destroy = function() {
    clearTimeout(d), clearTimeout(a), window.removeEventListener("message", p), window.removeEventListener("popstate", w), window.removeEventListener("hashchange", w), c();
  };
};
class N extends HTMLElement {
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
        const a = (this.getAttribute("params") || "").split(","), l = (this.getAttribute("history") || "").toLowerCase(), h = !["off", "false", "none", "0"].includes(l), c = parseInt(this.getAttribute("settle-delay"), 10), u = { stores: a, history: h };
        Number.isNaN(c) || (u.settleDelay = c), this.plugin = new k(u), this.viewer.plugin(this.plugin);
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
  N
);
export {
  N as GeocamViewerUrlFragments
};
