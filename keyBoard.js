export default class {
  constructor(keys, view) {
    this.language = this.getLanguage();
    this.keys = keys;
    this.view = view;

    this.capslockPressed = false;

    this.pressed = [];
    this.createKeyboard();
  }

  createKeyboard() {
    let currentRow;
    this.keys.forEach((key) => {
      if (currentRow !== key.row) {
        const row = document.createElement('div');
        row.classList.add('row');
        this.view.append(row);
        currentRow = key.row;
      }

      const button = document.createElement('button');
      button.dataset.keyCode = key.code;

      if (key.classes) button.classList = key.classes;
      button.innerHTML = key.isSpecial ? key.name : key[this.language];
      this.view.querySelectorAll('.row')[currentRow].append(button);
    });
  }

  changeState(code, type) {
    this.press(code, type);
    this.activateKeys();
    this.switchLanguage();
    this.updateKeys();
  }

  isPressed(keyName) {
    return (keyName === 'CapsLock') ? this.capslockPressed : this.pressed.some((key) => key.includes(keyName));
  }

  updateKeys() {
    this.view.querySelectorAll('button').forEach((btn) => {
        const data = this.getButtonInfo(btn);
        if (!data.isSpecial) {
          let updated = data[this.language];

          if (this.isPressed('Shift') || (this.isPressed('Shift') && this.isPressed('CapsLock'))) {
            updated = data[`${this.language}Shift`];
          } else if (this.isPressed('CapsLock')) {
            updated = data[this.language].toUpperCase();
          }

          document.querySelector(`[data-key-code="${data.code}"]`).innerHTML = updated;
        }
      });
  }

  setLanguage(language = this.language) {
    localStorage.setItem('language', language);
    return this;
  }

  getLanguage() {
    let currentLanguage = 'en';
    if (!localStorage.getItem('language')) {
      this.setLanguage(currentLanguage);
    } else {
      currentLanguage = localStorage.getItem('language');
    }
    return currentLanguage;
  }

  switchLanguage() {
    // ControlLeft or AltLeft
    if (this.isPressed('ShiftLeft') && this.isPressed('AltLeft')) {
      this.language = (this.language === 'en') ? 'ru' : 'en';
      this.setLanguage(this.language);
    }
  }

  getButtonInfo(button) {
    return this.keys.filter((key) => key.code === button.dataset.keyCode)[0];
  }

  press(code, event) {
    if (code === 'CapsLock') {
      switch (event) {
        case 'mousedown':
        case 'keydown':
        case 'keyup':
          this.capslockPressed = !this.capslockPressed;
          break;
        default:
      }
    } else if (code !== 'CapsLock') {
      switch (event) {
        case 'keydown':
        case 'mousedown':
          if (!this.isPressed(code)) this.pressed.push(code); break;
        case 'keyup':
          if (this.isPressed(code)) this.pressed.splice(this.pressed.indexOf(code), 1); break;
        case 'click':
          if (this.isPressed(code)) {
            this.pressed.splice(this.pressed.indexOf(code), 1);
          }
          break;
        default:
      }
    }
  }

  type(button, text) {
    const data = this.getButtonInfo(button);
    let updated = text;
    if (data.isSpecial) {
      switch (data.code) {
        case 'Backspace':
          updated = updated.slice(0, -1); break;
        case 'Tab':
          updated = `${updated}\t`; break;
        case 'Enter':
          updated = `${updated}\n`; break;
        case 'Space':
          updated = `${updated} `; break;
        default:
          updated = text;
      }
    } else if (this.isPressed('Shift')) {
      updated += data[`${this.language}Shift`];
    } else if (this.isPressed('CapsLock')) {
      updated += data[this.language].toUpperCase();
    } else {
      updated += data[this.language];
    }
    return updated;
  }

  activateKeys() {
    this.view.querySelectorAll('button').forEach((btn) => {
      if (!this.isPressed(btn.dataset.keyCode)) btn.classList.remove('press');
    });
    this.pressed.forEach((key) => this.view.querySelector(`[data-key-code="${key}"]`).classList.add('press'));
    if (this.capslockPressed) this.view.querySelector('[data-key-code="CapsLock"]').classList.add('press');
  }
}