import React, { useRef, useState } from "react";
import "./Uploadbox.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../firebase";

const Uploadbox = () => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("File size exceeds 100MB limit.");
      return;
    }

    setVideoFile(file);
    setVideoTitle(file.name);
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoTitle("");
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cancelUpload = () => {
    if (isUploading) {
      alert("Upload cancelled.");
      resetForm();
    }
  };
 const startUpload = () => {
  if (!videoFile) return;
  setIsUploading(true);

  const uniqueName = `${Date.now()}_${videoFile.name}`; // to avoid overwriting files
  const storageRef = ref(storage, `videos/${uniqueName}`);
  const uploadTask = uploadBytesResumable(storageRef, videoFile);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgress(Math.round(progress));
    },
    (error) => {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setIsUploading(false);
    },
    async () => {
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        await addDoc(collection(db, "videos"), {
          title: videoTitle,
          videoUrl: downloadURL,
          size: videoFile.size,
          type: videoFile.type,
          createdAt: serverTimestamp()
        });

        setIsUploading(false);
        setUploadComplete(true);
        alert("Upload completed successfully.");
      } catch (err) {
        console.error("Saving to Firestore failed:", err);
        alert("Upload succeeded but saving metadata failed.");
        setIsUploading(false);
      }
    }
  );
};


  

  return (
    <div className="uploadbox-container">
      <h2 className="uploadbox-title">Upload a Video</h2>

      {!videoFile ? (
        <div
          className="uploadbox-dropzone"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="uploadbox-icon">📤</div>
          <p>Click to select a video file</p>
          <p className="uploadbox-info">
            MP4, WebM, MOV, or AVI • up to 100MB
          </p>
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <strong>File:</strong> {videoFile.name} (
            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
            {isUploading && (
              <button onClick={cancelUpload} className="uploadbox-cancel">
                ✖ Cancel
              </button>
            )}
            {uploadComplete && (
              <span className="uploadbox-complete">✔ Done</span>
            )}
          </div>

          <div>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="uploadbox-input"
            />
          </div>

          {isUploading && (
            <div className="uploadbox-progress">
              <span>Uploading: {uploadProgress}%</span>
              <progress value={uploadProgress} max="100" style={{ width: "100%" }} />
            </div>
          )}

          {!uploadComplete && (
            <div className="uploadbox-actions">
              <button onClick={cancelUpload} className="uploadbox-cancel">
                Cancel
              </button>
              <button onClick={startUpload} className="uploadbox-upload">
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Uploadbox;


