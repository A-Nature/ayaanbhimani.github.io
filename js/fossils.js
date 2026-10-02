/*
  fossils.js
  ---------------------------------------------------------------------------
  Hand-built fossil illustrations (inline SVG, no image files) drawn onto the
  stone-slab project cards in the Projects section. Each generator returns
  the inner markup for a 120x120 viewBox; fossilSVG() wraps it. Which fossil a
  project gets is the `fossil` field in data.js.
*/

const FOSSILS = {
  // Coiled shell: a log spiral with ribs running across each whorl.
  ammonite() {
    const cx = 60, cy = 60, a = 2.1, b = 0.148, end = Math.PI * 2 * 3.35;
    const r = (t) => a * Math.exp(b * t);
    const pt = (t, rad) => [cx + rad * Math.cos(t), cy + rad * Math.sin(t)];
    let spiral = "";
    for (let t = 0.2; t <= end; t += 0.1) {
      const [x, y] = pt(t, r(t));
      spiral += (spiral ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
    }
    let ribs = "";
    for (let t = Math.PI * 2; t <= end; t += 0.24) {
      const [x1, y1] = pt(t, r(t - Math.PI * 2) * 1.04);
      const [xc, yc] = pt(t + 0.2, (r(t - Math.PI * 2) + r(t)) / 2);
      const [x2, y2] = pt(t + 0.08, r(t));
      ribs += `M${x1.toFixed(1)},${y1.toFixed(1)}Q${xc.toFixed(1)},${yc.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
    }
    return `<path d="${spiral}" fill="currentColor" fill-opacity=".1"/><path d="${ribs}" stroke-width="1.2"/>`;
  },

  // Armored arthropod: head shield with eyes, segmented thorax, tail plate.
  trilobite() {
    let seg = "";
    for (let i = 0; i < 9; i++) {
      const y = 44 + i * 5.8, w = 27 - i * 1.4;
      seg += `<path d="M${60 - w},${y}Q60,${y + 5} ${60 + w},${y}"/>`;
      seg += `<path d="M${60 - w},${y}Q${60 - w - 2},${y + 3} ${60 - w + 1},${y + 6}M${60 + w},${y}Q${60 + w + 2},${y + 3} ${60 + w - 1},${y + 6}" stroke-width="1.1"/>`;
    }
    return `
      <path d="M30,42Q30,12 60,12T90,42Q60,50 30,42Z" fill="currentColor" fill-opacity=".1"/>
      <ellipse cx="44" cy="30" rx="5" ry="3.4"/><ellipse cx="76" cy="30" rx="5" ry="3.4"/>
      <path d="M60,16V44" stroke-width="1.1"/>
      ${seg}
      <path d="M53,44V98M67,44V98" stroke-width="1.1"/>
      <path d="M46,98Q60,116 74,98Q60,102 46,98Z" fill="currentColor" fill-opacity=".1"/>`;
  },

  // Fish skeleton: skull, spine with vertebrae, curved ribs, forked tail.
  fish() {
    let ribs = "", verts = "";
    for (let i = 0; i < 12; i++) {
      const x = 40 + i * 4.6, h = 15 - i * 0.9;
      ribs += `<path d="M${x},60Q${x + 3},${60 - h} ${x + 8},${60 - h - 3}M${x},60Q${x + 3},${60 + h} ${x + 8},${60 + h + 3}" stroke-width="1.1"/>`;
      verts += `<path d="M${x},57V63"/>`;
    }
    return `
      <path d="M10,60Q16,42 38,46V74Q16,78 10,60Z" fill="currentColor" fill-opacity=".1"/>
      <circle cx="22" cy="57" r="3"/>
      <path d="M38,60H94"/>${verts}${ribs}
      <path d="M60,57L68,40L80,57M64,63L70,80L80,63" stroke-width="1.1"/>
      <path d="M94,60L112,42Q106,60 112,78Z" fill="currentColor" fill-opacity=".1"/>`;
  },

  // Three-toed footprint, the kind a small theropod (or a bird) leaves.
  footprint() {
    const toe = (cx, cy, rot) => `
      <g transform="rotate(${rot} ${cx} ${cy})">
        <ellipse cx="${cx}" cy="${cy}" rx="8.5" ry="21" fill="currentColor" fill-opacity=".1"/>
        <path d="M${cx - 3.5},${cy - 19}L${cx},${cy - 29}L${cx + 3.5},${cy - 19}" />
      </g>`;
    return `${toe(60, 48, 0)}${toe(35, 60, -34)}${toe(85, 60, 34)}
      <ellipse cx="60" cy="88" rx="13" ry="12" fill="currentColor" fill-opacity=".1"/>`;
  },

  // Long bone with the classic knobbed ends.
  bone() {
    return `<g transform="rotate(-38 60 60)">
      <rect x="24" y="53" width="72" height="14" rx="6" fill="currentColor" fill-opacity=".1"/>
      <circle cx="21" cy="52" r="9"/><circle cx="21" cy="68" r="9"/>
      <circle cx="99" cy="52" r="9"/><circle cx="99" cy="68" r="9"/>
      <path d="M34,58H86M34,62H80" stroke-width="1"/>
    </g>`;
  },

  // Fan shell with growth rings and radial ribs.
  shell() {
    const base = [60, 104], R = 66, span = 74 * Math.PI / 180;
    const at = (ang, rad) => [base[0] + rad * Math.sin(ang), base[1] - rad * Math.cos(ang)];
    let ribs = "";
    for (let d = -70; d <= 70; d += 10) {
      const [x, y] = at(d * Math.PI / 180, R);
      ribs += `M${base[0]},${base[1]}L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    let rings = "";
    [22, 38, 54].forEach((rad) => {
      const [x1, y1] = at(-span, rad), [x2, y2] = at(span, rad);
      rings += `M${x1.toFixed(1)},${y1.toFixed(1)}A${rad},${rad} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}`;
    });
    const [lx, ly] = at(-span, R), [rx, ry] = at(span, R);
    return `<path d="M${base[0]},${base[1]}L${lx.toFixed(1)},${ly.toFixed(1)}A${R},${R} 0 0 1 ${rx.toFixed(1)},${ry.toFixed(1)}Z" fill="currentColor" fill-opacity=".1"/>
      <path d="${ribs}" stroke-width="1.1"/><path d="${rings}" stroke-width="1"/>
      <path d="M48,104H72L68,112H52Z"/>`;
  }
};

function fossilSVG(name) {
  const make = FOSSILS[name];
  if (!make) return "";
  return `<svg class="fossil-svg" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${make()}</svg>`;
}
