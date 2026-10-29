/* Räumliche Ansicht der Referenzarchitektur, frei um alle drei Achsen drehbar.
 *
 * Die Szene kommt aus window.SCENE, erzeugt aus derselben Datenstruktur wie die
 * flache Grafik. Gerechnet wird von Hand, ohne 3D-Bibliothek.
 *
 * Drehung: Y (Gierung), X (Neigung), Z (Rollen), in dieser Reihenfolge auf den
 * Punkt angewendet. Das Mausrad dreht um die Hochachse, die gehaltene linke Taste
 * stellt den Blick frei ein. Dazu drei Regler und die Tastatur.
 *
 * Gezeichnet wird nach Tiefe sortiert. Rückflächen fallen über das Vorzeichen der
 * Polygonfläche weg. Beleuchtet wird im Blickraum, nicht im Modellraum — sonst
 * würde der Glanz mit dem Objekt mitdrehen statt über die Flächen zu wandern.
 *
 * Farben und Schriften stehen nicht hier, sondern in SCENE.theme. Der Generator
 * füllt sie aus der Palette des Repos, in dem gebaut wird — derselbe Renderer
 * trägt damit das helle for42- wie das dunkle Neural-Nautic-Design.
 */
(function () {
  var S = window.SCENE;
  var canvas = document.getElementById('model');
  var ctx = canvas.getContext('2d');
  var sliders = {
    x: document.getElementById('rot-x'),
    y: document.getElementById('rot-y'),
    z: document.getElementById('rot-z')
  };
  var readouts = {
    x: document.getElementById('out-x'),
    y: document.getElementById('out-y'),
    z: document.getElementById('out-z')
  };
  var resetBtn = document.getElementById('reset');

  var T = S.theme;                          // Farben und Schriften des Repos
  var CUBE = 42;
  var PITCH0 = 0.52;                        // Ausgangsneigung
  var FOCAL = 3400;                         // lange Brennweite, damit der Stapel nicht schert
  var LIGHT = norm([-0.30, 0.80, -0.52]);   // im Blickraum, nicht im Modellraum

  var W = 0, H = 0, dpr = 1;
  var rot = { x: PITCH0, y: 0, z: 0 };
  var goal = { x: PITCH0, y: 0, z: 0 };
  var nodes = {}, center, span;

  S.layers.forEach(function (l) {
    l.nodes.forEach(function (n) { nodes[n.id] = n; });
  });

  var ys = S.layers.map(function (l) { return l.y; });
  center = {
    x: S.box.w / 2,
    y: (Math.max.apply(null, ys) + Math.min.apply(null, ys)) / 2,
    z: S.box.d / 2
  };
  span = Math.max.apply(null, ys) - Math.min.apply(null, ys);

  // ---------------------------------------------------------------- Vektoren

  function norm(v) {
    var l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }
  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]];
  }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }

  /* Weltkoordinate → Blickraum. `dh` ist die Tiefe allein aus der Gierung; sie
     entscheidet, welche Beschriftungen vorn stehen — die volle Tiefe taugt dafür
     nicht, weil die Neigung die Höhe hineinrechnet. */
  function rotate(x, y, z) {
    var dx = x - center.x, dy = y - center.y, dz = z - center.z;

    var cy = Math.cos(rot.y), sy = Math.sin(rot.y);
    var x1 = dx * cy + dz * sy, z1 = -dx * sy + dz * cy, y1 = dy;

    var cx = Math.cos(rot.x), sx = Math.sin(rot.x);
    var y2 = y1 * cx - z1 * sx, z2 = y1 * sx + z1 * cx;

    var cz = Math.cos(rot.z), sz = Math.sin(rot.z);
    var x3 = x1 * cz - y2 * sz, y3 = x1 * sz + y2 * cz;

    return { x: x3, y: y3, z: z2, dh: z1 };
  }

  function project(x, y, z) {
    var v = rotate(x, y, z);
    var scale = FOCAL / (FOCAL + v.z + span * 0.9);
    var k = viewScale();
    return { x: W / 2 + v.x * scale * k, y: H / 2 - v.y * scale * k,
             d: v.z, dh: v.dh, s: scale };
  }

  function viewScale() {
    // 1390 = Höhe des RAG-Modells (fünf Ebenen). Höhere Stapel werden passend
    // verkleinert; für das RAG-Modell bleibt der Maßstab unverändert.
    return Math.min(W / 1500, H / (2150 * Math.max(1, span / 1390))) * 1.55;
  }

  // ---------------------------------------------------------------- Bausteine

  function shade(hex, f) {
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    var k = function (v) { return Math.max(0, Math.min(255, Math.round(v * f))); };
    return 'rgb(' + k(r) + ',' + k(g) + ',' + k(b) + ')';
  }

  /* Farbe aus dem Thema mit Alpha versehen — akzeptiert #rrggbb wie rgb(...). */
  function rgba(col, a) {
    a = Math.max(0, Math.min(1, a));
    if (col.charAt(0) === '#') return hexToRgba(col, a.toFixed(3));
    return col.replace(/^rgba?\(/, 'rgba(').replace(/\)$/, ',' + a.toFixed(3) + ')');
  }

  function hexToRgba(hex, a) {
    return 'rgba(' + parseInt(hex.slice(1, 3), 16) + ',' +
           parseInt(hex.slice(3, 5), 16) + ',' +
           parseInt(hex.slice(5, 7), 16) + ',' + a + ')';
  }

  function signedArea(p) {
    var a = 0;
    for (var i = 0; i < p.length; i++) {
      var q = p[(i + 1) % p.length];
      a += p[i].x * q.y - q.x * p[i].y;
    }
    return a / 2;
  }

  function cubeFaces(cx, cy, cz, a) {
    var v = [
      [cx - a, cy - a, cz - a], [cx + a, cy - a, cz - a],
      [cx + a, cy + a, cz - a], [cx - a, cy + a, cz - a],
      [cx - a, cy - a, cz + a], [cx + a, cy - a, cz + a],
      [cx + a, cy + a, cz + a], [cx - a, cy + a, cz + a]
    ];
    return [
      [v[3], v[2], v[6], v[7]], [v[0], v[4], v[5], v[1]],
      [v[1], v[5], v[6], v[2]], [v[4], v[0], v[3], v[7]],
      [v[5], v[4], v[7], v[6]], [v[0], v[1], v[2], v[3]]
    ];
  }

  function avgDepth(pp) {
    return pp.reduce(function (s, p) { return s + p.d; }, 0) / pp.length;
  }

  function routeOf(a, b) {
    if (Math.abs(a.y - b.y) < 1) return [[a.x, a.y, a.z], [b.x, b.y, b.z]];
    var ym = (a.y + b.y) / 2;
    return [[a.x, a.y, a.z], [a.x, ym, a.z], [b.x, ym, b.z], [b.x, b.y, b.z]];
  }

  // ---------------------------------------------------------------- Sammeln

  function collect() {
    var items = [], labels = [];

    S.layers.forEach(function (l) {
      var quad = [[0, l.y, 0], [S.box.w, l.y, 0],
                  [S.box.w, l.y, S.box.d], [0, l.y, S.box.d]];
      var pp = quad.map(function (p) { return project(p[0], p[1], p[2]); });
      items.push({
        d: avgDepth(pp) - 40,
        draw: function () {
          ctx.beginPath();
          pp.forEach(function (p, i) { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
          ctx.closePath();
          ctx.fillStyle = hexToRgba(l.color, 0.055);
          ctx.fill();
          ctx.strokeStyle = hexToRgba(l.color, 0.34);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
      labels.push({
        d: -1e6,
        draw: function () {
          var tag = project(0, l.y, S.box.d);
          ctx.font = '600 13px ' + T.sans;   // Titelschrift wäre hier zu zierlich
          ctx.textAlign = 'right';
          ctx.lineWidth = 4;
          ctx.lineJoin = 'round';
          ctx.strokeStyle = T.halo;
          ctx.strokeText(l.title, tag.x - 12, tag.y + 4);
          ctx.fillStyle = hexToRgba(l.color, 0.95);
          ctx.fillText(l.title, tag.x - 12, tag.y + 4);
          ctx.textAlign = 'start';
        }
      });
    });

    S.edges.forEach(function (e) {
      var a = nodes[e.a], b = nodes[e.b];
      if (!a || !b) return;
      var pts = routeOf(a, b).map(function (p) { return project(p[0], p[1], p[2]); });
      items.push({
        d: avgDepth(pts) - 10,
        draw: function () {
          ctx.beginPath();
          pts.forEach(function (p, i) { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
          ctx.strokeStyle = hexToRgba(e.color, 0.72);
          ctx.lineWidth = Math.max(0.8, e.w * 0.95);
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      });
    });

    S.layers.forEach(function (l) {
      l.nodes.forEach(function (n) {
        var a = (n.big ? CUBE * 1.4 : CUBE) / 2;
        var faces = cubeFaces(n.x, n.y, n.z, a);
        var pc = project(n.x, n.y, n.z);
        items.push({
          d: pc.d,
          draw: function () {
            faces.forEach(function (f) {
              var pp = f.map(function (p) { return project(p[0], p[1], p[2]); });
              if (signedArea(pp) >= 0) return;
              // Normale im Blickraum, damit der Glanz beim Drehen wandert
              var r0 = rotate(f[0][0], f[0][1], f[0][2]),
                  r1 = rotate(f[1][0], f[1][1], f[1][2]),
                  r2 = rotate(f[2][0], f[2][1], f[2][2]);
              var nrm = norm(cross(sub([r1.x, r1.y, r1.z], [r0.x, r0.y, r0.z]),
                                   sub([r2.x, r2.y, r2.z], [r0.x, r0.y, r0.z])));
              var lit = 0.66 + 0.5 * Math.abs(dot(nrm, LIGHT));
              ctx.beginPath();
              pp.forEach(function (p, i) { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
              ctx.closePath();
              ctx.fillStyle = shade(n.color, lit);
              ctx.fill();
              ctx.strokeStyle = shade(n.color, 0.66);
              ctx.lineWidth = 0.8;
              ctx.stroke();
            });
          }
        });
        labels.push({
          d: pc.d,
          draw: function () {
            var fade = Math.min(1, Math.max(0, (S.box.d * 0.55 - pc.dh) / (S.box.d * 0.7)));
            if (fade < 0.05) return;
            var px = pc.x + a * pc.s * 1.35 + 7, py = pc.y + 4;
            ctx.font = '12.5px ' + T.mono;
            ctx.lineWidth = 3.5;
            ctx.lineJoin = 'round';
            ctx.strokeStyle = rgba(T.halo, 0.92 * fade);
            ctx.strokeText(n.label, px, py);
            ctx.fillStyle = rgba(T.label, fade);
            ctx.fillText(n.label, px, py);
          }
        });
      });
    });

    return { items: items, labels: labels };
  }

  // ---------------------------------------------------------------- Bedienung

  function deg(rad) { return Math.round(rad * 180 / Math.PI); }
  function wrap(d) { return ((d % 360) + 540) % 360 - 180; }

  function syncUI() {
    ['x', 'y', 'z'].forEach(function (k) {
      var d = wrap(deg(rot[k]));
      if (sliders[k] && document.activeElement !== sliders[k]) sliders[k].value = d;
      if (readouts[k]) readouts[k].textContent = d + '°';
    });
  }

  var drag = null;
  canvas.addEventListener('pointerdown', function (e) {
    drag = { x: e.clientX, y: e.clientY, shift: e.shiftKey };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX; drag.y = e.clientY;
    if (e.shiftKey || drag.shift) {
      goal.z += dx * 0.006;                    // Umschalt: um die Blickachse rollen
    } else {
      goal.y += dx * 0.007;                    // waagerecht: Gierung
      goal.x += dy * 0.007;                    // senkrecht: Neigung
    }
    e.preventDefault();
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
    canvas.addEventListener(ev, function () { drag = null; canvas.style.cursor = 'grab'; });
  });

  canvas.addEventListener('wheel', function (e) {
    e.preventDefault();
    var d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;   // Zeilen- vs. Pixelmodus
    if (e.shiftKey) goal.x += d * 0.0020;
    else            goal.y += d * 0.0030;
  }, { passive: false });

  ['x', 'y', 'z'].forEach(function (k) {
    if (!sliders[k]) return;
    sliders[k].addEventListener('input', function () {
      goal[k] = rot[k] = parseFloat(sliders[k].value) * Math.PI / 180;
      syncUI();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      goal.x = PITCH0; goal.y = 0; goal.z = 0;
    });
  }

  var stage = canvas.closest('.m3d') || canvas;
  stage.addEventListener('keydown', function (e) {
    var step = e.shiftKey ? 0.20 : 0.06, used = true;
    switch (e.key) {
      case 'ArrowLeft':  goal.y -= step; break;
      case 'ArrowRight': goal.y += step; break;
      case 'ArrowUp':    goal.x -= step; break;
      case 'ArrowDown':  goal.x += step; break;
      case 'q': case 'Q': goal.z -= step; break;
      case 'e': case 'E': goal.z += step; break;
      default: used = false;
    }
    if (used) e.preventDefault();
  });

  // ---------------------------------------------------------------- Schleife

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame() {
    ['x', 'y', 'z'].forEach(function (k) { rot[k] += (goal[k] - rot[k]) * 0.14; });
    ctx.clearRect(0, 0, W, H);
    var c = collect();
    c.items.sort(function (a, b) { return b.d - a.d; }).forEach(function (i) { i.draw(); });
    c.labels.sort(function (a, b) { return b.d - a.d; }).forEach(function (i) { i.draw(); });
    syncUI();
    requestAnimationFrame(frame);
  }

  addEventListener('resize', resize, { passive: true });

  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'none';   // ein Finger dreht, kein Mitscrollen
  resize();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { requestAnimationFrame(frame); });
  } else {
    requestAnimationFrame(frame);
  }
})();
