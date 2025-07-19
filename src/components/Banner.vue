<!-- src/components/Banner.vue -->
<template>
  <div
    :class="[
      'relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-xl shadow-md',
      $attrs.class,
    ]"
  >
    <video autoplay muted loop playsinline class="w-full h-full object-cover">
      <source :src="videoSrc" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <!-- ข้อความ Overlay (ถ้าต้องการ) -->
  </div>
</template>

<script setup>
import bannerVideo from "../assets/videos/banner.mp4";

const videoSrc = bannerVideo;
</script>
