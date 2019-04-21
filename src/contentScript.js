class Navigator {
  constructor(selector) {
    this.element = document.querySelector(selector);
    if (!this.element) {
      throw new Error(`Redesign navigator failed to construct, element with selector ${selector} not found.`);
    }
    this.bind();
  }

  handleKeydown = (event) => {
    switch (event.keyCode) {
      // After J press, make it highlight next post and not the first one if already opened one
      // When in X mode, also open next preview and scroll it into view
      case 74: // J
        console.log('next');
        break;
      case 75: // K
        console.log('previous');
        break;
      // Make X stateful
      case 88: // X
        console.log('show preview');
        break;
    }
  }

  bind() {
    this.element.addEventListener('keydown', this.handleKeydown);
  }

  unbind() {
    this.element.removeEventListener('keydown', this.handleKeydown);
  }
}

// TODO add and destroy listeners when switching pages
const redditRedesignNavigator = new Navigator('#SHORTCUT_FOCUSABLE_DIV');