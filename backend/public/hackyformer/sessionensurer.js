const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

let sessionName = params.sessionName;
if (!sessionName) {
  sessionName = prompt("What is your session name?") || "default";
}

window.sessionName = sessionName;
