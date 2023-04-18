import React from 'react';
import MusifiedImage from '../elements/MusifiedImage';

function DisplayFiles() {

    const [data, setdata] = React.useState({
      imageURL: "",
      file: "",
    });

    const handleUploadImage(ev) {
      ev.preventDefault();

      const data = new FormData();
      data.append('file', this.uploadInput.files[0]);
      setData(
          { imageURL: URL.createObjectURL(this.uploadInput.files[0]) ,
            file: this.uploadInput.files[0].name,
          }
      )
      console.log(this.uploadInput.files[0].name);

      fetch('http://db8.cse.nd.edu:5009/upload', {
        method: 'POST',
        body: data,
      }).then((response) => {
        response.json().then(() => {
          //this.setState({ imageURL: URL.createObjectURL(ev.target.files[0]) });
          console.log("success");
        });
      });
    }



    return (
        <div className = "inputfun">
        <form onSubmit={this.handleUploadImage}>
          <div>
            <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
          </div>
          <div>
            <button>Upload</button>
          </div>
          <img src={this.state.imageURL} alt="img" />

        </form>
        <MusifiedImage path = {data.pathto}></MusifiedImage>
    </div>
    );

}
