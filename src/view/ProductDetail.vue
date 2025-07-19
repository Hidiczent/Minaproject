<template>
  <Navbar />
  <div class="max-w-6xl mx-auto pt-28 px-4 py-6" v-if="product">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- 📸 รูปสินค้า -->
      <div class="flex flex-row items-start lg:w-full gap-4">
        <!-- 📌 Thumbnail ด้านซ้าย -->
        <div class="flex flex-col gap-2">
          <img
            :src="imageSrc"
            class="w-20 h-20 border-2 border-red-500 rounded p-1 cursor-pointer hover:shadow-lg"
            @error="onImageError"
          />
        </div>

        <!-- 📸 รูปหลักด้านขวา -->
        <div class="flex-1">
          <img
            :src="imageSrc"
            :alt="product.name"
            class="w-full max-w-md rounded-md object-contain bg-white p-6 border"
            @error="onImageError"
          />
        </div>
      </div>

      <!-- 📝 รายละเอียดสินค้า -->
      <div class="lg:w-1/2">
        <h1 class="text-2xl font-bold mb-1">{{ product.name }}</h1>
        <p class="text-gray-600 mb-4">
          {{ product.description || "ບໍ່ມີລາຍລະອຽດ" }}
        </p>

        <div class="flex items-center gap-3 mb-6">
          <button class="p-2 border rounded-full hover:bg-gray-100">❤️</button>
          <button class="p-2 border rounded-full hover:bg-gray-100">🔗</button>
        </div>

        <div class="border rounded-md mb-4">
          <div class="bg-red-500 text-white px-4 py-2 font-semibold">
            ຂໍ້ມູນສິນຄ້າ
          </div>
          <div class="p-4 text-gray-600">
            {{ product.ingredient || "ຍັງບໍ່ລະບຸ" }}
          </div>
        </div>

        <div class="border rounded-md">
          <div class="bg-red-600 px-4 py-2 font-semibold text-white">
            ຂໍ້ມູນຜະລິດຕະພັນ
          </div>
          <div class="p-4 text-gray-800 space-y-2">
            <div class="flex justify-between border-b pb-2">
              <span>ຍີ່ຫໍ້</span>
              <span>{{ product.brand || "ຍັງບໍ່ລະບຸ" }}</span>
            </div>
            <div class="flex justify-between border-b pb-2">
              <span>ຫມວດຫມູ່</span>
              <span>{{ product.category }}</span>
            </div>
            <div class="flex justify-between border-b pb-2">
              <span>ນໍ້າໜັກສຸດທິ</span>
              <span>{{ product.weight }} g</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔁 สินค้าที่เกี่ยวข้อง -->
    <div class="mt-16 overflow-x-auto">
      <div class="flex gap-4">
        <div
          v-for="related in relatedProducts"
          :key="related.id"
          class="flex-shrink-0 w-[250px]"
        >
          <ProductCard
            :id="related.id"
            :name="related.name"
            :image="related.image_url"
            :category="related.category"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- ❌ ถ้าไม่พบสินค้า -->
  <div v-else class="text-center text-gray-500 mt-10">ບໍ່ພົບສິນຄ້າທີ່ລະບຸ</div>

  <div class="mt-16 overflow-x-auto" v-if="relatedProducts.length > 0">
    <h2 class="text-xl font-semibold mb-4">ສິນຄ້າທີ່ໃກ້ຄຽງ</h2>
    <div class="flex gap-4">
      <div
        v-for="related in relatedProducts"
        :key="related.id"
        class="flex-shrink-0 w-[250px]"
      >
        <ProductCard
          :id="related.id"
          :name="related.name"
          :image="related.image"
          :type="related.type"
        />
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { onMounted, ref } from "vue";
import ProductCard from "../components/ProductCard.vue";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import { useRoute } from "vue-router";
import axios from "axios";
import fallbackImage from "../assets/images/Chicken.jpg";

const route = useRoute();
const product = ref(null);
const relatedProducts = ref([]);
const imageSrc = ref("");
const error = ref("");

const onImageError = () => {
  imageSrc.value = fallbackImage;
};
onMounted(async () => {
  const productId = route.params.id;

  if (!productId || productId === "undefined") {
    error.value = "Product ID is missing or invalid";
    return;
  }
  try {
    const res = await axios.get(
      `http://127.0.0.1:5050/api/products/${productId}`
    );
    product.value = res.data;

    imageSrc.value = res.data.image
      ? `/images/${encodeURIComponent(res.data.image)}`
      : fallbackImage;

    // 2. โหลดสินค้าทั้งหมดเพื่อค้นหาที่ใกล้เคียง
    const all = await axios.get("http://127.0.0.1:5050/api/products");
    const allProducts = Array.isArray(all.data) ? all.data : all.data.data;

    // 3. หาเฉพาะสินค้าที่ type ตรงกันและไม่ใช่ตัวเอง
    relatedProducts.value = allProducts
      .filter((p) => p.id !== productId && p.type === product.value.type)
      .slice(0, 6); // เลือกมาแค่ 6 รายการ
  } catch (err) {
    error.value = err.message || "Failed to load data";
  }
});
</script>
