<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Main content area -->
    <main class="flex-1">
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
      <div v-else class="text-center text-gray-500 mt-10">
        ບໍ່ພົບສິນຄ້າທີ່ລະບຸ
      </div>

      <!-- 🔁 สินค้าที่มักซื้อคู่กัน -->
      <div v-if="pairRecommendations.length > 0" class="mt-16 mx-w-6xl mx-auto px-4">
        <h1 class="text-xl font-semibold mb-4 text-red-600 text-center">
          ສິນຄ້າທີ່ມັກຊື້ຄູ່ກັນ
        </h1>

        <div
          class="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 py-2"
          style="scrollbar-width: thin"
        >
          <div
            v-for="item in pairRecommendations"
            :key="item.id"
            class="snap-start flex-shrink-0 w-[250px]"
          >
            <ProductCard
              :id="item.id"
              :name="item.name"
              :image="item.image_url"
              :type="item.category"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import ProductCard from "../components/ProductCard.vue";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import { useRoute } from "vue-router";
import axios from "axios";
import fallbackImage from "../assets/Logo.jpg";

const route = useRoute();
const product = ref(null);
const relatedProducts = ref([]);
const imageSrc = ref("");
const error = ref("");
const pairRecommendations = ref([]); // ➕ เพิ่ม state ใหม่

const onImageError = () => {
  imageSrc.value = fallbackImage;
};

// ✅ แยก logic โหลด product เป็นฟังก์ชัน
const fetchProduct = async () => {
  const productId = route.params.id;

  if (!productId || productId === "undefined") return;

  try {
    const res = await axios.get(
      `http://127.0.0.1:5050/api/products/${productId}`
    );
    product.value = res.data;

    imageSrc.value = res.data.image
      ? `http://127.0.0.1:5050${res.data.image}`
      : fallbackImage;

    const all = await axios.get("http://127.0.0.1:5050/api/products");
    const allProducts = Array.isArray(all.data) ? all.data : all.data.data;

    relatedProducts.value = allProducts
      .filter((p) => p.id !== productId && p.type === product.value.type)
      .slice(0, 6);

    // ✅ โหลดคู่แนะนำ
    const pairRes = await axios.get(
      `http://127.0.0.1:5050/api/products/pairs/${productId}`
    );
    console.log("🎯 คู่แนะนำ:", pairRecommendations.value);

    pairRecommendations.value = pairRes.data.pairs; // ✅ ถูกต้อง
  } catch (err) {
    error.value = err.message;
  }
};

// ✅ โหลดเมื่อหน้าแรกเข้า
onMounted(
  fetchProduct
);

// ✅ โหลดใหม่เมื่อ param เปลี่ยน
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await fetchProduct();
    }
  }
);
</script>
