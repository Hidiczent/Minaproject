<template>
  <Navbar />
  <Banner class="my-6 pt-20" />
  <div id="category-section">
    <RecomendPanel
      :selected-items="selectedItems"
      :recommendations="recommendations"
      :pair-recommendations="pairRecommendations"
      @select-item="handleSelectItem"
      @get-recommendation="getRecommendation"
      @get-pair-recommendation="getPairRecommendations"
    />
  </div>
  <!-- รอให้ products โหลดก่อน แล้วค่อยแสดง -->
  <div
    v-if="products.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 py-8"
    id="products-section"
  >
    <ProductCard
      v-for="item in visibleProducts"
      :key="item.id ?? item.name"
      :id="item.id"
      :name="item.name"
      :image="item.image"
      :type="item.type"
    />
  </div>

  <div class="flex justify-center mt-6">
    <button
      v-if="products.length > itemsToShow"
      @click="showMore"
      class="px-6 py-2 my-4 bg-red-600 text-white rounded-lg text-sm hover:bg-red-600 hover:text-white transition"
    >
      showMore
    </button>
  </div>

  <Footer />
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

import Navbar from "../components/Navbar.vue";
import ProductCard from "../components/ProductCard.vue";
import Banner from "../components/Banner.vue";
import Footer from "../components/Footer.vue";
import RecomendPanel from "../components/CategorySelector.vue";

// State
const products = ref([]);
const selectedItems = ref([]);
const recommendations = ref([]);
const pairRecommendations = ref([]);
const itemsToShow = ref(8); // แสดงเริ่มต้น 8 รายการ

// Fetch product list
onMounted(async () => {
  try {
    const res = await axios.get("http://127.0.0.1:5050/api/products");

    let data = res.data;

    // ถ้า data เป็น string (JSON string) ให้แปลงเป็น object/array
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    // เช็คว่าข้อมูลที่ได้เป็น array หรือไม่
    if (Array.isArray(data)) {
      products.value = data;
    } else {
      console.error("API response is not an array:", data);
      products.value = [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
});

// ฟังก์ชันเลือกสินค้า
const handleSelectItem = (item) => {
  if (!selectedItems.value.includes(item)) {
    selectedItems.value.push(item);
  }
};

// แสดงรายการที่ต้องการตามจำนวน
const visibleProducts = computed(() => {
  return products.value.slice(0, itemsToShow.value);
});

// ปุ่มโหลดเพิ่ม
const showMore = () => {
  itemsToShow.value += 8;
};

// TODO: Recommendation logic
const getRecommendation = () => {
  // implement later
};

const getPairRecommendations = () => {
  // implement later
};
</script>
