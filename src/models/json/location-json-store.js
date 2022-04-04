import { v4 } from "uuid";
// eslint-disable-next-line import/no-unresolved
import { JSONFile, Low } from "lowdb";


const db = new Low(new JSONFile("./src/models/json/locations.json"));
db.data = { locations: [] };

export const locationJsonStore = {
  async getAllLocations() {
    await db.read();
    return db.data.locations;
  },

  async addLocation(location) {
    await db.read();
    location._id = v4();
    db.data.locations.push(location);
    await db.write();
    return location;
  },

  async getLocationById(id) {
    await db.read();
    return db.data.locations.filter((location) => location._id === id);
  },

  async getUserLocations(userid) {
    await db.read();
    return db.data.locations.filter((location) => location.userid === userid);
  },

  async deleteLocationById(id) {
    await db.read();
    const index = db.data.locations.findIndex((location) => location._id === id);

    console.log("location index:", index);
    if (index !== -1) db.data.locations.splice(index, 1);
    await db.write();
  },

  async deleteAllLocations() {
    db.data.locations = [];
    await db.write();
  },
};
