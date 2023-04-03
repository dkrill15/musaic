import React from 'react';

class ImageInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);

  }

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    this.setState({ imageURL: URL.createObjectURL(this.uploadInput.files[0]) })
    console.log(this.uploadInput.files[0].name.replace(" ","_"));
    this.props.update(this.uploadInput.files[0].name.replace(" ","_"));



    fetch('http://db8.cse.nd.edu:5014/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then(() => {
        //this.setState({ imageURL: URL.createObjectURL(ev.target.files[0]) });
        console.log("success");
      });
    });
  }

  render() {
    return (
      <form onSubmit={this.handleUploadImage}>
        <div>
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
        </div>
        <div>
          <p></p>
          <button>Upload</button>
        </div>
        <img src={this.state.imageURL} alt="[IMAGE HERE]" />

      </form>
    );
  }
}
export default ImageInput;
