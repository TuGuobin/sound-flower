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
