class Particle {
  constructor(mass = 10, x = random(width), y = random(height)) {
    this.pos = createVector(x, y)
    this.vel = createVector(0,0)
    this.acc = createVector(0,0)
    this.maxSpeed = 4
    this.mass = mass
    this.r = mass * 10
  }
  
  update() {
    this.vel.add(this.acc)
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel)
    this.acc.mult(0)
    this.edges()
  }

  applyForce(force) {
    const f = p5.Vector.div(force, this.mass)
    this.acc.add(f)
  }
  
  display(c = color(0, 0, 100, .3)) {
    noStroke()
    fill(c)
    circle(this.pos.x, this.pos.y, 1)
  }

  target(target) {
    let dir = p5.Vector.sub(target, this.pos);
    let d = dir.mag()
    dir.setMag(map(d, 0, 50, 0, 4, true))
    let steer = p5.Vector.sub(dir, this.vel)
    steer.limit(.1)
    this.applyForce(steer)
  }

  edges() {
    if(this.pos.x < 0){
      this.pos.x = width
    }
    if(this.pos.x > width)
    {
      this.pos.x = 0
    }
    if(this.pos.y < 0)
    {
      this.pos.y = height
    }
    if(this.pos.y > height)
    {
      this.pos.y = 0
    }
  }
}