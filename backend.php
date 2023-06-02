<?php
session_start();

// Function to acquire control of the keyboard
function acquireControl() {
  $_SESSION['control'] = true;
  return json_encode(getKeyboardState());
}

// Function to toggle key state
function toggleKeyState($keyId) {
  if (isset($_SESSION['control'])) {
    $keys = getKeyboardState();
    foreach ($keys as &$key) {
      if ($key['id'] === $keyId) {
        if ($key['state'] === 'on') {
          $key['state'] = 'off';
        } else {
          $key['state'] = 'on';
          $key['color'] = ($_SESSION['user'] === 1) ? 'red' : 'yellow';
        }
      }
    }
    $_SESSION['keyboard'] = json_encode($keys);
    return json_encode($keys);
  }
  return null;
}

// Function to release control of the keyboard
function releaseControl() {
  if (isset($_SESSION['control'])) {
    unset($_SESSION['control']);
    return json_encode(getKeyboardState());
  }
  return null;
}

// Function to get the current keyboard state
function getKeyboardState() {
  if (isset($_SESSION['keyboard'])) {
    return json_decode($_SESSION['keyboard'], true);
  }
  $keys = [];
  for ($i = 1; $i <= 10; $i++) {
    $keys[] = array(
      'id' => 'key' . $i,
      'state' => 'off',
      'color' => 'white'
    );
  }
  $_SESSION['keyboard'] = json_encode($keys);
  return $keys;
}

// Handle the requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if ($_POST['action'] === 'acquire_control') {
    $_SESSION['user'] = (isset($_SESSION['user']) && $_SESSION['user'] === 1) ? 2 : 1;
    echo acquireControl();
  } elseif ($_POST['action'] === 'toggle_key' && isset($_POST['keyId'])) {
    echo toggleKeyState($_POST['keyId']);
  } elseif ($_POST['action'] === 'release_control') {
    echo releaseControl();
  } elseif ($_POST['action'] === 'poll') {
    echo json_encode(getKeyboardState());
  }
}
?>
