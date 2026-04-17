import React from "react";
import {
  PiFileCssBold,
  PiFileHtmlBold,
  PiFileJsBold,
  PiImageBold,
  PiCodeBold
} from "react-icons/pi";

export const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg"
]);

export const getFileExtension = (fileName?: string): string => {
  if (!fileName) return "";
  const splitName = fileName.split(".");
  if (splitName.length < 2) return "";
  return splitName[splitName.length - 1].toLowerCase();
};

export const isImageFile = (fileName?: string): boolean =>
  SUPPORTED_IMAGE_EXTENSIONS.has(getFileExtension(fileName));

const MAX_IMAGE_DIMENSION = 1920;
const COMPRESSION_QUALITY = 0.75;

const compressImage = (
  file: File,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
): string => {
  let { width, height } = img;

  // Calculate new dimensions while maintaining aspect ratio
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;

  // Draw and compress
  ctx.drawImage(img, 0, 0, width, height);

  // Use appropriate compression based on file type
  if (
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.name.toLowerCase().endsWith(".jpg") ||
    file.name.toLowerCase().endsWith(".jpeg")
  ) {
    return canvas.toDataURL("image/jpeg", COMPRESSION_QUALITY);
  }

  if (
    file.type === "image/webp" ||
    file.name.toLowerCase().endsWith(".webp")
  ) {
    return canvas.toDataURL("image/webp", COMPRESSION_QUALITY);
  }

  // PNG defaults to lossless (quality parameter ignored)
  return canvas.toDataURL("image/png");
};

export const readImageFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    // SVG files don't compress well with canvas, read as-is
    if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || "");
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
      return;
    }

    // For raster images, compress before storing
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Failed to create canvas context"));
            return;
          }

          const compressedUrl = compressImage(file, canvas, ctx, img);
          resolve(compressedUrl);
        };
        img.onerror = () => {
          reject(new Error(`Failed to load image ${file.name}`));
        };
        img.src = e.target?.result as string;
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });

export const toRenderableImageSrc = (
  fileName: string,
  fileContent: string,
  projectName?: string,
  isImage: boolean = true
): string => {
  // Return empty string if not an image file
  if (!isImage) {
    return "";
  }

  // If projectName is provided, use the backend endpoint
  if (projectName) {
    return `${import.meta.env.VITE_BACKEND_URL}/pf/${projectName}/${encodeURIComponent(fileName)}`;
  }

  // Otherwise, convert file content to renderable image source
  if (fileContent.startsWith("data:")) {
    return fileContent;
  }
  if (/^https?:\/\//i.test(fileContent)) {
    return fileContent;
  }

  const extension = getFileExtension(fileName);
  const mimeByExtension: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml"
  };
  const mimeType = mimeByExtension[extension];
  if (!mimeType) {
    return fileContent;
  }
  return `data:${mimeType};base64,${fileContent}`;
};

export const getFileIcon = (fileName?: string) => {
  const ext = getFileExtension(fileName);
  switch (ext) {
    case "css":
      return React.createElement(PiFileCssBold);
    case "html":
      return React.createElement(PiFileHtmlBold);
    case "js":
      return React.createElement(PiFileJsBold);
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "svg":
      return React.createElement(PiImageBold);
    default:
      return React.createElement(PiCodeBold);
  }
};

export const getTabIcon = (fileName?: string) => {
  const ext = getFileExtension(fileName);
  switch (ext) {
    case "css":
      return React.createElement(PiFileCssBold, { size: 14 });
    case "html":
      return React.createElement(PiFileHtmlBold, { size: 14 });
    case "js":
      return React.createElement(PiFileJsBold, { size: 14 });
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "svg":
      return React.createElement(PiImageBold, { size: 14 });
    default:
      return null;
  }
};
