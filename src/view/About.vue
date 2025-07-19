<template>
  <Navbar />
  <div class="min-h-screen bg-gray-100 p-6 pt-28">
    <h1 class="text-3xl font-bold text-center mb-10">About Us</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
      <div
        v-for="member in members"
        :key="member.name"
        class="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
      >
        <img
          :src="member.photo"
          alt="Profile"
          class="w-50 h-50 mx-auto object-cover mb-4"
        />
        <h2 class="text-xl font-semibold text-center">{{ member.name }}</h2>
        <p class="text-center text-gray-700 mt-2">
          🎓 ຄະນະ: {{ member.faculty }}
        </p>
        <p class="text-center text-gray-700">
          🏛️ ພາກວິຊາ: {{ member.department }}
        </p>
        <p class="text-center text-gray-700">📘 ສາຂາ: {{ member.major }}</p>
        <p class="text-center text-gray-700">📅 ປີຮຽນ: {{ member.year }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import person1 from "../assets/images/person1.jpg";
import person2 from "../assets/images/person2.jpg";
const members = [
  {
    name: "ນາງ ມີນາ ເພັງໄພວັນ",
    faculty: "ວິທະຍາສາດທຳມະຊາດ",
    department: "ວິທະສາດຄອມພິວເຕີ",
    major: "ສາຂາ Computer Science",
    year: "ປີ 4",
    photo: person1,
  },
  {
    name: "ນາງ ປາມີສຸກ ສຸວັນວິໄຊ",
    faculty: "ວິທະຍາສາດທຳມະຊາດ",
    department: "ວິທະສາດຄອມພິວເຕີ",
    major: "ສາຂາ Computer Science",
    year: "ປີ 4",
    photo: person2,
  },
];
</script>

<style scoped>
/* Optional: Smooth card hover effect */
</style>
