import React, { useState } from "react";
import ReactPlayer from "react-player";
import * as _ from "lodash";
const DataItem = (props) => {
  const { data, currentId, selectedItems } = props;
  const [play, setPlay] = useState();

  const handleClick = (event) => {
    props.handleClick(event, data);
  };

  const selectedItem = () => {
    if (selectedItems?.length > 1 && selectedItems?.includes(data)) {
      return true
    }
    else if (data?.id === currentId) {
      return true
    }
    return false
  }

  return (
    <div
      className={selectedItem() == true ? "nft-item active" : "nft-item"}
      onClick={handleClick}
    >
      {
        data.mime_type === "video/mp4" ?
          <img alt="" src={data?.thumbURL} />
          :
          <img alt="" src={data?.imageURL} />
      }

      <span className="name one-line">{data?.name}</span>
    </div>
  );
};

export default DataItem;
