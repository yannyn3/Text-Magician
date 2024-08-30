const input = document.getElementById('input');
const output = document.getElementById('output');
const content = document.getElementById('content');
const notification = document.getElementById('notification');
const contentTitle = document.getElementById('contentTitle');
let currentConversionType = '';

function showContent(type) {
    content.style.display = 'block';
    currentConversionType = type;
    if (type === 'filename') {
        contentTitle.textContent = '文件名转换器';
        input.placeholder = "请输入需要转换的文件名，每行一个";
    } else {
        contentTitle.textContent = '半角全角转换器';
        input.placeholder = "请输入需要转换的文本";
    }
}

function convertText(conversionType) {
    const inputText = input.value;
    if (currentConversionType === 'filename') {
        output.textContent = inputText.split('\n').map(convertFileName).join('\n');
    } else {
        output.textContent = conversionType === 'half-to-full' ? 
            halfToFull(inputText) : fullToHalf(inputText);
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

function fullToHalf(text) {
    return text.replace(/[\uff01-\uff5e]/g, function(char) {
        return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
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

function switchTheme() {
    document.body.classList.toggle('dark-theme');
}
