import keyArray from './keyCode.js';
import Keyboard from './keyBoard.js';

window.onload = () => {
  // Add wrapper
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  document.body.append(wrapper);

  // Add title text
  const title = document.createElement('h1');
  title.classList.add('title');
  title.textContent = 'Virtual Keyboard';
  wrapper.append(title);

  // Add textarea
  const textarea = document.createElement('textarea');
  textarea.classList.add('textarea');
  textarea.placeholder = 'Поменять раскладку: left Alt + left Shift'
  wrapper.append(textarea);

  // Add keyboard border
  const keyboardBorder = document.createElement('div');
  keyboardBorder.classList.add('keyboard-border');
  wrapper.append(keyboardBorder);

  // Add keyboard container
  const keyBoard = document.createElement('div');
  keyBoard.classList.add('keyboard');
  keyboardBorder.append(keyBoard);

  // Create keyboard
  const keyboard = new Keyboard(keyArray, keyBoard);

  const pressMouse = (e) => {
    if (e.target.tagName === 'BUTTON') {
      keyboard.changeState(e.target.dataset.keyCode, e.type);
      textarea.value = keyboard.type(e.target, textarea.value);
    }
  };
  keyBoard.addEventListener('mousedown', pressMouse);

  const releaseMouse = (e) => {
    const code = (e.target.dataset.keyCode) ? e.target.dataset.keyCode : '';
    keyboard.changeState(code, e.type);
  };
  document.addEventListener('click', releaseMouse);

  const pressKey = (event) => {
    event.preventDefault();
    const virtualKey = keyboard.view.querySelector(`[data-key-code="${event.code}"]`);

    if (virtualKey) {
      keyboard.changeState(event.code, event.type);
      // if (event.type === 'keydown') textarea.value = keyboard.type(virtualKey, textarea.value);
      if (event.type === 'keydown') {
        textarea.value = keyboard.type(virtualKey, textarea.value);
        virtualKey.classList.add('press');
      } else if (event.type === 'keyup') {
        virtualKey.classList.remove('press');
      }
    }
  };
  document.addEventListener('keydown', pressKey);
  document.addEventListener('keyup', pressKey);

  textarea.focus();
  textarea.addEventListener('blur', () => textarea.focus());

  // Inactivate all buttons (except CapsLock), when focus got out of page and returned back
  window.addEventListener('blur', () => {
    if (keyboard.pressed.includes('CapsLock')) keyboard.pressed = ['CapsLock'];
    else keyboard.pressed = [];
    keyboard.activateKeys();
  });
}