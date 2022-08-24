
import { db } from "../models/db.js";
import { UserSpec,UserCredentialsSpec } from "../models/joi-schemas.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      request.log("Display main page");
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
      console.log("Displaying User page");
      return h.view("user", viewData);
    },
  },

  editUserDetails: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials; 
      const updatedUser = request.payload;
      await db.userStore.updateUser(loggedInUser._id,updatedUser);
      return h.redirect("user");
    },
  },

  deleteAccount: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials; 
      await db.userStore.deleteAllUsers()
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
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
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
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
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
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
};