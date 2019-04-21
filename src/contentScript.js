console.log(
  '%c Loaded extension on reddit',
  'background: red; color: yellow; font-size: x-large'
);


function handleKeydown(event) {
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

function startListening() {
    const postContainer = document.querySelector('#SHORTCUT_FOCUSABLE_DIV');

    if (!postContainer) {
        return;
    }
    postContainer.addEventListener('keydown', handleKeydown);
}

// TODO add and destroy listeners when switching pages
startListening();