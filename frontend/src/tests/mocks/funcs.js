import { vi } from "vitest";

const updateQueryMock = vi.fn();
const evictMock = vi.fn();
const identifyMock = vi.fn();

const client = {
  resetStore: vi.fn(),
  cache: {
    updateQuery: updateQueryMock,
    evict: evictMock,
    identify: identifyMock,
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
