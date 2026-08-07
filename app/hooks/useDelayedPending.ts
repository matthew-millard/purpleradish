import { useSpinDelay } from "spin-delay";

export function useDelayedPending(pending: boolean): boolean {
  return useSpinDelay(pending, { delay: 400, minDuration: 300, ssr: false });
}
