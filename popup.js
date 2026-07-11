document.addEventListener('DOMContentLoaded', () => {
  const rewindInput = document.getElementById('rewind');
  const forwardInput = document.getElementById('forward');
  const rewindKeyInput = document.getElementById('rewindKey');
  const forwardKeyInput = document.getElementById('forwardKey');
  const saveButton = document.getElementById('save');

  // Load existing settings or fall back to defaults
  chrome.storage.sync.get(['rewindSeconds', 'forwardSeconds', 'rewindKey', 'forwardKey'], (items) => {
    rewindInput.value = items.rewindSeconds || 2;
    forwardInput.value = items.forwardSeconds || 3;
    rewindKeyInput.value = items.rewindKey || ',';
    forwardKeyInput.value = items.forwardKey || '.';
  });

  // Intercept keypresses inside keybind fields to record the key name
  [rewindKeyInput, forwardKeyInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
      e.preventDefault();
      
      // Ignore standalone modifier keys to avoid accidental mapping
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
      
      // Assign the string value of the pressed key (e.g., "ArrowLeft", "[", "k")
      input.value = e.key;
      input.blur(); // Unfocus after capturing
    });
  });

  // Save everything to storage
  saveButton.addEventListener('click', () => {
    chrome.storage.sync.set({
      rewindSeconds: parseFloat(rewindInput.value) || 2,
      forwardSeconds: parseFloat(forwardInput.value) || 3,
      rewindKey: rewindKeyInput.value || ',',
      forwardKey: forwardKeyInput.value || '.'
    }, () => {
      saveButton.textContent = 'Settings Saved!';
      saveButton.classList.add('saved');
      
      setTimeout(() => { 
        saveButton.textContent = 'Save Settings';
        saveButton.classList.remove('saved'); 
      }, 1500);
    });
  });
});