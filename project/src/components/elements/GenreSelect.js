import React, { useState } from "react";
import Select from "react-select";




export default function GenreSelect(props) {
  // React state to manage selected options
  const [selectedOptions, setSelectedOptions] = useState();

  // const [optionList, setOptionList] = useState();
  //
  //     React.useEffect(() => {
  //         fetch('http://db8.cse.nd.edu:5014/getlist?type=genre',
  //             {method: "GET"}).then(response => response.json().then((dataf) => {
  //                 console.log(dataf.optionList);
  //                 setOptionList(dataf.optionList);
  //           })
  //         );
  //     }, []);

  //const optionList = [{"label": 'weird', "value" : 0}, {"label": 'cool', "value" : 7}] //get_genres();

  const optionList = props.list
  //console.log(optionList);



  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
    console.log(data);
    console.log(optionList);
    props.update_genre(data);
}

  return (
    <div className="app">
      <h2>Select Genres</h2>
      <div className="dropdown-container">
        <Select
          options={optionList}
          placeholder="Search Musaic database"
          value={selectedOptions}
          onChange={handleSelect}
          isSearchable={true}
          isMulti
        />
      </div>
    </div>
  );
}
