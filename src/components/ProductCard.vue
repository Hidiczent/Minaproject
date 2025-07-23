<template>
  <router-link
    :to="`/products/${id}`"
    class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition w-full flex flex-col overflow-hidden"
  >
    <img
      :src="currentImage"
      :alt="name"
      class="w-full h-48 object-contain bg-white p-4"
      @error="onImageError"
    />

    <div class="px-4 pb-4 flex-1 flex flex-col justify-between">
      <h2
        class="text-base font-bold text-gray-800 mt-2 line-clamp-2 min-h-[3rem]"
      >
        {{ name }}
      </h2>

      <div class="mt-4">
        <button
          class="w-full border font-medium border-gray-400 rounded-full text-sm text-gray-700 py-1.5 hover:border-red-600 hover:text-red-600 transition"
          @click.stop
        >
          {{ type }}
        </button>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref, watch } from "vue";
import fallbackImage from "../assets/Logo.jpg";

const props = defineProps({
  id: [String, Number],
  name: String,
  image: String, // เป็นรหัสสินค้า เช่น "800000084310"
  type: {
    type: String,
    default: "Uncategorized",
  },
});

const currentImage = ref("");

watch(
  () => props.image,
  (newImage) => {
    currentImage.value = newImage
      ? `http://127.0.0.1:5050${newImage}`
      : fallbackImage;
  },
  { immediate: true }
);

const onImageError = () => {
  currentImage.value = fallbackImage;
};
</script>
