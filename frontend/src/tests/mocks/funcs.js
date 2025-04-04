import { vi } from "vitest";

const client = {
  resetStore: vi.fn(),
};

const setActiveMenuItem = vi.fn();

const localStorage = {
  setItem: vi.fn(),
};

const navigate = vi.fn();

const location = vi.fn();

export default {
  client,
  setActiveMenuItem,
  localStorage,
  navigate,
  location,
};
