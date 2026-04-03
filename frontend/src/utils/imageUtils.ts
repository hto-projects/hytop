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

export const readImageFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || "");
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });

export const toRenderableImageSrc = (
  fileName: string,
  fileContent: string,
  projectName?: string
): string => {
  if (fileContent.startsWith("data:")) {
    return fileContent;
  }
  if (/^https?:\/\//i.test(fileContent)) {
    return fileContent;
  }
  if (projectName) {
    return `${import.meta.env.VITE_BACKEND_URL}/pf/${projectName}/${encodeURIComponent(fileName)}`;
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
