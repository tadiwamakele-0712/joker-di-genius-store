const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const uploadForm = document.getElementById("upload-form");
const passForm = document.getElementById("pass-form");
const categorySelect = document.getElementById("up-category");

function showDashboard() {
  loginSection.hidden = true;
  dashboard.hidden = false;
  loadDashboard();
}

function showLogin() {
  loginSection.hidden = false;
  dashboard.hidden = true;
}

function initCategories() {
  categorySelect.innerHTML = "";
  CATEGORIES.filter(function (c) { return c.id !== "all"; }).forEach(function (cat) {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.label;
    categorySelect.appendChild(opt);
  });
}

if (isAdminLoggedIn()) {
  showDashboard();
} else {
  showLogin();
}

initCategories();

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const pass = document.getElementById("admin-pass").value;
  if (adminLogin(pass)) {
    document.getElementById("login-error").textContent = "";
    showDashboard();
  } else {
    document.getElementById("login-error").textContent = "Wrong password. Try again.";
  }
});

document.getElementById("logout-btn").addEventListener("click", function () {
  adminLogout();
  showLogin();
  loginForm.reset();
});

uploadForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const fileInput = document.getElementById("up-file");
  const file = fileInput.files[0];
  if (!file) return;

  const track = {
    id: "up-" + Date.now(),
    title: document.getElementById("up-title").value.trim(),
    artist: document.getElementById("up-artist").value.trim(),
    category: document.getElementById("up-category").value,
    uploaded: new Date().toISOString().slice(0, 10),
    file: file.name,
    blob: file,
  };

  saveUploadedTrack(track).then(function () {
    document.getElementById("upload-msg").textContent = '"' + track.title + '" uploaded successfully!';
    uploadForm.reset();
    document.getElementById("up-artist").value = "Joker Di Genius";
    loadDashboard();
    setTimeout(function () {
      document.getElementById("upload-msg").textContent = "";
    }, 4000);
  });
});

passForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const p = document.getElementById("new-pass").value;
  changeAdminPassword(p);
  document.getElementById("pass-msg").textContent = "Password updated!";
  passForm.reset();
  setTimeout(function () {
    document.getElementById("pass-msg").textContent = "";
  }, 3000);
});

function loadDashboard() {
  Promise.all([
    getAllTracks(),
    getPlayCounts(),
    getUploadedTracks(),
    openDB().then(function (db) {
      return new Promise(function (resolve) {
        const tx = db.transaction("comments", "readonly");
        const req = tx.objectStore("comments").count();
        req.onsuccess = function () { resolve(req.result); };
      });
    }),
  ]).then(function (results) {
    const tracks = results[0];
    const plays = results[1];
    const uploads = results[2];
    const commentCount = results[3];

    let totalPlays = 0;
    Object.keys(plays).forEach(function (k) { totalPlays += plays[k]; });

    document.getElementById("stat-tracks").textContent = tracks.length;
    document.getElementById("stat-plays").textContent = totalPlays;
    document.getElementById("stat-uploads").textContent = uploads.length;
    document.getElementById("stat-comments").textContent = commentCount;

    renderUploadList(uploads, plays);
    renderTopTracks(tracks, plays);
  });
}

function renderUploadList(uploads, plays) {
  const list = document.getElementById("upload-list");
  if (uploads.length === 0) {
    list.innerHTML = '<p class="empty-msg">No uploads yet — add your first track above.</p>';
    return;
  }

  list.innerHTML = uploads.map(function (t) {
    return '<div class="upload-row">' +
      "<div><strong>" + escapeHtml(t.title) + "</strong>" +
      "<p>" + escapeHtml(t.artist) + " · " + (plays[t.id] || 0) + " plays</p></div>" +
      '<button type="button" class="btn btn-sm btn-danger" data-del="' + t.id + '">Delete</button>' +
      "</div>";
  }).join("");

  list.querySelectorAll("[data-del]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (confirm("Delete this uploaded track?")) {
        deleteUploadedTrack(btn.dataset.del).then(loadDashboard);
      }
    });
  });
}

function renderTopTracks(tracks, plays) {
  const sorted = tracks.slice().sort(function (a, b) {
    return (plays[b.id] || 0) - (plays[a.id] || 0);
  }).slice(0, 8);

  const list = document.getElementById("top-tracks");
  list.innerHTML = sorted.map(function (t, i) {
    return '<div class="top-row">' +
      '<span class="top-rank">' + (i + 1) + "</span>" +
      "<div><strong>" + escapeHtml(t.title) + "</strong>" +
      "<p>" + escapeHtml(t.artist) + "</p></div>" +
      '<span class="top-plays">' + (plays[t.id] || 0) + " ▶</span>" +
      "</div>";
  }).join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
