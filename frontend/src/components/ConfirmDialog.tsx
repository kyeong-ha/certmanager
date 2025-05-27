export function confirmDialog(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.confirm(message)) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
