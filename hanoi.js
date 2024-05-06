// 获取canvas元素并设置绘图上下文
const canvas = document.getElementById('hanoiCanvas');
const ctx = canvas.getContext('2d');
 
// 设置初始参数
const numDisks = 3; // 圆盘数量
const towerWidth = 10;
const towerHeight = 150;
const diskHeight = 20;
const diskIncrement = 20; // 圆盘宽度递增量
let towers = [[], [], []]; // 三根柱子
let draggingDisk = null; // 当前拖动的圆盘
let draggingOffsetX = 0;
let draggingOffsetY = 0;
 
// 初始化游戏：接受一个参数：圆盘数量
function initGame(numDisks) {
    towers = [[], [], []]; // 重置游戏状态
    // 初始化圆盘
    for (let i = 0; i < numDisks; i++) {
        towers[0].push({
            width: (numDisks - i) * diskIncrement + 60,
            height: diskHeight,
            color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
        });
    }
    draw();
}
 
// 添加startGame函数
function startGame() {
    const selectedNumDisks = document.getElementById('numDisks').value;
    initGame(parseInt(selectedNumDisks, 10)); // 根据选择的圆盘数量开始游戏
}
 
// 绘制游戏状态
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
 
    // 绘制三根柱子
    for (let i = 0; i <= 2; i++) {
        ctx.fillStyle = 'black';
        ctx.fillRect(100 + 200 * i - towerWidth / 2, canvas.height - towerHeight, towerWidth, towerHeight);
    }
 
    // 绘制圆盘
    for (let i = 0; i < 3; i++) {
        const tower = towers[i];
        for (let j = 0; j < tower.length; j++) {
            const disk = tower[j];
            ctx.fillStyle = disk.color;
            ctx.fillRect(100 + 200 * i - disk.width / 2, canvas.height - (j + 1) * diskHeight, disk.width, disk.height);
        }
    }
 
    // 绘制柱子底部的字符
    const baseY = canvas.height - towerHeight; // 字符的基线位置
    ctx.font = '20px Arial'; // 设置字体大小和样式
    ctx.fillStyle = 'black'; // 设置字符颜色
    ctx.textAlign = 'center'; // 设置文本对齐方式为居中，便于定位
 
    // 绘制每个柱子底部的字符
    ctx.fillText('A', 100, baseY); // 第一根柱子
    ctx.fillText('B', 300, baseY); // 第二根柱子
    ctx.fillText('C', 500, baseY); // 第三根柱子
 
}
 
// 鼠标按下事件处理
canvas.onmousedown = function(e) {
    const mousePos = getMousePos(canvas, e);
    for (let i = 2; i >= 0; i--) {
        const tower = towers[i];
        if (tower.length > 0) {
            const topDisk = tower[tower.length - 1];
            const centerX = 100 + 200 * i;
            const centerY = canvas.height - tower.length * diskHeight + diskHeight / 2;
            if (Math.abs(mousePos.x - centerX) <= topDisk.width / 2 && Math.abs(mousePos.y - centerY) <= diskHeight / 2) {
                draggingDisk = tower.pop();
                draggingOffsetX = centerX - mousePos.x;
                draggingOffsetY = centerY - mousePos.y;
                draw();
                return;
            }
        }
    }
};
 
// 鼠标移动事件处理
canvas.onmousemove = function(e) {
    if (draggingDisk) {
        const mousePos = getMousePos(canvas, e);
        const centerX = mousePos.x + draggingOffsetX;
        const centerY = mousePos.y + draggingOffsetY;
        // 清空画布并重新绘制所有元素，包括被拖动的圆盘
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        // 绘制被拖动的圆盘
        ctx.fillStyle = draggingDisk.color;
        ctx.fillRect(centerX - draggingDisk.width / 2, centerY - diskHeight / 2, draggingDisk.width, diskHeight);
    }
};
 
// 鼠标释放事件处理
canvas.onmouseup = function(e) {
    if (draggingDisk) {
        const mousePos = getMousePos(canvas, e);
        // 确定圆盘应该放置的柱子
        let targetTowerIndex = Math.floor(mousePos.x / 200);
        if (targetTowerIndex < 0) targetTowerIndex = 0;
        if (targetTowerIndex > 2) targetTowerIndex = 2;
 
        // 检查是否可以将圆盘放到目标柱子上
        if (canPlaceDiskOnTower(draggingDisk, towers[targetTowerIndex])) {
            towers[targetTowerIndex].push(draggingDisk);
        } else {
            // 如果不能放置，则将圆盘返回原柱子
            towers[Math.floor((draggingOffsetX + 100) / 200)].push(draggingDisk);
        }
 
        draggingDisk = null;
        draw();
        checkWin();
    }
};
 
// 检查圆盘是否可以放置到目标柱子上
function canPlaceDiskOnTower(disk, tower) {
    if (tower.length === 0) {
        return true; // 目标柱子为空，则可以放置
    }
    const topDisk = tower[tower.length - 1];
    return disk.width < topDisk.width; // 只能放在更大的圆盘上
}
 
// 获取鼠标位置
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
 
// 检查是否胜利
function checkWin() {
    if (towers[0].length === 0 && towers[1].length === 0) {
        alert('恭喜你，成功解决汉诺塔问题！');
    }
}
 
// 生成汉诺塔的解决步骤
//接收当前圆盘的数量n，源柱子source，目标柱子target，辅助柱子auxiliary，steps数组来存储所有的移动步骤，stepNumber步骤序号
function generateHanoiSteps(n, source, target, auxiliary, steps, stepNumber) {
    if (n > 0) {
        // 将n-1个圆盘从源柱子移动到辅助柱子
        generateHanoiSteps(n - 1, source, auxiliary, target, steps, stepNumber);
        // 将第n个圆盘从源柱子移动到目标柱子，并添加步骤序号
        steps.push(stepNumber[0] + ". " + source + " → " + target);
        stepNumber[0] += 1; // 更新步骤序号
        // 将n-1个圆盘从辅助柱子移动到目标柱子
        generateHanoiSteps(n - 1, auxiliary, target, source, steps, stepNumber);
    }
}
 
// 修改 showHints 函数，初始化步骤序号并传递给 generateHanoiSteps
function showHints() {
    const numDisks = document.getElementById('numDisks').value; // 获取圆盘数量
    let steps = [];
    let stepNumber = [1]; // 初始化步骤序号为1，并使用数组传递以便在递归调用中更新
    generateHanoiSteps(parseInt(numDisks, 10), 'A', 'C', 'B', steps, stepNumber);
 
    // 将步骤显示到多行文本框中
    document.getElementById('hintsBox').value = steps.join("\n");
}
 
// 启动游戏
// initGame(numDisks);
