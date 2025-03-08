import React from "react";
import Card from "react-bootstrap/Card";
import ImageCompression from "browser-image-compression";

export default class ImageCompressor extends React.Component {
  constructor() {
    super();

    // State of the app
    this.state = {
      compressedLink: "",
      originalImage: null,
      originalLink: "",
      clicked: false,
      uploadImage: false,
      outputFileName: "",
    };
  }

  // Handle uploaded Image
  handle = (e) => {
    const imageFile = e.target.files[0];
    this.setState({
      originalLink: URL.createObjectURL(imageFile),
      originalImage: imageFile,
      uploadImage: true,
      outputFileName: imageFile.name, // Set output file name
    });
  };

  click = async (e) => {
    e.preventDefault();
    
    if (!this.state.originalImage) {
      alert("Please upload an image first.");
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };

    // Fix incorrect size check (Convert bytes to MB)
    if (this.state.originalImage.size / (1024 * 1024) < options.maxSizeMB) {
      alert("Image is too small, can't be compressed.");
      return;
    }

    try {
      const output = await ImageCompression(this.state.originalImage, options);
      const downloadLink = URL.createObjectURL(output);

      this.setState({
        compressedLink: downloadLink,
        
      });
    } catch (error) {
      console.error("Compression error:", error);
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <div className="text-dark text-center">
          <h1>Three Simple Steps:</h1>
          <h3>1. Upload your image</h3>
          <h3>2. Click on Compress</h3>
          <h3>3. Click on Download button</h3>
        </div>

        <div className="row mt-5 justify-content-center">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <Card>
              {this.state.uploadImage && (
                <Card.Img variant="top" src={this.state.originalLink} />
              )}
            </Card>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <input
            type="file"
            accept="image/*"
            className="mt-2 btn btn-dark w-75"
            onChange={this.handle}
          />
        </div>

        <br />
        <div className="text-center">
          <button type="button" className="btn btn-dark" onClick={this.click}>
            Compress
          </button>
        </div>

        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3">
          {this.state.clicked && (
            <>
              <Card.Img variant="top" src={this.state.compressedLink} />
              <div className="d-flex justify-content-center">
                <a
                  href={this.state.compressedLink}
                  download={this.state.outputFileName}
                  className="mt-2 btn btn-dark w-75"
                >
                  Download
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
