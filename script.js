// Kласс ракеток и его отрисовка
function rect(color, x, y, width, height) {
    this.color = color;
    this.x = x; 
    this.y = y; 
    this.width = width; 
    this.height = height; 
    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

/* создание круглого шарика и отрисовка
let ball = {
    x: 20,
    y: 20, 
    radius: 10,
    color: 'rgb(247, 10, 10)',
    speedX: 5,
    speedY: 5,
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
    }
};
*/

// движение racket2 (управляемая ракетка)
function racket2Move(e) {
    let y = e.pageY;
    if (racket2.height / 2 + 10 < y && y < screen.height - racket2.height / 2 - 10) {
        racket2.y = y - racket2.height / 2;
    }
}

// движение racket1 (самопроизвольно движующаяся ракетка)
function racket1Move() {
    let y;
    let speedY = Math.abs(ball.speedY) - 2;
    if (ball.y < racket1.y + racket1.height / 2) {
        y = racket1.y - speedY;
    } else {
        y = racket1.y + speedY;
    }
    if (10 < y && y < screen.height - racket1.height - 10) {
        racket1.y = y;
    }
}

function startGame() {
    if (!start) {
        ball.speedX = -2;
        ball.speedY = 2;
        start = true;
    }
}

// Отрисовка игры
function draw() {
    screen.draw();
    ctx.font = 'bold 60px courier';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgb(167, 174, 212)';
    ctx.fillText(racket1.scores, 200, 50);
    ctx.fillText(racket2.scores, screen.width - 200, 50);
    for (let i = 10; i < screen.height; i += 45) { // разделительная линия
        ctx.fillStyle = 'rgb(119, 110, 110)';
        ctx.fillRect(screen.width / 2 - 5, i, 10, 20);
    }
    racket1.draw(); 
    racket2.draw(); 
    ball.draw(); 
    if (!start) {
        ctx.fillStyle = 'rgb(187, 181, 181)';
        ctx.font = 'bold 30px courier';
        ctx.fillText('Итого: ' + screen.total + ' Победы: ' + screen.win + ' Поражения: ' + screen.lose, screen.width / 2, 0);
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgb(65, 63, 204)';
        ctx.font = 'bold 40px courier';
        ctx.fillText('Нажми на меня', screen.width / 2, screen.height / 2 + 25);
        ctx.textBaseline = 'bottom';
    }
}

// Движение шарика
function update() {
    racket1Move();
    // Движение по оси У
    if (ball.y < 0 || ball.y + ball.height > screen.height) {
        ball.speedY = -ball.speedY;  
    }
    // Движение по оси Х
    if (ball.x < 0) {
        ball.speedX = -ball.speedX; 
        racket2.scores ++;
    }
    if (ball.x + ball.width > screen.width) {
        ball.speedX = -ball.speedX;  
        racket1.scores ++;
    }
    // Завершение игры
    if (racket1.scores === 10 || racket2.scores === 10) {
        if (racket1.scores === 10) { 
            screen.lose ++;
            start = false;
            ball.x = screen.width - screen.width - 1.5 * ball.width - 10;
            ball.y = screen.height / 2 - ball.radius;
            racket1.y = screen.height / 2 - screen.height / 2;
            racket2.y = screen.height / 2 - screen.height / 2;
        } else { // победа racket2
            screen.win ++;
            start = false;
            ball.x = racket2.width + ball.width;
            ball.y = screen.height / 2 - ball.width / 2;
            racket1.y = screen.height / 2 - racket1.height / 2;
            racket2.y = screen.height / 2 - racket1.height / 2;
        }
        ball.speedX = 0;
        ball.speedY = 0;
        racket1.scores = 0;
        racket2.scores = 0;
        screen.total ++;
    }
    // Соприкосновение с ракетками
    if ((collision(racket1, ball) && ball.speedX < 0) || (collision(racket2, ball) && ball.speedX > 0)) {
        if (ball.speedX < 9 && -9 < ball.speedX) { // приращение скорости шарика
            if (ball.speedX < 0) {
                ball.speedX --;
            } else {
                ball.speedX ++;
            }
            if (ball.speedY < 0) {
                ball.speedY --;
            } else {
                ball.speedY ++;
            }
        }
        ball.speedX = -ball.speedX;
    }
    // приращение координат
    ball.x += ball.speedX;
    ball.y += ball.speedY;
}

function play() {
    draw(); 
    update(); 
}

function collision(objA, objB) {
    if (objA.x + objA.width > objB.x && objA.x < objB.x + objB.width && objA.y + objA.height > objB.y && objA.y < objB.y + objB.height) {
            return true;
        } else {
            return false;
            }
    }

// Инициализация переменных
function init() {
    start = false;
    screen = new rect('rgb(31, 28, 28)', 0, 0, 720, 560);
    screen.total = 0;
    screen.win = 0;
    screen.lose = 0;
    racket1 = new rect('rgb(197, 58, 58)', 10, screen.height / 2 - 40, 20, 80);
    racket2 = new rect('rgb(116, 18, 18)', screen.width - 30, screen.height / 2 - 40, 20, 80);
    racket1.scores = 0;
    racket2.scores = 0;
    ball = new rect('rgb(158, 24, 24)', 40, screen.height / 2 - 10, 20, 20);
    ball.speedX = 5;
    ball.speedY = 5;
    canvas = document.getElementById('canvas');
    canvas.width = screen.width; 
    canvas.height = screen.height;
    ctx = canvas.getContext('2d');
    canvas.onmousemove = racket2Move;
    canvas.onclick = startGame;
    setInterval(play, 1000 / 50);
}
init();

