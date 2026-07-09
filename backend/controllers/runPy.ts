/**
 * For python projects, this function is required to render outputs through HTML code using Skulpt. This gets outputed to the preview iframe.
 * 
 * @param pythonToRun Code written in python files by hytop users.
 */
export const runPyThroughHTML = (pythonToRun: string) => {
  return `
  <html>
  <head>
    <script src="https://skulpt.org/js/skulpt.min.js"></script>
    <script src="https://skulpt.org/js/skulpt-stdlib.js"></script>
    <link href="style.css" rel="stylesheet">
  </head>
  <body>
    <script>
      const builtInRead = (x) => {
        return Sk.builtinFiles["files"][x];
      };

      const outf = (text) => { 
          const mypre = document.getElementById("output");
          mypre.innerHTML = mypre.innerHTML + text; 
      };

      const asyncReturn = () => {
        return Sk.importMainWithBody("<stdin>", false, ${pythonToRun}, true);
      };

      document.addEventListener("DOMContentLoaded", async () => {
        Sk.configure({ read: builtInRead, output: outf });
        const mypre = document.getElementById("output"); 
        mypre.innerHTML = "";
        Sk.pre = "python"
        Sk.TurtleGraphics = { target: "python-turtle-canvas"};
        try {
          await Sk.misceval.asyncToPromise(asyncReturn);
        } catch (e) {
          alert(e);
        }
      });
    </script>
    <div id="python-turtle-canvas"></div>
    <div id="python-console">
      <pre id="output"></pre>
    </div>
  </body>
  </html>
  `;
};
