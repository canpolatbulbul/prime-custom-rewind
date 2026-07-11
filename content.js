let config = {
  rewindSeconds: 2,
  forwardSeconds: 3,
  rewindKey: ',',
  forwardKey: '.'
};

function updateConfig() {
  chrome.storage.sync.get(["rewindSeconds", "forwardSeconds", "rewindKey", "forwardKey"], (items) => {
    if (items.rewindSeconds) config.rewindSeconds = parseFloat(items.rewindSeconds);
    if (items.forwardSeconds) config.forwardSeconds = parseFloat(items.forwardSeconds);
    if (items.rewindKey) config.rewindKey = items.rewindKey;
    if (items.forwardKey) config.forwardKey = items.forwardKey;
  });
}

updateConfig();

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    updateConfig();
  }
});

window.addEventListener("keydown", (event) => {
  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable)) {
    return;
  }

  // Dynamic evaluation based on storage configurations
  // Keeps back-compatibility for default angle brackets (< and >)
  const matchRewind = (event.key === config.rewindKey) || (config.rewindKey === ',' && event.key === '<');
  const matchForward = (event.key === config.forwardKey) || (config.forwardKey === '.' && event.key === '>');

  if (matchRewind) {
    const videos = document.querySelectorAll("video");
    if (videos.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      videos.forEach(video => {
        video.currentTime = Math.max(0, video.currentTime - config.rewindSeconds);
      });
    }
  } 
  else if (matchForward) {
    const videos = document.querySelectorAll("video");
    if (videos.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      videos.forEach(video => {
        if (!isNaN(video.duration)) {
          video.currentTime = Math.min(video.duration, video.currentTime + config.forwardSeconds);
        } else {
          video.currentTime += config.forwardSeconds;
        }
      });
    }
  }
}, true);