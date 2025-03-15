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

const stars = Array.from({ length: 100 }, () => new Star(Math.random() * canvas.width, Math.random() * canvas.height));
const asteroids = Array.from({ length: 10 }, () => new Asteroid(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    30 + Math.random() * 20,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2
));

const ship = new Ship();

function detectCollision(bullet, asteroid) {
    const dx = bullet.x - asteroid.x;
    const dy = bullet.y - asteroid.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < asteroid.radius;
}

function handleCollisions() {
    ship.bullets.forEach((bullet, bIndex) => {
        asteroids.forEach((asteroid, aIndex) => {
            if (detectCollision(bullet, asteroid)) {
                ship.bullets.splice(bIndex, 1);
                asteroids.splice(aIndex, 1);
            }
        });
    });

    const dx = ship.x - asteroids[0]?.x;
    const dy = ship.y - asteroids[0]?.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < asteroids[0]?.radius) {
        alert('Game Over!');
        document.location.reload();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => star.draw());
    ship.update();
    ship.draw();
    asteroids.forEach(asteroid => {
        asteroid.update();
        asteroid.draw();
    });

    handleCollisions();

    requestAnimationFrame(gameLoop);
}

gameLoop();