const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const keys = {
    left: false,
    up: false,
    right: false,
    down: false,
    space: false
};

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'ArrowUp':
            keys.up = true;
            break;
        case 'ArrowRight':
            keys.right = true;
            break;
        case 'ArrowDown':
            keys.down = true;
            break;
        case ' ':
            keys.space = true;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowUp':
            keys.up = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'ArrowDown':
            keys.down = false;
            break;
        case ' ':
            keys.space = false;
            break;
    }
});

class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

const stars = [];
for (let i = 0; i < 100; i++) {
    stars.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height));
}

class Asteroid {
    constructor(x, y, radius, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'gray';
        ctx.stroke();
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
}

const asteroids = [];
for (let i = 0; i < 10; i++) {
    asteroids.push(new Asteroid(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        30 + Math.random() * 20,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
    ));
}

class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.velocity = 5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    update() {
        this.x += this.velocity * Math.cos(this.angle);
        this.y += this.velocity * Math.sin(this.angle);

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
}

class Ship {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 20;
        this.angle = 0;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = 0.1;
        this.friction = 0.99;
        this.bullets = [];
        this.shootingCooldown = 0;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(this.radius, this.radius);
        ctx.lineTo(-this.radius, this.radius);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    update() {
        if (keys.left) {
            this.angle -= 0.05;
        } else if (keys.right) {
            this.angle += 0.05;
        }

        if (keys.up) {
            this.velocity.x += this.acceleration * Math.cos(this.angle);
            this.velocity.y += this.acceleration * Math.sin(this.angle);
        } else if (keys.down) {
            this.velocity.x -= this.acceleration * Math.cos(this.angle);
            this.velocity.y -= this.acceleration * Math.sin(this.angle);
        }

        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Screen wrap
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Shooting
        if (keys.space && this.shootingCooldown <= 0) {
            this.shoot();
            this.shootingCooldown = 15;
        }
        if (this.shootingCooldown > 0) {
            this.shootingCooldown--;
        }

        // Update bullets
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            bullet.draw();
        });
    }

    shoot() {
        this.bullets.push(new Bullet(this.x, this.y, this.angle));
    }
}

const ship = new Ship();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    stars.forEach(star => star.draw());

    // Update and draw ship
    ship.update();
    ship.draw();

    // Update and draw asteroids
    asteroids.forEach(asteroid => {
        asteroid.update();
        asteroid.draw();
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
