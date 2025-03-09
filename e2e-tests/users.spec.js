// @ts-check
import { test, expect } from "@playwright/test";

import data from "./data.js";
import helpers from "./helpers.js";

const {
  userCredentials,
  user1Credentials,
  user2Credentials,
  user3Credentials,
} = data;

const { signUp, signIn, signOut, addContacts } = helpers;

test.describe("Users And Contacts", () => {
  test.describe("Users", () => {
    test.beforeEach(async ({ page, request }) => {
      await request.post("http://localhost:4000/", {
        data: {
          query: `
          mutation Mutation {
            resetDatabase
          }
          `,
        },
      });
      await page.goto("http://localhost:5173");
    });

    test("Page has title", async ({ page }) => {
      await expect(page).toHaveTitle(/Messaging App/);
    });

    test("Try to create user with invalid username", async ({ page }) => {
      await signUp(
        page,
        "a",
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await expect(
        page.getByText("Username must be at least 4 characters long!")
      ).toBeVisible();
    });

    test("Try to create user with invalid password", async ({
      page,
      request,
    }) => {
      await signUp(page, user1Credentials.username, "pass", "pass");
      await expect(
        page.getByText("Password must be at least 6 characters long!")
      ).toBeVisible();
    });

    test("Try to create user with passwords not matching", async ({ page }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.password + "1"
      );
      await expect(page.getByText("Passwords do not match!")).toBeVisible();
    });

    test("Create a new user", async ({ page, request }) => {
      await request.post("http://localhost:4000/", {
        data: {
          query: `
            mutation Mutation {
              resetDatabase
            }
            `,
        },
      });
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await expect(
        page.getByText("Select Chat to Start Messaging.")
      ).toBeVisible();
    });

    test("Try to create same user twice", async ({ page, request }) => {
      await request.post("http://localhost:4000/", {
        data: {
          query: `
            mutation Mutation {
              resetDatabase
            }
            `,
        },
      });
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await signOut(page);
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await expect(page.getByText("Username already exists!")).toBeVisible();
    });

    test("Sign in success with a new user", async ({ page, request }) => {
      await request.post("http://localhost:4000/", {
        data: {
          query: `
            mutation Mutation {
              resetDatabase
            }
            `,
        },
      });
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await signOut(page);
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await expect(
        page.getByText("Select Chat to Start Messaging.")
      ).toBeVisible();
    });

    test("Sign in fails with wrong credentials", async ({ page }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await signOut(page);
      await signIn(
        page,
        user1Credentials.username,
        user1Credentials.password + "1"
      );
      await expect(
        page.getByText("invalid username or password!")
      ).toBeVisible();
    });

    test("Edit user profile", async ({ page }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await page.getByTestId("profile-button").click();
      await page.getByTestId("edit-profile-button").click();
      await page.getByTestId("profile-name-input").fill("John Doe");
      await page.getByTestId("profile-about-input").fill("I am John Doe.");
      await page.getByTestId("submit-edit-profile-button").click();
      await page.getByTestId("confirm-button").click();

      await expect(page.getByText("John Doe", { exact: true })).toBeVisible();
      await expect(page.getByText("I am John Doe.")).toBeVisible();
    });
  });

  test.describe("Contacts", () => {
    test.beforeEach(async ({ page, request }) => {
      await request.post("http://localhost:4000/", {
        data: {
          query: `
            mutation Mutation {
              resetDatabase
            }
          `,
        },
      });
      userCredentials.forEach(
        async (credential) =>
          await request.post("http://localhost:4000/", {
            data: {
              query: `
            mutation CreateUser($username: String!, $password: String!, $confirmPassword: String!) {
              createUser(username: $username, password: $password, confirmPassword: $confirmPassword) {
                username
              }
            }
            `,
              variables: credential,
            },
          })
      );
      await page.goto("http://localhost:5173");
    });

    test("Add new contacts", async ({ page, request }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await addContacts(page, [user2Credentials]);
      await expect(
        page.getByText(user2Credentials.name, { exact: true })
      ).toBeVisible();
    });

    test("Block and unblock contact", async ({ page }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await addContacts(page, [user2Credentials]);
      await page.getByTestId("contacts-button").click();
      await page.getByTestId(user2Credentials.username).click();
      await page.getByTestId("block-or-unblock-contact-button").click();
      await page.getByTestId("confirm-button").click();
      await expect(
        page.getByText("You have blocked this contact!")
      ).toBeVisible();

      await page.getByTestId("block-or-unblock-contact-button").click();
      await page.getByTestId("confirm-button").click();

      await expect(
        page.getByText("You have blocked this contact!")
      ).not.toBeVisible();
    });

    test("Remove contact", async ({ page }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await addContacts(page, [user2Credentials]);
      await page.getByTestId("contacts-button").click();
      await page.getByTestId(user2Credentials.username).click();
      await page.getByTestId("remove-contact-button").click();
      await page.getByTestId("confirm-button").click();
      await expect(page.getByText("No contacts found")).not.toBeVisible();
    });

    test("Users can search for contacts", async ({ page }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await addContacts(page, [user2Credentials, user3Credentials]);

      await page.getByTestId("contacts-button").click();
      await page
        .getByTestId("contact-search-input")
        .fill(user2Credentials.name);

      await expect(page.getByTestId(user2Credentials.username)).toBeVisible();
      await expect(
        page.getByTestId(user3Credentials.username)
      ).not.toBeVisible();
    });
  });
});
