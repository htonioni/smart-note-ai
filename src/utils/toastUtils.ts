export interface Toast {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export const showToast = (
  message: string,
  severity: "success" | "error" | "info" | "warning",
  setToast: Function
) => {
  setToast({
    open: true,
    message,
    severity
  });
};