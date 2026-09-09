// lucide (vanilla UMD) → React コンポーネント化するシム。本番は lucide-react を使う。
(function () {
  var R = window.React;
  var cache = {};
  function kebab(n) { return n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(); }
  function make(name) {
    var icons = window.lucide && window.lucide.icons;
    if (!icons) return undefined;
    var node = icons[name] || icons[kebab(name)];
    if (!node) return undefined;
    if (node[0] === "svg") node = node[2] || [];  // vanilla lucide: ["svg", attrs, children]
    var C = function (props) {
      props = props || {};
      var size = props.size || 24, sw = props.strokeWidth || 2, color = props.color || "currentColor";
      var rest = {};
      for (var k in props) if (["size", "strokeWidth", "color", "children"].indexOf(k) < 0) rest[k] = props[k];
      var kids = node.map(function (n, i) { var attrs = Object.assign({ key: i }, n[1]); return R.createElement(n[0], attrs); });
      return R.createElement("svg", Object.assign({ xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" }, rest), kids);
    };
    C.displayName = "Lucide" + name;
    return C;
  }
  window.LucideReact = new Proxy({}, {
    get: function (_, name) { if (typeof name !== "string") return undefined; if (!cache[name]) cache[name] = make(name); return cache[name]; },
    has: function (_, name) { return !!make(name); },
  });
})();
