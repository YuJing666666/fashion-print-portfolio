"use client";

import { useCallback, useRef } from "react";

/**
 * 三击进入后台的链接组件。
 * 单击正常跳转到 href，快速连续点击 3 次跳转到 /admin。
 */
export function AdminLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const clicksRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      clicksRef.current += 1;

      if (timerRef.current) clearTimeout(timerRef.current);

      if (clicksRef.current >= 3) {
        clicksRef.current = 0;
        window.location.href = "/admin";
        return;
      }

      timerRef.current = setTimeout(() => {
        window.location.href = href;
        clicksRef.current = 0;
      }, 350);
    },
    [href],
  );

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
