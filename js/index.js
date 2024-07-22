const record = document.getElementById('record');
const stop = document.getElementById('stop');
const remake = document.getElementById('remake');
const container = document.querySelector('.container');

const canvas = document.getElementById('canvas');
const dpr = window.devicePixelRatio || 1;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const lines = [];
const MAX_LINES = 10000;

let isRecording = false;
let degree = Math.PI * 2;
let ratio = 0.25;
const colorList = ['#ff0000', '#ffa500', '#ffff00', '#008000', '#00ffff', '#0000ff', '#800080'];
const audioTrack = [];
let timeoutId = null;

function changeLanguageFn() {
    changeLanguage();
    showMessage({ type: 'info', text: getLangugeValue(language, 'info.change'), duration: 3000 });
}

function updateCanvasSize() {
    const innerSize = Math.min(window.innerWidth, window.innerHeight);
    const isHorizontal = window.innerHeight > window.innerWidth * 1.4;
    const size = isHorizontal ? window.innerWidth - 48 : window.innerHeight - 286;
    const setSize = innerSize < size * dpr ? size : size * dpr - 60;
    canvas.width = setSize;
    canvas.height = setSize;
    clearCanvas();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveBlob(blob, name) {
    const a = document.createElement('a');
    a.download = name;
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
}

function save() {
    const SAVE_IMG_NAME = 'sound-flower.png';
    showMessage({
        type: 'info',
        isConfirm: true,
        isMask: true,
        text: getLangugeValue(language, 'confirm.save'),
        confirm() {
            const poster = new Image();
            poster.src = './assets/poster.png';
            const cvs = document.createElement('canvas');
            const tempCtx = cvs.getContext('2d');
            poster.onload = () => {
                const margin = 30;
                cvs.width = poster.width;
                cvs.height = poster.height;
                tempCtx.drawImage(poster, 0, 0, poster.width, poster.height);
                tempCtx.drawImage(canvas, margin, margin, poster.width - 2 * margin, poster.width - 2 * margin);
                cvs.toBlob((blob) => {
                    saveBlob(blob, SAVE_IMG_NAME);
                }, 'image/png');
            }
        },
        cancel() {
            canvas.toBlob((blob) => {
                saveBlob(blob, SAVE_IMG_NAME);
            })
        }
    })
}

function draw() {
    requestAnimationFrame(draw);
    if (!isRecording) {
        return;
    }
    clearCanvas();
    const baseOpacity = 0.3;
    if (lines.length >= MAX_LINES) {
        lines.shift();
    }
    for (let i = 0; i < lines.length; i++) {
        lines[i].opacity = (i + 1) / lines.length * (1 - baseOpacity) + baseOpacity;
        lines[i].draw(ctx);
    }
}

function recordFn() {
    if (isRecording) return;
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            isRecording = true;
            container.classList.add('recording');
            document.documentElement.style.setProperty('--start-degree', `${degree}rad`);
            record.hide();
            stop.show();

            const audioCtx = new AudioContext();
            const audioSrc = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            audioSrc.connect(analyser);
            analyser.connect(audioCtx.destination);
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            audioTrack.push(...stream.getAudioTracks());

            let time = 0;
            run();

            function drawRecord() {
                if (!isRecording) {
                    return;
                }
                requestAnimationFrame(drawRecord);

                time += Math.random() / 20;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += Math.abs(dataArray[i]);
                }
                const average = sum / bufferLength;
                ratio = (1 - Math.min(1, Math.max(0.05 + Math.random() / 10, average / 64))) / 2;
                const line = new Line(0, 0, 0, 0);

                const color1 = colorList[Math.floor(time % colorList.length)].slice(1);
                const color2 = colorList[Math.floor((time + 1) % colorList.length)].slice(1);

                const color1Hex = parseInt(color1, 16);
                const color2Hex = parseInt(color2, 16);

                const r1 = (color1Hex >> 16) & 0xFF;
                const g1 = (color1Hex >> 8) & 0xFF;
                const b1 = color1Hex & 0xFF;

                const r2 = (color2Hex >> 16) & 0xFF;
                const g2 = (color2Hex >> 8) & 0xFF;
                const b2 = color2Hex & 0xFF;

                const interpolationRatio = time % 1;

                const r = Math.round(r1 + (r2 - r1) * interpolationRatio);
                const g = Math.round(g1 + (g2 - g1) * interpolationRatio);
                const b = Math.round(b1 + (b2 - b1) * interpolationRatio);

                const interpolatedColor = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;

                line.color = interpolatedColor;
                line.set(...getLinePosition());
                lines.push(line);
            }

            drawRecord();
        }).catch(error => {
            if (error.name === 'PermissionDeniedError' || error.name === 'NotAllowedError') {
                requestPermissionAgain();
            } else {
                alert(`${error.name}: ${error.message}`);
            }
        })
}

function requestPermissionAgain() {
    navigator.permissions.query({ name: 'microphone' })
        .then(result => {
            if (result.state === 'prompt') {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(() => {
                        recordFn();
                    })
            } else if (result.state === 'denied') {
                showMessage({ type: 'error', text: getLangugeValue(language, 'error.permission'), duration: 3000 });
            }
        });
}

function getLinePosition() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const round = Math.min(centerX, centerY) * 4 / 4;
    const lineLength = round / 2;
    return [centerX + round * Math.cos(degree) * ratio, centerY + round * Math.sin(degree) * ratio, centerX + round * Math.cos(degree) * (1 - ratio), centerY + round * Math.sin(degree) * (1 - ratio)]
}

function run() {
    if (!isRecording) {
        return;
    }
    requestAnimationFrame(run);
    degree -= 0.05;
    if (degree < 0) {
        degree += Math.PI * 2;
    }
}

function stopFn() {
    isRecording = false;
    container.classList.remove('recording');
    audioTrack.forEach(track => track.stop());
    audioTrack.splice(0, audioTrack.length);
    record.show();
    stop.hide();
}

function remakeFn() {
    lines.splice(0, lines.length);
    clearCanvas();
}

function init() {
    stop.hide();
    record.show();
    draw();
    updateCanvasSize();
    window.onresize = updateCanvasSize;
    showMessage({
        type: 'info',
        text: getLangugeValue(language, 'info.language'),
        duration: 5000,
        close() {
            showMessage({ type: 'info', text: getLangugeValue(language, 'info.sing'), duration: 5000 })
        }
    });
}