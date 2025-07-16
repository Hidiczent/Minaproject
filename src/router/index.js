import { createRouter, createWebHistory } from "vue-router";
import RecommendView from "../view/RecommendView.vue";
import  Rulestable from "../view/Rulestable.vue"
const routes = [
  {
    path: "/",
    name: "recommend",
    component: RecommendView,
  },
  {
    path:"/Rule",
    name :"Table",
    component:Rulestable

  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
