import React, { useState } from "react";

const UploadAndDisplayImage = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
      <h1>Upload and Display Image usign React Hook's</h1>
      {selectedImage && (
        <div>
        <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} />
        <br />
        <button onClick={()=>setSelectedImage(null)}>Remove</button>
        </div>
      )}
      <br />

      <br />
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
          props.update(event.target.files[0].name);
          fetch('http://db8.cse.nd.edu:5009/upload', {
            method: 'POST',
            body: event.target.files[0],
          }).then((response) => {
            response.json().then(() => {
              //this.setState({ imageURL: URL.createObjectURL(ev.target.files[0]) });
              console.log("sent to server");
            });
          });
        }}
      />
    </div>
  );
};

export default UploadAndDisplayImage;
