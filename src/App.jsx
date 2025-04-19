import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [modificationText, setModificationText] = useState("");
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const response = await axios.post("http://localhost:3001/generate-image", { prompt });
      setGeneratedImage(response.data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModify = async () => {
    if (!generatedImage || !modificationText || !searchPrompt) return;
    setIsModifying(true);

    try {
      const response = await axios.post("http://localhost:3001/edit-image", {
        base64Image: generatedImage,
        searchPrompt: searchPrompt,
        replacePrompt: modificationText,
      });
      setGeneratedImage(response.data.editedImageUrl);
      setModificationText("");
      setSearchPrompt("");
    } catch (error) {
      console.error("Error modifying image:", error);
      alert("Failed to modify image.");
    } finally {
      setIsModifying(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'accessory.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoToGoogle = () => {
    window.open("https://www.google.com", "_blank");
  };

  return (
    <div className="app-container">
      <h1 className="title">Accessory Image Creator</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Describe the accessory you want..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input-box"
        />
        <button onClick={handleGenerate} disabled={isLoading} className="primary-button">
          {isLoading ? "Generating..." : "Generate Image"}
        </button>
      </div>

      {generatedImage && (
        <>
          <h2 className="section-title">Generated Image</h2>
          <img
            src={generatedImage}
            alt="Generated accessory"
            className="generated-image"
          />

          <div className="edit-section">
            <input
              type="text"
              placeholder="What do you want to replace?"
              value={searchPrompt}
              onChange={(e) => setSearchPrompt(e.target.value)}
              className="input-box"
            />
            <input
              type="text"
              placeholder="What should it become?"
              value={modificationText}
              onChange={(e) => setModificationText(e.target.value)}
              className="input-box"
            />
            <button onClick={handleModify} disabled={isModifying} className="secondary-button">
              {isModifying ? "Modifying..." : "Modify Image"}
            </button>
          </div>

          {/* Download + Google Buttons */}
          <div className="download-section" style={{ textAlign: "center", marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
            <button className="primary-button" onClick={handleDownload}>
              Download Image
            </button>
            <button className="secondary-button" onClick={handleGoToGoogle}>
              Go to Google
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
