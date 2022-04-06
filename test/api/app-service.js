import axios from "axios";

import { serviceUrl } from "../fixtures.js";

export const appService = {
  appUrl: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.appUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.appUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.appUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.appUrl}/api/users`);
    return res.data;
  },
};