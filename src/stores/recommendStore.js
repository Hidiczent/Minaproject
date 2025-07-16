import { defineStore } from "pinia";
import axios from "axios";

export const useRecommendStore = defineStore("recommend", {
  state: () => ({
    items: [],
    recommendations: [],
  }),

  actions: {
    async fetchRecommendations() {
      try {
        const res = await axios.post(
          "http://127.0.0.1:5000/api/recommend",
          { items: this.items },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        this.recommendations = res.data.recommendations;
        console.log("📦 คำแนะนำที่ได้:", this.recommendations);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    },
  },
});
