import { createRouter, createWebHistory } from "vue-router";
import RecommendView from "../view/RecommendView.vue";
import ProductDetail from "../view/ProductDetail.vue";
import About from "../view/About.vue";
import Main from "../view/Main.vue";
const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/Rule",
    name: "Table",
    component: RecommendView,
  },
  {
    path: "/About",
    name: "About",
    component: About,
  },
  {
    path: "/products/:id",
    name: "ProductDetail",
    component: ProductDetail,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    return { top: 0 };
  },
});

export default router;
