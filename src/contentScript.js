class Post {
  constructor(element) {
    this.element = element;
  }

  highlight(color = "hotpink") {
    this.element.style.background = color;
  }

  get isExpanded() {
    const expandButton = this.element.children[1].children[0].children[1].children[3].children[0];
    return expandButton.getAttribute('aria-expanded') === 'true';
  }

  scrollIntoView() {
    DomManager.scrollTo(this.element);
  }
}

class DomManager {
  static findActivePost(container) {
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
    this.bind();
  }

  handleNavigation(direction, event) {
    const activePost = DomManager.findActivePost(this.element);

    if (activePost) {
      activePost.highlight();
    }

    const previousPost = DomManager.findSiblingPost(
      activePost.element,
      direction
    );

    if (previousPost && previousPost.isExpanded) {
      previousPost.highlight("blue");
      console.log('scroll intoView', activePost);
      activePost.scrollIntoView();
    }
    // if previousPost is expanded, scroll activePost into view, and expand.
  }

  handleKeydown = event => {
    switch (event.keyCode) {
      // After J press, make it highlight next post and not the first one if already opened one
      // When in X mode, also open next preview and scroll it into view
      case 74: // J
        setTimeout(() => {
          this.handleNavigation("DOWN", event);
        });
        break;
      case 75: // K
        setTimeout(() => {
          this.handleNavigation("UP", event);
        });
        break;
      // Make X stateful
      case 88: // X
        console.log("show preview");
        break;
    }
  };

  bind() {
    this.element.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  unbind() {
    this.element.removeEventListener("keydown", this.handleKeydown.bind(this));
  }
}

// TODO add and destroy listeners when switching pages
const redditRedesignNavigator = new Navigator("#SHORTCUT_FOCUSABLE_DIV");
