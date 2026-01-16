import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const downloadImage = (canvasId, fileName = "qr-code") => {
  const canvas = document.getElementById(canvasId);
  if (canvas) {
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${fileName}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success("QR Code downloaded successfully!");
  } else {
    toast.error("Failed to download QR Code.");
  }
};
