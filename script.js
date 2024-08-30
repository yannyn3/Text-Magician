const input = document.getElementById('input');
const output = document.getElementById('output');
const content = document.getElementById('content');
const notification = document.getElementById('notification');
const contentTitle = document.getElementById('contentTitle');
const convertBtn = document.getElementById('convertBtn');
let currentConversionType = '';

function showContent(type) {
    document.getElementById('mainPage').style.display = 'none';
    content.style.display = 'block';
    currentConversionType = type;
    if (type === 'filename') {
        contentTitle.textContent = 'Windows 文件名转换器';
        input.placeholder = "请在此输入需要转换的文件名，每行一个";
        convertBtn.textContent = "转换文件名";
    } else {
        contentTitle.textContent = '半角全角转换器';
        input.placeholder = "请输入需要转换的文本";
        convertBtn.textContent = "半角转全角";
    }
}

function convertText() {
    const inputText = input.value;
    if (currentConversionType === 'filename') {
        output.textContent = inputText.split('\n').map(convertFileName).join('\n');
    } else {
        output.textContent = inputText.split('\n').map(halfToFull).join('\n');
    }
    showNotification('转换完成');
}

function convertFileName(fileName) {
    return fileName.replace(/[\\/:*?"<>|]/g, '')
                   .trim()
                   .replace(/^\.+|\.+$/g, '') || '未命名文件';
}

function halfToFull(text) {
    return text.replace(/[\u0000-\u00ff]/g, function(char) {
        return String.fromCharCode(char.charCodeAt(0) + 0xfee0);
    });
}

function copyOutput() {
    if (output.textContent) {
        navigator.clipboard.writeText(output.textContent)
            .then(() => showNotification('复制成功'))
            .catch(() => showNotification('复制失败，请手动复制'));
    } else {
        showNotification('没有可复制的内容');
    }
}

function clearAll() {
    input.value = '';
    output.textContent = '';
    showNotification('已清空所有内容');
}

function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// 初始隐藏内容区域
content.style.display = 'none';

function returnToMain() {
    document.getElementById('mainPage').style.display = 'block';
    content.style.display = 'none';
    input.value = '';
    output.textContent = '';
}

// ... 其他函数保持不变 ...

// 初始隐藏内容区域
content.style.display = 'none';
