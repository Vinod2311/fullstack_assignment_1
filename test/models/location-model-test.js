import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testLocations, Galway, maggie } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Location Model tests", () => {

    let newUser = null;
    setup(async () => {
        db.init("mongo");
        await db.userStore.deleteAll();
        await db.locationStore.deleteAllLocations();
        newUser = await db.userStore.addUser(maggie);
        for (let i = 0; i < testLocations.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          testLocations[i] = await db.locationStore.addLocation(newUser._id,testLocations[i]);
        }
      });
    
      test("create a location", async () => {
        const location = await db.locationStore.addLocation(newUser._id,Galway);
        assertSubset(Galway, location);
        assert.isDefined(location._id);
      });

    test("delete all locations", async () => {
        let returnedLocations = await db.locationStore.getAllLocations();
        assert.equal(returnedLocations.length, 2);
        await db.locationStore.deleteAllLocations();
        returnedLocations = await db.locationStore.getAllLocations();
        assert.equal(returnedLocations, 0);
    });

    test("get a location - success", async () => {
        const location = await db.locationStore.addLocation(newUser._id,Galway);
        const returnedLocation = await db.locationStore.getLocationById(location._id);
        assert.deepEqual(location, returnedLocation);
    });

    test("delete One Location - success", async () => {
        await db.locationStore.deleteLocationById(testLocations[0]._id);
        const returnedLocations = await db.locationStore.getAllLocations();
        assert.equal(returnedLocations.length, testLocations.length -1);
        const deletedLocation = await db.locationStore.getLocationById(testLocations[0]._id);
        assert.isNull(deletedLocation);
    });

    test("get a location - bad parameters", async () => {
        assert.isNull(await db.locationStore.getLocationById(""));
    });

    test("delete One Location - fail", async () => {
        await db.locationStore.deleteLocationById("bad-id");
        const allLocations = await db.locationStore.getAllLocations();
        assert.equal(testLocations.length, allLocations.length);
    });
});