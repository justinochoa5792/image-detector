import { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "./index.scss";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState([]);

  const imageRef = useRef();
  const textInputRef = useRef();
  const fileInputRef = useRef();

  const uploadImage = () => {
    fileInputRef.current.click();
  };

  const handleImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const handleChange = (e) => {
    setImageUrl(e.target.value);
    setResults([]);
  };

  const detectImage = async () => {
    textInputRef.current.value = "";
    const results = await model.classify(imageRef.current);
    setResults(results);
  };

  const loadModel = async () => {
    setIsLoaded(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsLoaded(false);
    } catch (error) {
      console.log(error);
      setIsLoaded(false);
    }
  };
  useEffect(() => {
    loadModel();
  }, []);

  if (isLoaded) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="App">
      <h1 className="header"> Image Detector</h1>
      <div className="inputField">
        <input
          type="file"
          accept="image/*"
          capture="camera"
          className="uploadInput"
          onChange={handleImage}
          ref={fileInputRef}
        />
        <button className="uploadImage" onClick={uploadImage}>
          Upload Image
        </button>
        <span className="or">OR</span>
        <input
          type="text"
          placeholder="Enter Image URL"
          ref={textInputRef}
          onChange={handleChange}
        />
      </div>
      <div className="imageWrapper">
        <div className="imageContent">
          <div className="imageArea">
            {imageUrl && <img src={imageUrl} alt="Preview" ref={imageRef} />}
          </div>
          {results.length > 0 && (
            <div className="imageResult">
              {results.map((result, index) => {
                return (
                  <div className="result" key={result.className}>
                    <span className="name">{result.className}</span>
                    <span className="accuracy">
                      Accuracy Level: {(result.probability * 100).toFixed(2)}%{" "}
                      {index === 0 && (
                        <span className="bestGuess">Best Guess</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {imageUrl && (
          <button className="button" onClick={detectImage}>
            Detect Image
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
