export const urlFragments = function (config = {}) {
  let hashParams = new URLSearchParams(window.location.hash.substr(1));

  const trackedStores = config.stores || "*";

  let viewer,
    updateHashTO,
    settleTO,
    moving = false,
    lastHash = "",
    unsubNewStoreAdded,
    unsubs = {};

  // Keeps the address bar live during movement (replaceState coalesces).
  const DebounceTimeout = 100;

  // Whether view changes leave Back-button history at all. Off = the URL still
  // updates (copyable) but every change is a replaceState, so Back leaves the
  // page — the right default for an embedded iframe whose history belongs to the
  // host page. On (default) = one history entry per settled interaction.
  const trackHistory = config.history !== false;

  // How long the viewer must sit still before a movement counts as "settled".
  // Changes closer together than this collapse into a single history entry, so a
  // 2s drag is one Back step, not ~20.
  const SettleDelay = config.settleDelay || 500;

  // Mirrors the CSP the viewer route sends —
  // "frame-ancestors 'self' https://*.geocam.io" in geocam-pm
  // app/controllers/viewer_controller.rb#allow_geocam_framing. Only a page that is
  // allowed to embed the viewer is allowed to drive it.
  const allowedOrigins = config.allowedOrigins || [
    window.location.origin,
    /^https:\/\/([\w-]+\.)*geocam\.io$/,
  ];

  const originAllowed = function (origin) {
    return allowedOrigins.some((rule) =>
      rule instanceof RegExp ? rule.test(origin) : rule === origin
    );
  };

  const updateHash = function () {
    let hash = hashParams.toString();
    if (hash === lastHash) return;
    lastHash = hash;
    if (trackHistory && !moving) {
      // First change of a fresh interaction: push a new entry so the position we
      // are leaving stays on the Back stack. `moving` is now set, so every
      // subsequent change until the next settle mutates this same entry in place.
      history.pushState(null, "", `#${hash}`);
      moving = true;
    } else {
      // Mid-interaction, or history disabled: keep the URL live without adding a
      // Back-button entry. Copyable either way, no history flooding.
      history.replaceState(null, "", `#${hash}`);
    }
  };

  const updateHashDebounce = function () {
    clearTimeout(updateHashTO);
    updateHashTO = setTimeout(updateHash, DebounceTimeout);
    if (trackHistory) {
      // Re-arm the settle timer on every change. It only fires once movement
      // actually pauses for SettleDelay, ending the interaction so the next
      // change opens a new history entry. Since SettleDelay > DebounceTimeout,
      // the final replaceState always lands before `moving` is cleared.
      clearTimeout(settleTO);
      settleTO = setTimeout(() => {
        moving = false;
      }, SettleDelay);
    }
  };

  const hashParamsToStores = function () {
    for (let [k, str] of hashParams.entries()) {
      if (trackedStores === "*" || trackedStores.includes(k)) {
        let v;
        try {
          v = JSON.parse(str);
        } catch (e) {
          if (e instanceof SyntaxError) {
            v = str;
            console.warn(
              `urlFragments: could not parse JSON value for ${k} in URL hash: ${str}`
            );
          } else {
            throw e;
          }
        }
        viewer.stores[k] ? viewer.stores[k](v) : viewer.store(k, v); // NB this will add anything in hash url as a geocam viewer store
      }
    }

  };

  const subscribe = function (stores) {
     for (let name in stores) {
      if (trackedStores === "*" || trackedStores.includes(name)) {
        if (!unsubs[name]) {
          const store = stores[name];
          unsubs[name] = store((v) => {
            const val = JSON.stringify(v);
            if (hashParams.get(name) !== val) {
              hashParams.set(name, val);
              updateHashDebounce();
            }
          });
        } 
      }
    }
  };

  const handleHistoryStateChanges = function (event) {
    hashParams = new URLSearchParams(window.location.hash.substr(1));
    hashParamsToStores();
  };

  const handleWindowMessage = function (event) {
    if (!originAllowed(event.origin)) {
      console.warn("urlFragments: ignoring message from origin", event.origin);
      return;
    }
    console.log("windowMessage", event);
    const kind = event.data && event.data.message;
    if (kind === "updateHash") {
      // Honour the same history setting as internal changes: a discrete external
      // re-aim earns a Back entry when history is on, but not when it is off.
      if (trackHistory) {
        window.location = event.data.value;
      } else {
        window.location.replace(event.data.value);
      }
      // history.pushState({external: true}, '',  event.data.value)
    }
  };

  this.init = function (geocamViewer) {
    viewer = geocamViewer;
    // handle original URL hash here.
    hashParamsToStores();
    unsubNewStoreAdded = viewer.newstoreadded((d) => {
      subscribe(viewer.stores);
    });
    window.addEventListener("popstate", handleHistoryStateChanges);
    // a fragment changed on an already-loaded page fires hashchange, not popstate —
    // this is what lets an embedding page re-aim the iframe without a reload.
    window.addEventListener("hashchange", handleHistoryStateChanges);
    window.addEventListener("message", handleWindowMessage);
  };

  this.destroy = function () {
    clearTimeout(updateHashTO);
    clearTimeout(settleTO);
    window.removeEventListener("message", handleWindowMessage);
    window.removeEventListener("popstate", handleHistoryStateChanges);
    window.removeEventListener("hashchange", handleHistoryStateChanges);
    unsubNewStoreAdded();
  };
};
