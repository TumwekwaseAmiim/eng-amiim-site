// ⚡ Background Music (Autoplay 2 Songs with Mute/Unmute)
const songs = ["bring_me.mp3", "hall_of_fame.mp3"];
let currentSongIndex = 0;
let bgAudio = new Audio(songs[currentSongIndex]);
let isMuted = false;

function rotateSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  bgAudio.src = songs[currentSongIndex];
  if (!isMuted) bgAudio.play().catch(() => {});
}
bgAudio.addEventListener("ended", rotateSong);

// Autoplay after interaction
window.addEventListener("click", () => {
  if (!isMuted && bgAudio.paused) {
    bgAudio.play().catch(() => {});
  }
}, { once: true });

function toggleAudio() {
  isMuted = !isMuted;
  const btn = document.getElementById("muteButton");
  if (isMuted) {
    bgAudio.pause();
    btn.innerText = "🔈 Unmute";
  } else {
    bgAudio.play().catch(() => {});
    btn.innerText = "🔊 Mute";
  }
}

// 🎖️ Frank Photo Click Sound + Goal Celebration
const frankPhoto = document.getElementById("frank-photo");
const frankAudio = document.getElementById("frank-audio");
const goalAudio = document.getElementById("goal-audio");

if (frankPhoto && frankAudio && goalAudio) {
  frankPhoto.classList.add("frank-pulse");
  frankPhoto.title = "Tap Hon. Frank Tumwebaze to celebrate 🇺🇬";

  frankPhoto.addEventListener("click", () => {
    bgAudio.pause();
    bgAudio.removeEventListener("ended", rotateSong);

    frankAudio.currentTime = 0;
    goalAudio.currentTime = 0;
    frankAudio.play().catch(() => {});
    goalAudio.play().catch(() => {});

    if (!document.querySelector(".frank-thankyou")) {
      const thankYou = document.createElement("div");
      thankYou.className = "frank-thankyou";
      thankYou.innerHTML = `
        <p style="color:#00ffcc; font-weight:bold; font-size:1.1rem; margin-top:10px;">
          🙏 Thanks for loving and supporting your leader.<br>
          Hon. Frank Tumwebaze represents unity, vision, and action for Kibale East!
        </p>
      `;
      document.querySelector(".frank-section")?.appendChild(thankYou);
    }

    frankAudio.onended = () => {
      if (!isMuted) {
        bgAudio.play().catch(() => {});
        bgAudio.addEventListener("ended", rotateSong);
      }
    };
  });
}

// 🎈 Balloon Pop Game
let score = parseInt(localStorage.getItem("score")) || 0;
let popped = 0;
const totalBalloons = 6;
let gameCompleted = localStorage.getItem("balloonGameCompleted") === "true";

if (gameCompleted) {
  document.querySelector(".balloon-row").innerHTML = `
    <p style="color: #00ffcc; font-weight: bold;">🎯 You already completed this game. Well done!</p>
  `;
  document.getElementById("scoreDisplay").innerText = `🎯 Score: ${localStorage.getItem("score") || 6}`;
}

function explodeBalloon(el) {
  if (!el || el.classList.contains("popped") || gameCompleted) return;

  el.classList.add("popped");
  const popSound = new Audio("pop.mp3");
  popSound.play().catch(() => {});

  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.innerText = "💥 ENG. AMIIM 💥";
  const burstArea = document.getElementById("burstLetters");
  burstArea?.appendChild(explosion);
  setTimeout(() => explosion.remove(), 1000);

  score++;
  popped++;
  document.getElementById("scoreDisplay").innerText = `🎯 Score: ${score}`;
  localStorage.setItem("score", score);

  if (popped === totalBalloons) {
    localStorage.setItem("balloonGameCompleted", "true");
    const balloonRow = document.querySelector(".balloon-row");

    const congrats = document.createElement("div");
    congrats.className = "thanks-msg";
    congrats.innerText = "🎉 Congratulations! You popped all balloons!";
    balloonRow.appendChild(congrats);

    const cheer = new Audio("goal_celebrations.mp3");
    cheer.play().catch(() => {});

    const quiz = document.createElement("div");
    quiz.innerHTML = `
      <h3>👑 Be a Winner!</h3>
      <p>Select our development hero to win:</p>
      <img src="frank_photo.jpg" alt="Hon. Frank Tumwebaze" onclick="winnerSelected()" style="width:300px;border:3px solid #00ffcc;border-radius:10px;cursor:pointer;box-shadow:0 0 15px #00ffaa;">
    `;
    balloonRow.appendChild(quiz);
  }
}

function winnerSelected() {
  const msg = document.createElement("div");
  msg.className = "thanks-msg";
  msg.innerHTML = "✅ Well done! You selected our true development hero. Hon. Frank is the pride of Kibale East! <br>#FrankMyMP #FrankMyChoice";
  document.querySelector(".balloon-row").appendChild(msg);

  const frankSong = new Audio("frank_song.mp3");
  frankSong.play().catch(() => {});
}

// ⚽ Arsenal vs Man Utd Mini Game
function startGame() {
  const userTeam = document.getElementById("teamSelect").value;
  const opp = userTeam === "Arsenal" ? "Manchester United" : "Arsenal";
  const userGoals = Math.floor(Math.random() * 5);
  const oppGoals = Math.floor(Math.random() * 5);
  const result = userGoals > oppGoals ? "🎉 You Win!" : userGoals < oppGoals ? "😢 You Lost!" : "⚖️ It's a draw!";
  const sound = new Audio("goal.mp3");
  sound.play().catch(() => {});

  let teamImage = userTeam === "Arsenal"
    ? '<img src="arsenal.jpg" class="fade-in-img" alt="Arsenal Team">'
    : '<img src="manutd.jpg" class="fade-in-img" alt="Manchester United Team">';

  document.getElementById("gameCanvas").innerHTML = `
    <p><strong>${userTeam}</strong>: ${userGoals} – <strong>${opp}</strong>: ${oppGoals}</p>
    <p>${result}</p>
    ${teamImage}
  `;

  const resetBtn = document.createElement("button");
  resetBtn.innerText = "🔄 Reset Canvas Game";
  resetBtn.onclick = resetGame;
  document.getElementById("gameCanvas").appendChild(resetBtn);
}

// 📤 Share Function
function shareSite() {
  const url = "https://tumwekwaseamiim.github.io/eng-amiim-site/";
  const encodedUrl = encodeURIComponent(url);
  const shareButtons = `
    <div style="margin-top: 10px">
      <a href="https://wa.me/?text=${encodedUrl}" target="_blank">📱 WhatsApp</a>
      <a href="https://twitter.com/intent/tweet?url=${encodedUrl}" target="_blank">🐦 Twitter</a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank">📘 Facebook</a>
    </div>
  `;
  document.getElementById("gameCanvas").innerHTML += shareButtons;
}

// 🕹️ Canvas Game
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

  if (ball.x - ball.r < player.x + player.w && ball.y > player.y && ball.y < player.y + player.h) {
    ball.vx *= -1;
    new Audio("kick.mp3").play().catch(() => {});
  }

  if (ball.x + ball.r > ai.x && ball.y > ai.y && ball.y < ai.y + ai.h) ball.vx *= -1;

  if (ball.x < 0) { scoreCanvas.ai++; resetBall(); }
  else if (ball.x > canvas.width) { scoreCanvas.player++; resetBall(); }

  const scoreBoard = document.getElementById("scoreBoard");
  if (scoreBoard) scoreBoard.innerText = `You: ${scoreCanvas.player} | AI: ${scoreCanvas.ai}`;

  ai.y += (ball.y > ai.y + ai.h / 2 ? 2 : -2);
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
    new Audio("kick.mp3").play().catch(() => {});
  }
});

function resetGame() {
  scoreCanvas.player = 0;
  scoreCanvas.ai = 0;
  resetBall();
}

setTimeout(() => {
  if (canvas) draw();
}, 500);
