let language = localStorage.getItem('language') || 'zh';

const zh = {
    title: '声音之花',
    tools: {
        record: '录制',
        stop: '停止',
        save: '保存',
        remake: '重制',
    },
    error: {
        permission: '🔈 请允许浏览器访问麦克风 ⚠',
    },
    info: {
        language: '🔈 Click 「声音之花」 To Change Language',
        change: 'ℹ️ 切换为中文',
        sing: '🎙️ 点击「录制」唱一首拿手的歌曲绘画出专属于你的「声音之花」 🎵'
    },
    confirm: {
        save: '❓ 保存图片时是否添加二维码链接',
        confirm: '确认',
        cancel: '取消',
    }
}

const en = {
    title: 'Sound Flower',
    tools: {
        record: 'Record',
        stop: 'Stop',
        save: 'Save',
        remake: 'Remake',
    },
    error: {
        permission: '🔈 Please allow the browser to access the microphone ⚠',
    },
    info: {
        language: '🔈 点击 [Sound Flower] 切换语言',
        change: 'ℹ️ Change to English',
        sing: '🎙️ Click [Record] sing a song and draw a picture of your hand-made [sound-flower] 🎵'
    },
    confirm: {
        save: '❓ Do you want to add a QR code link to the website',
        confirm: 'Confirm',
        cancel: 'Cancel',
    }
}

function getLangugeValue(obj, keys) {
    let current = obj;
    if (typeof current === 'string') {
        current = eval(current);
    }
    if (typeof keys === 'string') {
        keys = keys.split('.');
    }
    for (const key of keys) {
        if (current[key]) {
            current = current[key];
        } else {
            return '';
        }
    }
    return current;
}

function compileDOM(node, language) {
    for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            const parent = child.parentNode;
            if (parent.getAttribute('data-template')) {
                child.textContent = parent.getAttribute('data-template');
            }
            if (!child.textContent.includes('{{')) {
                continue;
            }
            parent.setAttribute('data-template', child.textContent);
            child.textContent = child.textContent.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, p1) => {
                return getLangugeValue(language, p1.trim());
            });
        } else {
            compileDOM(child, language);
        }
    }
}

function changeLanguage() {
    language = language === 'en' ? 'zh' : 'en';
    localStorage.setItem('language', language);
    compileDOM(document.body, language);
}

window.addEventListener('load', () => {
    compileDOM(document.body, language);
});