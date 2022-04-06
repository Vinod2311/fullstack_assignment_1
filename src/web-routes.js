import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
  { method: "GET", path: "/user", config: accountsController.user },
  { method: "POST", path: "/editUserDetails", config: accountsController.editUserDetails },
  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "GET", path: "/location/{id}", config: dashboardController.location },
  { method: "GET", path: "/deleteLocation/{id}", config: dashboardController.deleteLocation },
  { method: "POST", path: "/dashboard/addLocation", config: dashboardController.addLocation },
  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } }
];