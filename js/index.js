HTMLElement.prototype.hide = function (animate = false) {
    if (!animate) {
        this.style.display = 'none';
        return;
    }
    this.classList.add('hide');
    this.addEventListener('animationend', () => {
        this.style.display = 'none';
        this.classList.remove('hide');
    })
}

HTMLElement.prototype.show = function ( animate = false) {
    this.style.display = '';
    if (!animate) {
        return;
    }
    this.classList.add('show');
    this.addEventListener('animationend', () => {
        this.classList.remove('show');
    })
}

const messageList = [];

function showMessage(options = {}) {
    if (messageList.length) {
        messageList[messageList.length - 1]._removeNode();
        messageList.pop();
    }
    const { type = 'error', text = '', duration = 3000, isClose = true, isConfirm = false, isMask = false, confirmText = getNestedValue(language, 'confirm.confirm'), cancelText = getNestedValue(language, 'confirm.cancel'), confirm = () => {}, cancel = () => {} } = options;
    const node = document.createElement('div');
    node.className = 'message-container';
    document.body.appendChild(node);
    if (isMask) {
        const mask = document.createElement('div');
        mask.className = 'mask';
        node.appendChild(mask);
        mask.addEventListener('click', () => {
            _removeNode();
        })
    }
    const inner = document.createElement('div');
    inner.className = `message ${type}`;
    node.appendChild(inner);
    const textNode = document.createElement('span');
    textNode.className = 'text';
    inner.appendChild(textNode);
    textNode.textContent = text;
    function _removeNode() {
        node.classList.add('hide');
        node.addEventListener('animationend', () => {
            node.remove();
        })
    }
    if (!isConfirm && isClose) {
        const timer = setTimeout(_removeNode, duration);
        const close = document.createElement('i');
        close.className = 'close';
        close.innerHTML = `<img src="assets/close.svg" alt="">`;
        inner.appendChild(close);
        close.addEventListener('click', () => {
            clearTimeout(timer);
            _removeNode();
        });
    }
    if (isConfirm) {
        inner.classList.add('confirm');
        const btns = document.createElement('div');
        btns.className = 'btns';
        inner.appendChild(btns);
        const confirm = document.createElement('button');
        confirm.className = 'success';
        confirm.innerHTML = confirmText;
        confirm.addEventListener('click', () => {
            _removeNode();
            options.confirm();
        });
        btns.appendChild(confirm);
        const cancel = document.createElement('button');
        cancel.className = 'cancel';
        cancel.innerHTML = cancelText;
        cancel.addEventListener('click', () => {
            _removeNode();
            options.cancel();
        });
        btns.appendChild(cancel);
    }
    messageList.push({
        node,
        _removeNode
    })
}