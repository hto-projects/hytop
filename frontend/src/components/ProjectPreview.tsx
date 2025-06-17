import { useState } from "react";
import { PiLinkSimpleBold } from "react-icons/pi";

const ProjectPreview = ({ projectId, version }) => {
  const urlThing = `${import.meta.env.VITE_BACKEND_URL}/pf/${projectId}/`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(urlThing);
      setCopied(true);
      setTimeout(() => setCopied(false), 100);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h1>Project Preview</h1>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            transition: "transform 0.2s",
            transform: copied ? "scale(1.5)" : "scale(1)"
          }}
        >
          <PiLinkSimpleBold
            style={{ cursor: "pointer" }}
            title="Copy link"
            onClick={copy}
            target="_blanck"
          />
        </span>
        <span>{urlThing}</span>
      </div>
      <iframe
        key={version}
        src={urlThing}
        style={{
          width: "100%",
          height: "100%"
        }}
      ></iframe>
    </div>
  );
};

export default ProjectPreview;
