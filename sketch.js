const colorModes = { 
  colorModeRandom: 1,
  colorModeNoise: 2
}

let particles = []
let t = 0
let targets = []
let currentTarget

const opts = {
  Width: 1920,
  Height: 1080,

  // particles
  Particles: 50,
  Min_Mass: 1,
  Max_Mass: 5,
  
  //targets
  Targets: 100,
  RadiusRangeMin: 50,
  RadiusRangeMax: 250,
  
  //Drawing options
  Redraw_Background: false,
  Speed: 10,
  Symmetry_Number: 12,
  Miror: true,
  ColorMode: 1,
  Alpha: .2,
  Chances_Shift: 5,

  Generate: () => randomize(),
  Save: () => save(),
};

window.onload = function() {
  var gui = new dat.GUI();
  var img = gui.addFolder('Image Settings');
  img.add(opts, 'Width', 200, 1400)
  img.add(opts, 'Height', 200, 1400)
  
  let col = gui.addFolder('Particles Settings (needs to regenerate)')
  col.add(opts, 'Particles', 1, 300)
  col.add(opts, 'Min_Mass', 1, 10).step(1)
  col.add(opts, 'Max_Mass', 1, 10).step(1)
  col.open();
  
  col = gui.addFolder('Target Settings (needs to regenerate)')
  col.add(opts, 'Targets', 1, 300)
  col.add(opts, 'RadiusRangeMin', 1, 500)
  col.add(opts, 'RadiusRangeMax', 1, 500)
  col.open();
  
  col = gui.addFolder('Drawing options')
  col.add(opts, 'Redraw_Background')
  col.add(opts, 'Speed', 1, 30)
  col.add(opts, 'Symmetry_Number', 1, 24)
  col.add(opts, 'Miror')
  col.add(opts, 'ColorMode', colorModes)
  col.add(opts, 'Alpha', 0.05, 1).step(.05)
  col.add(opts, 'Chances_Shift', 0, 100).step(.1)
  col.open();
  
  gui.add(opts, 'Generate');
  gui.add(opts, 'Save');
  gui.close()
};

function setup() {
  createCanvas(1900, 1080)
  background(0)
  colorMode(HSB)
  for (let i = 0; i < opts.Particles; i++) {
    const minMass = min(opts.Min_Mass, opts.Max_Mass)
    const maxMass = max(opts.Min_Mass, opts.Max_Mass)
    particles.push(new Particle(random(minMass,maxMass), random(width), random(height)))
  }

  for (let i = 0; i < opts.Targets; i++) {
    const minR = min(opts.RadiusRangeMin, opts.RadiusRangeMax)
    const maxR = max(opts.RadiusRangeMin, opts.RadiusRangeMax)
    const r = random(minR, maxR)
    const x = cos(i * (TWO_PI / opts.Targets)) * r + width/2
    const y = sin(i * (TWO_PI / opts.Targets)) * r + height/2
    noStroke()
    const c = color(random(360), random(80,100), 80)
    c.setAlpha(opts.Alpha)
    fill(c)
    targets.push({
      color: c,
      pos:createVector(x, y)
    })
  }

  currentTarget = targets[int(random(targets.length))]
}

function draw() {
  if(opts.Redraw_Background)
    background(0)
  for (let i = 0; i < opts.Speed; i++) {
    wagadoo() 
  }
}

function wagadoo() {
  if(random() < (opts.Chances_Shift/100)) {
    currentTarget = targets[int(random(targets.length))]
  }
  
  let c
  if(opts.ColorMode == colorModes.colorModeNoise)
    c = color(noise(t) * 360, 70, 70, opts.Alpha)

  for (let i = 0; i < particles.length; i++) {
    particles[i].target(currentTarget.pos)
    particles[i].update()

    for(let j = 0; j < opts.Symmetry_Number; j++) {
      push()
        translate(width/2, height/2)
        rotate((TWO_PI / opts.Symmetry_Number) * j)
        if(opts.Miror && j%2 == 0) scale(1,-1)
        particles[i].pos = createVector(particles[i].pos.x - width/2, particles[i].pos.y - height/2)
        currentTarget.color.setAlpha(opts.Alpha)

        if(opts.ColorMode == colorModes.colorModeRandom)
          particles[i].display(currentTarget.color)
        else if(opts.ColorMode == colorModes.colorModeNoise)
          particles[i].display(c)
        
        particles[i].pos = createVector(particles[i].pos.x + width/2, particles[i].pos.y + height/2)
      pop()
    }
  }
  t += .1
}

function randomize() {
  particles = []
  targets = []
  setup()
}

function keyPressed(key) {
  if(key.keyCode === 80)
    save()
  if(key.keyCode === 81)
    randomize()
}
