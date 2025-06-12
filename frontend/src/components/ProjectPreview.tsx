const ProjectPreview = ({ projectId, version }) => {
  const urlThing = `${import.meta.env.VITE_BACKEND_URL}/pf/${projectId}/`;

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
          width: "100%"
        }}
      >
        {urlThing}
        <a href={urlThing} target="_blanck">
          {" "}
          Web Link{" "}
        </a>
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
