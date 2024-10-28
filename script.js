//array, sliders, other variables

let balls = []

tSlider = document.getElementById("tempSlider")

var MM = 2.02;

document.getElementById('gasDropdown').addEventListener('change', function() {
    var selectedOption = this.options[this.selectedIndex];
    MM = selectedOption.value;
});

var T = tSlider.value

/* Velocity variable is declared here, follows the formula for the velocity of an ideal gas particle: 
sqrt(RT/MM).*/

let velocity = Math.sqrt(8.314 * T / MM)

// Declare class for Ball - Classes act as a sort of "blueprint"
class Ball {

    // Declaring basic variables for the particle, position, size
    constructor(x, y, size) {
        this.pos = createVector(x, y)
        this.size = size;
        this.speed = velocity
        this.vel = p5.Vector.random2D()
        this.vel.setMag(this.speed)
    }

    // Function to draw ball on the canvas
    show() {
        circle(this.pos.x, this.pos.y, this.size * 2);
    }

    // Checks if ball is intersecting another ball
    intersects(other) {
        var d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        return d < this.size + other.size;
    }

    // Update function for the "ball"
    update() {
        this.speed = velocity
        this.vel.setMag(this.speed / 3)
        this.pos.add(this.vel);

        if ((this.pos.x > width - this.size && this.vel.x > 0) || (this.pos.x < this.size && this.vel.x < 0)) {
            this.vel.x *= -1;
        }
        if ((this.pos.y > height - this.size && this.vel.y > 0) || (this.pos.y < this.size && this.vel.y < 0)) {
            this.vel.y *= -1;
        }
    }

    collide(other) {
        let normal = p5.Vector.sub(this.pos, other.pos);
        let dist = normal.mag();
        let minDist = this.size + other.size;

        if (dist < minDist) {
            let overlap = (minDist - dist) / 2;
            normal.setMag(overlap);
            this.pos.add(normal);
            other.pos.sub(normal);

            let relativeVelocity = p5.Vector.sub(this.vel, other.vel);
            let speed = relativeVelocity.dot(normal.normalize());

            if (speed < 0) {
                let impulse = normal.mult(speed);
                this.vel.sub(impulse);
                other.vel.add(impulse);
            }
        }
    }
}

function setup() {
    createCanvas(400, 400);
    for (let i = 0; i < 55; i++) {
        balls.push(new Ball(random(width), random(height), 3));
    }
}

function draw() {
    velocity = Math.sqrt(8.314 * T / MM)
    T = tSlider.value

    background(0);

    for (let i = 0; i < balls.length; i++) {
        balls[i].update();
        balls[i].show();
        for (let j = i + 1; j < balls.length; j++) {
            if (balls[i].intersects(balls[j])) {
                balls[i].collide(balls[j]);
            }
        }
    }

    let n = balls.length; // number of particles
    let V = 400 * 400; // volume of the container (assuming 2D)
    let P = (n * 8.314 * T) / V; // pressure calculation



    // Display pressure
    document.getElementById('pressureValue').innerText = P.toFixed(5);
    document.getElementById('temperatureValue').innerText = T
    document.getElementById('temperatureValueCelsius').innerText = (T-273.15).toFixed(2)
    document.getElementById('velocityValue').innerText = velocity.toFixed(2);
}
