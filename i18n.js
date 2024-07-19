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
        permission: '请允许浏览器访问麦克风',
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
        permission: 'Please allow the browser to access the microphone',
    }
}

function getNestedValue(obj, keys) {
    let current = obj;
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
                const keys = p1.trim().split('.');
                return getNestedValue(eval(language), keys);
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