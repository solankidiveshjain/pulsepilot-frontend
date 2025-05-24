// src/lib/hooks/profile.test.ts
// @ts-nocheck
/// <reference types="vitest" />
import { mockUsers } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUserProfile } from "./profile";

// Mock TanStack Query
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const original = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...original,
    useQuery: vi.fn(),
  };
});

const mockedUseQuery = vi.mocked(useQuery);

describe("useUserProfile", () => {
  beforeEach(() => {
    mockedUseQuery.mockReset();
  });

  it("should return loading state initially", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useUserProfile({ userId: "1" }));
    expect(result.current.isLoading).toBe(true);
  });

  it("should return data on successful fetch", async () => {
    const userProfile = mockUsers[0]; // Assuming mockUsers has at least one user
    mockedUseQuery.mockReturnValue({
      data: userProfile,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useUserProfile({ userId: "1" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.userProfile).toEqual(userProfile);
  });

  it("should return an error state when fetch fails", async () => {
    const error = new Error("Failed to fetch user profile");
    mockedUseQuery.mockReturnValue({
      data: undefined,
      error: error,
      isLoading: false,
      isError: true,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useUserProfile({ userId: "1" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });

  it("should return undefined if user profile not found (successful fetch but no data)", async () => {
    mockedUseQuery.mockReturnValue({
      data: undefined, // Simulate API returning nothing for a given ID
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useUserProfile({ userId: "non-existent-id" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.userProfile).toBeUndefined();
  });
});
