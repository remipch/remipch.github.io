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
  if (!navigator.wakeLock) return keepAwakeWithVideo();
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.onrelease = () => { wakeLock = null; };
  } catch (e) {
    // Refusé : la page fonctionne quand même
  }
}

// Secours pour les navigateurs sans l'API (par exemple Qwant) : une vidéo de 1 s jouée en boucle
// empêche la mise en veille (technique de la bibliothèque NoSleep.js). Les navigateurs ignorent les
// vidéos minuscules et, pour certains (moteur de Firefox), les vidéos sans son : elle couvre donc
// tout l'écran, transparente à 99 % et derrière tout le reste, son non coupé. Sa piste son est un
// son à 25 Hz très faible : détecté comme sonore, mais inaudible (un haut-parleur de téléphone ne
// reproduit pas 25 Hz, et c'est sous le seuil d'audition au casque).
// Elle ne démarre qu'après un appui sur l'écran, comme l'exigent les navigateurs.
const KEEP_AWAKE_WEBM = 'data:video/webm;base64,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';
const KEEP_AWAKE_MP4 = 'data:video/mp4;base64,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';
let keepAwakeVideo = null;
function keepAwakeWithVideo() {
  if (!keepAwakeVideo) {
    keepAwakeVideo = document.createElement('video');
    keepAwakeVideo.loop = true;
    keepAwakeVideo.setAttribute('playsinline', '');
    keepAwakeVideo.style.cssText = 'position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; opacity: 0.01; z-index: -1; pointer-events: none;';
    for (const [type, src] of [['video/webm', KEEP_AWAKE_WEBM], ['video/mp4', KEEP_AWAKE_MP4]]) {
      const source = document.createElement('source');
      source.type = type;
      source.src = src;
      keepAwakeVideo.appendChild(source);
    }
    document.body.appendChild(keepAwakeVideo);
  }
  if (keepAwakeVideo.paused) keepAwakeVideo.play().catch(() => {});   // refusée avant le premier appui
}

// Le wake lock est relâché automatiquement quand la page passe en arrière-plan : on le redemande
// au retour, et au premier appui au cas où le navigateur l'aurait refusé sans action de l'utilisateur
document.addEventListener('visibilitychange', requestWakeLock);
document.addEventListener('pointerdown', requestWakeLock);
requestWakeLock();
