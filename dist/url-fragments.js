const b = function(p = {}) {
  let o = new URLSearchParams(window.location.hash.substr(1));
  const a = p.stores || "*";
  let s, r, c = "", d, u = {};
  const m = 100, g = function() {
    let t = o.toString();
    t !== c && (c = t, console.log("pushing state", t), history.pushState(null, "", `#${t}`));
  }, S = function() {
    clearTimeout(r), r = setTimeout(g, m);
  }, h = function() {
    for (let [t, e] of o.entries())
      if (a === "*" || a.includes(t)) {
        let n;
        try {
          n = JSON.parse(e);
        } catch (i) {
          if (i instanceof SyntaxError)
            n = e, console.warn(
              `urlFragments: could not parse JSON value for ${t} in URL hash: ${e}`
            );
          else
            throw i;
        }
        s.stores[t] ? s.stores[t](n) : s.store(t, n);
      }
  }, v = function(t) {
    for (let e in t)
      if ((a === "*" || a.includes(e)) && !u[e]) {
        const n = t[e];
        u[e] = n((i) => {
          const f = JSON.stringify(i);
          o.get(e) !== f && (o.set(e, f), S());
        });
      }
  }, l = function(t) {
    o = new URLSearchParams(window.location.hash.substr(1)), h();
  }, w = function(t) {
    console.log("windowMessage", t), t.data.message === "updateHash" && (window.location = t.data.value);
  };
  this.init = function(t) {
    s = t, h(), d = s.newstoreadded((e) => {
      v(s.stores);
    }), window.addEventListener("popstate", l), window.addEventListener("message", w);
  }, this.destroy = function() {
    window.removeEventListener("popstate", w), window.removeEventListener("popstate", l), d();
  };
};
export {
  b as urlFragments
};
