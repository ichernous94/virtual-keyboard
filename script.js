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
  wrapper.append(textarea);

  // Add keyboard border
  const keyboardBorder = document.createElement('div');
  keyboardBorder.classList.add('keyboard-border');
  wrapper.append(keyboardBorder);

  // Add keyboard container
  const keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');
  keyboardBorder.append(keyboard);
}