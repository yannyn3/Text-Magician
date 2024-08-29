<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Windows 文件名转换器</title>
    <!-- 保持原有的 style 部分不变 -->
</head>
<body>
    <!-- 保持原有的 HTML 结构不变 -->

    <script>
        const input = document.getElementById('input');
        const output = document.getElementById('output');
        const tempInput = document.getElementById('tempInput');
        const notification = document.getElementById('notification');
        const invalidCharsRegex = /[\\/:*?"<>|]/g;
        const trimDotsRegex = /^\.+|\.+$/g;

        function showNotification(message) {
            notification.textContent = message;
            notification.style.display = 'block';
            notification.style.opacity = '1';
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 500);
            }, 2000);
        }

        function convertFileNames() {
            const fileNames = input.value.split('\n');
            const convertedNames = fileNames.map(convertFileName);
            output.textContent = convertedNames.join('\n');
            showNotification('文件名已转换');
        }

        function convertFileName(fileName) {
            // 移除无效字符，但保留中文字符
            fileName = fileName.replace(invalidCharsRegex, '');
            // 去除首尾空格
            fileName = fileName.trim();
            // 移除首尾的点
            fileName = fileName.replace(trimDotsRegex, '');
            // 如果文件名为空，则使用默认名称
            return fileName || '未命名文件';
        }

        function copyOutput() {
            if (output.textContent) {
                tempInput.value = output.textContent;
                tempInput.select();
                try {
                    document.execCommand('copy');
                    showNotification('已复制到剪贴板');
                } catch (err) {
                    console.error('复制失败:', err);
                    showNotification('复制失败，请手动复制');
                }
                tempInput.blur();
            } else {
                showNotification('没有可复制的内容');
            }
        }

        function clearAll() {
            input.value = '';
            output.textContent = '';
            showNotification('已清空所有内容');
        }

        // 使用事件委托来处理按钮点击
        document.querySelector('.button-group').addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                switch(e.target.textContent) {
                    case '转换文件名':
                        convertFileNames();
                        break;
                    case '复制结果':
                        copyOutput();
                        break;
                    case '清空所有':
                        clearAll();
                        break;
                }
            }
        });
    </script>
</body>
</html>
