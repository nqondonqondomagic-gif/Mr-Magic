/* Mr Magic — non-destructive PDF mark-up that runs entirely in your browser.
 *
 * Design contract:
 *   - The PDF you open is read into memory only. Nothing is ever written back to it.
 *   - Edits live in a separate overlay layer ("project"), saved as a small .json sidecar.
 *   - "Export copy" applies the layer to a NEW pdf derived from the source bytes.
 *   - The export records the source file name + SHA-256 and its own true timestamp.
 *     It deliberately does NOT inherit or fake the source's creation date.
 */
(function () {
  'use strict';

  var APP = 'Mr Magic';
  var VERSION = '1.0';

  var pdfjsLib = window.pdfjsLib;
  var PDFLib = window.PDFLib;

  // ---------------------------------------------------------------- state ---
  var S = {
    bytes: null,
    doc: null,
    name: '', size: 0, mtime: 0, sha: '',
    info: {},
    pages: [],
    zoom: 1.1,
    cur: 1,
    edits: [],
    sel: null,
    tool: 'select',
    showEdits: true,
    ocr: {},
    ocrOn: {},
    style: {
      color: '#000000', size: 11, font: 'helv', bold: false, italic: false,
      geoColor: '#d1372c', lw: 1.6, hlColor: '#fff176', coverColor: '#ffffff'
    }
  };
  var idSeq = 1;
  function nextId() { idSeq += 1; return 'e' + idSeq + Date.now().toString(36).slice(-3); }

  // -------------------------------------------------------------- elements --
  function $(s) { return document.querySelector(s); }
  function gv(id) { return document.getElementById(id); }
  var elPages = $('#pages'), elViewer = $('#viewer'), elThumbs = $('#thumbs'),
      elLayers = $('#layers'), elProps = $('#props'), elStatus = $('#status'),
      elTip = $('#tip'), elZoom = $('#zoom-val'), elLayCount = $('#lay-count'),
      elVeil = $('#veil'), elCard = $('#card');
  var pageEls = {};

  // ---------------------------------------------------------------- utils ---
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function r2(v) { return Math.round(v * 100) / 100; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function shallow(o) { var r = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r[k] = o[k]; return r; }
  var statusBusy = false;
  function setStatus(html, busy) {
    statusBusy = !!busy;
    elStatus.innerHTML = html;
    elStatus.className = busy ? 'busy' : '';
  }
  // keep the page summary in the status bar truthful as edits come and go,
  // without ever stepping on a progress message
  function refreshStatus() {
    if (!S.doc || statusBusy) return;
    setStatus('<b>' + esc(S.name) + '</b> — page ' + S.cur + ' / ' + S.pages.length +
      ' · zoom ' + Math.round(S.zoom * 100) + '% · ' + pageEdits(S.cur).length + ' edit(s) here');
  }
  function px() { return S.zoom; }
  function pageSize(n) { return S.pages[n - 1] || { w: 612, h: 792 }; }
  function byId(id) { for (var i = 0; i < S.edits.length; i++) if (S.edits[i].id === id) return S.edits[i]; return null; }
  function pageEdits(n) { return S.edits.filter(function (e) { return e.p === n; }); }
  function baseName(n) { return String(n || 'document').replace(/\.pdf$/i, ''); }

  // Canvas font metrics, used to size replacement text to the original word.
  var mCtx = document.createElement('canvas').getContext('2d');
  function fontStack(f) {
    return f === 'cour' ? '"Courier New",Courier,monospace'
         : f === 'time' ? '"Times New Roman",Times,serif'
         : 'Helvetica,Arial,sans-serif';
  }
  function measure(text, it) {
    if (!text) return 0;
    mCtx.font = (it.italic ? 'italic ' : '') + (it.bold ? 'bold ' : '') + '100px ' + fontStack(it.font);
    var lines = String(text).split('\n'), best = 0;
    for (var i = 0; i < lines.length; i++) best = Math.max(best, mCtx.measureText(lines[i]).width);
    return best / 100 * (it.size || S.style.size);
  }

  // ------------------------------------------------------------- geometry ---
  // Items are stored in PDF points, origin top-left of the page.
  // line / arrow keep signed w/h (they are vectors); everything else is normalised.
  function norm(e) {
    if (e.t === 'line' || e.t === 'arrow') {
      if (e.t === 'arrow' && !e.w && !e.h) e.w = 60;
      return e;
    }
    if (e.t === 'pen') {
      if (e.pts && e.pts.length) {
        var xs = e.pts.map(function (p) { return p.x; }), ys = e.pts.map(function (p) { return p.y; });
        e.x = r2(Math.min.apply(null, xs)); e.y = r2(Math.min.apply(null, ys));
        e.w = r2(Math.max.apply(null, xs) - e.x); e.h = r2(Math.max.apply(null, ys) - e.y);
      }
      return e;
    }
    if (e.w < 0) { e.x += e.w; e.w = -e.w; }
    if (e.h < 0) { e.y += e.h; e.h = -e.h; }
    return e;
  }
  function bbox(e) { return { x: e.x, y: e.y, w: Math.abs(e.w), h: Math.abs(e.h) }; }
  function movePen(e, dx, dy) {
    if (e.t === 'pen' && e.pts) e.pts = e.pts.map(function (p) { return { x: r2(p.x + dx), y: r2(p.y + dy) }; });
  }

  // ============================================================ document ===
  function readFileBuf(file) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onload = function () { res(fr.result); };
      fr.onerror = function () { rej(fr.error || new Error('read failed')); };
      fr.readAsArrayBuffer(file);
    });
  }
  function readFileText(file) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onload = function () { res(fr.result); };
      fr.onerror = function () { rej(fr.error || new Error('read failed')); };
      fr.readAsText(file);
    });
  }
  async function hashBytes(buf) {
    try {
      if (!(window.crypto && window.crypto.subtle)) return '';
      var d = await crypto.subtle.digest('SHA-256', buf);
      var a = new Uint8Array(d), s = '';
      for (var i = 0; i < a.length; i++) s += ('0' + a[i].toString(16)).slice(-2);
      return s;
    } catch (err) { return ''; }
  }

  async function openFile(file) {
    if (!file) return;
    if (!/pdf$/i.test(file.name || '') && file.type !== 'application/pdf') {
      alert('Please choose a .pdf file.'); return;
    }
    setStatus('Reading ' + esc(file.name) + ' …', true);
    try {
      var buf = await readFileBuf(file);
      var doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise;
      var pages = [];
      for (var i = 1; i <= doc.numPages; i++) {
        var pg = await doc.getPage(i);
        var v = pg.getViewport({ scale: 1 });
        pages.push({ w: r2(v.width), h: r2(v.height) });
        if (pg.cleanup) pg.cleanup();
      }
      var info = {};
      try { var m = await doc.getMetadata(); if (m && m.info) info = shallow(m.info); } catch (e2) {}
      var sha = await hashBytes(buf.slice(0));

      S.bytes = buf; S.doc = doc; S.pages = pages; S.info = info; S.sha = sha;
      S.name = file.name; S.size = file.size; S.mtime = file.lastModified || 0;
      S.edits = []; S.sel = null; S.ocr = {}; S.ocrOn = {}; S.cur = 1; idSeq = 1;

      ['#btn-proj', '#btn-export', '#btn-ocr', '#btn-ocr-all', '#btn-load', '#btn-prov'].forEach(function (s) {
        $(s).disabled = false;
      });
      buildPages(); buildThumbs();
      await showPage(1);
      renderProps();
      setStatus('<b>' + esc(S.name) + '</b> — ' + pages.length + ' page(s), ' +
        (S.size / 1048576).toFixed(2) + ' MB, read into memory only.' +
        (sha ? ' SHA-256 ' + esc(sha.slice(0, 16)) + '…' : ''));
    } catch (err) {
      console.error(err);
      setStatus('Could not open that PDF: ' + esc(err.message || String(err)), true);
      alert('Could not open this PDF.\n\n' + (err.message || err) +
        '\n\nIf it is password-protected, remove the password in a PDF reader first. ' +
        'This editor does not work around permissions on documents you are not authorised to change.');
    }
  }

  // ============================================================== render ===
  function buildPages() {
    elPages.innerHTML = ''; pageEls = {};
    for (var n = 1; n <= S.pages.length; n++) {
      var ps = pageSize(n);
      var root = document.createElement('div');
      root.className = 'page';
      root.dataset.page = n;
      root.style.width = (ps.w * px()) + 'px';
      root.style.height = (ps.h * px()) + 'px';
      root.innerHTML =
        '<canvas></canvas>' +
        '<svg class="laysvg" width="100%" height="100%"></svg>' +
        '<div class="layhtml"></div>' +
        '<div class="layocr"></div>';
      elPages.appendChild(root);
      pageEls[n] = {
        root: root, canvas: root.querySelector('canvas'), ctx: null,
        svg: root.querySelector('.laysvg'), html: root.querySelector('.layhtml'),
        ocr: root.querySelector('.layocr'), drawn: 0
      };
      wirePage(n);
    }
  }

  async function renderPage(n) {
    var pe = pageEls[n]; if (!pe || !S.doc) return;
    var pg = await S.doc.getPage(n);
    var v = pg.getViewport({ scale: px() });
    pe.canvas.width = Math.max(1, Math.floor(v.width));
    pe.canvas.height = Math.max(1, Math.floor(v.height));
    pe.canvas.style.width = v.width + 'px';
    pe.canvas.style.height = v.height + 'px';
    pe.ctx = pe.canvas.getContext('2d', { alpha: false });
    pe.ctx.fillStyle = '#fff';
    pe.ctx.fillRect(0, 0, pe.canvas.width, pe.canvas.height);
    await pg.render({ canvasContext: pe.ctx, viewport: v }).promise;
    pe.drawn = px();
    if (pg.cleanup) pg.cleanup();
  }

  async function showPage(n) {
    if (!S.doc) return;
    n = clamp(n, 1, S.pages.length);
    S.cur = n;
    for (var k in pageEls) pageEls[k].root.classList.toggle('show', +k === n);
    var pe = pageEls[n];
    if (pe && pe.drawn !== px()) {
      setStatus('Rendering page ' + n + ' …', true);
      try { await renderPage(n); } catch (err) { console.error(err); }
      statusBusy = false; // rendering finished: let the summary line come back
    }
    sizeSvg(n);
    renderLayers(); renderOcr(n); markThumb();
    refreshStatus();
    elViewer.scrollTop = 0;
  }

  var zoomTimer = null;
  async function applyZoom() {
    elZoom.textContent = Math.round(S.zoom * 100) + '%';
    for (var n in pageEls) {
      pageEls[n].drawn = 0;
      var ps = pageSize(+n);
      pageEls[n].root.style.width = (ps.w * px()) + 'px';
      pageEls[n].root.style.height = (ps.h * px()) + 'px';
    }
    await showPage(S.cur);
    if (zoomTimer) clearTimeout(zoomTimer);
    zoomTimer = setTimeout(buildThumbs, 400);
  }
  function setZoom(z) { S.zoom = clamp(z, 0.35, 6); applyZoom(); }
  function fitWidth() {
    var avail = elViewer.clientWidth - 56;
    S.zoom = clamp(avail / pageSize(S.cur).w, 0.35, 6); applyZoom();
  }

  function sizeSvg(n) {
    var pe = pageEls[n]; if (!pe) return;
    var ps = pageSize(n);
    pe.svg.setAttribute('viewBox', '0 0 ' + (ps.w * px()) + ' ' + (ps.h * px()));
  }

  // ============================================================== layers ===
  var LABEL = { text: 'text', cover: 'cover', hl: 'mark', pen: 'pen', line: 'line',
                arrow: 'arrow', box: 'box', strike: 'strike' };

  function renderLayers() {
    var n = S.cur, pe = pageEls[n];
    if (!pe) { renderLayerList(); return; }
    var P = px();
    pe.html.innerHTML = ''; pe.svg.innerHTML = '';
    pe.root.classList.toggle('nohid', !S.showEdits);
    pe.root.dataset.mode = S.tool === 'pan' ? 'pan' : '';
    var list = pageEdits(n);
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.visible === false) continue;
      var b = bbox(e);
      var hit = document.createElement('div');
      hit.className = 'it ' + e.t + (S.sel === e.id ? ' sel' : '');
      hit.dataset.id = e.id;
      hit.style.left = (b.x * P) + 'px';
      hit.style.top = (b.y * P) + 'px';
      hit.style.width = (Math.max(b.w, 5) * P) + 'px';

      if (e.t === 'text') {
        var body = document.createElement('div');
        body.className = 'body';
        body.style.fontSize = (e.size * P) + 'px';
        body.style.color = e.color;
        body.style.fontFamily = fontStack(e.font);
        body.style.fontWeight = e.bold ? '700' : '400';
        body.style.fontStyle = e.italic ? 'italic' : 'normal';
        body.textContent = e.text || '';
        hit.style.width = (Math.max(b.w, measure(e.text || ' ', e)) * P + 3) + 'px';
        hit.style.height = 'auto';
        hit.appendChild(body);
      } else {
        var hpts = e.t === 'pen' || e.t === 'line' || e.t === 'arrow'
          ? Math.max(b.h, 5) : Math.max(b.h, e.lw || 1.6);
        hit.style.height = (hpts * P) + 'px';
        if (e.t === 'cover') { hit.style.background = e.color; hit.style.border = '1px solid rgba(0,0,0,.16)'; }
        else if (e.t === 'hl') {
          hit.style.background = e.color; hit.style.mixBlendMode = 'multiply';
          hit.style.opacity = '.5'; hit.style.borderRadius = '1px';
        } else { hit.style.background = 'transparent'; hit.style.border = '0'; }
      }
      if (e.locked) hit.style.outline = '1px dotted #4c9aff';
      else {
        var g = document.createElement('div'); g.className = 'grip'; g.dataset.grip = 'wh';
        var g2 = document.createElement('div'); g2.className = 'grip2'; g2.dataset.grip = 'sz';
        hit.appendChild(g); hit.appendChild(g2);
      }
      pe.html.appendChild(hit);
      drawSvg(e, pe, P);
    }
    renderLayerList();
    refreshStatus();
  }

  function drawSvg(e, pe, P) {
    var ns = 'http://www.w3.org/2000/svg';
    function mk(tag, at) {
      var el = document.createElementNS(ns, tag);
      for (var k in at) if (Object.prototype.hasOwnProperty.call(at, k)) el.setAttribute(k, at[k]);
      pe.svg.appendChild(el);
      return el;
    }
    var col = e.color || S.style.geoColor, lw = Math.max(0.6, (e.lw || 1.6) * P);
    if (e.t === 'box') {
      var b = bbox(e);
      mk('rect', { x: b.x * P, y: b.y * P, width: b.w * P, height: b.h * P,
                   fill: 'none', stroke: col, 'stroke-width': lw, rx: 1 });
    } else if (e.t === 'line' || e.t === 'arrow') {
      var x1 = e.x * P, y1 = e.y * P, x2 = (e.x + e.w) * P, y2 = (e.y + e.h) * P;
      mk('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: col, 'stroke-width': lw, 'stroke-linecap': 'round' });
      if (e.t === 'arrow') {
        var ang = Math.atan2(y2 - y1, x2 - x1), hl = Math.max(9, lw * 5);
        [ang + 2.6, ang - 2.6].forEach(function (a) {
          mk('line', { x1: x2, y1: y2, x2: x2 + Math.cos(a) * hl, y2: y2 + Math.sin(a) * hl,
                       stroke: col, 'stroke-width': lw, 'stroke-linecap': 'round' });
        });
      }
    } else if (e.t === 'strike') {
      var yy = (e.y + bbox(e).h * (e.pos == null ? 0.45 : e.pos)) * P;
      mk('line', { x1: e.x * P, y1: yy, x2: (e.x + bbox(e).w) * P, y2: yy,
                   stroke: col, 'stroke-width': lw, 'stroke-linecap': 'round' });
      if (e.double) mk('line', { x1: e.x * P, y1: yy + lw * 1.9, x2: (e.x + bbox(e).w) * P, y2: yy + lw * 1.9,
                   stroke: col, 'stroke-width': lw, 'stroke-linecap': 'round' });
    } else if (e.t === 'pen' && e.pts && e.pts.length > 1) {
      var d = e.pts.map(function (p, i) {
        return (i ? 'L' : 'M') + (p.x * P).toFixed(1) + ' ' + (p.y * P).toFixed(1);
      }).join(' ');
      mk('path', { d: d, fill: 'none', stroke: col, 'stroke-width': lw,
                   'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    }
  }

  function renderLayerList() {
    if (!S.doc) { elLayers.innerHTML = ''; return; }
    var list = pageEdits(S.cur);
    elLayCount.textContent = list.length ? '(' + list.length + ')' : '';
    if (!list.length) {
      elLayers.innerHTML = '<div class="empty">No edits on this page.<br><br>' +
        '<b>Strike</b> crosses out · <b>Text</b> adds a correction · <b>Cover</b> hides a value.</div>';
      return;
    }
    var h = '';
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      var nm = e.t === 'text' ? (e.text || '').split('\n')[0]
             : e.t === 'strike' ? ('✕ ' + (e.label || (r2(bbox(e).w) + 'pt')))
             : e.t;
      h += '<div class="lay' + (S.sel === e.id ? ' sel' : '') + (e.visible === false ? ' off' : '') +
        '" data-id="' + e.id + '"><span class="tag">' + (LABEL[e.t] || e.t) + '</span>' +
        '<span class="nm">' + esc(nm || '—') + '</span>' +
        '<button class="eye" data-eye="' + e.id + '" title="Show / hide this edit">' +
        (e.visible === false ? '○' : '●') + '</button></div>';
    }
    elLayers.innerHTML = h;
  }

  function markThumb() {
    elThumbs.querySelectorAll('.thumb').forEach(function (t) {
      t.classList.toggle('sel', +t.dataset.page === S.cur);
    });
  }
  async function buildThumbs() {
    if (!S.doc) return;
    elThumbs.innerHTML = '';
    var cap = Math.min(S.pages.length, 40);
    for (var n = 1; n <= cap; n++) {
      var d = document.createElement('div');
      d.className = 'thumb' + (n === S.cur ? ' sel' : '');
      d.dataset.page = n;
      d.innerHTML = '<b>' + n + '</b>';
      var c = document.createElement('canvas');
      d.appendChild(c);
      elThumbs.appendChild(d);
      queueThumb(n, c);
    }
    if (S.pages.length > cap) {
      var note = document.createElement('div');
      note.className = 'empty';
      note.textContent = 'First ' + cap + ' pages shown — use ← → or click the page in the viewer.';
      elThumbs.appendChild(note);
    }
  }
  function queueThumb(n, canvas) {
    S.doc.getPage(n).then(function (pg) {
      var sc = 116 / pageSize(n).w;
      var v = pg.getViewport({ scale: sc });
      canvas.width = Math.floor(v.width); canvas.height = Math.floor(v.height);
      var cx = canvas.getContext('2d');
      cx.fillStyle = '#fff'; cx.fillRect(0, 0, canvas.width, canvas.height);
      return pg.render({ canvasContext: cx, viewport: v }).promise;
    }).catch(function () {});
  }

  // ============================================================== OCR ======
  var ocrWorker = null, ocrBusy = false;
  async function getOcrWorker() {
    if (ocrWorker) return ocrWorker;
    if (!window.Tesseract) throw new Error('Tesseract library not loaded.');
    var tries = [];
    if (window.__OFFLINE_OCR__) {
      tries.push({ label: 'local', o: {
        workerPath: 'libs/tesseract-worker.min.js',
        corePath: 'libs/tess-core',
        langPath: 'libs/tess-lang'
      } });
    }
    tries.push({ label: 'online', o: {} });
    var last = null;
    for (var i = 0; i < tries.length; i++) {
      var opts = tries[i].o;
      opts.logger = function (m) {
        if (m && m.status) setStatus('OCR (' + tries[i].label + '): ' + esc(m.status) +
          (typeof m.progress === 'number' ? ' ' + Math.round(m.progress * 100) + '%' : ''), true);
      };
      try {
        ocrWorker = await Tesseract.createWorker('eng', 1, opts);
        return ocrWorker;
      } catch (err) {
        last = err; console.warn('OCR init failed via ' + tries[i].label, err);
        ocrWorker = null;
      }
    }
    throw last || new Error('could not start OCR');
  }

  function extractWords(data) {
    if (data.words && data.words.length) return data.words;
    var out = [];
    (data.blocks || []).forEach(function (b) {
      (b.paragraphs || []).forEach(function (p) {
        (p.lines || []).forEach(function (l) {
          (l.words || []).forEach(function (w) { out.push(w); });
        });
      });
    });
    return out;
  }

  async function runOcr(n) {
    if (!S.doc || ocrBusy) return;
    if (S.ocr[n] && S.ocr[n].status === 'run') return;
    ocrBusy = true;
    S.ocr[n] = { status: 'run', words: [] };
    try {
      var w = await getOcrWorker();
      var pg = await S.doc.getPage(n);
      var sc = 2.4;
      var v = pg.getViewport({ scale: sc });
      var c = document.createElement('canvas');
      c.width = Math.floor(v.width); c.height = Math.floor(v.height);
      var cx = c.getContext('2d', { alpha: false });
      cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height);
      await pg.render({ canvasContext: cx, viewport: v }).promise;
      if (pg.cleanup) pg.cleanup();
      setStatus('Recognising text on page ' + n + ' …', true);
      var res = await w.recognize(c);
      var words = extractWords(res.data || {});
      var out = [];
      for (var i = 0; i < words.length; i++) {
        var q = words[i], bb = q.bbox, txt = String(q.text || '').replace(/\s+$/, '');
        if (!bb || !txt.trim()) continue;
        out.push({
          x: r2(bb.x0 / sc), y: r2(bb.y0 / sc),
          w: r2((bb.x1 - bb.x0) / sc), h: r2((bb.y1 - bb.y0) / sc),
          text: txt, conf: q.conf
        });
      }
      S.ocr[n] = { status: 'done', words: out };
      S.ocrOn[n] = true;
      if (n === S.cur) renderOcr(n);
      statusBusy = false;
      setStatus('<b>' + esc(S.name) + '</b> — page ' + n + ': ' + out.length +
        ' words recognised. Select <b>Strike</b> or <b>Text</b> and click a word.');
    } catch (err) {
      console.error(err);
      S.ocr[n] = { status: 'err', words: [] };
      setStatus('OCR failed: ' + esc(err.message || String(err)), true);
      alert('OCR could not run:\n\n' + (err.message || err) +
        '\n\nThe engine loads an English language model the first time, so it needs an internet connection ' +
        'unless you launched this with the included start script (that one is fully offline).\n\n' +
        'Everything else works without OCR: drag <b>Strike</b> or <b>Cover</b> across an area by hand instead.');
    } finally {
      ocrBusy = false;
    }
  }

  function renderOcr(n) {
    var pe = pageEls[n]; if (!pe) return;
    var o = S.ocr[n], on = !!S.ocrOn[n] && !!o && o.status === 'done';
    pe.root.classList.toggle('ocr-on', on);
    pe.ocr.innerHTML = '';
    pe.ocr.style.pointerEvents = (on && (S.tool === 'strike' || S.tool === 'text' || S.tool === 'hl')) ? 'auto' : 'none';
    if (!on) return;
    var P = px(), frag = document.createDocumentFragment();
    for (var i = 0; i < o.words.length; i++) {
      var wd = o.words[i];
      var d = document.createElement('div');
      d.className = 'wb';
      d.dataset.i = i;
      d.style.left = (wd.x * P) + 'px'; d.style.top = (wd.y * P) + 'px';
      d.style.width = (wd.w * P) + 'px'; d.style.height = (wd.h * P) + 'px';
      d.title = wd.text + '  ·  ' + Math.round(wd.conf || 0) + '% match';
      frag.appendChild(d);
    }
    pe.ocr.appendChild(frag);
  }

  function ocrWordAt(n, clientX, clientY) {
    var o = S.ocr[n];
    if (!o || o.status !== 'done') return null;
    var pe = pageEls[n], r = pe.root.getBoundingClientRect(), P = px();
    var x = (clientX - r.left) / P, y = (clientY - r.top) / P;
    var best = null, bestA = Infinity;
    for (var i = 0; i < o.words.length; i++) {
      var wd = o.words[i];
      if (x >= wd.x - 1 && x <= wd.x + wd.w + 1 && y >= wd.y - 1 && y <= wd.y + wd.h + 1) {
        var a = wd.w * wd.h;
        if (a < bestA) { bestA = a; best = wd; }
      }
    }
    return best;
  }

  // ============================================================== tools ====
  var TIPS = {
    select: 'Click an edit to select it. Drag to move · corner handle resizes · side handle changes font size · <kbd>Del</kbd> removes.',
    pan: 'Scroll or drag the page. Nothing here writes to your file.',
    text: 'Click anywhere — or on a recognised word — to place a text box.',
    strike: 'Click a recognised word to cross it out and auto-drop a matched correction. Or just drag a box.',
    cover: 'Drag a box. It prints as an opaque block over whatever is underneath.',
    hl: 'Drag across text to highlight it.',
    pen: 'Draw freehand.',
    line: 'Drag to draw a straight line. Hold <kbd>Shift</kbd> to constrain.',
    arrow: 'Drag from the note towards what it refers to.',
    box: 'Drag a hollow rectangle to flag a field without hiding anything.'
  };
  function setTool(t) {
    S.tool = t;
    document.querySelectorAll('.tool[data-tool]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.tool === t);
    });
    elTip.innerHTML = TIPS[t] || '';
    renderOcr(S.cur);
    renderLayers();
  }

  function makeEdit(type, x, y) {
    var st = S.style;
    var e = { id: nextId(), t: type, p: S.cur, x: r2(x), y: r2(y), w: 0, h: 0, visible: true, locked: false };
    if (type === 'text') {
      e.size = st.size; e.font = st.font; e.bold = st.bold; e.italic = st.italic;
      e.color = st.color; e.text = ''; e.fitTo = null;
      e.w = 120; e.h = e.size * 1.2;
    } else if (type === 'cover') e.color = st.coverColor;
    else if (type === 'hl') e.color = st.hlColor;
    else if (type === 'strike') { e.color = st.geoColor; e.lw = st.lw; e.pos = 0.45; e.double = false; }
    else { e.color = st.geoColor; e.lw = st.lw; }
    return e;
  }

  function wirePage(n) {
    var pe = pageEls[n];
    pe.root.addEventListener('pointerdown', function (ev) {
      if (ev.button !== 0) return;
      var t = S.tool;
      if (t === 'pan') return;
      var r = pe.root.getBoundingClientRect(), P = px();
      var x = (ev.clientX - r.left) / P, y = (ev.clientY - r.top) / P;
      var onIt = ev.target.closest ? ev.target.closest('.it') : null;

      if (t === 'select') {
        if (!onIt) { S.sel = null; renderLayers(); renderProps(); return; }
        var it = byId(onIt.dataset.id);
        if (!it) return;
        S.sel = it.id;
        if (it.locked) { renderLayers(); renderProps(); return; }
        var grip = ev.target.dataset ? ev.target.dataset.grip : null;
        if (grip) { renderLayers(); renderProps(); startResize(ev, it, grip); }
        else { renderLayers(); renderProps(); startDrag(ev, it); }
        return;
      }
      if (t === 'text') {
        var w = ocrWordAt(n, ev.clientX, ev.clientY);
        var e = makeEdit('text', w ? r2(w.x + w.w + 2.5) : x, w ? r2(w.y + w.h * 0.1) : y);
        if (w) {
          e.size = Math.max(5, r2(w.h * 0.75));
          e.fitTo = null; e.text = w.text; e.anchorWord = w.text;
          e.w = Math.max(24, measure(w.text, e));
          e.h = e.size * 1.2;
        }
        S.edits.push(e); S.sel = e.id;
        markDirty();
        renderLayers(); renderProps(); beginTextEdit(e);
        elTip.innerHTML = w
          ? 'Copied &ldquo;<b>' + esc(w.text) + '</b>&rdquo; at its recognised size (' + e.size + ' pt) and baseline. Edit it.'
          : 'Type your text, then press <kbd>Esc</kbd>.';
        return;
      }
      if (t === 'strike') {
        var w2 = ocrWordAt(n, ev.clientX, ev.clientY);
        if (w2) { createStrikeOnWord(n, w2); return; }
      }
      startCreate(ev, n, t, x, y);
    });
  }

  function createStrikeOnWord(n, w) {
    var s = makeEdit('strike', w.x, w.y);
    s.w = w.w; s.h = Math.max(w.h, 4); s.label = w.text;
    s.lw = clamp(r2(w.h * 0.085), 0.8, 3.2);
    S.edits.push(s);
    var t = makeEdit('text', w.x, r2(w.y + w.h * 0.06));
    t.size = Math.max(5, r2(w.h * 0.74));
    t.w = w.w; t.fitTo = w.w; t.replaces = w.text; t.h = t.size * 1.2;
    S.edits.push(t);
    S.sel = t.id;
    markDirty();
    renderLayers(); renderProps(); beginTextEdit(t);
    elTip.innerHTML = 'Crossed out &ldquo;<b>' + esc(w.text) + '</b>&rdquo;. Type the replacement — it is fitted to the ' +
      'original width (' + w.w + ' pt) and sits on the same line, then press <kbd>Esc</kbd>.';
  }

  function startCreate(ev, n, t, x0, y0) {
    var P = px();
    var e = makeEdit(t, x0, y0);
    if (t === 'pen') e.pts = [{ x: r2(x0), y: r2(y0) }];
    S.edits.push(e); S.sel = e.id;
    renderLayers();
    function mv(ev2) {
      var r = pageEls[n].root.getBoundingClientRect();
      var x = (ev2.clientX - r.left) / P, y = (ev2.clientY - r.top) / P;
      if (t === 'pen') { e.pts.push({ x: r2(x), y: r2(y) }); norm(e); }
      else if (t === 'line' || t === 'arrow') {
        e.w = r2(x - x0); e.h = r2(y - y0);
        if (ev2.shiftKey) { if (Math.abs(e.w) > Math.abs(e.h)) e.h = 0; else e.w = 0; }
      } else {
        e.w = r2(x - x0); e.h = r2(y - y0);
        if (ev2.shiftKey && e.h) { var m = Math.max(Math.abs(e.w), Math.abs(e.h)); e.w = (e.w < 0 ? -1 : 1) * m; e.h = (e.h < 0 ? -1 : 1) * m; }
        norm(e);
      }
      renderLayers();
    }
    function up() {
      document.removeEventListener('pointermove', mv);
      document.removeEventListener('pointerup', up);
      if (t !== 'pen' && Math.abs(e.w) < 3 && Math.abs(e.h) < 3) {
        e.w = t === 'strike' ? 80 : 96;
        e.h = t === 'strike' ? S.style.size * 1.7 : S.style.size * 1.3;
        e.x = r2(e.x - (t === 'strike' ? 0 : e.w / 2)); e.y = r2(e.y - e.h / 2);
        norm(e);
      }
      if (t === 'pen' && e.pts.length < 2) e.pts.push({ x: r2(e.pts[0].x + 0.6), y: e.pts[0].y });
      norm(e);
      markDirty();
      renderLayers(); renderProps();
    }
    document.addEventListener('pointermove', mv);
    document.addEventListener('pointerup', up);
  }

  function startDrag(ev, it) {
    var P = px(), r = pageEls[S.cur].root.getBoundingClientRect();
    var ox = (ev.clientX - r.left) / P - it.x, oy = (ev.clientY - r.top) / P - it.y;
    var sx = it.x, sy = it.y, moved = false;
    function mv(ev2) {
      var x = (ev2.clientX - r.left) / P - ox, y = (ev2.clientY - r.top) / P - oy;
      if (ev2.shiftKey) { if (Math.abs(x - it.x) > Math.abs(y - it.y)) y = it.y; else x = it.x; }
      var dx = x - it.x, dy = y - it.y;
      movePen(it, dx, dy);
      it.x = r2(x); it.y = r2(y);
      moved = true;
      renderLayers();
    }
    function up() {
      document.removeEventListener('pointermove', mv);
      document.removeEventListener('pointerup', up);
      if (!moved) return;
      markDirty();
      renderLayers(); renderProps();
    }
    document.addEventListener('pointermove', mv);
    document.addEventListener('pointerup', up);
  }

  function startResize(ev, it, grip) {
    var P = px(), r = pageEls[S.cur].root.getBoundingClientRect();
    var sx = (ev.clientX - r.left) / P, sy = (ev.clientY - r.top) / P;
    var o = { x: it.x, y: it.y, w: Math.abs(it.w), h: Math.abs(it.h), s: it.size || S.style.size };
    function mv(ev2) {
      var x = (ev2.clientX - r.left) / P, y = (ev2.clientY - r.top) / P;
      if (grip === 'sz') {
        if (it.t === 'text') { it.size = clamp(r2(o.s + (y - sy)), 4, 160); it.h = it.size * 1.2; it.fitTo = null; }
        else it.h = clamp(r2(o.h + (y - sy)), 1, 2000);
      } else {
        it.w = r2(o.w + (x - sx));
        if (it.t !== 'line' && it.t !== 'arrow') it.h = r2(o.h + (y - sy));
        if (it.t === 'text') { it.fitTo = null; it.h = it.size * 1.2; }
        if (it.t !== 'line' && it.t !== 'arrow') norm(it);
      }
      renderLayers();
    }
    function up() {
      document.removeEventListener('pointermove', mv);
      document.removeEventListener('pointerup', up);
      if (it.t === 'text') { it.w = Math.max(20, r2(measure(it.text || ' ', it))); }
      markDirty();
      renderLayers(); renderProps();
    }
    document.addEventListener('pointermove', mv);
    document.addEventListener('pointerup', up);
  }

  function beginTextEdit(e) {
    var pe = pageEls[e.p]; if (!pe) return;
    var node = pe.html.querySelector('.it[data-id="' + e.id + '"] .body');
    if (!node) return;
    node.setAttribute('contenteditable', 'true');
    node.focus();
    try {
      var rng = document.createRange();
      rng.selectNodeContents(node); rng.collapse(false);
      var sl = window.getSelection(); sl.removeAllRanges(); sl.addRange(rng);
    } catch (err) {}
    function finish() {
      node.removeEventListener('blur', finish);
      node.removeEventListener('keydown', onKey);
      node.removeAttribute('contenteditable');
      e.text = (node.innerText || node.textContent || '').replace(/\u00a0/g, ' ').replace(/\n+$/, '');
      e.w = Math.max(20, r2(measure(e.text || ' ', e)));
      e.h = r2(e.text.split('\n').length * e.size * 1.2);
      if (!e.text) { S.edits = S.edits.filter(function (x) { return x.id !== e.id; }); S.sel = null; }
      markDirty();
      renderLayers(); renderProps();
    }
    function onKey(ev) {
      if (ev.key === 'Escape' || (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey))) {
        ev.preventDefault(); node.blur();
      }
      ev.stopPropagation();
    }
    node.addEventListener('blur', finish);
    node.addEventListener('keydown', onKey);
    node.addEventListener('paste', function (ev) {
      ev.preventDefault();
      var txt = ((ev.clipboardData || window.clipboardData).getData('text/plain') || '');
      document.execCommand('insertText', false, txt);
    });
  }

  function commitOpenTextEdit() {
    var node = document.querySelector('.layhtml .body[contenteditable="true"]');
    if (node) node.blur();
  }

  // ============================================================== props ====
  function numFld(label, id, val, min, max, step) {
    return '<div class="fld"><label>' + label + '</label><input type="number" id="' + id + '" value="' +
      (val == null ? 0 : r2(val)) + '" min="' + min + '" max="' + max + '" step="' + step + '"></div>';
  }
  function opt(v, lbl, cur) { return '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + lbl + '</option>'; }
  function toHex(c) { return /^#[0-9a-fA-F]{6}$/.test(c || '') ? c : '#000000'; }

  function renderProps() {
    if (!S.doc) {
      elProps.innerHTML = '<div class="empty">Open a PDF to start.<br><br>Nothing you do here writes to your file — ' +
        'edits sit in a separate layer that you can save, hide, or apply to a new copy on export.</div>';
      return;
    }
    var e = S.sel ? byId(S.sel) : null;
    if (!e) {
      elProps.innerHTML =
        '<div class="fld"><label>New text · size (pt)</label><input type="number" id="ps-size" value="' + S.style.size + '" min="4" max="160" step=".5"></div>' +
        '<div class="row"><div class="fld"><label>Typeface</label><select id="ps-font">' +
          opt('helv', 'Helvetica', S.style.font) + opt('time', 'Times', S.style.font) + opt('cour', 'Courier', S.style.font) +
        '</select></div><div class="fld"><label>Colour</label><input type="color" id="ps-color" value="' + S.style.color + '"></div></div>' +
        '<label class="chk"><input type="checkbox" id="ps-bold"' + (S.style.bold ? ' checked' : '') + '> Bold</label>' +
        '<label class="chk"><input type="checkbox" id="ps-italic"' + (S.style.italic ? ' checked' : '') + '> Italic</label>' +
        '<div class="fld" style="margin-top:8px"><label>Mark-up colour (strike, pen, arrows, boxes)</label>' +
        '<input type="color" id="ps-geo" value="' + S.style.geoColor + '"></div>' +
        '<div class="fld"><label>Stroke weight (pt)</label><input type="number" id="ps-lw" value="' + S.style.lw + '" min=".3" max="14" step=".1"></div>' +
        '<div class="row"><div class="fld"><label>Cover fill</label><input type="color" id="ps-cover" value="' + S.style.coverColor + '"></div>' +
        '<div class="fld"><label>Highlight</label><input type="color" id="ps-hl" value="' + S.style.hlColor + '"></div></div>' +
        '<div class="hint" style="margin-top:14px">' + S.edits.length + ' edit(s) in this project · page ' + S.cur +
        ' · OCR: <b>' + esc((S.ocr[S.cur] && S.ocr[S.cur].status) || 'not run') + '</b>' +
        (S.ocr[S.cur] && S.ocr[S.cur].words && S.ocr[S.cur].words.length ? ' (' + S.ocr[S.cur].words.length + ' words)' : '') +
        '</div>';
      bindStyle();
      return;
    }

    var h = '<div class="fld"><label>' + e.t.toUpperCase() + ' · page ' + e.p + (e.locked ? ' · locked' : '') + '</label></div>';
    if (e.t === 'text') {
      h += '<div class="fld"><label>Text</label><textarea id="pr-text" rows="3" placeholder="Type the correction…">' + esc(e.text) + '</textarea></div>' +
        '<div class="row">' + numFld('Size', 'pr-size', e.size, 4, 160, .5) +
        '<div class="fld"><label>Typeface</label><select id="pr-font">' +
          opt('helv', 'Helvetica', e.font) + opt('time', 'Times', e.font) + opt('cour', 'Courier', e.font) + '</select></div></div>' +
        '<div class="fld"><label>Colour</label><input type="color" id="pr-color" value="' + toHex(e.color) + '"></div>' +
        '<label class="chk"><input type="checkbox" id="pr-bold"' + (e.bold ? ' checked' : '') + '> Bold</label>' +
        '<label class="chk"><input type="checkbox" id="pr-italic"' + (e.italic ? ' checked' : '') + '> Italic</label>' +
        (e.replaces ? '<div class="hint">Replacement for recognised word &ldquo;<b>' + esc(e.replaces) + '</b>&rdquo;.</div>' : '') +
        (e.anchorWord ? '<div class="hint">Copied from &ldquo;<b>' + esc(e.anchorWord) + '</b>&rdquo; at its recognised size.</div>' : '') +
        (e.fitTo ? '<label class="chk"><input type="checkbox" id="pr-fit" checked> Shrink to fit original width (' + r2(e.fitTo) + ' pt)</label>' : '');
    } else if (e.t === 'strike') {
      h += '<div class="fld"><label>Note (what was crossed out)</label><input type="text" id="pr-label" value="' + esc(e.label || '') + '"></div>' +
        '<div class="fld"><label>Colour</label><input type="color" id="pr-color" value="' + toHex(e.color) + '"></div>' +
        numFld('Thickness (pt)', 'pr-lw', e.lw, .3, 14, .1) +
        numFld('Vertical position 0–1', 'pr-pos', e.pos == null ? .45 : e.pos, 0, 1, .05) +
        '<label class="chk"><input type="checkbox" id="pr-double"' + (e.double ? ' checked' : '') + '> Double strike</label>';
    } else if (e.t === 'cover' || e.t === 'hl' || e.t === 'box') {
      h += '<div class="fld"><label>' + (e.t === 'box' ? 'Line colour' : 'Fill colour') + '</label>' +
        '<input type="color" id="pr-color" value="' + toHex(e.color) + '"></div>';
      if (e.t === 'box') h += numFld('Thickness (pt)', 'pr-lw', e.lw, .3, 14, .1);
      if (e.t === 'cover') h += '<div class="hint">Prints as an opaque block over what is underneath. The underlying bytes still exist in your source file — that is what non-destructive means.</div>';
    } else {
      h += '<div class="fld"><label>Colour</label><input type="color" id="pr-color" value="' + toHex(e.color) + '"></div>' +
        numFld('Thickness (pt)', 'pr-lw', e.lw, .3, 14, .1) +
        (e.t === 'pen' ? '<div class="hint">' + (e.pts ? e.pts.length : 0) + ' recorded points</div>' : '');
    }
    if (e.t !== 'pen') {
      h += '<div class="row">' + numFld('X', 'pr-x', e.x, -3000, 5000, .5) + numFld('Y', 'pr-y', e.y, -3000, 5000, .5) + '</div>' +
        '<div class="row">' + numFld(e.t === 'line' || e.t === 'arrow' ? 'Δx' : 'Width', 'pr-w', e.w, -5000, 5000, .5) +
        numFld(e.t === 'line' || e.t === 'arrow' ? 'Δy' : 'Height', 'pr-h', e.h, -5000, 5000, .5) + '</div>';
    }
    h += '<label class="chk"><input type="checkbox" id="pr-lock"' + (e.locked ? ' checked' : '') + '> Lock position</label>' +
      '<div class="row" style="margin-top:8px"><button class="btn" id="pr-dup">Duplicate</button>' +
      '<button class="btn" id="pr-del">Delete</button></div>';
    elProps.innerHTML = h;
    bindItem(e);
  }

  function bindStyle() {
    var n = gv('ps-size'); if (n) n.addEventListener('input', function () { S.style.size = clamp(+n.value || S.style.size, 4, 160); });
    var lw = gv('ps-lw'); if (lw) lw.addEventListener('input', function () { S.style.lw = clamp(+lw.value || S.style.lw, .3, 14); });
    [['ps-font', 'font'], ['ps-color', 'color'], ['ps-geo', 'geoColor'], ['ps-cover', 'coverColor'], ['ps-hl', 'hlColor']]
      .forEach(function (p) {
        var el = gv(p[0]); if (!el) return;
        el.addEventListener('input', function () { S.style[p[1]] = el.value; });
      });
    [['ps-bold', 'bold'], ['ps-italic', 'italic']].forEach(function (p) {
      var el = gv(p[0]); if (!el) return;
      el.addEventListener('change', function () { S.style[p[1]] = el.checked; });
    });
  }

  function bindItem(e) {
    function on(id, fn) {
      var el = gv(id); if (!el) return;
      el.addEventListener('input', function () { markDirty(); fn(el); renderLayers(); });
    }
    on('pr-text', function (el) {
      e.text = el.value.replace(/\u00a0/g, ' ');
      e.w = Math.max(20, r2(measure(e.text || ' ', e)));
      e.h = r2(e.text.split('\n').length * e.size * 1.2);
    });
    on('pr-label', function (el) { e.label = el.value; renderLayerList(); });
    on('pr-size', function (el) { e.size = clamp(+el.value || 8, 4, 160); e.h = e.size * 1.2; e.fitTo = null; });
    on('pr-font', function (el) { e.font = el.value; });
    on('pr-color', function (el) { e.color = el.value; });
    on('pr-lw', function (el) { e.lw = clamp(+el.value || 1.6, .3, 14); });
    on('pr-pos', function (el) { e.pos = clamp(+el.value || 0, 0, 1); });
    on('pr-x', function (el) { var v = +el.value || 0; movePen(e, v - e.x, 0); e.x = v; });
    on('pr-y', function (el) { var v = +el.value || 0; movePen(e, 0, v - e.y); e.y = v; });
    on('pr-w', function (el) { e.w = +el.value || 1; e.fitTo = null; });
    on('pr-h', function (el) { e.h = +el.value || 1; });
    [['pr-bold', 'bold'], ['pr-italic', 'italic'], ['pr-double', 'double']].forEach(function (p) {
      var el = gv(p[0]); if (!el) return;
      el.addEventListener('change', function () { e[p[1]] = el.checked; markDirty(); renderLayers(); });
    });
    var fit = gv('pr-fit');
    if (fit) fit.addEventListener('change', function () { e.fitTo = fit.checked ? (e.fitTo || bbox(e).w) : null; markDirty(); renderLayers(); });
    var lk = gv('pr-lock');
    if (lk) lk.addEventListener('change', function () { e.locked = lk.checked; markDirty(); renderLayers(); });
    var dup = gv('pr-dup');
    if (dup) dup.addEventListener('click', function () {
      commitOpenTextEdit();
      var c = JSON.parse(JSON.stringify(e));
      c.id = nextId();
      var dx = 8, dy = 8;
      if (c.t === 'pen' && c.pts) c.pts = c.pts.map(function (p) { return { x: r2(p.x + dx), y: r2(p.y + dy) }; });
      c.x = r2(e.x + dx); c.y = r2(e.y + dy);
      S.edits.push(c); S.sel = c.id; markDirty(); renderLayers(); renderProps();
    });
    var del = gv('pr-del');
    if (del) del.addEventListener('click', function () { commitOpenTextEdit(); delSel(); });
  }

  function delSel() {
    if (!S.sel) return;
    S.edits = S.edits.filter(function (e) { return e.id !== S.sel; });
    S.sel = null;
    markDirty();
    renderLayers(); renderProps();
  }

  // =============================================================== export ==
  var SUBS = {
    '\u2018': "'", '\u2019': "'", '\u201a': "'", '\u201b': "'", '\u201c': '"', '\u201d': '"',
    '\u201e': '"', '\u2032': "'", '\u2033': '"', '\u2026': '...', '\u2013': '-', '\u2014': '--',
    '\u2212': '-', '\u00a0': ' ', '\u2022': '-', '\u00b7': '-', '\u2010': '-', '\u2011': '-',
    '\u2024': '.', '\u2025': '..', '\u2035': "'", '\u02cb': "'", '\u00d7': 'x', '\u2044': '/',
    '\u2215': '/', '\u2039': '<', '\u203a': '>', '\u201f': ','
  };
  function sanWinAnsi(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var ch = s[i], code = s.charCodeAt(i);
      if (SUBS[ch]) { out += SUBS[ch]; continue; }
      if (code === 10 || code === 9) { out += ch; continue; }
      if (code >= 32 && code <= 255) { out += ch; continue; }
      out += '?';
    }
    return out;
  }
  function rgb(hex) {
    var h = toHex(hex).slice(1);
    return PDFLib.rgb(parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255);
  }

  async function exportPdf() {
    if (!S.bytes) return;
    commitOpenTextEdit();
    var vis = S.edits.filter(function (e) { return e.visible !== false; });
    if (!vis.length && !confirm('This project has no visible edits, so the export will be a plain copy of the original.\n\nExport anyway?')) return;
    setStatus('Writing a new copy …', true);
    try {
      var src = await PDFLib.PDFDocument.load(new Uint8Array(S.bytes.slice(0)), { ignoreEncryption: true });
      var pages = src.getPages();
      var cache = {};
      async function fontFor(kind, bold, italic) {
        var k = kind + (bold ? 'b' : '') + (italic ? 'i' : '');
        if (!cache[k]) {
          var F = PDFLib.StandardFonts;
          var name = kind === 'cour' ? (bold ? F.CourierBold : italic ? F.CourierOblique : F.Courier)
                   : kind === 'time' ? (bold ? F.TimesBold : italic ? F.TimesItalic : F.TimesRoman)
                   : (bold ? F.HelveticaBold : italic ? F.HelveticaOblique : F.Helvetica);
          cache[k] = await src.embedFont(name);
        }
        return cache[k];
      }
      var written = 0;
      var covers = vis.filter(function (e) { return e.t === 'cover'; });
      var rest = vis.filter(function (e) { return e.t !== 'cover'; });
      var ordered = covers.concat(rest);

      for (var i = 0; i < ordered.length; i++) {
        var e = ordered[i], pg = pages[e.p - 1];
        if (!pg) continue;
        var PH = pg.getHeight();
        var b = bbox(e);

        if (e.t === 'text') {
          var fnt = await fontFor(e.font, e.bold, e.italic);
          var txt = sanWinAnsi(e.text || '');
          if (!txt.trim()) continue;
          var lines = txt.split('\n'), size = e.size;
          if (e.fitTo) {
            var mw = 0;
            for (var q = 0; q < lines.length; q++) mw = Math.max(mw, fnt.widthOfTextAtSize(lines[q], size));
            if (mw > e.fitTo) size = Math.max(4, size * e.fitTo / mw);
          }
          var lh = size * 1.18;
          for (var L = 0; L < lines.length; L++) {
            pg.drawText(lines[L], {
              x: e.x, y: PH - e.y - size * 0.8 - L * lh,
              size: size, font: fnt, color: rgb(e.color), lineHeight: lh
            });
          }
          written++;
        } else if (e.t === 'cover') {
          pg.drawRectangle({ x: b.x, y: PH - (b.y + b.h), width: b.w, height: b.h, color: rgb(e.color), opacity: 1 });
          written++;
        } else if (e.t === 'hl') {
          pg.drawRectangle({ x: b.x, y: PH - (b.y + b.h), width: b.w, height: b.h, color: rgb(e.color), opacity: 0.45 });
          written++;
        } else if (e.t === 'box') {
          pg.drawRectangle({ x: b.x, y: PH - (b.y + b.h), width: b.w, height: b.h, borderColor: rgb(e.color), borderWidth: e.lw || 1.6 });
          written++;
        } else if (e.t === 'strike') {
          var c = rgb(e.color), lw = e.lw || 1.6;
          var yy = e.y + b.h * (e.pos == null ? .45 : e.pos);
          pg.drawLine({ start: { x: b.x, y: PH - yy }, end: { x: b.x + b.w, y: PH - yy }, thickness: lw, color: c, lineCap: PDFLib.LineCapStyle.Round });
          if (e.double) {
            var y2 = yy + lw * 1.9;
            pg.drawLine({ start: { x: b.x, y: PH - y2 }, end: { x: b.x + b.w, y: PH - y2 }, thickness: lw, color: c, lineCap: PDFLib.LineCapStyle.Round });
          }
          written++;
        } else if (e.t === 'line' || e.t === 'arrow') {
          var c2 = rgb(e.color), lw2 = e.lw || 1.6;
          var s0 = { x: e.x, y: PH - e.y }, s1 = { x: e.x + e.w, y: PH - (e.y + e.h) };
          pg.drawLine({ start: s0, end: s1, thickness: lw2, color: c2, lineCap: PDFLib.LineCapStyle.Round });
          if (e.t === 'arrow') {
            var ang = Math.atan2(s1.y - s0.y, s1.x - s0.x), hl = Math.max(7, lw2 * 5);
            [ang + 2.6, ang - 2.6].forEach(function (a) {
              pg.drawLine({ start: s1, end: { x: s1.x + Math.cos(a) * hl, y: s1.y + Math.sin(a) * hl }, thickness: lw2, color: c2, lineCap: PDFLib.LineCapStyle.Round });
            });
          }
          written++;
        } else if (e.t === 'pen' && e.pts && e.pts.length > 1) {
          var c3 = rgb(e.color), lw3 = e.lw || 1.6;
          for (var p = 1; p < e.pts.length; p++) {
            pg.drawLine({
              start: { x: e.pts[p - 1].x, y: PH - e.pts[p - 1].y },
              end: { x: e.pts[p].x, y: PH - e.pts[p].y },
              thickness: lw3, color: c3, lineCap: PDFLib.LineCapStyle.Round, lineJoin: PDFLib.LineJoinStyle.Round
            });
          }
          written++;
        }
      }

      var now = new Date();
      // Note: pdf-lib deliberately overwrites /Producer with its own signature on save,
      // so this app identifies itself in /Creator, which is preserved. Nothing here copies
      // or backdates the source's timestamps — the export reports when it was really made.
      var meta = {
        setTitle: [baseName(S.name) + ' — edited'],
        setCreationDate: [now],
        setModificationDate: [now],
        setCreator: [APP + ' ' + VERSION + ' — derived from ' + S.name +
          (S.sha ? ' (SHA-256 ' + S.sha + ')' : '')],
        setSubject: ['Edited copy of ' + S.name + ' — ' + pages.length + ' pages, ' + written +
          ' layer object(s) applied · source SHA-256 ' + (S.sha || 'unavailable')],
        setKeywords: [['mr-magic', 'derived-copy', 'source-sha256:' + (S.sha || 'unavailable')]]
      };
      Object.keys(meta).forEach(function (fn) {
        try {
          if (typeof src[fn] === 'function') src[fn].apply(src, meta[fn]);
          else console.warn('pdf-lib has no ' + fn);
        } catch (e1) { console.warn('metadata ' + fn + ': ' + e1.message); }
      });

      var out = await src.save();
      downloadBlob(new Blob([out], { type: 'application/pdf' }), baseName(S.name) + '-edited.pdf');
      setStatus('Exported <b>' + esc(baseName(S.name) + '-edited.pdf') + '</b> · ' + written +
        ' object(s) written · your original was not touched.');
      alert('A new PDF was created with the layer applied.\n\n' +
        'Original file:  ' + S.name + ' — unchanged on disk.\n' +
        'New file:       ' + baseName(S.name) + '-edited.pdf\n\n' +
        'The copy carries its own real creation timestamp, and names the source file and its SHA-256 in its ' +
        'metadata. That is intentional: it makes the copy traceable if anyone asks where it came from. ' +
        'This tool will not backdate or strip timestamps.\n\n' +
        'Keep the .pdflayer.json project file as well — it is what lets you reopen and adjust these edits later.');
    } catch (err) {
      console.error(err);
      setStatus('Export failed: ' + esc(err.message || String(err)), true);
      alert('Export failed:\n\n' + (err.message || err) +
        '\n\nIf this PDF is encrypted with an owner password, clear it in a PDF reader first.');
    }
  }

  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 2000);
  }

  // ============================================================= project ===
  function saveProject() {
    if (!S.doc) return;
    commitOpenTextEdit();
    var o = {
      format: 'pdflayer', app: APP, version: 1,
      saved: new Date().toISOString(),
      source: { name: S.name, size: S.size, lastModified: S.mtime, sha256: S.sha, info: S.info },
      pageCount: S.pages.length,
      pages: S.pages,
      editCount: S.edits.length,
      edits: S.edits
    };
    downloadBlob(new Blob([JSON.stringify(o, null, 1)], { type: 'application/json' }),
      baseName(S.name) + '.pdflayer.json');
    dirty = false;
    setStatus('Project saved: <b>' + esc(baseName(S.name) + '.pdflayer.json') + '</b> · ' +
      S.edits.length + ' edit(s). Your PDF is still exactly as it was.');
  }

  async function loadProject(file) {
    if (!file) return;
    if (!S.doc) { alert('Open the original PDF first, then load its project file.'); return; }
    try {
      var o = JSON.parse(await readFileText(file));
      if (o.format !== 'pdflayer') { alert('That is not a Mr Magic project file.'); return; }
      var bad = [];
      if (o.source && o.source.name && o.source.name !== S.name) bad.push('file name (saved against "' + o.source.name + '")');
      if (o.source && o.source.sha256 && S.sha && o.source.sha256 !== S.sha) bad.push('SHA-256 checksum');
      else if (o.source && o.source.size && o.source.size !== S.size) bad.push('file size');
      if (o.pageCount && o.pageCount !== S.pages.length) bad.push('page count (' + o.pageCount + ' vs ' + S.pages.length + ')');
      if (bad.length) {
        if (!confirm('This project was saved against a different document:\n\n· ' + bad.join('\n· ') +
          '\n\nLoading it anyway may place edits in the wrong positions.\n\nLoad anyway?')) return;
      }
      S.edits = (o.edits || []).map(function (e) { return norm(e); });
      idSeq = S.edits.length + 2;
      S.sel = null; dirty = false;
      await showPage(clamp(S.cur, 1, S.pages.length));
      renderProps();
      setStatus('Loaded <b>' + esc(file.name) + '</b> — ' + S.edits.length +
        ' edit(s) restored. Nothing was written to your PDF.');
    } catch (err) {
      console.error(err);
      alert('Could not read that project file:\n\n' + (err.message || err));
    }
  }

  // ================================================================= cards =
  function card(html) { elCard.innerHTML = html; elVeil.classList.add('on'); }
  function closeCard() { elVeil.classList.remove('on'); }
  function kv(k, v) { return '<div>' + esc(k) + '</div><div>' + v + '</div>'; }
  function fmtPdfDate(d) {
    var m = /D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?(Z|[+-]\d{2}'\d{2}')?/.exec(String(d || ''));
    if (!m) return esc(String(d || ''));
    return m[1] + '-' + m[2] + '-' + m[3] + '  ' + m[4] + ':' + m[5] + (m[6] ? ':' + m[6] : ':00') + (m[7] ? ' ' + m[7] : '');
  }

  function showProvenance() {
    if (!S.doc) return;
    var i = S.info || {}, t = {};
    S.edits.forEach(function (x) { t[x.t] = (t[x.t] || 0) + 1; });
    card(
      '<h3>Provenance record</h3>' +
      '<div class="hint">Read from your original file and stored with the project, so a derived copy can always be traced back to its source.</div>' +
      '<div class="kv">' +
      kv('File name', esc(S.name)) +
      kv('Size', S.size.toLocaleString() + ' bytes') +
      kv('OS file modified', S.mtime ? esc(new Date(S.mtime).toLocaleString()) : '— not reported —') +
      kv('PDF /CreationDate', fmtPdfDate(i.CreationDate) || '— not recorded —') +
      kv('PDF /ModDate', fmtPdfDate(i.ModDate) || '— not recorded —') +
      kv('Producer', esc(i.Producer || '— not recorded —')) +
      kv('Creator', esc(i.Creator || '— not recorded —')) +
      kv('Author', esc(i.Author || '— not recorded —')) +
      kv('Title', esc(i.Title || '— not recorded —')) +
      kv('SHA-256 (this session)', S.sha ? '<span title="' + esc(S.sha) + '">' + esc(S.sha.slice(0, 32)) + '…</span>' : '— unavailable —') +
      kv('Pages', String(S.pages.length)) +
      kv('Page 1 size', pageSize(1).w + ' × ' + pageSize(1).h + ' pt') +
      kv('Edits in layer', String(S.edits.length) + (Object.keys(t).length ? ' (' + Object.keys(t).map(function (k) { return k + ' ' + t[k]; }).join(', ') + ')' : '')) +
      '</div>' +
      '<div class="note"><b>About timestamps.</b> An exported copy is a new file, so it reports a new creation time and names this source and its hash. ' +
      'This editor will not backdate, inherit or strip timestamps — an altered document that pretends to be untouched is the one thing that ' +
      'turns a correction into a forgery.<br><br>' +
      'If the document itself is wrong (a judgment figure, a credit listing, a finance agreement), the defensible fix is an amended original from the ' +
      'issuer. Use this tool to mark up what must change, or to correct your own templates and letters.</div>' +
      '<div class="acts"><button class="btn" id="cp-copy">Copy record</button><button class="btn primary" id="cp-x">Close</button></div>'
    );
    gv('cp-x').addEventListener('click', closeCard);
    gv('cp-copy').addEventListener('click', function () {
      var txt = APP + ' provenance record\n' + elCard.querySelector('.kv').innerText;
      var btn = gv('cp-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { btn.textContent = 'Copied'; },
          function () { btn.textContent = 'Copy blocked — select manually'; });
      } else btn.textContent = 'No clipboard access';
    });
  }

  function showHelp() {
    card(
      '<h3>Mr Magic</h3>' +
      '<div class="kv prose">' +
      kv('1 · Open', 'Open PDF, or drop a file anywhere. The bytes are read into memory only — this tool never writes back to the file you choose.') +
      kv('2 · Edit', 'Pick a tool in the left rail. Edits sit in a floating layer over the page.') +
      kv('3 · Save project', 'Downloads a small .json with your edits plus a record of the source file. Reopen the PDF and load it to continue.') +
      kv('4 · Export copy', 'Writes a NEW pdf with the layer applied. Your original stays as it is.') +
      '</div>' +
      '<h3 style="margin-top:18px;font-size:14px">Scanned pages where the text is not selectable</h3>' +
      '<div class="hint" style="line-height:1.7">' +
      'Click <b>OCR this page</b>. A hidden word layer is built — while <b>Strike</b> or <b>Text</b> is selected, words outline in blue as you hover.<br>' +
      '· <b>Strike</b> + click → crosses out that exact word and drops a replacement box matched to its baseline, height and width, so the correction sits on the line instead of looking pasted on.<br>' +
      '· <b>Text</b> + click → places an editable copy of the word right after it, at the recognised size.<br>' +
      '· <b>Cover</b> → drag over anything you need blocked out (ID numbers, account numbers).<br>' +
      'Recognition is not perfect on handwriting or poor scans — the text is always yours to fix, and the layer list shows every change made.</div>' +
      '<h3 style="margin-top:18px;font-size:14px">Shortcuts</h3>' +
      '<div class="hint" style="line-height:1.7">' +
      '<kbd>V</kbd> select · <kbd>H</kbd> pan · <kbd>T</kbd> text · <kbd>K</kbd> strike · <kbd>C</kbd> cover · <kbd>Y</kbd> highlight · ' +
      '<kbd>P</kbd> pen · <kbd>L</kbd> line · <kbd>A</kbd> arrow · <kbd>B</kbd> box · <kbd>D</kbd> show/hide layer<br>' +
      '<kbd>Del</kbd> remove · arrows nudge 1 pt (<kbd>Shift</kbd> = 10) · <kbd>Shift</kbd> while drawing constrains ' +
      '· <kbd>Ctrl/⌘ S</kbd> save project · <kbd>Ctrl/⌘ E</kbd> export · <kbd>Esc</kbd> deselect' +
      '</div>' +
      '<div class="note" style="margin-top:16px"><b>Being straight about what this is.</b> It is a mark-up and correction tool with a full audit trail: ' +
      'visible layer, saved project, checksummed source, honestly dated export. It is not a tool for making an altered document look untouched.</div>' +
      '<div class="acts"><button class="btn primary" id="hp-x">Got it</button></div>'
    );
    gv('hp-x').addEventListener('click', closeCard);
  }

  // ================================================================ dirty ==
  var dirty = false;
  function markDirty() { dirty = true; }

  // ============================================================== wiring ====
  function wire() {
    if (!window.pdfjsLib || !window.PDFLib) {
      setStatus('Libraries missing — the libs/ folder must sit next to index.html.', true);
      return;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'libs/pdf.worker.min.js';

    $('#btn-open').addEventListener('click', function () { $('#fin').click(); });
    $('#fin').addEventListener('change', function (e) { openFile(e.target.files[0]); e.target.value = ''; });
    $('#btn-proj').addEventListener('click', saveProject);
    $('#btn-load').addEventListener('click', function () { $('#pfin').click(); });
    $('#pfin').addEventListener('change', function (e) { loadProject(e.target.files[0]); e.target.value = ''; });
    $('#btn-export').addEventListener('click', exportPdf);
    $('#btn-ocr').addEventListener('click', function () { runOcr(S.cur); });
    $('#btn-ocr-all').addEventListener('click', async function () {
      if (!S.doc) return;
      for (var n = 1; n <= S.pages.length; n++) await runOcr(n);
      renderOcr(S.cur);
      setStatus('OCR pass finished over ' + S.pages.length + ' page(s).');
    });
    $('#btn-prov').addEventListener('click', showProvenance);
    $('#btn-help').addEventListener('click', showHelp);
    $('#zoom-in').addEventListener('click', function () { setZoom(S.zoom * 1.2); });
    $('#zoom-out').addEventListener('click', function () { setZoom(S.zoom / 1.2); });
    $('#zoom-fit').addEventListener('click', fitWidth);
    $('#btn-edits').addEventListener('click', function () {
      S.showEdits = !S.showEdits;
      this.classList.toggle('on', !S.showEdits);
      this.querySelector('span').textContent = S.showEdits ? 'Show' : 'Hide';
      renderLayers();
    });
    elVeil.addEventListener('click', function (e) { if (e.target === elVeil) closeCard(); });
    document.querySelectorAll('.tool[data-tool]').forEach(function (b) {
      b.addEventListener('click', function () { setTool(b.dataset.tool); });
    });
    elThumbs.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('.thumb') : null;
      if (t) showPage(+t.dataset.page);
    });
    elLayers.addEventListener('click', function (e) {
      commitOpenTextEdit();
      var eye = e.target.closest ? e.target.closest('[data-eye]') : null;
      if (eye) {
        var it = byId(eye.dataset.eye);
        if (it) { it.visible = it.visible === false; markDirty(); renderLayers(); }
        return;
      }
      var l = e.target.closest ? e.target.closest('.lay') : null;
      if (l) { S.sel = l.dataset.id; setTool('select'); renderLayers(); renderProps(); }
    });

    document.addEventListener('keydown', function (e) {
      var tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) {
        if (e.key === 'Escape' && e.target.isContentEditable) e.target.blur();
        return;
      }
      var mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); saveProject(); return; }
      if (mod && e.key.toLowerCase() === 'e') { e.preventDefault(); exportPdf(); return; }
      if (mod && (e.key === '=' || e.key === '+')) { e.preventDefault(); setZoom(S.zoom * 1.2); return; }
      if (mod && e.key === '-') { e.preventDefault(); setZoom(S.zoom / 1.2); return; }
      if (e.key === 'Escape') { S.sel = null; closeCard(); renderLayers(); renderProps(); return; }
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); delSel(); return; }
      if (e.key.indexOf('Arrow') === 0) {
        var it = S.sel ? byId(S.sel) : null;
        if (it && !it.locked) {
          e.preventDefault();
          var d = e.shiftKey ? 10 : 1, dx = 0, dy = 0;
          if (e.key === 'ArrowLeft') dx = -d;
          if (e.key === 'ArrowRight') dx = d;
          if (e.key === 'ArrowUp') dy = -d;
          if (e.key === 'ArrowDown') dy = d;
          movePen(it, dx, dy);
          it.x = r2(it.x + dx); it.y = r2(it.y + dy);
          markDirty(); renderLayers(); renderProps();
        } else if (S.pages.length) {
          e.preventDefault();
          showPage(S.cur + ((e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1));
        }
        return;
      }
      if (e.key === 'PageDown') { showPage(S.cur + 1); return; }
      if (e.key === 'PageUp') { showPage(S.cur - 1); return; }
      var map = { v: 'select', h: 'pan', t: 'text', k: 'strike', c: 'cover', y: 'hl',
                  p: 'pen', l: 'line', a: 'arrow', b: 'box' };
      var k = e.key.toLowerCase();
      if (map[k]) { setTool(map[k]); return; }
      if (k === 'd') { $('#btn-edits').click(); return; }
      if (k === 'f') { fitWidth(); }
    });

    var depth = 0;
    window.addEventListener('dragenter', function (e) { e.preventDefault(); depth += 1; $('#drop').classList.add('on'); });
    window.addEventListener('dragover', function (e) { e.preventDefault(); });
    window.addEventListener('dragleave', function () { depth = Math.max(0, depth - 1); if (!depth) $('#drop').classList.remove('on'); });
    window.addEventListener('drop', function (e) {
      e.preventDefault(); depth = 0; $('#drop').classList.remove('on');
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (!f) return;
      if (/\.json$/i.test(f.name)) loadProject(f); else openFile(f);
    });
    window.addEventListener('resize', function () { markThumb(); });
    window.addEventListener('beforeunload', function (e) {
      if (dirty && S.edits.length) { e.preventDefault(); e.returnValue = ''; }
    });

    setTool('select');
    renderProps();
    elZoom.textContent = Math.round(S.zoom * 100) + '%';
  }

  window.addEventListener('DOMContentLoaded', wire);
  window.__PDFLAYER__ = S;
})();
