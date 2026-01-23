"use client";

interface ThemeWrapperProps {
  children: React.ReactNode;
  scale?: number;
}

export function ThemeWrapper({ children, scale = 0.5 }: ThemeWrapperProps) {
  return (
    <div className="relative overflow-hidden border border-border bg-white shadow-sm">
      <div
        className="origin-top-left"
        style={{
          transform: `scale(${scale})`,
          width: `${100 / scale}%`,
          minHeight: `${100 / scale}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
