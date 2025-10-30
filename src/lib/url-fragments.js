export const urlFragments = function (config = {}) {
  let hashParams = new URLSearchParams(window.location.hash.substr(1));

  const trackedStores = config.stores || "*";

  let viewer,
    updateHashTO,
    lastHash = "",
    unsubNewStoreAdded,
    unsubs = {};

  const DebounceTimeout = 100;

  const updateHash = function () {
    let hash = hashParams.toString();
    if (hash !== lastHash) {
      lastHash = hash;
      // console.log("pushing state", hash);
      history.pushState(null, "", `#${hash}`);
      // window.location.hash = `#${hash}`;
    }
  };

  const updateHashDebounce = function () {
    clearTimeout(updateHashTO);
    updateHashTO = setTimeout(updateHash, DebounceTimeout);
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
    console.log("windowMessage", event);
    const kind = event.data.message;
    if (kind === "updateHash") {
      window.location = event.data.value;
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
    window.addEventListener("message", handleWindowMessage);
  };

  this.destroy = function () {
    window.removeEventListener("popstate", handleWindowMessage);
    window.removeEventListener("popstate", handleHistoryStateChanges);
    unsubNewStoreAdded();
  };
};
