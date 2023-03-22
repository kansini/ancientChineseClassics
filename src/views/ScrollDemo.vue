<script setup>
import {onMounted, ref} from 'vue';
import gsap from 'gsap';
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
onMounted(() => {
  let sections = gsap.utils.toArray(".panel");

  let scrollTween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none", // <-- IMPORTANT!
    scrollTrigger: {
      trigger: ".container",
      pin: true,
      scrub: 0.1,
      //snap: directionalSnap(1 / (sections.length - 1)),
      end: "+=2000"
    }
  });

  gsap.set(".box-1, .box-2", {y: 100});
  ScrollTrigger.defaults({markers: false});

// red section
  gsap.to(".box-1", {
    y: -130,
    duration: 2,
    ease: "elastic",
    scrollTrigger: {
      trigger: ".box-1",
      containerAnimation: scrollTween,
      start: "left center",
      toggleActions: "play none none reset",
      id: "1",
    }
  });


// gray section
  gsap.to(".box-2", {
    y: -120,
    backgroundColor: "#1e90ff",
    ease: "none",
    scrollTrigger: {
      trigger: ".box-2",
      containerAnimation: scrollTween,
      start: "center 80%",
      end: "center 20%",
      scrub: true,
      id: "2"
    }
  });

// purple section
  ScrollTrigger.create({
    trigger: ".box-3",
    containerAnimation: scrollTween,
    toggleClass: "active",
    start: "center 60%",
    id: "3"
  });

// green section
  ScrollTrigger.create({
    trigger: ".green",
    containerAnimation: scrollTween,
    start: "center 65%",
    end: "center 51%",
    onEnter: () => console.log("enter"),
    onLeave: () => console.log("leave"),
    onEnterBack: () => console.log("enterBack"),
    onLeaveBack: () => console.log("leaveBack"),
    onToggle: self => console.log("active", self.isActive),
    id: "4"
  });

// only show the relevant section's markers at any given time
  gsap.set(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end", {autoAlpha: 0});
  ["red", "gray", "purple", "green"].forEach((triggerClass, i) => {
    ScrollTrigger.create({
      trigger: "." + triggerClass,
      containerAnimation: scrollTween,
      start: "left 30%",
      end: i === 3 ? "right right" : "right 30%",
      markers: false,
      onToggle: self => gsap.to(".marker-" + (i + 1), {duration: 0.25, autoAlpha: self.isActive ? 1 : 0})
    });
  });
});


</script>
<template>
  <div class="description" style="height: 100vh;">
    <h1>description</h1>
    <!--    <cover />-->
  </div>

  <div class="container">

    <div class="panel blue">
      Scroll down to animate horizontally &gt;
    </div>

    <section class="panel red">
      <div>
    <pre class="code-block prettyprint lang-js linenums">gsap.to(".box-1", {
  y: -130,
  duration: 2,
  ease: "elastic",
  scrollTrigger: {
    trigger: ".box-1",
    containerAnimation: scrollTween,
    start: "left center",
    toggleActions: "play none none reset"
  }
});</pre>
        Fire an animation at a particular spot...
      </div>
      <div class="box-1 box">box-1</div>
    </section>

    <section class="panel gray">
      <div>
    <pre class="code-block prettyprint lang-js linenums">gsap.to(".box-2", {
  y: -120,
  backgroundColor: "#1e90ff",
  ease: "none",
  scrollTrigger: {
    trigger: ".box-2",
    containerAnimation: scrollTween,
    start: "center 80%",
    end: "center 20%",
    scrub: true
  }
});</pre>
        ...or scrub it back &amp; forth with the scrollbar
      </div>
      <div class="box-2 box">box-2</div>
    </section>
    <section class="panel purple">
      <div>
    <pre class="code-block prettyprint lang-js linenums">ScrollTrigger.create({
  trigger: ".box-3",
  containerAnimation: scrollTween,
  toggleClass: "active",
  start: "center 60%"
});</pre>
        Toggle a CSS class
      </div>
      <div class="box-3 box">box-3</div>
    </section>
    <section class="panel green">
      <div>
    <pre class="code-block prettyprint lang-js linenums">ScrollTrigger.create({
  trigger: ".green",
  containerAnimation: scrollTween,
  start: "center 65%",
  end: "center 51%",
  onEnter: () => console.log("enter"),
  onLeave: () => console.log("leave"),
  onEnterBack: () => console.log("enterBack"),
  onLeaveBack: () => console.log("leaveBack"),
  onToggle: self => console.log("active", self.isActive)
});</pre>
        Use the rich callback system
      </div>
    </section>
  </div>
</template>
<style lang="scss">
body {
  background: url(../assets/img/main_bg.jpg) center;
  background-size: cover;
}

h1, h2 {
  color: white;
  font-weight: 400;
  margin-bottom: 0;
}

.panel pre.prettyprint {
  font-size: 20px;
  text-align: left;
  width: auto;
  font-weight: normal;
  margin: 10px;
  border: none;
}

.prettyprint .linenums {
  padding: 0;
  list-style: none;
}

.prettyprint ol li {
  background-color: black;
}

.panel.red .prettyprint .linenums > li:nth-child(n+7):nth-child(-n+9),
.panel.gray .prettyprint .linenums > li:nth-child(10),
.panel.purple .prettyprint .linenums > li:nth-child(4),
.panel.green .prettyprint .linenums > li:nth-child(n+6):nth-child(-n+10) {
  background-color: #222;
}

.box {
  width: 100px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  background-color: white;
  border-radius: 8px;
  color: #222;
  font-weight: 700;
  margin-left: 20px;
  will-change: transform;
}

.box.active {
  background-color: orange;
  border: 2px solid white;
}

.description, .final {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  min-height: 80vh;
}

.container {
  width: 500%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
}

.panel {
  font-weight: 300;
}
</style>