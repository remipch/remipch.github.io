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

// Secours pour les navigateurs sans l'API (par exemple Qwant) : une vidéo muette de 1 s, noire et
// minuscule, jouée en boucle, empêche la mise en veille (technique de la bibliothèque NoSleep.js).
// Elle ne démarre qu'après un appui sur l'écran, comme l'exigent les navigateurs.
const KEEP_AWAKE_WEBM = 'data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAH0EU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHWTbuMU6uEElTDZ1OsggEyTbuMU6uEHFO7a1OsggHe7AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmsCrXsYMPQkBNgIxMYXZmNjMuMS4xMDJXQYxMYXZmNjMuMS4xMDJEiYhAj0AAAAAAABZUrmvXrgEAAAAAAABO14EBc8WIm+UGQ4zK/1+cgQAitZyDdW5kiIEAhoVWX1ZQOIOBASPjg4Q7msoA4JCwgRC6gRCagQJVsIRVuYEBVe6BAOwBAAAAAAAAAgAAElTDZ/pzc59jwIBnyJlFo4dFTkNPREVSRIeMTGF2ZjYzLjEuMTAyc3PVY8CLY8WIm+UGQ4zK/19nyKBFo4dFTkNPREVSRIeTTGF2YzYzLjEuMTAyIGxpYnZweGfIoUWjiERVUkFUSU9ORIeTMDA6MDA6MDEuMDAwMDAwMDAwAB9DtnWo54EAo6OBAACAEAIAnQEqEAAQAABHCIWFiJmEiAICAAwNYAD+/6tQgBxTu2uRu4+zgQC3iveBAfGCAbHwgQM=';
const KEEP_AWAKE_MP4 = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAMUbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAA+gAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAj90cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+gAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAABAAAAAQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPoAAAAAAABAAAAAAG3bWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAABAAAAAQABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABYm1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAASJzdGJsAAAAvnN0c2QAAAAAAAAAAQAAAK5hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAABAAEABIAAAASAAAAAAAAAABFExhdmM2My4xLjEwMiBsaWJ4MjY0AAAAAAAAAAAAAAAAGP//AAAANGF2Y0MBZAAK/+EAF2dkAAqs2V7ARAAAAwAEAAADAAg8SJZYAQAGaOvjyyLA/fj4AAAAABBwYXNwAAAAAQAAAAEAAAAUYnRydAAAAAAAABW4AAAAAAAAABhzdHRzAAAAAAAAAAEAAAABAABAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAK3AAAAAQAAABRzdGNvAAAAAAAAAAEAAANEAAAAYXVkdGEAAABZbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAsaWxzdAAAACSpdG9vAAAAHGRhdGEAAAABAAAAAExhdmY2My4xLjEwMgAAAAhmcmVlAAACv21kYXQAAAKfBgX//5vcRem95tlIt5Ys2CDZI+7veDI2NCAtIGNvcmUgMTY1IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD00MCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIzLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgYXE9MToxLjAwAIAAAAAQZYiEABX//vfJ78Cm69vfgQ==';
let keepAwakeVideo = null;
function keepAwakeWithVideo() {
  if (!keepAwakeVideo) {
    keepAwakeVideo = document.createElement('video');
    keepAwakeVideo.muted = true;
    keepAwakeVideo.loop = true;
    keepAwakeVideo.setAttribute('playsinline', '');
    keepAwakeVideo.style.cssText = 'position: fixed; left: 0; bottom: 0; width: 1px; height: 1px; opacity: 0.01; pointer-events: none;';
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
