// ⚡ Background Music (Autoplay 2 Songs with Mute/Unmute)
const songs = ["bring me.mp3", "hall of fame.mp3"];
let currentSongIndex = 0;
let bgAudio = new Audio(songs[currentSongIndex]);
let isMuted = false;

bgAudio.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  bgAudio.src = songs[currentSongIndex];
  if (!isMuted) bgAudio.play();
});
bgAudio.play();

function toggleAudio() {
  isMuted = !isMuted;
  if (isMuted) {
    bgAudio.pause();
    document.getElementById("muteButton")?.innerText = "🔈 Unmute";
  } else {
    bgAudio.play();
    document.getElementById("muteButton")?.innerText = "🔊 Mute";
  }
}

// 🎖️ Frank Photo Click Sound + Goal Celebration
const frankPhoto = document.getElementById("frank-photo");
const frankAudio = document.getElementById("frank-audio");
const goalAudio = document.getElementById("goal-audio");

if (frankPhoto && frankAudio && goalAudio) {
  frankPhoto.addEventListener("click", () => {
    // Stop other music
    bgAudio.pause();
    frankAudio.currentTime = 0;
    goalAudio.currentTime = 0;
    frankAudio.play();
    goalAudio.play();
  });
}

// 🎈 Balloon Pop Game with Sound + Score + Congrats
let score = parseInt(localStorage.getItem("score")) || 0;
let popped = 0;
const totalBalloons = 6;

function explodeBalloon(el) {
  if (el.classList.contains("popped")) return;
  el.classList.add("popped");

  const popSound = new Audio("pop.mp3");
  popSound.play();

  el.style.display = "none";

  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.innerText = "💥 ENG. AMIIM 💥";
  document.getElementById("burstLetters").appendChild(explosion);

  setTimeout(() => explosion.remove(), 1000);

  score++;
  popped++;
  document.getElementById("scoreDisplay").innerText = `🎯 Score: ${score}`;
  localStorage.setItem("score", score);

  if (popped === totalBalloons) {
    const congrats = document.createElement("div");
    congrats.className = "thanks-msg";
    congrats.innerText = "🎉 Congratulations! You popped all balloons!";
    document.querySelector(".balloon-row").appendChild(congrats);

    const cheer = new Audio("goal celebrations.mp3");
    cheer.play();

    const quiz = document.createElement("div");
    quiz.innerHTML = `
      <h3>👑 Be a Winner!</h3>
      <p>Select our development hero to win:</p>
      <img src="frank photo.jpg" alt="Hon. Frank" onclick="winnerSelected()" style="width:300px;border:3px solid #00ffcc;border-radius:10px;cursor:pointer;box-shadow:0 0 15px #00ffaa;">
    `;
    document.querySelector(".balloon-row").appendChild(quiz);
  }
}

function winnerSelected() {
  const msg = document.createElement("div");
  msg.className = "thanks-msg";
  msg.innerHTML = "✅ Well done! You selected our true development hero. Hon. Frank is the pride of Kibale East! <br>#FrankMyMP #FrankMyChoice";
  document.querySelector(".balloon-row").appendChild(msg);
  const frankSong = new Audio("frank song.mp3");
  frankSong.play();
}

// ⚽ Arsenal vs Man Utd Mini Game + Team Image
function startGame() {
  const userTeam = document.getElementById("teamSelect").value;
  const opp = userTeam === "Arsenal" ? "Manchester United" : "Arsenal";
  const userGoals = Math.floor(Math.random() * 5);
  const oppGoals = Math.floor(Math.random() * 5);

  const result =
    userGoals > oppGoals
      ? "🎉 You Win!"
      : userGoals < oppGoals
      ? "😢 You Lost!"
      : "⚖️ It's a draw!";

  const sound = new Audio("goal.mp3");
  sound.play();

  let teamImage = "";
  if (userTeam === "Arsenal") {
    teamImage = '<img src="arsenal.jpg" class="fade-in-img" alt="Arsenal Team">';
  } else {
    teamImage = '<img src="manutd.jpg" class="fade-in-img" alt="Man Utd Team">';
  }

  document.getElementById("gameCanvas").innerHTML = `
    <p><strong>${userTeam}</strong>: ${userGoals} – <strong>${opp}</strong>: ${oppGoals}</p>
    <p>${result}</p>
    ${teamImage}
  `;
}

// 📤 Share Button Function
function shareSite() {
  const shareText = `🎮 I just played Eng. Amiim’s Football Game! Try it: https://tumwekwaseamiim.github.io/eng-amiim-site/`;
  if (navigator.share) {
    navigator.share({ title: "Eng. Amiim Game", text: shareText });
  } else {
    alert("Share this link:\n" + shareText);
  }
}

// 🕹️ Canvas Football Game Logic
const canvas = document.getElementById("footballGame");
const ctx = canvas?.getContext("2d");
let player = { x: 50, y: 180, w: 20, h: 20 };
let ball = { x: 70, y: 190, r: 6, vx: 0, vy: 0 };
let ai = { x: 500, y: 180, w: 20, h: 20 };
let scoreCanvas = { player: 0, ai: 0 };

function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#ff00cc";
  ctx.fillRect(ai.x, ai.y, ai.w, ai.h);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y < 0 || ball.y > canvas.height) ball.vy *= -1;

  if (
    ball.x - ball.r < player.x + player.w &&
    ball.y > player.y &&
    ball.y < player.y + player.h
  ) {
    ball.vx *= -1;
    const kick = new Audio("kick.mp3");
    kick.play();
  }

  if (
    ball.x + ball.r > ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + ai.h
  ) {
    ball.vx *= -1;
  }

  if (ball.x < 0) {
    scoreCanvas.ai++;
    resetBall();
  } else if (ball.x > canvas.width) {
    scoreCanvas.player++;
    resetBall();
  }

  const scoreBoard = document.getElementById("scoreBoard");
  if (scoreBoard) scoreBoard.innerText = `You: ${scoreCanvas.player} | AI: ${scoreCanvas.ai}`;

  if (ball.y > ai.y + ai.h / 2) ai.y += 2;
  else ai.y -= 2;

  requestAnimationFrame(draw);
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 0;
  ball.vy = 0;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.y -= 10;
  if (e.key === "ArrowDown") player.y += 10;
  if (e.key === " ") {
    ball.vx = 4;
    ball.vy = Math.random() > 0.5 ? 2 : -2;
    const kick = new Audio("kick.mp3");
    kick.play();
  }
});

setTimeout(() => {
  if (canvas) draw();
}, 500);

function resetGame() {
  scoreCanvas.player = 0;
  scoreCanvas.ai = 0;
  resetBall();
}
