import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials; 
      const locations = await db.locationStore.getAllLocations();
      const viewData = {
        title: "Dashboard",
        user: loggedInUser, 
        locations: locations,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  

  addLocation: {
    handler: async function (request, h) {
      const loggedInUser= request.auth.credentials;
      const newLocation = {
        name: request.payload.name,
        latitude: request.payload.lat,
        longitude: request.payload.lng,
        userid: loggedInUser._id,
      };
      await db.locationStore.addLocation(newLocation);
      return h.redirect("/dashboard");
    },
  },
};