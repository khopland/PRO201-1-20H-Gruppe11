import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/repair",
    name: "Repair",
    component: () => import("../views/RepairPage.vue")
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/ProfilePage.vue")
  },
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("../views/LoginPage.vue")
  },
  {
    path: "/entry-successful",
    name: "Entry Successful",
    component: () => import("../views/EntrySuccessful.vue")
  },
  {
    path: "/logout",
    name: "Logout page",
    component: () => import("../views/Logout.vue")
  },
  {
    path: "/admin",
    name: "AdminPage",
    component: () => import("../views/AdminPage.vue")
  },
  {
    path: "/notimplemented",
    name: "NotImplemented",
    component: () => import("../views/NotImplementedPage.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// UNCOMMENT TO ENFORCE NAVIGATION GUARDS:

import store from "../store";

router.beforeEach((to, from, next) => {
  const userData = store.getters.getUserData;
  if (to.path !== "/login" && !userData) {
    next("/login");
  } else if (to.path === "/login" && userData) {
    next(false);
  } else if (to.path === "/admin" && !userData.admin) {
    next("/");
  } else {
    next();
  }
});

export default router;