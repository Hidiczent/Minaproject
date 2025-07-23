<template>
  <Navbar />
  <Banner class="my-6 pt-20" />

  <!-- 🔻 Section: Category Selector -->
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

  <!-- 🔥 สินค้าขายดี -->
  <div v-if="popularProducts.length" class="px-4 py-6 my-6 mb-8">
    <h2 class="text-2xl font-bold mb-4 text-red-600 text-center">
      ສິນຄ້າຂາຍດີ
    </h2>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="item in popularProducts"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :image="item.image_url"
        :type="item.category"
      />
    </div>
  </div>

  <!-- 🔽 สินค้าทั้งหมด -->
  <h2 class="text-2xl font-bold mb-4 text-red-600 text-center">ສິນຄ້າທັງໝົດ</h2>
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

  <!-- 🔘 Load more -->
  <div class="flex justify-center mt-6">
    <button
      v-if="products.length > itemsToShow"
      @click="showMore"
      class="px-6 py-2 my-4 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
    >
      ໂຫຼດເພີ່ມ
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

// ✅ States
const products = ref([]);
const popularProducts = ref([]);
const selectedItems = ref([]);
const recommendations = ref([]);
const pairRecommendations = ref([]);
const itemsToShow = ref(8);

// ✅ ดึงสินค้าทั้งหมด
const fetchAllProducts = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:5050/api/products");
    let data = res.data;

    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    if (Array.isArray(data)) {
      products.value = data;
    } else {
      console.error("API response is not an array:", data);
    }
  } catch (error) {
    console.error("❌ Error fetching products:", error);
  }
};

// ✅ ดึงสินค้าขายดี
const fetchPopularProducts = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:5050/api/products/popular");
    popularProducts.value = res.data.popular || [];
  } catch (error) {
    console.error("❌ Error fetching popular products:", error);
  }
};

// ✅ Lifecycle
onMounted(async () => {
  await fetchPopularProducts();
  await fetchAllProducts();
});

// ✅ แสดงเฉพาะที่กำหนดจำนวน
const visibleProducts = computed(() =>
  products.value.slice(0, itemsToShow.value)
);

// ✅ ปุ่มโหลดเพิ่ม
const showMore = () => {
  itemsToShow.value += 8;
};

// ✅ เลือกหมวด
const handleSelectItem = (item) => {
  if (!selectedItems.value.includes(item)) {
    selectedItems.value.push(item);
  }
};

// ✅ placeholder (ทำงานร่วมกับ RecommendPanel)
const getRecommendation = () => {
  // implement if needed
};
const getPairRecommendations = () => {
  // implement if needed
};
</script>
