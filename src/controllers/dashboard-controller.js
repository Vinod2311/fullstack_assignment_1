import { db } from "../models/db.js";
import { LocationSpec } from "../models/joi-schemas.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials; 
      const locations = await db.locationStore.getUserLocations(loggedInUser._id);
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
      failAction: async function (request, h, error) {
        const loggedInUser = request.auth.credentials; 
        const locations = await db.locationStore.getUserLocations(loggedInUser._id);
        const viewData = {
          title: "Add Location error",
          user: loggedInUser, 
          locations: locations,
          errors: error.details
        };
        console.log(viewData);
        return h.view("dashboard-view",viewData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser= request.auth.credentials;
      const userid = loggedInUser._id;
      const newLocation = {
        name: request.payload.name,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        description: request.payload.description,
      };
      await db.locationStore.addLocation(userid,newLocation);
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