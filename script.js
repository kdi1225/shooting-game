const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const shootSound = document.getElementById("shoot-sound");
const clearScreen = document.getElementById("clear-screen");
const restartButton = document.getElementById("restart-button");
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

let score = 0;
let target = null;
let isBoss = false;

// 배경 음악 설정 (초기 볼륨 설정)
bgMusic.volume = 0.2;

// 사용자가 클릭하면 배경 음악 재생 (자동 재생 차단 해결)
document.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(error => console.log("재생 오류:", error));
    }
}, { once: true }); // 한 번만 실행

// 음악 ON/OFF 버튼 기능 추가
musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = "🎵 음악 끄기";
    } else {
        bgMusic.pause();
        musicToggle.textContent = "🎵 음악 켜기";
    }
});

// 게임 재시작 버튼 기능
restartButton.addEventListener("click", () => {
    score = 0;
    isBoss = false;
    scoreDisplay.textContent = score;
    clearScreen.style.display = "none"; // 클리어 화면 숨김
    spawnTarget();
});

// 목표물 생성 함수
function spawnTarget(isBossTarget = false) {
    if (target) target.remove();
    target = document.createElement("div");
    target.classList.add("target");
    if (isBossTarget) target.classList.add("boss");

    let maxX = window.innerWidth - target.offsetWidth;
    let maxY = window.innerHeight - target.offsetHeight;

    let x = Math.random() * maxX;
    let y = Math.random() * maxY;

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    gameContainer.appendChild(target);
    moveTarget(target);
}

// 목표물 이동 함수 (보스는 4배 속도)
function moveTarget(element) {
    let speedMultiplier = element.classList.contains("boss") ? 4 : 2;

    function animateMovement() {
        let newX = parseInt(element.style.left) + (Math.random() * 400 - 200) * speedMultiplier;
        let newY = parseInt(element.style.top) + (Math.random() * 400 - 200) * speedMultiplier;

        newX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newX));
        newY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newY));

        element.style.transition = "left 0.3s ease-in-out, top 0.3s ease-in-out";
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;

        setTimeout(animateMovement, 1000 / speedMultiplier);
    }

    animateMovement();
}

// 게임 클리어 처리 함수
function gameClear() {
    clearScreen.style.display = "flex"; // 클리어 화면 표시
}

// 게임 클릭 이벤트 (목표물 제거 및 점수 증가)
gameContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("target")) {
        shootSound.currentTime = 0;
        shootSound.play();

        event.target.remove();

        score++;
        scoreDisplay.textContent = score;

        if (score >= 10 && !isBoss) {
            isBoss = true;
            spawnTarget(true);
        } else if (!isBoss) {
            spawnTarget();
        } else {
            gameClear();
        }
    }
});

// 초기 목표물 생성
spawnTarget();
