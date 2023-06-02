// Update the URL to match your PHP backend file
const backendURL = 'backend.php';

// Function to acquire control of the keyboard
function acquireControl() {
  $.ajax({
    url: backendURL,
    method: 'POST',
    data: { action: 'acquire_control' },
    success: function(response) {
      console.log('Control acquired');
      updateKeyboardState(response);
      enableKeys();
    },
    error: function() {
      console.log('Error acquiring control');
    }
  });
}

// Function to toggle key state
function toggleKeyState(keyId) {
  $.ajax({
    url: backendURL,
    method: 'POST',
    data: { action: 'toggle_key', keyId: keyId },
    success: function(response) {
      console.log('Key state toggled');
      updateKeyboardState(response);
    },
    error: function() {
      console.log('Error toggling key state');
    }
  });
}

// Function to release control of the keyboard
function releaseControl() {
  $.ajax({
    url: backendURL,
    method: 'POST',
    data: { action: 'release_control' },
    success: function(response) {
      console.log('Control released');
      updateKeyboardState(response);
      disableKeys();
    },
    error: function() {
      console.log('Error releasing control');
    }
  });
}

// Function to update the keyboard state
function updateKeyboardState(state) {
  const keys = JSON.parse(state);
  keys.forEach(function(key) {
    const keyElement = document.getElementById(key.id);
    if (key.state === 'on') {
      keyElement.style.backgroundColor = key.color;
    } else {
      keyElement.style.backgroundColor = 'white';
    }
  });
}

// Function to enable key clicks
function enableKeys() {
  const keys = document.getElementsByClassName('key');
  for (let i = 0; i < keys.length; i++) {
    keys[i].addEventListener('click', function() {
      const keyId = keys[i].id;
      toggleKeyState(keyId);
    });
  }
}

// Function to disable key clicks
function disableKeys() {
  const keys = document.getElementsByClassName('key');
  for (let i = 0; i < keys.length; i++) {
    keys[i].removeEventListener('click');
  }
}

// Polling function to check for updates
function poll() {
  $.ajax({
    url: backendURL,
    method: 'POST',
    data: { action: 'poll' },
    success: function(response) {
      updateKeyboardState(response);
    },
    error: function() {
      console.log('Error polling for updates');
    },
    complete: function() {
      setTimeout(poll, 1000); // Poll every 1 second (adjust as needed)
    }
  });
}

// Start polling for updates
poll();
