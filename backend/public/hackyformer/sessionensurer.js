const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

let sessionName = params.sessionName && params.sessionName.toLowerCase().trim();
if (!sessionName) {
  sessionName = prompt("What is your session name?") || "default";
  sessionName = sessionName.toLowerCase().trim();
  window.location.search = `?sessionName=${sessionName}`;
}

window.sessionName = sessionName;
