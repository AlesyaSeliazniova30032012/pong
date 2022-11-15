// класс определяющий параметры игрового прямоугольника и метод для его отрисовки
function rect(color, x, y, width, height) {
    this.color = color;
    this.x = x; 
    this.y = y; 
    this.width = width; 
    this.height = height; 
    // функция рисует прямоугольник согласно заданным параметрам
    this.draw = function() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    };
}

// функция проверяет пересекаются ли переданные ей прямоугольные объекты
function collision(objA, objB) {
    if (objA.x + objA.width > objB.x && objA.x < objB.x + objB.width && objA.y + objA.height > objB.y && objA.y < objB.y + objB.height) {
        return true;
    }
    else {
        return false;
    }
}

// движение оппонента
function racket1Move() {
    let y;
    // делаем скорость оппонента зависимой от скорости шарика
    switch (ball.speedY) {
    case 2:
        speedY = 2;
        break;
    case 3:
        speedY = 3;
        break;
    case 4:
        speedY = 4;
        break;
    case 5:
        speedY = 5;
        break;
    case 6:
        speedY = 5;
        break;
    case 7:
        speedY = 6;
        break;
    case 8:
        speedY = 6;
        break;
    case 9:
        speedY = 6;
        break;
    case 0:
        speedY = 0;
        break;
    }

    if (ball.y < racket1.y + racket1.height / 2) {
        y = racket1.y - speedY;
    }
    if (ball.y > racket1.y + racket1.height / 2) {
        y = racket1.y + speedY;
    }
    if (10 < y && y < screen.height - racket1.height - 10) {
        racket1.y = y;
    }
}

// движение игрока
function racket2Move(e) {
    if (start) {
        let y = e.pageY;
        // условие проверяет не выходит ли ракетка за пределы поля
        if (racket2.height / 2 + 10 < y && y < screen.height - racket2.height / 2 - 10) {
            // привязываем положение мыши к середине ракетки
            racket2.y = y - racket2.height / 2;
        }
    }
}

function startGame() {
    if (!start) {
        ball.speedX = -2;
        ball.speedY = 2;
        start = true;
    }
}

// отрисовка игры
function draw() {
    screen.draw(); // игровое поле
    // разделительная полоса
    for (let i = 10; i < screen.height; i += 45) {
        cxt.fillStyle = "#ccc";
        cxt.fillRect(screen.width / 2 - 10, i, 20, 30);
    }
    // рисуем на поле счёт
    cxt.font = 'bold 128px courier';
    cxt.textAlign = 'center';
    cxt.textBaseline = 'top';
    cxt.fillStyle = '#ccc';
    cxt.fillText(racket1.scores, 100, 0);
    cxt.fillText(racket2.scores, screen.width - 100, 0);
    racket1.draw();
    racket2.draw(); 
    ball.draw(); 
    if (!start) {
        // вывод статистики
        cxt.fillStyle = "#ccc";
        cxt.globalAlpha = 0.7;
        cxt.fillRect(0, 0, screen.width, screen.height);
        cxt.font = 'bold 16px courier';
        cxt.textBaseline = 'top';
        cxt.fillStyle = '#000';
        cxt.fillText("Total: " + screen.total + " Win: " + screen.win + " Lose: " + screen.lose, screen.width / 2, 0);
        cxt.font = 'bold 60px courier';
        cxt.textBaseline = 'top';
        cxt.fillStyle = '#000';
        cxt.fillText("canvasPong", screen.width / 2, screen.height / 2 - 50);
        cxt.font = 'bold 16px courier';
        cxt.textBaseline = 'top';
        cxt.fillStyle = '#000';
        cxt.fillText("click on me", screen.width / 2, screen.height / 2 + 25);
        cxt.textBaseline = 'bottom';
        cxt.fillText("A.Seliazniova @ 2022", screen.width / 2, screen.height);
    }
}

// игровые изменения которые нужно произвести
function update() {
    racket1Move();
    // Движение шарика по оси У
    if (ball.y < 0 || ball.y + ball.height > screen.height) {
        // соприкосновение с полом и потолком игрового поля
        ball.speedY = -ball.speedY;
    }
    // Движение шарика по оси Х
    if (ball.x < 0) {
        ball.speedX = -ball.speedX;   // столкновение с левой стеной
        racket2.scores++;
    }
    if (ball.x + ball.width > screen.width) {
        ball.speedX = -ball.speedX;  // столкновение с правой стеной
        racket1.scores++;
    }

    // Если счёт равен десяти, то завершаем партию
    if (racket1.scores === 10 || racket2.scores === 10) {
        if (racket1.scores === 10) { // победа racket1
            screen.lose++;
            start = false;
            ball.x = screen.width - screen.width - 1.5 * ball.width - 10;
            ball.y = screen.height / 2 - ball.width / 2;
            racket1.y = screen.height / 2 - screen.height / 2;
            racket2.y = screen.height / 2 - screen.height / 2;
        } else { // победа racket2
            screen.win++;
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
        screen.total++;
    }

    // Соприкосновение с ракетками
    if ((collision(racket1, ball) && ball.speedX < 0) || (collision(racket2, ball) && ball.speedX > 0)) {
        // приращение скорости шарика
        if (ball.speedX < 9 && -9 < ball.speedX) {
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
}

// Инициализация переменных
function init() {
    start = false;
    screen = new rect("#000", 0, 0, 480, 320);
    screen.total = 0;
    screen.win = 0;
    screen.lose = 0;
    racket1 = new rect("#ffffff", 10, screen.height / 2 - 40, 20, 80);
    racket2 = new rect("#ffffff", screen.width - 30, screen.height / 2 - 40, 20, 80);
    racket1.scores = 0;
    racket2.scores = 0;
    ball = new rect("#fff", 40, screen.height / 2 - 10, 20, 20);
    ball.vX = 0;
    ball.vY = 0; 
    let canvas = document.getElementById("canvas");
    canvas.width = screen.width;
    canvas.height = screen.height;
    context = canvas.getContext("2d");
    canvas.onmousemove = racket2Move;
    canvas.onclick = startGame;
    setInterval(play, 1000 / 50);
}

init();