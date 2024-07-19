HTMLElement.prototype.hide = function () {
    this.originalDisplay = getComputedStyle(this).display === 'none' ? 'block' : getComputedStyle(this).display;
    this.style.display = 'none';
}

HTMLElement.prototype.show = function () {
    this.style.display = this.originalDisplay;
}

const messageList = [];

function showMessage(options = {}) {
    if (messageList.length) {
        messageList[messageList.length - 1]._removeNode();
        messageList.pop();
    }
    const { type = 'error', text = '', duration = 3000, isClose = true } = options;
    const node = document.createElement('div');
    node.className = `message ${type}`;
    node.innerHTML = `<span class="text">${text}</span>`;
    function _removeNode() {
        node.classList.add('hide');
        node.addEventListener('animationend', () => {
            node.remove();
        })
    }
    const timer = setTimeout(_removeNode, duration);
    if (isClose) {
        const close = document.createElement('i');
        close.className = 'close';
        close.innerHTML = `<img src="assets/close.svg" alt="">`;
        node.appendChild(close);
        document.body.appendChild(node);
        close.addEventListener('click', () => {
            clearTimeout(timer);
            _removeNode();
        });
    }
    messageList.push({
        node,
        _removeNode
    })
}