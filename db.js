const DB_NAME = "jdg-music-store";
const DB_VERSION = 1;
const ADMIN_KEY = "jdg-admin-session";
const ADMIN_PASS_KEY = "jdg-admin-password";
const DEFAULT_ADMIN_PASS = "joker2026";

function openDB() {
  return new Promise(function (resolve, reject) {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = function () { reject(req.error); };
    req.onsuccess = function () { resolve(req.result); };
    req.onupgradeneeded = function (e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("uploads")) {
        db.createObjectStore("uploads", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("comments")) {
        db.createObjectStore("comments", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
    };
  });
}

function getMeta(key) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction("meta", "readonly");
      const req = tx.objectStore("meta").get(key);
      req.onsuccess = function () { resolve(req.result ? req.result.value : null); };
      req.onerror = function () { reject(req.error); };
    });
  });
}

function setMeta(key, value) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction("meta", "readwrite");
      tx.objectStore("meta").put({ key: key, value: value });
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

function getPlayCounts() {
  return getMeta("playCounts").then(function (v) {
    return v || {};
  });
}

function incrementPlayCount(trackId) {
  return getPlayCounts().then(function (counts) {
    counts[trackId] = (counts[trackId] || 0) + 1;
    return setMeta("playCounts", counts).then(function () {
      return counts[trackId];
    });
  });
}

function getUploadedTracks() {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction("uploads", "readonly");
      const req = tx.objectStore("uploads").getAll();
      req.onsuccess = function () {
        const tracks = req.result || [];
        tracks.forEach(function (t) {
          if (t.blob && !t.blobUrl) {
            t.blobUrl = URL.createObjectURL(t.blob);
          }
        });
        resolve(tracks);
      };
      req.onerror = function () { reject(req.error); };
    });
  });
}

function saveUploadedTrack(track) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction("uploads", "readwrite");
      tx.objectStore("uploads").put(track);
      tx.oncomplete = function () { resolve(track); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

function deleteUploadedTrack(id) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction("uploads", "readwrite");
      tx.objectStore("uploads").delete(id);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

function getComments(trackId) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction("comments", "readonly");
      const req = tx.objectStore("comments").getAll();
      req.onsuccess = function () {
        const all = req.result || [];
        resolve(all.filter(function (c) { return c.trackId === trackId; }));
      };
      req.onerror = function () { reject(req.error); };
    });
  });
}

function addComment(trackId, author, text) {
  const comment = {
    trackId: trackId,
    author: author,
    text: text,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction("comments", "readwrite");
      const req = tx.objectStore("comments").add(comment);
      req.onsuccess = function () {
        comment.id = req.result;
        resolve(comment);
      };
      req.onerror = function () { reject(req.error); };
    });
  });
}

function deleteComment(id) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction("comments", "readwrite");
      tx.objectStore("comments").delete(id);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_KEY) === "1";
}

function adminLogin(password) {
  const stored = localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_ADMIN_PASS;
  if (password === stored) {
    sessionStorage.setItem(ADMIN_KEY, "1");
    return true;
  }
  return false;
}

function adminLogout() {
  sessionStorage.removeItem(ADMIN_KEY);
}

function changeAdminPassword(newPass) {
  localStorage.setItem(ADMIN_PASS_KEY, newPass);
}

function getAllTracks() {
  return getUploadedTracks().then(function (uploads) {
    const catalog = INITIAL_TRACKS.map(function (t) {
      return Object.assign({}, t, { source: "catalog", url: "music/" + encodeURIComponent(t.file).replace(/%2F/g, "/") });
    });
    const uploaded = uploads.map(function (t) {
      return Object.assign({}, t, { source: "upload" });
    });
    return catalog.concat(uploaded).sort(function (a, b) {
      return (b.uploaded || "").localeCompare(a.uploaded || "");
    });
  });
}
