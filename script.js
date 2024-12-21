class FilenameOptimizer {
    constructor() {
        this.invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
        this.maxLength = 255;
        this.logs = [];
    }

    optimize(filename) {
        const original = filename;
        let modified = filename;
        const changes = [];

        // 移除无效字符
        const invalidCharsFound = modified.match(this.invalidChars);
        if (invalidCharsFound) {
            changes.push(`移除无效字符: ${invalidCharsFound.join(', ')}`);
            modified = modified.replace(this.invalidChars, '');
        }

        // 处理多余的空格和标点
        const oldModified = modified;
        modified = modified
            .replace(/\s+/g, ' ')  // 多个空格替换为单个
            .replace(/[,，]{2,}/g, '，') // 多个逗号替换为单个
            .replace(/[.。]{2,}/g, '。') // 多个句号替换为单个
            .replace(/^\s+|\s+$/g, ''); // 移除首尾空格

        if (oldModified !== modified) {
            changes.push('优化空格和标点');
        }

        // 处理文件名长度
        if (modified.length > this.maxLength) {
            changes.push(`截断超长文件名(${modified.length} -> ${this.maxLength})`);
            modified = modified.substring(0, this.maxLength);
        }

        // 处理以点或空格结尾的情况
        const oldEnding = modified;
        modified = modified.replace(/[. 。，,]+$/, '');
        if (oldEnding !== modified) {
            changes.push('移除末尾的点号或空格');
        }

        // 记录日志
        if (original !== modified) {
            this.logs.push({
                original,
                modified,
                changes
            });
        }

        return modified;
    }

    getStats() {
        return {
            modifiedCount: this.logs.length
        };
    }

    getLogs() {
        return this.logs;
    }

    clearLogs() {
        this.logs = [];
    }
}

const optimizer = new FilenameOptimizer();

function processAll() {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const lines = input.value.trim().split('\n').filter(line => line.trim());
    
    // 清除之前的日志
    optimizer.clearLogs();
    
    // 去重并优化
    const seen = new Set();
    const duplicates = new Set();
    const processedLines = [];
    const duplicateItems = [];

    lines.forEach(line => {
        const optimized = optimizer.optimize(line);
        if (seen.has(optimized)) {
            duplicates.add(optimized);
            duplicateItems.push(line);
        } else {
            seen.add(optimized);
            processedLines.push(optimized);
        }
    });

    // 更新输出
    output.value = processedLines.join('\n');
    
    // 更新行数计数
    updateLineCounts();

    // 更新日志
    updateLog();
    
    // 更新统计和信息
    const stats = {
        total: lines.length,
        duplicates: duplicates.size,
        modified: optimizer.getStats().modifiedCount,
        duplicateItems: duplicateItems,
        lengthExceeded: optimizer.getLogs().filter(log => 
            log.changes.some(change => change.includes('截断超长文件名'))
        ).length,
        invalidChars: optimizer.getLogs().filter(log => 
            log.changes.some(change => change.includes('移除无效字符'))
        ).length
    };
    
    updateStats(stats.total, stats.duplicates, stats.modified);
    updateInfo(stats);
}

function updateInfo(stats) {
    const infoArea = document.getElementById('info');
    const duplicatesList = stats.duplicateItems.length > 0 
        ? `<div style="margin-top: 8px; color: #ff3b30;">${stats.duplicateItems.join('<br>')}</div>`
        : '';

    infoArea.innerHTML = `
        <div class="info-item">
            <span class="info-label">处理总数</span>
            <span class="info-value">${stats.total} 个标题</span>
        </div>
        <div class="info-item">
            <span class="info-label">重复标题</span>
            <span class="info-value">${stats.duplicates} 个</span>
        </div>
        <div class="info-item">
            <span class="info-label">需要优化</span>
            <span class="info-value">${stats.modified} 个</span>
        </div>
        <div class="info-item">
            <span class="info-label">超长标题</span>
            <span class="info-value">${stats.lengthExceeded} 个</span>
        </div>
        <div class="info-item">
            <span class="info-label">含无效字符</span>
            <span class="info-value">${stats.invalidChars} 个</span>
        </div>
        ${stats.duplicateItems.length > 0 ? `
            <div class="info-item" style="display: block;">
                <span class="info-label">重复的标题：</span>
                ${duplicatesList}
            </div>
        ` : ''}
    `;
}

function updateLog() {
    const logArea = document.getElementById('log');
    logArea.innerHTML = optimizer.getLogs().map(log => `
        <div class="log-entry">
            <span class="original">${log.original}</span>
            <span class="arrow">→</span>
            <span class="modified">${log.modified}</span>
            <div style="color: #86868b; font-size: 12px; margin-top: 4px;">
                ${log.changes.join(' | ')}
            </div>
        </div>
    `).join('');
}

function copyResult() {
    const output = document.getElementById('output');
    navigator.clipboard.writeText(output.value).then(() => {
        showToast('已复制到剪贴板');
    }).catch(() => {
        output.select();
        document.execCommand('copy');
        showToast('已复制到剪贴板');
    });
}

function clearAll() {
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
    document.getElementById('log').innerHTML = '';
    document.getElementById('info').innerHTML = '';
    optimizer.clearLogs();
    updateStats(0, 0, 0);
    updateLineCounts();
}

function updateLineCounts() {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const inputLines = input.value.trim().split('\n').filter(line => line.trim()).length;
    const outputLines = output.value.trim().split('\n').filter(line => line.trim()).length;
    
    document.getElementById('inputCount').textContent = `${inputLines} 行`;
    document.getElementById('outputCount').textContent = `${outputLines} 行`;
}

function updateStats(total, duplicates, modified) {
    document.getElementById('totalCount').textContent = total;
    document.getElementById('duplicateCount').textContent = duplicates;
    document.getElementById('modifiedCount').textContent = modified;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
}

// 初始化事件监听
document.getElementById('input').addEventListener('input', () => {
    updateLineCounts();
    const lines = document.getElementById('input').value.trim().split('\n').filter(line => line.trim());
    updateStats(lines.length, 0, 0);
});
