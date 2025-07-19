<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
    <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">
      ເລືອກໝວດໝູ່ສິນຄ້າ
    </h2>

    <div
      class="flex w-full overflow-x-auto space-x-3 pb-4 mb-6 custom-scrollbar snap-x snap-mandatory touch-auto"
    >
      <button
        v-for="item in allItems"
        :key="item"
        @click="toggleCategory(item)"
        class="flex-shrink-0 px-4 py-2 rounded-full text-sm whitespace-nowrap border transition duration-200"
        :class="{
          'bg-red-500 text-white border-red-500': selectedItems.includes(item),
          'bg-white text-gray-700 border-gray-300':
            !selectedItems.includes(item),
        }"
      >
        {{ item }}
      </button>
    </div>

    <!-- Recommend Button -->
    <div class="text-center">
      <button
        @click="handleRecommendClick"
        class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition"
      >
        ແນະນຳສິນຄ້າ
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-sm text-gray-500 mt-4">
      ກຳລັງປະມວນຜົນ...
    </div>
    <!-- Pair Recommendations -->
    <div v-if="filteredPairRecommendations.length" class="mt-8">
      <h3 class="text-xl font-semibold text-center text-gray-800 mb-4">
        ສິນຄ້າທີ່ມັກຊື້ຄູ່ກັບສິນຄ້າທີ່ເລືອກ:
      </h3>
      <div class="flex overflow-x-auto space-x-4 pb-2 custom-scrollbar">
        <div
          v-for="(rec, index) in filteredPairRecommendations"
          :key="'pair-' + index"
          class="flex-shrink-0 w-60 bg-white border rounded-lg shadow-md p-4"
        >
          <h4 class="text-md font-semibold text-gray-800">{{ rec }}</h4>
          <p class="text-sm text-gray-500">ສິນຄ້າແນະນຳແບບຈັບຄູ່</p>
        </div>
      </div>
    </div>

    <!-- Single Recommendations -->
    <div v-if="filteredRecommendations.length" class="mt-8">
      <h3 class="text-xl font-semibold text-center text-gray-800 mb-4">
        ແນະນຳເພິ່ມເຕິມ:
      </h3>

      <div class="flex overflow-x-auto space-x-4 pb-2 custom-scrollbar">
        <div
          v-for="(rec, index) in filteredRecommendations"
          :key="'single-' + index"
          class="flex-shrink-0 w-60 bg-white border rounded-lg shadow-md p-4"
        >
          <h4 class="text-md font-semibold text-gray-800">{{ rec }}</h4>
          <p class="text-sm text-gray-500">ຄຳແນະນຳເພິ່ມເຕິມ</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// ✅ States
const selectedItems = ref([]);
const recommendations = ref([]);
const pairRecommendations = ref([]);
const allItems = ref([]);
const isLoading = ref(false);
const pairData = ref({});
const allProducts = ref([]);

// ✅ Item ที่จะไม่แสดง
const excludedItem = "ຢາສາມັນປະຈໍາບ້ານ";

// ✅ ตัวกรองรายการคำแนะนำ
const filteredRecommendations = computed(() =>
  recommendations.value.filter((item) => item !== excludedItem)
);

const filteredPairRecommendations = computed(() =>
  pairRecommendations.value.filter((item) => item !== excludedItem)
);

// ✅ สลับเลือกสินค้า
const toggleCategory = (item) => {
  const index = selectedItems.value.indexOf(item);
  if (index === -1) {
    selectedItems.value.push(item);
  } else {
    selectedItems.value.splice(index, 1);
  }
};

// ✅ โหลดคำแนะนำแบบเดี่ยว
const getRecommendation = async () => {
  if (selectedItems.value.length === 0) {
    recommendations.value = [];
    return;
  }

  isLoading.value = true;
  try {
    if (selectedItems.value.length === 1) {
      const res = await axios.post(
        "http://127.0.0.1:5050/api/recommend-products",
        { category: selectedItems.value[0] }
      );
      recommendations.value = res.data.products || [];
    } else {
      const res = await axios.post("http://127.0.0.1:5050/api/recommend", {
        items: selectedItems.value,
      });
      recommendations.value = res.data.recommendations || [];
    }
  } catch (err) {
    console.error("❌ Error fetching recommendations:", err);
  } finally {
    isLoading.value = false;
  }
};

const getPairRecommendations = async () => {
  if (selectedItems.value.length === 0) {
    pairRecommendations.value = [];
    pairData.value = {};
    return;
  }

  try {
    const res = await axios.post("http://127.0.0.1:5050/api/pair-recommend", {
      items: selectedItems.value,
    });

    console.log("✅ Pair API Response:", res.data);
    pairData.value = res.data.pair_data || [];

    // ✅ ไม่ต้อง map กับ allProducts แล้ว
    pairRecommendations.value = res.data.pair_recommendations || [];
  } catch (err) {
    console.error("❌ Error loading pair-based recommendations:", err);
  }
};

// ✅ เรียกทั้ง 2 ฟังก์ชันเมื่อคลิกปุ่ม
const handleRecommendClick = async () => {
  await getRecommendation();
  await getPairRecommendations();
};

// ✅ โหลดหมวดหมู่เริ่มต้น
onMounted(async () => {
  try {
    const categoryRes = await axios.get("http://127.0.0.1:5050/api/categories");
    allItems.value = categoryRes.data.categories || [];
  } catch (err) {
    console.error("❌ Error loading categories:", err);
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e66e1a;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cc5912;
}
.custom-scrollbar {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
.custom-scrollbar > * {
  scroll-snap-align: start;
}
</style>
