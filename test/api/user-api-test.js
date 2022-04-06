import { assert } from "chai";
import { appService } from "./app-service.js";
// import { assertSubset } from "../test-utils.js";
import { maggie } from "../fixtures.js";

suite("User API tests", () => {
  setup(async () => {
  });
  teardown(async () => {
  });

  test("create a user", async () => {
    const newUser = await appService.createUser(maggie);
    // assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });
});