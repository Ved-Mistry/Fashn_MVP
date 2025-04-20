import express from "express";
import FormData from "form-data";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors()); 
app.use(express.json({ limit: "50mb" })); // allow large base64 images

const stabilityApiKey = "sk-iMgGRFzQwnTMSnKobYQxOlbKYI4xg95XAPtYha42G8RpwjDf";

// 🖼️ Generate new image
app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      formData,
      {
        headers: {
          Authorization: `Bearer ${stabilityApiKey}`,
          Accept: "application/json",
          ...formData.getHeaders(),
        },
      }
    );

    const imageBase64 = response.data.image;
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    res.json({ imageUrl });
  } catch (error) {
    console.error("🔥 Proxy error generating images:", error?.response?.data || error.message);
    res.status(500).json({ error: "Proxy error generating images." });
  }
});

// 🖌️ Edit existing image (search and replace)
app.post("/edit-image", async (req, res) => {
  const { base64Image, searchPrompt, replacePrompt } = req.body;

  try {
    const imageBuffer = Buffer.from(base64Image.replace(/^data:image\/png;base64,/, ""), "base64");

    const formData = new FormData();
    formData.append("image", imageBuffer, { filename: "input.png", contentType: "image/png" });
    formData.append("search_prompt", searchPrompt);
    formData.append("prompt", replacePrompt);

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/edit/search-and-replace",
      formData,
      {
        headers: {
          Authorization: `Bearer ${stabilityApiKey}`,
          Accept: "application/json",
          ...formData.getHeaders(),
        },
      }
    );

    const editedImageBase64 = response.data.image;
    const editedImageUrl = `data:image/png;base64,${editedImageBase64}`;

    res.json({ editedImageUrl });
  } catch (error) {
    console.error("🔥 Proxy error editing image:", error?.response?.data || error.message);
    res.status(500).json({ error: "Proxy error editing image." });
  }
});

// ✅ Start proxy server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
