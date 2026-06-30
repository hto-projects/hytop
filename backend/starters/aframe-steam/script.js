const environmentProps = [
    "skyType",
    "groundColor",
    "skyColor",
    "seed",
    "fog",
    "ground",
    "playArea",
    "groundYScale",
    "groundTexture",
    "groundColor",
    "groundColor2",
    "dressing",
    "dressingScale",
    "dressingAmount",
    "dressingColor",
];

function setEnvVar(scene, envVarString) {
    let varVal;
    try {
        varVal = eval(envVarString);
    } catch {
        varVal = "";
    }

    scene.setAttribute('environment', envVarString, varVal);
}

document.addEventListener("DOMContentLoaded", () => {
    const a = document.createElement("a");
    a.href = "https://hytop.onrender.com/forks-of/aframe-steam";
    a.textContent = "View All";
    a.style.position = "absolute";
    a.style.top = "0";
    a.style.right = "0";
    a.style.zIndex = "1";
    document.body.appendChild(a);

    const scene = document.querySelector('a-scene');
    if (!scene) {
        return;
    }
    
    const cameraEntity = document.createElement("a-entity");
    cameraEntity.setAttribute("camera", true);
    if (cameraLookControls) {
        cameraEntity.setAttribute("look-controls", true);
    }
    
    cameraEntity.setAttribute("position", "0 5 20");
    cameraEntity.setAttribute("wasd-controls", "fly", cameraFly);
    cameraEntity.setAttribute("wasd-controls", "acceleration", cameraAcceleration);
    scene.appendChild(cameraEntity);

    function run () {
        for (let i = 0; i < environmentProps.length; i++) {
            setEnvVar(scene, environmentProps[i]);
        }
    }

    if (scene.hasLoaded) {
        run();
    } else {
        scene.addEventListener('loaded', run);
    }
});
