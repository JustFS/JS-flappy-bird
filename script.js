const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();

// general settings
const gravity = .5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);
let gamePlaying = false;

// pipe settings
const pipeWidth = 78;
const pipeGap = 260;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipe;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set basic flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2)

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()])
}

const render = () => {
  // faire avancer le jeu
  index++;

  // mise en place du canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // background Première partie 
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // background deuxième partie
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // mise en place des pipes
  if (gamePlaying){
    pipes.map(pipe => {
      // pipes se rapprochent
      pipe[0] -= speed;

      // pipe du haut
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // pipe du bas
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // quand on passe le pipe prend un point
      if(pipe[0] <= -pipeWidth){
        currentScore++;
        // si jamais on bat le meilleur score
        bestScore = Math.max(bestScore, currentScore);
        
        // retirer le pipe quand il est passé
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
      }
    
      // if hit the pipe, end
      if ([pipe[0] <= cTenth + size[0], pipe[0] + pipeWidth >= cTenth, pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]].every(c => c)) {
        gamePlaying = false;
        setup();
      }
    })
  }
  // draw bird
  if (gamePlaying) {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
      // text accueil
    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText('Cliquez pour jouer', 48, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Meilleur : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Actuel : ${currentScore}`;

  // demander au navigateur de relancer l'animation avant la fin de celle-ci (donne l'impresison de fluidité)
  window.requestAnimationFrame(render);
}

// launch setup
setup();
img.onload = render;
img.src = './media/flappy-bird-set.png';

//start game
document.addEventListener('click', () => {
  gamePlaying = true;  
})
window.onclick = () => flight = jump;