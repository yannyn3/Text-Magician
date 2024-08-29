function showContent(type) {
    const contentDiv = document.getElementById('content');
    if (type === 'filename') {
        contentDiv.innerHTML = `
            <h2>文件名字转换</h2>
            <textarea id="input" placeholder="请输入需要转换的文件名，每行一个"></textarea>
            <button onclick="convertFilename()" class="button green">转换</button>
            <div id="result"></div>
        `;
    } else if (type === 'fullwidth') {
        contentDiv.innerHTML = `
            <h2>全/半角转换</h2>
            <textarea id="input" placeholder="请输入需要转换的文本"></textarea>
            <button onclick="convertToFullWidth()" class="button green">转为全角</button>
            <button onclick="convertToHalfWidth()" class="button gray">转为半角</button>
            <div id="result"></div>
        `;
    }
}

function convertFilename() {
    const input = document.getElementById('input').value;
    const lines = input.split('\n');
    const result = lines.map(line => {
        return line.replace(/[^\w\s.-]/gi, '').replace(/\s+/g, '_');
    }).join('\n');
    document.getElementById('result').innerText = result;
}

function convertToFullWidth() {
    const input = document.getElementById('input').value;
    const result = input.replace(/[A-Za-z0-9]/g, char => String.fromCharCode(char.charCodeAt(0) + 0xFEE0));
    document.getElementById('result').innerText = result;
}

function convertToHalfWidth() {
    const input = document.getElementById('input').value;
    const result = input.replace(/[\uff01-\uff5e]/g, char => String.fromCharCode(char.charCodeAt(0) - 0xFEE0));
    document.getElementById('result').innerText = result;
}

// 初始加载文件名转换界面
showContent('filename');
