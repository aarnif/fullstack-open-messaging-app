import { vi } from "vitest";

const client = {
  resetStore: vi.fn(),
  refetchQueries: vi.fn(),
  query: vi.fn(),
  cache: {
    updateQuery: vi.fn(),
    readQuery: vi.fn(),
    evict: vi.fn(),
    identify: vi.fn(),
  },
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
