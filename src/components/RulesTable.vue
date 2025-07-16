<template>
  <div>
    <!-- <h2> (Top Rules)</h2> -->

    <div v-if="rules.length === 0">⏳ กำลังโหลดข้อมูล...</div>

    <table v-else>
      <thead>
        <tr>
          <th>Index</th>
          <th>Antecedents</th>
          <th>Consequents</th>
          <th>Support</th>
          <th>Confidence</th>
          <th>Lift</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rule, index) in rules" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ formatSet(rule.antecedents) }}</td>
          <td>{{ formatSet(rule.consequents) }}</td>
          <td>{{ formatNumber(rule.support) }}</td>
          <td>{{ formatNumber(rule.confidence) }}</td>
          <td>{{ formatNumber(rule.lift) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const rules = ref([]);

// โหลดข้อมูลเมื่อ component mount
onMounted(async () => {
  try {
    const res = await axios.get("http://127.0.0.1:5000/api/rules");
    console.log("✅ Rules loaded:", res.data);
    rules.value = res.data;
  } catch (error) {
    console.error("❌ Error fetching rules:", error);
  }
});

// แปลงเซ็ตให้อ่านง่าย
const formatSet = (input) => {
  try {
    if (!input) return "-";

    // ถ้าเป็น Array ปกติ
    if (Array.isArray(input)) {
      return input.join(", ");
    }

    // ถ้าเป็น object ที่มี key เป็นเลข (e.g., {0: "A", 1: "B"})
    if (typeof input === "object" && input !== null) {
      const values = Object.values(input);
      // ตรวจว่าทุกตัวเป็น string หรือ number จริง ๆ
      if (values.every((v) => typeof v === "string" || typeof v === "number")) {
        return values.join(", ");
      }
    }

    // fallback
    return JSON.stringify(input);
  } catch (err) {
    console.warn("⚠️ formatSet error:", err);
    return "-";
  }
};

// ปัดทศนิยม 2 ตำแหน่ง
const formatNumber = (num) => {
  return typeof num === "number" ? num.toFixed(2) : "-";
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 16px;
  font-family: sans-serif;
  background-color: #fdfdfd;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
  text-align: left;
}

th,
td {
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
