<template>
  <nav class="bg-white shadow-md px-6 py-3 fixed top-0 left-0 w-full z-50">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <a href="/"><img src="../assets/Logo.jpg" alt="logo" class="w-20 h-20" /></a>
        <a href="/" class="text-xl font-semibold text-red-600"
          >Fresh Shop ສາຂາດອນໜູນ</a
        >
      </div>

      <!-- Center Menu -->
      <ul
        class="hidden md:flex gap-6 text-gray-800 font-bold text-sm absolute left-1/2 -translate-x-1/2 items-center"
      >
        <li>
          <router-link to="/" class="hover:text-red-500 text-base"
            >ໜ້າຫຼັກ</router-link
          >
        </li>
        <li>
          <router-link
            to="/#products-section"
            class="hover:text-red-500 text-base"
            >ສິນຄ້າ</router-link
          >
        </li>
        <li>
          <router-link
            to="/#category-section"
            class="hover:text-red-500 text-base"
            >ເລືອກໝວດໝູ່ສິນຄ້າ</router-link
          >
        </li>
        <li>
          <router-link to="/About" class="hover:text-red-500 text-base"
            >ກ່ຽວກັບ</router-link
          >
        </li>

        <!-- Search Icon -->
        <li>
          <button
            @click="showSearch = true"
            class="p-2 hover:bg-gray-100 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1117 10.5a7.5 7.5 0 01-.35 6.15z"
              />
            </svg>
          </button>
        </li>
      </ul>

      <!-- Mobile -->
      <div class="flex items-center gap-3 md:hidden">
        <button class="p-2 hover:bg-gray-100 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <!-- 🔍 Search Popup -->
  <div
    v-if="showSearch"
    class="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-28"
  >
    <div class="bg-white w-[90%] max-w-2xl p-6 rounded-xl shadow-xl relative">
      <button
        @click="showSearch = false"
        class="absolute top-3 right-3 text-gray-500 hover:text-red-500"
      >
        ✕
      </button>

      <!-- Search Input -->
      <div
        class="flex items-center border border-red-500 rounded-full px-4 py-2 mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 mr-2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1117 10.5a7.5 7.5 0 01-.35 6.15z"
          />
        </svg>
        <input
          v-model="searchText"
          @input="fetchSuggestions"
          type="text"
          placeholder="ຄົ້ນຫາສິນຄ້າ..."
          class="w-full outline-none text-sm"
        />
      </div>

      <!-- Suggestions -->
      <div v-if="suggestions.length">
        <ul>
          <li
            v-for="product in suggestions"
            :key="product.id"
            @click="goToProduct(product.id)"
            class="py-2 px-4 hover:bg-gray-100 cursor-pointer rounded-md text-gray-700"
          >
            {{ product.name }}
          </li>
        </ul>
      </div>

      <!-- Popular tags -->
      <div class="mt-5 my-3">
        <p class="font-semibold text-gray-700 mb-2">ຍອດນິຍົມ</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in popularTags"
            :key="tag.id"
            class="bg-gray-100 text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-red-100"
            @click="goToProduct(tag.id)"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const showSearch = ref(false);
const searchText = ref("");
const suggestions = ref([]);
const router = useRouter();
const popularTags = ref([]);

const fetchSuggestions = async () => {
  try {
    if (!searchText.value) {
      suggestions.value = [];
      return;
    }

    const res = await axios.get("http://127.0.0.1:5050/api/products");
    const allProducts = res.data;

    // กรองจากข้อความค้นหา
    suggestions.value = allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchText.value.toLowerCase())
    );
  } catch (error) {
    console.error("❌ Fetch search error:", error);
  }
};

watch(showSearch, async (newVal) => {
  if (newVal) {
    try {
      const res = await axios.get("http://127.0.0.1:5050/api/products/popular");
      popularTags.value = res.data.popular || [];
    } catch (err) {
      console.error("❌ Failed to fetch popular tags:", err);
    }
  }
});

const handleSearchTag = async (name) => {
  try {
    // 🔍 ค้นหา product ID จากชื่อ
    const res = await axios.get(`http://127.0.0.1:5050/api/products`);
    const product = res.data.find((p) => p.name === name);

    if (product) {
      router.push(`/products/${product.id}`);
      showSearch.value = false; // ปิด popup ด้วย
    } else {
      alert("❌ ไม่พบสินค้านี้");
    }
  } catch (err) {
    console.error("❌ Failed to fetch product ID:", err);
  }
};

const goToProduct = (productId) => {
  showSearch.value = false;
  searchText.value = "";
  suggestions.value = [];
  router.push(`/products/${productId}`);
};
</script>
