'use strict';

const startBtn       = document.querySelector(".startBtn");
const stopBtn        = document.querySelector(".stopBtn");

const time           = document.querySelector(".time");
const setTime        = 15; // 15초 (항상 둘이 같게)
let   cntDown        = 15; // 15초 (항상 둘이 같게)
let   timmer;

const count          = document.querySelector(".count");

const itemBox        = document.querySelector(".itemBox");
const itemArr        = ["bug", "carrot"];
const itemTotalCnt   = 10;
let   itemClickCnt   = 0;

const banner         = document.querySelector(".mainBanner");

const popup          = document.querySelector(".popup");
const popupReturnBtn = document.querySelector(".popup__returnBtn");
const popupTitle     = document.querySelector(".popup__title");

const mask           = document.querySelector(".mask");

const bodyWidth      = document.querySelector("body").getBoundingClientRect().width;
const maxXY          = [[1500, 330], [940, 200], [700, 100]];
let   maxX           = 0;
let   maxY           = 0;

const audioBg         = new Audio("sound/bg.mp3");
const audioBugPull    = new Audio("sound/bug_pull.mp3");
const audioCarrotPull = new Audio("sound/carrot_pull.mp3");
const audioGameWin    = new Audio("sound/game_win.mp3");


/** 
  ---------------------------
 | 브라우저 load 시 함수 호출 |
 ----------------------------
 */
newCoordinates(bodyWidth);
itemsCoordinatesSet();

count.innerHTML = itemTotalCnt;
time.innerHTML = `00:${setTime}`;

/**
 ******************************************
 click_Event : 시작 버튼 클릭
 ******************************************
 */
startBtn.addEventListener("click", () => {
    startBtn.style.display = "none"; /* 처음 시작할 때만 보여지고, 누른 뒤에는 계속 none */
    stopBtn.style.display  = "block";
    itemBox.style.display  = "block";
    banner.style.display   = "none";
    startTimmer();
});

/**
 ******************************************
 click_Event : 중지 버튼 클릭
 ******************************************
 */
stopBtn.addEventListener("click", () => {
    stopBtn.style.visibility = "hidden";
    popup.style.display      = "block";
    popupTitle.innerHTML     = "Replay?";
    mask.style.display       = "block";
    stopTimmer();
});

/**
 ******************************************
 click_Event : (벌레, 당근) 아이템 클릭
 ******************************************
 */
itemBox.addEventListener("click", (event) => {
    let item = event.target.attributes.alt;
    if(item) {
        if(item.value == itemArr[1]) {
            audioCarrotPull.play();
            event.target.remove();
            itemClickCnt += 1;
            count.innerHTML = itemTotalCnt - itemClickCnt;
        }
        else if(item.value == itemArr[0]) {
            audioBugPull.play();
            mask.style.display   = "block";
            popup.style.display  = "block";
            popupTitle.innerHTML = "Replay?";
            itemClickCnt         = 0;
            stopTimmer();
        }
    }
    else {
        return;
    }

    if(itemClickCnt === itemTotalCnt) {
        mask.style.display   = "block";
        popup.style.display  = "block";
        popupTitle.innerHTML = "YOU WON~!!";
        itemClickCnt         = 0;
        audioGameWin.play();
        stopTimmer();
    }
});

/**
 ******************************************
 click_Event : 팝업 재시작 버튼 클릭
 ******************************************
 */
popupReturnBtn.addEventListener("click", () => {
    itemsRemove();
    stopBtn.style.visibility = "visible";
    popup.style.display      = "none";
    mask.style.display       = "none";
    popupTitle.innerHTML     = "";
    count.innerHTML          = itemTotalCnt;
    time.innerHTML           = `00:${setTime}`;
    itemClickCnt             = 0;
    itemsCoordinatesSet();
    startTimmer();
});

/** 
 ------------------------------------------
 f-1. 기기 화면 크기에 따른 난수좌표 MAX 지정
 ------------------------------------------
 */
function newCoordinates(width) {
    if(width > 1367) {
        maxX = maxXY[0][0];
        maxY = maxXY[0][1];
        return;
    } else if(width > 813) {
        maxX = maxXY[1][0];
        maxY = maxXY[1][1];
        return;
    } else {
        maxX = maxXY[2][0];
        maxY = maxXY[2][1];
        return;
    }
}

/** 
 ------------------------------------------
 f-2. (벌레, 당근) 태그 추가 및 좌표에 배치
 ------------------------------------------
 */
function itemsCoordinatesSet() {
    for(let i=0; i<itemTotalCnt; i++) {
        // 1. 벌레, 당근 생성
        const itemBug    = createItem("img", itemArr[0]);
        const itemCarrot = createItem("img", itemArr[1]);
        itemBox.appendChild(itemBug);
        itemBox.appendChild(itemCarrot);
    
        // 2. 벌레, 당근 임의의 좌표로 배치
        for(const item of itemArr) {
            const x = getRamdomInt(maxX, 0);
            const y = getRamdomInt(maxY, 0);
    
            if(item == itemArr[0]) {
                itemBug.style.transform = `translate(${x}px, ${y}px)`;
            }
            else if(item == itemArr[1]) {
                itemCarrot.style.transform = `translate(${x}px, ${y}px)`;
            }
        }
    }
}

/** 
 ------------------------------------------
 f-3. (벌레, 당근) 태그 및 속성 생성
 ------------------------------------------
*/
function createItem(tagName, itemName) {
    const item = document.createElement(tagName);
    item.setAttribute("class", "item");
    item.setAttribute("src", `img/${itemName}.png`);
    item.setAttribute("alt", itemName);
    return item;
}

/** 
 ------------------------------------------
 f-4. 난수 생성 (최대값 제외, 최소값 포함)
 ------------------------------------------
 */
function getRamdomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/** 
 ------------------------------------------
 f-5. (벌레, 당근) 아이템 모두 지우기
 ------------------------------------------
 */
function itemsRemove() {
    while(itemBox.lastElementChild) {
        const lastItem = itemBox.lastElementChild;
        lastItem.remove();
    }
}

/** 
 ------------------------------------------
 f-6. 타이머 시작
 ------------------------------------------
 */
function startTimmer() {
    audioBg.play();
    timmer = window.setInterval(() => {
        cntDown -= 1;
        if(cntDown >= 10) {
            time.innerHTML = `00:${cntDown}`;
        }
        else {
            time.innerHTML = `00:0${cntDown}`;
        }

        if(cntDown == 0) {
            mask.style.display   = "block";
            popup.style.display  = "block";
            popupTitle.innerHTML = "Replay?";
            itemClickCnt         = 0;
            stopTimmer();
        }
    }, 1000);
}

/** 
 ------------------------------------------
 f-7. 타이머 종료
 ------------------------------------------
 */
function stopTimmer() {
    clearInterval(timmer);
    cntDown = setTime;
    audioBg.pause();
}