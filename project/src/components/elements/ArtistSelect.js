import React, { useState } from "react";
import Select from "react-select";




export default function ArtistSelect(props) {
  // React state to manage selected options
  const [selectedOptions, setSelectedOptions] = useState();

  // const [optionList, setOptionList] = useState();
  //
  //     React.useEffect(() => {
  //         fetch('http://db8.cse.nd.edu:5014/getlist?type=artist',
  //             {method: "GET"}).then(response => response.json().then((dataf) => {
  //                 console.log(dataf.optionList);
  //                 setOptionList(dataf.optionList);
  //           })
  //         );
  //     }, []);

  //const optionList = [{"label": 'weird', "value" : 0}, {"label": 'cool', "value" : 7}] //get_genres();

  const optionList = props.props;

  var optionsList = [];
  optionList.forEach(function (element) {
    optionsList.push({ "label": element.name , "id": element.id})
  });




  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
    console.log(optionsList);
    props.update(data);
}

  return (
    <div className="app">
      <h2>Select Artists</h2>
      <div className="dropdown-container">
        <Select
          options={optionsList}
          placeholder="Search Musaic database"
          value={selectedOptions}
          onChange={handleSelect}
          isSearchable={true}
        />
      </div>
    </div>
  );
}
