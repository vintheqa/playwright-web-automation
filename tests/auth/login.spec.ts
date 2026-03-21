import { test } from "../../fixtures/baseTest";

test("User can login with correct credentials", async ({ loginPage }) => {
  await loginPage.goToLoginPage();
  await loginPage.login("standard_user", "secret_sauce");

  await loginPage.assertLoginSuccess();
});

test("User should not be able to login with incorrect credentials", async ({
  loginPage,
}) => {
  await loginPage.goToLoginPage();
  await loginPage.login("standard_user", "wrong_password");

  await loginPage.assertLoggedOutState();
  await loginPage.assertLoginErrorMsg(
    "Epic sadface: Username and password do not match any user in this service",
  );
});
