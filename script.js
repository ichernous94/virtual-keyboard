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
  textarea.placeholder = 'Изменить раскладку клавиатуры: left Alt + left Shift'
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

  const pressKey = (e) => {
    e.preventDefault();
    const virtualKey = keyboard.view.querySelector(`[data-key-code="${e.code}"]`);

    if (virtualKey) {
      keyboard.changeState(e.code, e.type);
      if (e.type === 'keydown') {
        textarea.value = keyboard.type(virtualKey, textarea.value);
        virtualKey.classList.add('press');
      } else if (e.type === 'keyup') {
        virtualKey.classList.remove('press');
      }
    }
  };
  document.addEventListener('keydown', pressKey);
  document.addEventListener('keyup', pressKey);

  textarea.focus();
  textarea.addEventListener('blur', () => textarea.focus());

  window.addEventListener('blur', () => {
    if (keyboard.pressed.includes('CapsLock')) keyboard.pressed = ['CapsLock'];
    else keyboard.pressed = [];
    keyboard.activateKeys();
  });
}