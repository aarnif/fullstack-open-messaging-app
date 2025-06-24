import { test, expect } from "@playwright/test";

import data from "./data.js";
import helpers from "./helpers.js";

const {
  userCredentials,
  user1Credentials,
  user2Credentials,
  user3Credentials,
} = data;

const { signUp, signIn, signOut, addContacts, resetDatabase, createUsers } =
  helpers;

const editProfile = async (page, name, about) => {
  await page.getByTestId("profile-button").click();
  await page.getByTestId("edit-profile-button").click();
  await page.getByTestId("profile-name-input").fill(name);
  await page.getByTestId("profile-about-input").fill(about);
  await page.getByTestId("submit-edit-profile-button").click();
};

const openChangePasswordModal = async (page) => {
  await page.getByTestId("settings-button").click();
  await page.getByTestId("change-password-button").click();
};

const changePassword = async (
  page,
  currentPassword,
  newPassword,
  confirmPassword
) => {
  await openChangePasswordModal(page);
  await page.getByTestId("current-password-input").fill(currentPassword);
  await page.getByTestId("new-password-input").fill(newPassword);
  await page.getByTestId("confirm-new-password-input").fill(confirmPassword);
  await page.getByTestId("submit-change-password-button").click();
};

const navigateToContact = async (page, contact) => {
  await page.getByTestId("contacts-button").click();
  await page.getByTestId(contact.username).click();
};

const blockOrUnblockContact = async (page) => {
  await page.getByTestId("block-or-unblock-contact-button").click();
  await page.getByTestId("confirm-button").click();
};

test.describe("Users And Contacts", () => {
  test.describe("Users", () => {
    test.beforeEach(async ({ page, request }) => {
      await resetDatabase(request);
      await page.goto("http://localhost:5173");
    });

    test("has correct page title", async ({ page }) => {
      await expect(page).toHaveTitle(/Messaging App/);
    });

    test("prevents user creation with invalid username", async ({ page }) => {
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

    test("prevents user creation with invalid password", async ({ page }) => {
      await signUp(page, user1Credentials.username, "pass", "pass");
      await expect(
        page.getByText("Password must be at least 6 characters long!")
      ).toBeVisible();
    });

    test("prevents user creation with non-matching passwords", async ({
      page,
    }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.password + "1"
      );
      await expect(page.getByText("Passwords do not match!")).toBeVisible();
    });

    test("creates new user successfully", async ({ page, request }) => {
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

    test("prevents creating duplicate user", async ({ page, request }) => {
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

    test("signs in user successfully", async ({ page, request }) => {
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

    test("prevents sign in with wrong credentials", async ({ page }) => {
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

    test("maintains user session after page refresh", async ({ page }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );

      await expect(
        page.getByText("Select Chat to Start Messaging.")
      ).toBeVisible();

      await page.reload();

      await expect(
        page.getByText("Select Chat to Start Messaging.")
      ).toBeVisible();
      await expect(page.getByTestId("profile-button")).toBeVisible();
    });

    test("clears user session after logout", async ({ page }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await signOut(page);

      await page.reload();

      await expect(page.getByTestId("sign-in-title")).toBeVisible();
    });

    test("edits user profile successfully", async ({ page }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );

      await editProfile(page, "John Doe", "I am John Doe.");
      await page.getByTestId("confirm-button").click();

      await expect(page.getByText("John Doe", { exact: true })).toBeVisible();
      await expect(page.getByText("I am John Doe.")).toBeVisible();
    });

    test("prevents editing profile with empty name", async ({ page }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );

      await editProfile(page, "", "I am John Doe.");

      await expect(
        page.getByText("Profile name cannot be empty!")
      ).toBeVisible();

      await page.getByTestId("close-modal-button").click();

      await expect(
        page.getByText("Profile name cannot be empty!")
      ).not.toBeVisible();
    });

    test("prevents password change with empty fields", async ({ page }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );

      await openChangePasswordModal(page);
      await page.getByTestId("submit-change-password-button").click();

      await expect(page.getByText("Please fill in all fields")).toBeVisible();
    });

    test("prevents password change with wrong current password", async ({
      page,
    }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );

      await changePassword(
        page,
        "wrong_password",
        "new_password",
        "new_password"
      );

      await expect(
        page.getByText("Current password is incorrect!")
      ).toBeVisible();
    });

    test("prevents password change with non-matching new passwords", async ({
      page,
    }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );

      await changePassword(
        page,
        user1Credentials.password,
        "new_password",
        "wrong_password"
      );

      await expect(page.getByText("Passwords do not match!")).toBeVisible();
    });

    test("changes password successfully", async ({ page }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );

      await changePassword(
        page,
        user1Credentials.password,
        "new_password",
        "new_password"
      );

      await expect(page.getByTestId("change-password-modal")).not.toBeVisible();
      await expect(page.getByTestId("alert-modal")).toBeVisible();
      await expect(
        page.getByText("Password changed successfully")
      ).toBeVisible();
    });
  });

  test.describe("Contacts", () => {
    test.beforeEach(async ({ page, request }) => {
      await resetDatabase(request);
      await createUsers(page, userCredentials);
    });

    test("adds new contacts", async ({ page, request }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await addContacts(page, [user2Credentials]);
      await expect(
        page.getByText(user2Credentials.name, { exact: true })
      ).toBeVisible();
    });

    test("blocks and unblocks contact", async ({ page }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await addContacts(page, [user2Credentials]);

      await navigateToContact(page, user2Credentials);
      await blockOrUnblockContact(page);

      await expect(
        page.getByText("You have blocked this contact!")
      ).toBeVisible();

      await blockOrUnblockContact(page);

      await expect(
        page.getByText("You have blocked this contact!")
      ).not.toBeVisible();
    });

    test("removes contact", async ({ page }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await addContacts(page, [user2Credentials]);

      await navigateToContact(page, user2Credentials);
      await page.getByTestId("remove-contact-button").click();
      await page.getByTestId("confirm-button").click();

      await expect(page.getByText("No contacts found")).not.toBeVisible();
    });

    test("searches for contacts", async ({ page }) => {
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
