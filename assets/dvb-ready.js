// window.DVB に名前が揃うまで待つ（ブラウザ直接実行の仕様カード・UIキット用）
export function ready(names, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    const tick = () => {
      const D = window.DVB || {};
      if (names.every((n) => typeof D[n] === "function")) return resolve(D);
      if (Date.now() - t0 > timeout) return reject(new Error("DVB components not loaded: " + names.filter((n) => !D[n]).join(", ")));
      setTimeout(tick, 16);
    };
    tick();
  });
}
