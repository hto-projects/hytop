function getMonacoLang(filename: string) {
  if (!filename) return "plaintext";
  if (filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".html")) return "html";
  if (filename.endsWith(".py")) return "python";
  return "plaintext";
}

/** 
 * Used with input fields.
 * aAlso feel free to use @ts-ignore to get e.target.value
 * since because this should only be used with input fields it should theoretically never be undefined.
 * @param args you can add arguments to the function as well
 */
function handleEnterShortCut(e: React.KeyboardEvent, callback: (...args: any[]) => void, ...args: any[]) {
  if (e.key !== "Enter") return;
  callback(...args);
};

export { getMonacoLang, handleEnterShortCut };