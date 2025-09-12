import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import WatchlistPage from "./components/watchlistPage.vue";
import ProfilePage from "./components/ProfilePage.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/watchlist", component: WatchlistPage },
  { path: "/profile", component: ProfilePage },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
