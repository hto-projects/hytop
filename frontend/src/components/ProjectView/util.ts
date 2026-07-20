function getMonacoLang(filename: string) {
  if (!filename) return "plaintext";
  if (filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".html")) return "html";
  if (filename.endsWith(".py")) return "python";
  return "plaintext";
}

/** use with input fields */
function handleEnterShortCut(e: React.KeyboardEvent, callback: () => void) {
  if (e.key !== "Enter") return;
  callback();
};

export { getMonacoLang, handleEnterShortCut };