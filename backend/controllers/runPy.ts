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
    <style>
      html, body {
        margin: 0;
        background: black;
      }
      
      #output, #output:disabled {
        border: 4px solid black;
        background: #222;
        color: #eee;
        padding: 8px;
        width: 100%;
        resize: none;
        display: none;
        height: 100px;
        position: fixed;
        bottom: 0;
        z-index: 20;
        font-size: 1.5em;
        outline: none;
      }
    </style>
  </head>
  <body>
    <script>
      const builtInRead = (x) => {
        return Sk.builtinFiles["files"][x];
      };

      const openConsole = () => {
        const pyConsole = document.querySelector("#output");
        pyConsole.style.display = "block";
        const canv = document.querySelector("canvas");
        if (!canv) {
          pyConsole.style.height = "100%";
        } else {
          pyConsole.style.height = "100px";
        }
      }

      const outf = (text) => { 
          openConsole();
          const mypre = document.getElementById("output");
          mypre.innerHTML = mypre.innerHTML + text;
          mypre.scrollTop = mypre.scrollHeight;
      };

      const asyncReturn = () => {
        return Sk.importMainWithBody("<stdin>", false, ${pythonToRun}, true);
      };

      const takeIn = prmpt => {
        openConsole();
        if (!prmpt) {
          prmt = "> ";
        }

        pyConsole = document.querySelector("#output");
        pyConsole.innerHTML += prmpt;
        pyConsole.disabled = false;
        pyConsole.currentIn = "";
        pyConsole.prev = pyConsole.value;
        pyConsole.setSelectionRange(pyConsole.prev.length, pyConsole.prev.length);
        pyConsole.cursorPos = 0;
        
        pyConsole.focus();
        return new Promise((resolve, reject) => {
          pyConsole.onkeydown = (e) => {
            e.preventDefault();
            
            if (e.key === "Backspace") {
              if (pyConsole.cursorPos > 0) {
                pyConsole.currentIn = pyConsole.currentIn.slice(0, pyConsole.cursorPos-1) + pyConsole.currentIn.slice(pyConsole.cursorPos);
                pyConsole.cursorPos--;
              }
            }
            if (e.key === "Delete") {
              if (pyConsole.cursorPos < pyConsole.currentIn.length) {
                pyConsole.currentIn.slice(pyConsole.cursorPos, 1);
                pyConsole.cursorPos++;
              }
            }

            if (e.key === "ArrowLeft") {
              if (pyConsole.cursorPos > 0) {
                pyConsole.cursorPos--;
              }
            }

            if (e.key === "ArrowRight") {
              if (pyConsole.cursorPos < pyConsole.currentIn.length) {
                pyConsole.cursorPos++;
              }
            }

            if (e.key === "Enter") {
              pyConsole.disabled = true;
              pyConsole.innerHTML += "\\n"
              resolve(pyConsole.currentIn);
              return;
            }

            const insertChar = e.key.length === 1 ? e.key : "";
            if (insertChar) {
              pyConsole.currentIn = [pyConsole.currentIn.slice(0, pyConsole.cursorPos), insertChar, pyConsole.currentIn.slice(pyConsole.cursorPos)].join('');
              pyConsole.cursorPos++;
            }

            pyConsole.innerHTML = pyConsole.prev + pyConsole.currentIn;
            const totalCursorPos = pyConsole.cursorPos + pyConsole.prev.length;
            pyConsole.setSelectionRange(totalCursorPos, totalCursorPos);
          }
        });
      };

      document.addEventListener("DOMContentLoaded", async () => {
        Sk.configure({ read: builtInRead, output: outf, inputfun: takeIn, inputfunTakesPrompt: true });
        const mypre = document.getElementById("output"); 
        mypre.innerHTML = "";
        Sk.pre = "python";
        Sk.TurtleGraphics = { target: "python-turtle-canvas"};
        try {
          await Sk.misceval.asyncToPromise(asyncReturn);
        } catch (e) {
          alert(e);
        }
      });
    </script>
    <div id="canvas-and-console">
    <div id="python-turtle-canvas"></div>
    <div id="python-console">
      <textarea id="output" disabled></textarea>
    </div>
    </div>
  </body>
  </html>
  `;
};
