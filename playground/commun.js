// Code commun au métronome et à l'accordeur

const PLAY_ICON = '\u25B6\uFE0E';   // ▶ forcé en texte (pas en emoji)
const PAUSE_ICON = '\u275A\u275A';  // ❚❚

const $ = id => document.getElementById(id);

// Réglages mémorisés dans le navigateur. Les deux pages partagent le même stockage :
// chaque réglage a un nom distinct.
function loadNumber(key, fallback) {
  try {
    return Number(localStorage.getItem(key)) || fallback;
  } catch (e) {
    return fallback;
  }
}

function saveNumber(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

// Données binaires (sons) mémorisées dans le navigateur : IndexedDB, car localStorage ne stocke que
// du texte. Une base par page, avec un seul magasin.
function openDb(name, store) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveValue(name, store, key, value) {   // value = null pour effacer
  const db = await openDb(name, store);
  const tx = db.transaction(store, 'readwrite');
  if (value === null) tx.objectStore(store).delete(key);
  else tx.objectStore(store).put(value, key);
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function loadValue(name, store, key) {
  const db = await openDb(name, store);
  const request = db.transaction(store).objectStore(store).get(key);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Écran toujours allumé tant que la page est affichée
let wakeLock = null;
async function requestWakeLock() {
  if (wakeLock || document.visibilityState !== 'visible') return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.onrelease = () => { wakeLock = null; showWakeLock('relâché'); };   // DEBUG temporaire
    showWakeLock('actif');   // DEBUG temporaire
  } catch (e) {
    // API absente ou refusée : la page fonctionne quand même
    showWakeLock(navigator.wakeLock ? 'refusé : ' + e.message : 'API absente');   // DEBUG temporaire
  }
}

// DEBUG temporaire : état du verrou de l'écran, en haut à gauche
function showWakeLock(text) {
  let el = document.getElementById('debug');
  if (!el) {
    el = document.createElement('div');
    el.id = 'debug';
    el.style.cssText = 'position: fixed; left: 0; top: 0; font-size: 3.5vw; background: #ff0; pointer-events: none; z-index: 1;';
    document.body.appendChild(el);
  }
  el.textContent = 'écran : ' + text + (isSecureContext ? '' : ' (page non sécurisée)');
}

// Le wake lock est relâché automatiquement quand la page passe en arrière-plan : on le redemande
// au retour, et au premier appui au cas où le navigateur l'aurait refusé sans action de l'utilisateur
document.addEventListener('visibilitychange', requestWakeLock);
document.addEventListener('pointerdown', requestWakeLock);
requestWakeLock();
