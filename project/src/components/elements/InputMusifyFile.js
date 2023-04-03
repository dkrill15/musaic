import React, { Component } from "react";
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import Image from '../elements/Image';

class InputMusifyFile extends Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.fileInput = React.createRef();
    }

    handleSubmit(event) {
      event.preventDefault();
      alert(
        `Selected file - ${this.fileInput.current.files[0].name}`
      );
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Upload file: 
            <input type="file" ref={this.fileInput} />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      );
    }
  }
  
  // const root = ReactDOM.createRoot(
  //   document.getElementById('root')
  // );
  // root.render(<FileInput />);

export default InputMusifyFile