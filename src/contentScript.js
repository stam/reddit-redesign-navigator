class Post {
  constructor(element) {
    this.element = element;
  }

  get expandButton() {
    return this.element.children[1].children[0].children[1].children[3]
      .children[0];
  }

  get isExpanded() {
    return this.expandButton.getAttribute('aria-expanded') === 'true';
  }

  expand() {
    // The expandbutton can also be an "A", which opens a new link which we don't want
    if (this.expandButton.tagName === 'BUTTON') {
      this.expandButton.click();
    }
  }
}

class DomManager {
  static findActivePost() {
    const element = document.activeElement;

    if (DomManager.isElementPost(element)) {
      return new Post(element);
    }

    return null;
  }

  static isElementPost(element) {
    return element.classList.contains("Post");
  }

  static findSiblingPost(element, direction) {
    if (!DomManager.isElementPost(element)) {
      throw new Error("Target element is not a Post", element);
    }

    const parentWithSiblings = element.parentElement.parentElement;
    const uncle =
      direction === "UP"
        ? parentWithSiblings.nextElementSibling
        : parentWithSiblings.previousElementSibling;

    if (!uncle) {
      return null;
    }
    const target = uncle.firstElementChild.firstElementChild;

    // TODO check if target is visible (could be an ad that's hidden)
    return new Post(target);
  }

  static scrollTo(element) {
    const html = document.querySelector('html');
    const { top } = element.getBoundingClientRect();

    document.querySelector('html').scrollTo({ top: html.scrollTop + top - 50 });
  }
}

class Navigator {
  constructor(selector) {
    this.element = document.querySelector(selector);
    if (!this.element) {
      throw new Error(
        `Redesign navigator failed to construct, element with selector ${selector} not found.`
      );
    }
  }

  handleNavigation(direction) {
    const activePost = DomManager.findActivePost(this.element);

    if (!activePost) {
      return;
    }

    const previousPost = DomManager.findSiblingPost(
      activePost.element,
      direction
    );

    if (previousPost && previousPost.isExpanded) {
      DomManager.scrollTo(activePost.element);
      if (!activePost.isExpanded) {
        activePost.expand();
      }
    }
  }

  handleKeydown(event) {
    switch (event.keyCode) {
      case 74: // J
        setTimeout(() => {
          this.handleNavigation('DOWN', event);
        });
        break;
      case 75: // K
        setTimeout(() => {
          this.handleNavigation('UP', event);
        });
        break;
      case 88: // X
      default:
        break;
    }
  }

  bind() {
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  unbind() {
    this.element.removeEventListener('keydown', this.handleKeydown.bind(this));
  }
}

function pageHasRedditPosts() {
  if (window.location.host !== 'www.reddit.com') {
    return false;
  }

  const hasPosts = document.querySelectorAll('.Post').length > 0;

  if (!hasPosts) {
    return false;
  }

  const path = window.location.pathname.split('/');

  if (path.length > 3) {
    if (path[3] === 'comments') {
      return false;
    }
  }

  return true;
}

let navigator;

function init() {
  if (navigator) {
    navigator.unbind();
  }

  if (!pageHasRedditPosts()) {
    return;
  }

  navigator = new Navigator('#SHORTCUT_FOCUSABLE_DIV');
  navigator.bind();
}

window.addEventListener('popstate', init);
window.addEventListener('pushstate-changed', init);
init();