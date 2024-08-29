function locomotiveAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
}
locomotiveAnimation();

var tl = gsap.timeline();
tl.from(".line h1", {
  y: 150,
  stagger: 0.2,
  duration: 0.5,
  delay: 0.5,
});
tl.from("#line1-part1", {
  opacity: 0,
  onStart: () => {
    var counter = 0;
    var int = setInterval(() => {
      if (counter == 99) {
        clearInterval(int);
      }
      counter++;
      var cnt = document.querySelector("#line1-part1 h3:nth-child(1)");
      cnt.textContent = counter;
    }, 45);
  },
});
tl.to(".line h2", {
  animationName: "blink",
  opacity: 1,
});
tl.to("#loader", {
  opacity: 0,
  delay: 5,
  duration: 0.4,
});
tl.from("#page1", {
  y: 1200,
  opacity: 0,
  ease: Power4,
});
tl.to("#loader", {
  display: "none",
});

tl.from("#nav", {
  opacity: 0,
  duration: 1,
});
tl.from("#zero", {
  opacity: 0,
  duration: 1,
});
tl.from("#hero1 h1, #hero2 h1, #hero3 h2, #hero3 h3, #hero4 h1", {
  y: 140,
  duration: 2,
  stagger: 0.2,
});
tl.from(
  "#hero1, #page2",
  {
    opacity: 0,
  },
  "-=1"
);

// tl.from("#page3 .underline", {
//   width: "0",
//   backgroundColor: "red",
//   transformOrigin: "right",
//   scrollTrigger: {
//     trigger: "#page3 .underline",
//     scroller: "#main",
//     markers: true, // Useful for debugging
//     start: "top 90%",
//     end: "top 80%",
//     scrub: 3, // Adjust as needed
//   },
// });
function cursorAnimation() {
  Shery.mouseFollower({
    // skew: true,
    // ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    // duration: 1,
    // debug: true,
  });
  // document.addEventListener("mousemove", (event) => {
  //   gsap.to("#cursor", {
  //     left: event.x - 5,
  //     top: event.y - 5,
  //   });

  // Call the magnet function
  Shery.makeMagnet("#nav-part2 h4:nth-child(1)");
  Shery.makeMagnet("#nav-part2 h4:nth-child(2)");
  Shery.makeMagnet("#nav-part2 h4:nth-child(3)");
  Shery.makeMagnet(".menu-opener__square");
  var videoContainer = document.querySelector("#video-container");
  var video = document.querySelector("#video-container video");
  var videoImg = document.querySelector("#video-container img");
  var videoCursor = document.querySelector("#video-cursor");

  videoContainer.addEventListener("mouseenter", () => {
    videoContainer.addEventListener("mousemove", (dets) => {
      gsap.to(".mousefollower", {
        opacity: 0,
      });
      gsap.to("#video-cursor ", {
        left: dets.x - 570,
        top: dets.y - 300,
      });
    });
  });

  videoContainer.addEventListener("mouseleave", () => {
    gsap.to(".mousefollower", {
      opacity: 1,
    });
    gsap.to("#video-cursor ", {
      left: "70%",
      top: "-10%",
    });
  });

  videoContainer.addEventListener("click", () => {
    if (video.paused) {
      video.style.opacity = "1";
      videoImg.style.opacity = "0";
      video.play();
      videoCursor.innerHTML = `<i class="ri-pause-fill"></i>`;
      gsap.to("#video-cursor", {
        scale: 0.5,
      });
    } else {
      video.style.opacity = "0";
      video.pause();
      videoImg.style.opacity = "1";
      gsap.to("#video-cursor", {
        scale: 1,
      });
      videoCursor.innerHTML = `<i class="ri-play-fill"></i>`;
    }
  });
}

function makeMagnet(selector, cursorX, cursorY, radius) {
  const element = document.querySelector(selector);
  const { left, top, width, height } = element.getBoundingClientRect();
  const elementX = left + width / 2;
  const elementY = top + height / 2;

  // Calculate distance between cursor and element
  const distance = Math.sqrt(
    Math.pow(cursorX - elementX, 2) + Math.pow(cursorY - elementY, 2)
  );

  if (distance < radius) {
    // Calculate the direction vector and scale it to the distance
    const ratio = (radius - distance) / radius;
    const dx = cursorX - elementX;
    const dy = 120 - elementY;
    const moveX = dx * ratio;
    const moveY = dy * ratio;

    gsap.to(element, {
      x: moveX,
      y: moveY,
      duration: 0.2,
      ease: "power3.out",
    });

    gsap.to("#cursor", {
      scale: 1.5, // Scale up when hovering
      // duration: 0.2,
      // ease: "power3.out",
      // clearProps: "transform",
    });
  } else {
    // Reset to original position if outside the radius
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.2,
      ease: "power3.out",
    });

    gsap.to("#cursor", {
      scale: 1, // Default scale
    });
  }
}
cursorAnimation();

function sheryAmimations() {
  // Shery.imageEffect("#video-container .image-div", {
  //   style: 5,
  //   debug: true,
  // });
  Shery.imageEffect(".image-div", {
    style: 5,
    config: {
      a: { value: 2, range: [0, 30] },
      b: { value: 0.75, range: [-1, 1] },
      zindex: { value: -9996999, range: [-9999999, 9999999] },
      aspect: { value: 0.6666666859330038 },
      ignoreShapeAspect: { value: true },
      shapePosition: { value: { x: 0, y: 0 } },
      shapeScale: { value: { x: 0.5, y: 0.5 } },
      shapeEdgeSoftness: { value: 0, range: [0, 0.5] },
      shapeRadius: { value: 0, range: [0, 2] },
      currentScroll: { value: 0 },
      scrollLerp: { value: 0.07 },
      gooey: { value: true },
      infiniteGooey: { value: false },
      growSize: { value: 4, range: [1, 15] },
      durationOut: { value: 1, range: [0.1, 5] },
      durationIn: { value: 1.5, range: [0.1, 5] },
      displaceAmount: { value: 0.5 },
      masker: { value: true },
      maskVal: { value: 1.3, range: [1, 5] },
      scrollType: { value: 0 },
      geoVertex: { range: [1, 64], value: 1 },
      noEffectGooey: { value: true },
      onMouse: { value: 0 },
      noise_speed: { value: 0.66, range: [0, 10] },
      metaball: { value: 0.43, range: [0, 2] },
      discard_threshold: { value: 0.5, range: [0, 1] },
      antialias_threshold: { value: 0, range: [0, 0.1] },
      noise_height: { value: 0.43, range: [0, 2] },
      noise_scale: { value: 7.44, range: [0, 100] },
    },
    // debug: true,
    gooey: true,
  });
}

sheryAmimations();

document.addEventListener("mousemove", (dets) => {
  gsap.to("#flag", {
    x: dets.x,
    y: dets.y,
  });
});

document.querySelector("#hero3").addEventListener("mouseenter", () => {
  gsap.to("#flag", {
    opacity: 1,
  });
});

document.querySelector("#hero3").addEventListener("mouseleave", () => {
  gsap.to("#flag", {
    opacity: 0,
  });
});
function footerAnimation() {
  var clutter = "";
  var clutter2 = "";
  document
    .querySelector("#footer h1")
    .textContent.split("")
    .forEach(function (elem) {
      clutter += `<span>${elem}</span>`;
    });
  document.querySelector("#footer h1").innerHTML = clutter;
  document
    .querySelector("#footer h2")
    .textContent.split("")
    .forEach(function (elem) {
      clutter2 += `<span>${elem}</span>`;
    });
  document.querySelector("#footer h2").innerHTML = clutter2;

  document
    .querySelector("#footer-text")
    .addEventListener("mouseenter", function () {
      gsap.to("#footer h1 span", {
        opacity: 0,
        stagger: 0.05,
      });

      gsap.to("#footer h2 span", {
        delay: 0.35,
        opacity: 1,
        stagger: 0.1,
      });
      gsap.to("#footer svg", {
        x: 50,
      });
    });
  document
    .querySelector("#footer-text")
    .addEventListener("mouseleave", function () {
      gsap.to("#footer h1 span", {
        opacity: 1,
        stagger: 0.1,
        delay: 0.35,
      });

      gsap.to("#footer h2 span", {
        opacity: 0,
        stagger: 0.05,
      });
      gsap.to("#footer svg", {
        x: "initial",
        delay: 0.35,
      });
    });
}

footerAnimation();
