import { test } from "../../fixtures/baseTest";

test("User can login with correct credentials", async ({ loginPage }) => {
  await loginPage.login("demouser", "testingisfun99");

  await loginPage.assertLoginSuccess();
});

test("User should not be able to login with incorrect credentials", async ({
  loginPage,
}) => {
  await loginPage.login("demouser", "wrong_password");

  await loginPage.assertLoggedOutState();
  await loginPage.assertLoginErrorMsg(
    "Invalid Password",
  );
});
