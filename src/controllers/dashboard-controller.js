import { db } from "../models/db.js";
import { LocationSpec } from "../models/joi-schemas.js";

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
    validate: {
      payload: LocationSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Add Location error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser= request.auth.credentials;
      const newLocation = {
        name: request.payload.name,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        description: request.payload.description,
        userid: loggedInUser._id,
      };
      await db.locationStore.addLocation(newLocation);
      return h.redirect("/dashboard");
    },
  },

  deleteLocation: {
    handler: async function (request, h){
      await db.locationStore.deleteLocationById(request.params.id)
      return h.redirect("/dashboard");
    },
  },

  error: {
    handler: function (request, h) {
      const viewData = {
        title: "Error 404",
      };
      return h.view("page-not-found", viewData);
    },
  },

  location: {
    handler: async function (request, h){
      const location =  await db.locationStore.getLocationById(request.params.id);
      const loggedInUser= request.auth.credentials;
      const viewData = {
        title: "Location",
        user: loggedInUser, 
        location: location,
      };
      return h.view("location", viewData);
    },
  }
};