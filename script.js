const items = [
  "./assets/facemask.png",
  "./assets/laptopcover.png",
  "./assets/stickers.png",
  "./assets/totebag.png",
  "./assets/travelpillow.png",
  "./assets/tshirt.png",
  "./assets/waterbottle.png",
];

const doors = document.querySelectorAll(".door"),
  trigger = document.querySelector(".slot-trigger");

trigger.addEventListener("click", spin);

function init(firstInit = true, groups = 1, duration = 1) {
  const itemsUsed = []; // stores items shown on the doors

  for (const door of doors) {
    if (firstInit) {
      door.dataset.spinned = "0"; // firstInit: all doors are unspinned
    } else if (door.dataset.spinned === "1") {
      console.log("spinned"); // the door has been spinned already
      return;
    }

    const boxes = door.querySelector(".boxes");
    const boxesClone = boxes.cloneNode(false);
    const pool = ["./assets/questionmark.png"];

    if (!firstInit) {
      let arr = []; // array of items to be spinned

      for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
        // we filter out the items already picked
        arr = items.filter((x) => {
          return !itemsUsed.includes(x);
        });
      }

      pool.push(...shuffle(arr));
      itemsUsed.push(pool[pool.length - 1]);

      /* -- Spinning Transition Code -- */
      boxesClone.addEventListener(
        "transitionstart",
        function () {
          door.dataset.spinned = "1";
          this.querySelectorAll(".box").forEach((box) => {
            box.style.filter = "blur(1px)";
          });
        },
        { once: true }
      );

      boxesClone.addEventListener(
        "transitionend",
        function () {
          this.querySelectorAll(".box").forEach((box, index) => {
            box.style.filter = "blur(0)";
            if (index > 0) this.removeChild(box);
          });
        },
        { once: true }
      );
    }

    /* Populating boxesClone with divs containing item images */
    for (let i = pool.length - 1; i >= 0; i--) {
      const box = document.createElement("div");
      box.classList.add("box");
      box.style.width = door.clientWidth + "px";
      box.style.height = door.clientHeight + "px";
      box.innerHTML = `<img src=${pool[i]}>`;
      boxesClone.appendChild(box);
    }

    /* boxesClone CSS for transition: last box is displayed */
    boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
    boxesClone.style.transform = `translateY(-${
      door.clientHeight * (pool.length - 1)
    }px)`;

    door.replaceChild(boxesClone, boxes);
  }

  if (!firstInit) {
    animateTrigger();
  }
}

async function spin() {
  init(false, 1, 2);

  for (const door of doors) {
    const boxes = door.querySelector(".boxes");
    const duration = parseInt(boxes.style.transitionDuration);
    boxes.style.transform = "translateY(0)";
    await new Promise((resolve) => setTimeout(resolve, duration * 100));
  }
}

function shuffle([...arr]) {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
}

/* Animation Function: https://developer.mozilla.org/en-US/docs/Web/API/Element/animate */
function animateTrigger() {
  const arm = document.querySelector(".slot-trigger .arm"),
    knob = document.querySelector(".slot-trigger .knob"),
    armShadow = document.querySelector(".slot-trigger .arm-shadow");

  console.log("animate");
  arm.animate([
    { transform: "none" },
    { transform: "translateY(48px) scaleY(0.1)" },
  ]);
  // knob.animate({ transform: translateY(-40px) scaleY(8); });
  // armShadow.animate({ top: "40px" }, 380);
}

init();
