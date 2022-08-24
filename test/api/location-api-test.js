import { assert } from "chai";
import { appService } from "./app-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, Galway, testLocations} from "../fixtures.js"

suite("Location API tests", () => {

  let newUser = null;

  setup(async () => {
    await appService.deleteAllLocations();
    await appService.deleteAllUsers();
    newUser = await appService.createUser(maggie);
    //GalwayUserid = newUser._id;
  });

  teardown(async () => {});

  test("create location", async () => {
    const returnedLocation = await appService.createLocation(newUser._id,Galway);
    assert.isNotNull(returnedLocation);
    assertSubset(Galway, returnedLocation);
  });

  test("create multiple locations", async () => {
    for (let i = 0; i < testLocations.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await appService.createLocation(newUser._id, testLocations[i]);
    };
    const returnedLocations = await appService.getAllLocations();
    assert.equal(returnedLocations.length, testLocations.length);
    for (let i = 0; i < returnedLocations.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const location = await appService.getLocation(returnedLocations[i]._id);
        assertSubset(location, returnedLocations[i]);
    };
  });

  test("delete locations one by one", async () => {
    for (let i = 0; i < testLocations.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await appService.createLocation(newUser._id, testLocations[i]);
    };
    let returnedLocations = await appService.getAllLocations();
    assert.equal(returnedLocations.length, testLocations.length);
    for (let i = 0; i < returnedLocations.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const location = await appService.deleteLocation(returnedLocations[i]._id);
    }
    returnedLocations = await appService.getAllLocations();
    assertSubset(returnedLocations.length, 0);
    
  });

});