import { useRef } from "react";
import { UploadCloud, X } from "lucide-react";
import "./PhotoUploadStep.css";

function PhotoUploadStep({
  files,
  onFilesChange,
  maxFiles = 4,
  acceptedTypes = "image/jpeg,image/png",
  label = "Drag & drop photos here",
  helperText = "Up to 4 images (JPG, PNG) • Max 5MB each",
}) {
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    const combined = [...files, ...selected].slice(0, maxFiles);
    onFilesChange(combined);
  };

  const handleRemove = (index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    const combined = [...files, ...dropped].slice(0, maxFiles);
    onFilesChange(combined);
  };

  return (
    <div className="cf-photo-upload">
      <div
        className="cf-photo-dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <UploadCloud size={28} />
        <p className="cf-photo-dropzone-label">{label}</p>
        <span className="cf-photo-or">or</span>
        <button type="button" className="cf-photo-browse-btn">
          Browse Files
        </button>
        <p className="cf-photo-helper">{helperText}</p>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes}
          multiple
          hidden
          onChange={handleFileSelect}
        />
      </div>

      <p className="cf-photo-count">
        {files.length} / {maxFiles} images uploaded
      </p>

      {files.length > 0 && (
        <div className="cf-photo-previews">
          {files.map((file, index) => (
            <div className="cf-photo-preview" key={index}>
              <img src={URL.createObjectURL(file)} alt={`upload-${index}`} />
              <button
                type="button"
                className="cf-photo-remove"
                onClick={() => handleRemove(index)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoUploadStep;