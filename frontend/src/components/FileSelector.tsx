const FileSelector = ({
  filenamesList,
  newFilenameSelected,
  selectedFilename
}) => {
  return (
    <div
      style={{
        height: "100%",
        width: "800px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h1>File Selector</h1>
      {filenamesList.map((filename, index) => (
        <div
          key={index}
          className={`file-selector ${
            selectedFilename === filename ? "selected" : ""
          }`}
          onClick={() => newFilenameSelected(filename)}
          style={{
            padding: "10px",
            cursor: "pointer",
            fontFamily: "Inter",
            backgroundColor: selectedFilename === filename ? "#e0e0e0" : "#fff",
            borderBottom: "1px solid #ccc"
          }}
        >
          {filename}
        </div>
      ))}
    </div>
  );
};

export default FileSelector;
