"use client";

import {
  IconCheckbox,
  IconCircleX,
  IconAlertCircle,
  IconInfoCircle,
  IconLoader,
} from "@tabler/icons-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ theme, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme ?? "system"}
      className="toaster group"
      icons={{
        success: <IconCheckbox className="size-4" />,
        info: <IconInfoCircle className="size-4" />,
        warning: <IconAlertCircle className="size-4" />,
        error: <IconCircleX className="size-4" />,
        loading: <IconLoader className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
