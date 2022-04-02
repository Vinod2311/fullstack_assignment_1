import { db } from "../models/db.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome" });
    },
  },

  user: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials; 
      const viewData = {
        title: "User",
        user: loggedInUser, 
      };
      return h.view("user", viewData);
    },
  },

  editUserDetails: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials; 
      const updatedUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName, 
        email:request.body.email,
      };
      await db.userStore.updatedUser(loggedInUser,updatedUser);
      return h.redirect("user");
    },
  },
  
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up" });
    },
  },
  signup: {
    auth: false,
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login" });
    },
  },
  login: {
    auth: false,
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { valid: false };
    }
    return { valid: true, credentials: user };
  },
  logout: {
    auth: false,
    handler: function (request, h) {
      return h.redirect("/");
    },
  },
};