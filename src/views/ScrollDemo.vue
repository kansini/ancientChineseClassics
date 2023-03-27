<script setup>
import {onMounted, ref} from 'vue';
import gsap from 'gsap';
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
onMounted(() => {
  const horizontalSections = gsap.utils.toArray('section.horizontal')

  horizontalSections.forEach(function (sec, i) {

    let thisPinWrap = sec.querySelector('.pin-wrap');
    let thisAnimWrap = thisPinWrap.querySelector('.animation-wrap');

    let getToValue = () => -(thisAnimWrap.scrollWidth - window.innerWidth);

    gsap.fromTo(thisAnimWrap, {
      x: () => thisAnimWrap.classList.contains('to-right') ? 0 : getToValue()
    }, {
      x: () => thisAnimWrap.classList.contains('to-right') ? getToValue() : 0,
      ease: "none",
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: () => "+=" + (thisAnimWrap.scrollWidth - window.innerWidth),
        pin: thisPinWrap,
        invalidateOnRefresh: true,
        //anticipatePin: 1,
        scrub: true,
        //markers: true,
      }
    });

  });
})

</script>
<template>
  <custom-cursor/>
   <top-menu />
  <section >
   <cover />
  </section>
  <section class="horizontal">
    <div class="pin-wrap">
      <div class="animation-wrap to-left">
        <div class="item">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, temporibus esse
          magni illum eos natus ipsum minus? Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima magni
          recusandae ex dignissimos.
        </div>
        <div class="item">Eaque ullam illum nobis deleniti mollitia unde, sed, nemo ipsa ratione ex, dicta aliquam
          voluptates! Odio vitae eum nobis dignissimos sunt ipsum repellendus totam optio distinctio. Laborum suscipit
          quia aperiam.
        </div>
        <div class="item">Animi, porro molestias? Reiciendis dolor aspernatur ab quos nulla impedit, dolores ullam hic
          commodi nobis nam. Dolorem expedita laudantium dignissimos nobis a. Dolorem, unde quidem. Tempora et a
          quibusdam inventore!
        </div>
        <div class="item">Labore, unde amet! Alias delectus hic laboriosam et dolorum? Saepe, dicta eaque? Veniam eos
          blanditiis neque. Officia et nostrum, tempore modi quo praesentium aspernatur vero dolor, ipsa unde
          perspiciatis minima.
        </div>
        <div class="item">Quaerat error dolorem aspernatur magni dicta ut consequuntur maxime tempore. Animi odio eos
          quod culpa nulla consectetur? Aperiam ipsam ducimus delectus reprehenderit unde, non laborum voluptate
          laboriosam, officiis at ea!
        </div>
        <div class="item">Rem nobis facere provident magni minima iste commodi aliquam harum? Facere error quos cumque
          perspiciatis voluptatibus deserunt maiores, fugiat sunt sit ab inventore natus saepe, eveniet alias ipsam
          placeat voluptas!
        </div>
        <div class="item">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, temporibus esse
          magni illum eos natus ipsum minus? Quis excepturi voluptates atque dolorum minus eligendi! Omnis minima magni
          recusandae ex dignissimos.
        </div>
        <div class="item">Magnam eveniet inventore assumenda ullam. At saepe voluptatibus sed dicta reiciendis,
          excepturi nisi perferendis, accusantium est suscipit tempora dolorum praesentium cupiditate doloribus non?
          Sint numquam recusandae dolore quis esse ea?
        </div>
        <div class="item">Temporibus cum dolor minima consequatur esse veritatis enim nemo cupiditate laborum doloribus
          reiciendis perferendis, quas fugit earum rerum, at beatae alias amet aspernatur dolorem dolore error commodi.
          Perspiciatis, reiciendis amet!
        </div>
        <div class="item">Vitae, tenetur beatae error corrupti odit expedita quisquam commodi ea aspernatur aliquid,
          eveniet reprehenderit sequi, similique maiores praesentium quam! Optio tenetur saepe unde voluptatem minus
          tempora maxime temporibus ducimus ullam!
        </div>

      </div>
    </div>
  </section>
</template>
<style lang="scss">
html, body, section.horizontal {
  overflow-x: hidden;
}

body {
  font-family: "Signika Negative", sans-serif;
  font-weight: 300;

  margin: 0;
  padding: 0;
}

h1 {
  margin: 0;
  padding: 50px 0 0 50px;
}

p {
  margin: 0;
  padding: 50px 0 50px 50px;
}

section {
  width: 100%;
  height: 100%;
  position: relative;
  background: url("../assets/img/main_bg.jpg");
  background-size: 100%;
}


section:nth-of-type(odd) {
  background-color: #f0f0f0;
}

section:nth-of-type(even) {
  background-color: #ffffff;
}


section.horizontal {
  overflow-x: hidden;
}

section.horizontal .pin-wrap,
section.horizontal .animation-wrap {
  display: flex;
  position: relative;
  z-index: 1;
  height: 100vh;
}


section.horizontal .item {
  position: relative;
  padding: 150px 80px;
  flex: 0 0 500px;
  height: calc(100vh - 300px);
  display: flex;
  align-items: center;
  line-height: 1.7;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  background-color: transparent;
}

section.horizontal .item:before {
  position: absolute;
  font-size: 100px;
  opacity: .13;
  font-weight: bold;
  z-index: -1;
  -webkit-transform: translate(-30px, -50px);
  transform: translate(-30px, -50px);
  line-height: 1;
}


section.horizontal .animation-wrap.to-right {
  counter-reset: item;
  float: left;
}

section.horizontal .animation-wrap.to-left {
  counter-reset: item 11;
  float: right;
}

section.horizontal .animation-wrap.to-right .item:before {
  counter-increment: item;
  content: counter(item);
}

section.horizontal .animation-wrap.to-left .item:before {
  counter-increment: item -1;
  content: counter(item);
}


section.horizontal .animation-wrap .item:nth-child(2n+2) {
  align-items: flex-start;
}

section.horizontal .animation-wrap .item:nth-child(4n+4) {
  align-items: flex-end;
}
</style>