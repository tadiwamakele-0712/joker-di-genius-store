let allTracks = [];
let playCounts = {};
let activeCategory = "all";
let searchQuery = "";
let currentTrack = null;

const musicGrid = document.getElementById("music-grid");
const searchInput = document.getElementById("search-input");
const categoryBar = document.getElementById("category-bar");
const noResults = document.getElementById("no-results");
const trackCountEl = document.getElementById("track-count");
const totalPlaysEl = document.getElementById("total-plays");
const playerBar = document.getElementById("player-bar");
const audioPlayer = document.getElementById("audio-player");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playerDownload = document.getElementById("player-download");
const trackModal = document.getElementById("track-modal");
const modalContent = document.getElementById("modal-content");

function trackUrl(track) {
  if (track.source === "upload" && track.blobUrl) {
    return track.blobUrl;
  }
  if (track.url) {
    return track.url;
  }
  return "music/" + track.file.split("/").map(encodeURIComponent).join("/");
}

function showToast(message) {
  let toast = document.getElementById("play-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(function () {
    toast.hidden = true;
  }, 5000);
}

function formatCategory(cat) {
  const found = CATEGORIES.find(function (c) { return c.id === cat; });
  return found ? found.label : cat;
}

function formatDate(d) {
  if (!d) return "—";
  const parts = d.split("-");
  if (parts.length !== 3) return d;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[parseInt(parts[1], 10) - 1] + " " + parseInt(parts[2], 10) + ", " + parts[0];
}

function renderCategories() {
  categoryBar.innerHTML = "";
  CATEGORIES.forEach(function (cat) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cat-btn" + (activeCategory === cat.id ? " active" : "");
    btn.textContent = cat.label;
    btn.dataset.cat = cat.id;
    categoryBar.appendChild(btn);
  });
}

function getFilteredTracks() {
  const q = searchQuery.toLowerCase().trim();
  return allTracks.filter(function (t) {
    const matchCat = activeCategory === "all" || t.category === activeCategory;
    const matchSearch = !q ||
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
}

function renderGrid() {
  const filtered = getFilteredTracks();
  musicGrid.innerHTML = "";
  noResults.hidden = filtered.length > 0;

  filtered.forEach(function (track) {
    const plays = playCounts[track.id] || 0;
    const card = document.createElement("article");
    card.className = "music-card";
    card.setAttribute("role", "listitem");

    card.innerHTML =
      '<div class="card-art">' +
      '<img src="images/profile.jpg" alt="" width="48" height="48">' +
      '<button type="button" class="play-overlay" data-id="' + track.id + '" aria-label="Play ' + escapeHtml(track.title) + '">▶</button>' +
      "</div>" +
      '<div class="card-body">' +
      '<span class="card-cat">' + escapeHtml(formatCategory(track.category)) + "</span>" +
      "<h3>" + escapeHtml(track.title) + "</h3>" +
      '<p class="card-artist">' + escapeHtml(track.artist) + "</p>" +
      '<div class="card-meta">' +
      "<span>📅 " + formatDate(track.uploaded) + "</span>" +
      '<span class="play-count">▶ ' + plays + " plays</span>" +
      "</div>" +
      '<div class="card-actions">' +
      '<button type="button" class="btn btn-sm btn-primary play-btn" data-id="' + track.id + '">Play</button>' +
      '<button type="button" class="btn btn-sm btn-gold download-btn" data-id="' + track.id + '">Download</button>' +
      '<button type="button" class="btn btn-sm btn-outline comment-btn" data-id="' + track.id + '">Comments</button>' +
      "</div></div>";

    musicGrid.appendChild(card);
  });

  bindCardEvents();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function bindCardEvents() {
  musicGrid.querySelectorAll(".play-btn, .play-overlay").forEach(function (btn) {
    btn.addEventListener("click", function () {
      playTrack(btn.dataset.id);
    });
  });

  musicGrid.querySelectorAll(".download-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      downloadTrack(btn.dataset.id);
    });
  });

  musicGrid.querySelectorAll(".comment-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openTrackModal(btn.dataset.id);
    });
  });
}

function findTrack(id) {
  return allTracks.find(function (t) { return t.id === id; });
}

function playTrack(id) {
  const track = findTrack(id);
  if (!track) return;

  currentTrack = track;
  const url = trackUrl(track);

  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;
  playerBar.hidden = false;

  audioPlayer.pause();
  audioPlayer.src = url;
  audioPlayer.load();

  const playPromise = audioPlayer.play();
  if (playPromise !== undefined) {
    playPromise.catch(function () {
      showToast("Press ▶ on the player bar to start: " + track.title);
    });
  }

  incrementPlayCount(id).then(function (count) {
    playCounts[id] = count;
    updateStats();
    updatePlayCountInGrid(id, count);
  });
}

function updatePlayCountInGrid(id, count) {
  musicGrid.querySelectorAll(".music-card").forEach(function (card) {
    const playBtn = card.querySelector(".play-btn[data-id='" + id + "']");
    if (playBtn) {
      const countEl = card.querySelector(".play-count");
      if (countEl) countEl.textContent = "▶ " + count + " plays";
    }
  });
}

function downloadTrack(id) {
  const track = findTrack(id);
  if (!track) return;

  const a = document.createElement("a");
  a.href = trackUrl(track);
  a.download = (track.title || "track") + (track.file && track.file.endsWith(".wav") ? ".wav" : ".mp3");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

playerDownload.addEventListener("click", function () {
  if (currentTrack) downloadTrack(currentTrack.id);
});

function openTrackModal(id) {
  const track = findTrack(id);
  if (!track) return;

  currentTrack = track;

  modalContent.innerHTML =
    '<div class="modal-track">' +
    '<img src="images/profile.jpg" alt="" class="modal-art" width="80" height="80">' +
    "<div>" +
    '<span class="card-cat">' + escapeHtml(formatCategory(track.category)) + "</span>" +
    "<h2>" + escapeHtml(track.title) + "</h2>" +
    '<p class="card-artist">' + escapeHtml(track.artist) + "</p>" +
    '<p class="modal-meta">Uploaded ' + formatDate(track.uploaded) + " · " + (playCounts[track.id] || 0) + " plays</p>" +
  "</div></div>" +
    '<div class="modal-actions-row">' +
    '<button type="button" class="btn btn-primary" id="modal-play">▶ Play</button>' +
    '<button type="button" class="btn btn-gold" id="modal-download">⬇ Download</button>' +
    "</div>" +
    '<section class="comments-section">' +
    "<h3>Comments</h3>" +
    '<div id="comments-list" class="comments-list"><p class="loading">Loading…</p></div>' +
    '<form id="comment-form" class="comment-form">' +
    '<label for="comment-author">Your name</label>' +
    '<input type="text" id="comment-author" required placeholder="Name" maxlength="60">' +
    '<label for="comment-text">Comment</label>' +
    '<textarea id="comment-text" rows="3" required placeholder="Leave a comment…" maxlength="500"></textarea>' +
    '<button type="submit" class="btn btn-primary">Post Comment</button>' +
    "</form></section>";

  trackModal.showModal();

  document.getElementById("modal-play").addEventListener("click", function () {
    playTrack(id);
    trackModal.close();
  });

  document.getElementById("modal-download").addEventListener("click", function () {
    downloadTrack(id);
  });

  loadComments(id);

  document.getElementById("comment-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const author = document.getElementById("comment-author").value.trim();
    const text = document.getElementById("comment-text").value.trim();
    if (!author || !text) return;

    addComment(id, author, text).then(function () {
      document.getElementById("comment-form").reset();
      loadComments(id);
    });
  });
}

function loadComments(trackId) {
  const list = document.getElementById("comments-list");
  if (!list) return;

  getComments(trackId).then(function (comments) {
    if (comments.length === 0) {
      list.innerHTML = '<p class="no-comments">No comments yet — be the first!</p>';
      return;
    }

    list.innerHTML = comments.map(function (c) {
      return '<article class="comment">' +
        '<header><strong>' + escapeHtml(c.author) + "</strong>" +
        '<span>' + formatDate(c.date) + " " + (c.time || "") + "</span></header>" +
        "<p>" + escapeHtml(c.text) + "</p></article>";
    }).join("");
  });
}

document.getElementById("modal-close").addEventListener("click", function () {
  trackModal.close();
});

trackModal.addEventListener("click", function (e) {
  if (e.target === trackModal) trackModal.close();
});

function updateStats() {
  trackCountEl.textContent = allTracks.length;
  let total = 0;
  Object.keys(playCounts).forEach(function (k) {
    total += playCounts[k];
  });
  totalPlaysEl.textContent = total;
}

function initUploadedBlobUrls(uploads) {
  uploads.forEach(function (t) {
    if (t.blob && !t.blobUrl) {
      t.blobUrl = URL.createObjectURL(t.blob);
    }
  });
}

function loadStore() {
  return Promise.all([getAllTracks(), getPlayCounts()]).then(function (results) {
    allTracks = results[0];
    playCounts = results[1];
    initUploadedBlobUrls(allTracks.filter(function (t) { return t.source === "upload"; }));
    updateStats();
    renderCategories();
    renderGrid();
  });
}

categoryBar.addEventListener("click", function (e) {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;
  activeCategory = btn.dataset.cat;
  renderCategories();
  renderGrid();
});

searchInput.addEventListener("input", function () {
  searchQuery = searchInput.value;
  renderGrid();
});

var menuBtn = document.getElementById("menu-btn");
var nav = document.getElementById("main-nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

loadStore().catch(function () {
  showToast("Could not load tracks. Refresh the page.");
});

audioPlayer.addEventListener("error", function () {
  if (currentTrack) {
    showToast("Could not load: " + currentTrack.title + ". Check the music file exists.");
  }
});
