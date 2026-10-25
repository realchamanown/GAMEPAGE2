/* Store page mockup behaviour. Reads window.GAME from game-data.js. */
(function () {
  "use strict";
  var G = window.GAME;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- Title binding ----------
  $$("[data-bind=title]").forEach(function (el) { el.textContent = G.title; });

  // ---------- Toast ----------
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  // ---------- Local storage helpers (fail safe) ----------
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: state lasts for this visit */ } }

  // ---------- Gallery ----------
  var strip = $("#strip"), img = $("#playerImg"), cur = 0;
  G.media.forEach(function (m, i) {
    var b = document.createElement("button");
    b.className = "strip-item" + (m.type === "video" ? " video" : "");
    b.setAttribute("role", "listitem");
    b.setAttribute("aria-label", (m.type === "video" ? "Trailer: " : "Screenshot " + i + ": ") + m.label);
    var t = document.createElement("img");
    t.src = m.src; t.alt = ""; t.loading = "lazy";
    b.appendChild(t);
    b.addEventListener("click", function () { show(i); });
    strip.appendChild(b);
  });

  function show(i) {
    cur = (i + G.media.length) % G.media.length;
    var m = G.media[cur];
    img.src = m.src;
    img.alt = m.label;
    $("#playerPlay").hidden = m.type !== "video";
    $("#playerNote").textContent = (cur + 1) + " / " + G.media.length + " · " + m.label;
    $("#playerLive").textContent = "Showing " + (cur + 1) + " of " + G.media.length + ": " + m.label;
    $$(".strip-item", strip).forEach(function (b, k) {
      b.classList.toggle("focus", k === cur);
      b.setAttribute("aria-current", k === cur ? "true" : "false");
    });
    var item = strip.children[cur];
    var left = item.offsetLeft - (strip.clientWidth - item.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }
  $("#prevBtn").addEventListener("click", function () { show(cur - 1); });
  $("#nextBtn").addEventListener("click", function () { show(cur + 1); });
  $("#player").addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(cur - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); }
  });
  $("#player").addEventListener("click", function (e) {
    if (e.target.closest(".player-arrow")) return;
    if (G.media[cur].type === "video") toast("Trailer not produced yet. This slot will play it.");
  });

  // Strip slider (custom scrollbar like the reference)
  var handle = $("#sliderHandle");
  function syncHandle() {
    var track = handle.parentElement.clientWidth;
    var ratio = Math.min(1, strip.clientWidth / strip.scrollWidth);
    var w = Math.max(30, track * ratio);
    var max = strip.scrollWidth - strip.clientWidth;
    handle.style.width = w + "px";
    handle.style.left = (max > 0 ? (strip.scrollLeft / max) * (track - w) : 0) + "px";
  }
  strip.addEventListener("scroll", syncHandle);
  window.addEventListener("resize", syncHandle);
  $("#stripLeft").addEventListener("click", function () { strip.scrollBy({ left: -240, behavior: "smooth" }); });
  $("#stripRight").addEventListener("click", function () { strip.scrollBy({ left: 240, behavior: "smooth" }); });
  show(0);
  syncHandle();

  // ---------- Tags ----------
  var tagList = $("#tagList");
  G.tags.forEach(function (t) {
    var b = document.createElement("button");
    b.className = "app-tag" + (t.planned ? " planned" : "");
    b.textContent = t.name + (t.planned ? " (planned)" : "");
    b.addEventListener("click", function () {
      toast(t.planned ? "“" + t.name + "” is a planned feature, not built yet." : "Tag browsing is not part of this prototype.");
    });
    tagList.appendChild(b);
  });
  var add = document.createElement("button");
  add.className = "app-tag add"; add.textContent = "+"; add.setAttribute("aria-label", "Add a tag");
  add.addEventListener("click", function () { toast("Adding tags needs an account. Not part of this prototype."); });
  tagList.appendChild(add);

  // ---------- System requirements ----------
  function reqCol(title, rows) {
    var c = document.createElement("div"); c.className = "sysreq-col";
    var h = document.createElement("strong"); h.className = "head"; h.textContent = title + ":"; c.appendChild(h);
    var ul = document.createElement("ul");
    rows.forEach(function (r) {
      var li = document.createElement("li");
      var s = document.createElement("strong"); s.textContent = r[0] + ": ";
      var v = document.createElement("span"); v.textContent = r[1];
      if (r[1] === "TBD") v.className = "tbd";
      li.appendChild(s); li.appendChild(v); ul.appendChild(li);
    });
    c.appendChild(ul);
    return c;
  }
  $("#sysreqCols").appendChild(reqCol("Minimum", G.sysreq.minimum));
  $("#sysreqCols").appendChild(reqCol("Recommended", G.sysreq.recommended));

  // ---------- Wishlist / follow / ignore ----------
  function toggleBtn(btn, textEl, key, onText, offText, onMsg, offMsg, after) {
    function set(on) {
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      textEl.textContent = on ? onText : offText;
      if (after) after(on);
    }
    set(load(key) === "1");
    btn.addEventListener("click", function () {
      var on = btn.getAttribute("aria-pressed") !== "true";
      set(on); save(key, on ? "1" : "0");
      toast(on ? onMsg : offMsg);
    });
  }
  toggleBtn($("#wishBtn"), $("#wishText"), "sio_wish", "On Wishlist", "Add to your wishlist",
    "Added to your wishlist (demo, saved in this browser).", "Removed from your wishlist.",
    function (on) { $("#wishCount").textContent = on ? "1" : "0"; });
  toggleBtn($("#followBtn"), $("#followText"), "sio_follow", "Following", "Follow",
    "Following this game (demo).", "Stopped following.");
  toggleBtn($("#ignoreBtn"), $("#ignoreText"), "sio_ignore", "Ignored", "Ignore",
    "Marked as ignored (demo).", "No longer ignored.");

  // ---------- Demo links ----------
  $$("[data-demo]").forEach(function (a) {
    a.addEventListener("click", function () { toast(a.getAttribute("data-demo")); });
  });

  // ---------- Mobile menu ----------
  var menuBtn = $("#menuBtn"), menu = $("#globalMenu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // ---------- Local search ----------
  var index = [
    { name: "About This Game", kind: "Section", target: "#about", keys: "about story puff jawfish coral ghetto crab mafia don hermit" },
    { name: "Sand-spit combat", kind: "Feature", target: "#about", keys: "spit sand combat attack skill swim dash" },
    { name: "Trash sorting", kind: "Feature", target: "#about", keys: "trash sort sorting plastic glass metal vending upgrade" },
    { name: "Online co-op", kind: "Feature", target: "#about", keys: "coop co-op online multiplayer friends together" },
    { name: "Planned features", kind: "Feature", target: "#about", keys: "planned boss economy progression cosmetics voice chat emotes camera" },
    { name: "System Requirements", kind: "Section", target: "#sysreq", keys: "system requirements specs windows pc hardware" },
    { name: "Wishlist", kind: "Action", target: "#wishlistArea", keys: "wishlist follow ignore" },
    { name: "Customer reviews", kind: "Section", target: "#reviews", keys: "reviews community" },
    { name: "Developer & links", kind: "Section", target: "#dev", keys: "developer publisher nich studio discord website contact support" },
    { name: "Screenshots", kind: "Media", target: "#player", keys: "screenshots media trailer gallery images video" }
  ];
  G.tags.forEach(function (t) { index.push({ name: t.name, kind: "Tag", target: "#tagsBlock", keys: t.name.toLowerCase() }); });

  var input = $("#storeSearch"), list = $("#searchSuggest"), hits = [], sel = -1;
  function closeSuggest() { list.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); sel = -1; }
  function go(h) {
    closeSuggest(); input.blur();
    var el = $(h.target);
    el.scrollIntoView({ block: "center" });
    toast("Jumped to " + h.name + ".");
  }
  function renderSuggest() {
    var v = input.value.trim().toLowerCase();
    if (!v) { closeSuggest(); return; }
    hits = index.filter(function (h) { return (h.name + " " + h.keys).toLowerCase().indexOf(v) !== -1; }).slice(0, 8);
    list.innerHTML = "";
    if (!hits.length) {
      var li = document.createElement("li"); li.className = "ss-none";
      li.textContent = "No matches on this page. Try “co-op”, “sort” or “requirements”.";
      list.appendChild(li);
    }
    hits.forEach(function (h, i) {
      var li = document.createElement("li"), b = document.createElement("button");
      b.id = "ss" + i; b.setAttribute("role", "option");
      var k = document.createElement("span"); k.className = "ss-kind"; k.textContent = h.kind;
      var n = document.createElement("span"); n.className = "ss-name"; n.textContent = h.name;
      b.appendChild(k); b.appendChild(n);
      b.addEventListener("click", function () { go(h); });
      li.appendChild(b); list.appendChild(li);
    });
    list.hidden = false; input.setAttribute("aria-expanded", "true"); sel = -1;
  }
  input.addEventListener("input", renderSuggest);
  input.addEventListener("keydown", function (e) {
    var bs = $$("button", list);
    if (e.key === "ArrowDown" && bs.length) { e.preventDefault(); sel = (sel + 1) % bs.length; }
    else if (e.key === "ArrowUp" && bs.length) { e.preventDefault(); sel = (sel - 1 + bs.length) % bs.length; }
    else if (e.key === "Enter") { e.preventDefault(); if (hits.length) go(hits[Math.max(0, sel)]); else if (input.value.trim()) toast("No matches on this page."); return; }
    else if (e.key === "Escape") { closeSuggest(); return; }
    else return;
    bs.forEach(function (b, i) { b.classList.toggle("on", i === sel); });
    input.setAttribute("aria-activedescendant", bs[sel].id);
  });
  $("#searchBtn").addEventListener("click", function () {
    if (hits.length && input.value.trim()) go(hits[0]);
    else { input.focus(); toast("Type to search this page (local demo)."); }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".sn-search")) closeSuggest(); });
})();
