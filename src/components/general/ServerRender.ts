import { useSyncExternalStore } from "react";

// 用于修复组件渲染两次，所导致的状态不一致问题
export default function useIsServerRender() {
  return useSyncExternalStore(
    () => {
      return () => {};
    },
    () => false,
    () => true
  );
}
