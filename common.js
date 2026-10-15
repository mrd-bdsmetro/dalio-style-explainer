// Shared timeline engine. Every sample is a pure function render(t) of time in seconds,
// so the same scene code can later be ported to Remotion (frame / fps) unchanged.
const TH = (() => {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const p = (t, a, b) => ease((t - a) / (b - a));          // eased 0→1 between a and b
  const lin = (t, a, b) => clamp((t - a) / (b - a));       // linear 0→1
  const lerp = (a, b, k) => a + (b - a) * k;
  const fade = (t, a, b, c, d) => (c === undefined ? p(t, a, b) : Math.min(p(t, a, b), 1 - p(t, c, d)));
  const num = (n, dec = 0) => n.toLocaleString('vi-VN', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  function run({ duration, hold = 3, render }) {
    const brand = window.BRAND || {};
    document.querySelectorAll('[data-brand]').forEach((el) => { el.textContent = brand[el.dataset.brand] || ''; });
    const stage = document.querySelector('.stage');
    const params = new URLSearchParams(location.search);
    const embed = params.has('embed');
    const barH = embed ? 0 : 56;

    function fit() {
      const s = Math.min(innerWidth / 1080, (innerHeight - barH) / 1920);
      stage.style.transform = `scale(${s})`;
      stage.style.left = (innerWidth - 1080 * s) / 2 + 'px';
      stage.style.top = (innerHeight - barH - 1920 * s) / 2 + 'px';
    }
    addEventListener('resize', fit);
    fit();

    let t = 0, playing = true, last = 0;
    if (params.has('t')) { t = +params.get('t'); playing = false; }
    const total = duration + hold;

    let btn, range, label;
    function toggle() { playing = !playing; if (btn) btn.textContent = playing ? 'Pause' : 'Play'; }
    if (!embed) {
      const bar = document.createElement('div');
      bar.className = 'th-controls';
      bar.innerHTML = `<button>${playing ? 'Pause' : 'Play'}</button><input type="range" min="0" max="${duration}" step="0.01" value="${t}"><span>0.0s</span><span>Space: pause · R: replay</span>`;
      document.body.appendChild(bar);
      [btn, range, label] = bar.children;
      btn.onclick = toggle;
      range.oninput = () => { t = +range.value; playing = false; btn.textContent = 'Play'; };
    }
    addEventListener('keydown', (e) => {
      if (e.code === 'Space') { e.preventDefault(); toggle(); }
      if (e.key === 'r' || e.key === 'R') { t = 0; playing = true; if (btn) btn.textContent = 'Pause'; }
    });

    function frame(now) {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      if (playing) { t += dt; if (t > total) t = 0; }
      const tt = Math.min(t, duration);
      render(tt);
      if (range) { range.value = tt; label.textContent = tt.toFixed(1) + 's'; }
      requestAnimationFrame(frame);
    }
    document.fonts.ready.then(() => requestAnimationFrame(frame));
  }

  return { clamp, ease, p, lin, lerp, fade, num, run };
})();
