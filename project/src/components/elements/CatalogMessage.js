import React from 'react';

function CatalogMessage(props) {


    console.log("size is ", props.size);


      if(props.size < 30){
          return(
              <div>There are {props.size} songs in the catalog. For best results, curate a catalog of <b> at least 30 songs</b></div>
          )
      }
      else if (props.size > 900)    {
          return(
              <div>There are {props.size} songs in the catalog <b> WARNING: </b> This will take a long time to process </div>
          )
      }
      else{

          return(
              <div>There are {props.size} songs in the catalog</div>
          )
      }
}
export default React.memo(CatalogMessage);
