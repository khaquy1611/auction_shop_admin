import React, { useState } from "react";
import { getNFTStatus } from "../../../modules/Utils";

const DataItem = (props) => {
  const { data, currentId } = props;
  const [play, setPlay] = useState();
  const handleClick = () => {
    props.handleClick(data);
  };

  return (
    <div
      className={data.id === currentId ? "nft-item active" : "nft-item"}
      onClick={handleClick}
    >
      {data.status && 
        <span className="status">{getNFTStatus(data.status)}</span>
      }
      {data.mime_type.indexOf("image") === 0 ? (
        <img alt="" src={data?.imageURL ? data?.imageURL : data?.image_url} />
      ) : (
        <img alt="" src={data?.thumb_url ? data?.thumb_url : data?.thumbURL} />
      )}

      <span className="name one-line">{data.name}</span>
    </div>
  );
};

export default DataItem;
