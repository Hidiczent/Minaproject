<template>
  <div class="panel">
    <h2 style="text-align: center">ເລືອກໝວດໝູ່ສິນຄ້າ</h2>

    <div class="checkbox-group">
      <label v-for="item in allItems" :key="item">
        <input type="checkbox" :value="item" v-model="selectedItems" />
        {{ item }}
      </label>
    </div>

    <button @click="getRecommendation">ແນະນຳສິນຄ້າ</button>

    <div v-if="isLoading">⏳ ກຳລັງປະມວນຜົນ...</div>

    <div v-if="pairRecommendations.length">
      <h3 style="text-align: center">ສິນຄ້າທີ່ມັກຊື້ຄູ່ກັບສິນຄ້າທີ່ເລືອກ:</h3>
      <ul class="numbered-list">
        <li v-for="(item, index) in pairRecommendations" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>

    <div v-if="recommendations.length">
      <h3 style="text-align: center">ແນະນຳເພິ່ມເຕິມ:</h3>
      <ul class="numbered-list">
        <li v-for="(rec, index) in recommendations" :key="index">
          {{ rec }}
        </li>
      </ul>
    </div>
  </div>

  <div class="pair-section">
    <h3>ສິນຄ້າທີ່ນິຍົມຊື້ຄູ່ກັນຫຼາຍ:</h3>
    <table>
      <thead>
        <tr>
          <th>Index</th>
          <th>ຄູ່ສິນຄ້າ</th>
          <th>Support</th>
          <th>Confidence</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pair, idx) in topPairs" :key="idx">
          <td>{{ idx + 1 }}</td>
          <td>{{ formatPair(pair.pair) }}</td>
          <td>{{ (pair.support * 100).toFixed(1) }}%</td>
          <td>{{ (pair.confidence * 100).toFixed(1) }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const selectedItems = ref([]);
const recommendations = ref([]);
const topPairs = ref([]);
const pairRecommendations = ref([]);
const allItems = ref([]);
const isLoading = ref(false);

// ฟอร์แมตรายการคู่สินค้า
const formatPair = (pair) => {
  if (Array.isArray(pair)) {
    return pair.join(" + ");
  }
  return String(pair);
};

// กดปุ่มเพื่อขอคำแนะนำ
const getRecommendation = async () => {
  if (selectedItems.value.length === 0) {
    alert("⚠️ ກະລຸນາເລືອກສິນຄ້າກ່ອນ");
    return;
  }

  isLoading.value = true;
  try {
    if (selectedItems.value.length === 1) {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/recommend-products",
        {
          category: selectedItems.value[0],
        }
      );
      recommendations.value = res.data.products;
    } else {
      const res = await axios.post("http://127.0.0.1:5000/api/recommend", {
        items: selectedItems.value,
      });
      recommendations.value = res.data.recommendations;
    }
  } catch (err) {
    console.error("❌ Error fetching recommendations:", err);
  } finally {
    isLoading.value = false;
  }
};

// ดึงสินค้าที่มักซื้อคู่กัน
const getPairRecommendations = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:5000/api/pair-recommend", {
      items: selectedItems.value,
    });
    pairRecommendations.value = res.data.pair_recommendations;
  } catch (err) {
    console.error("❌ Error loading pair-based recommendations:", err);
  }
};

// โหลดข้อมูลตอน mount
onMounted(async () => {
  try {
    const categoryRes = await axios.get("http://127.0.0.1:5000/api/categories");
    allItems.value = categoryRes.data.categories;

    const pairRes = await axios.get("http://127.0.0.1:5000/api/top-pairs");
    topPairs.value = pairRes.data;
  } catch (err) {
    console.error("❌ Error during onMounted:", err);
  }
});

// เรียกสินค้าคู่เมื่อเลือกสินค้า
watch(selectedItems, async () => {
  if (selectedItems.value.length > 0) {
    await getPairRecommendations();
  } else {
    pairRecommendations.value = [];
  }
});
</script>

<style scoped>
.panel {
  padding: 1rem;
  max-width: 700px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #fdfdfd;
}
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.pair-section {
  max-width: 700px;
  margin: 2rem auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}
th,
td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
th {
  background: #eee;
}
.numbered-list {
  list-style-type: decimal;
  margin-left: 20px;
  padding-left: 10px;
  font-size: 16px;
  color: #333;
}
.numbered-list li {
  margin-bottom: 5px;
}
</style>
