const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const shootSound = document.getElementById("shoot-sound");

let score = 0;
let target;
let isBoss = false;

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

function moveTarget(element) {
    let moveInterval = setInterval(() => {
        let newX = parseInt(element.style.left) + (Math.random() * 200 - 100);
        let newY = parseInt(element.style.top) + (Math.random() * 200 - 100);
        
        // 화면 경계를 벗어나지 않도록 제한
        newX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newX));
        newY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newY));
        
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
    }, 1000);
    
    element.dataset.moveInterval = moveInterval;
}

gameContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("target")) {
        shootSound.currentTime = 0;
        shootSound.play();
        
        clearInterval(event.target.dataset.moveInterval);
        event.target.remove();
        
        score++;
        scoreDisplay.textContent = score;
        
        if (score >= 10 && !isBoss) {
            isBoss = true;
            spawnTarget(true);
        } else if (!isBoss) {
            spawnTarget();
        } else {
            alert("게임 클리어!");
        }
    }
});

spawnTarget();
