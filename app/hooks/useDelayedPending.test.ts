import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDelayedPending } from "./useDelayedPending";

describe("useDelayedPending", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("never shows pending when it resolves before the delay", () => {
    const { result, rerender } = renderHook(({ pending }) => useDelayedPending(pending), {
      initialProps: { pending: true },
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ pending: false });

    expect(result.current).toBe(false);
  });

  it("shows pending only after the delay elapses", () => {
    const { result } = renderHook(() => useDelayedPending(true));

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it("keeps pending visible for at least minDuration once shown", () => {
    const { result, rerender } = renderHook(({ pending }) => useDelayedPending(pending), {
      initialProps: { pending: true },
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe(true);

    rerender({ pending: false });
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(false);
  });
});
