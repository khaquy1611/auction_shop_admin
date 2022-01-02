import React, { useState }  from "react";
import ReactPlayer from "react-player";

const DataItem = (props) => {
    const {data, currentId} = props;
    const [play, setPlay] = useState();

    const handleClick = () => {
        props.handleClick();
    }

    return <div className={data.auctionID === currentId ? "nft-item active" : "nft-item"}
                onClick={handleClick}>
        <span className="status">{data.auctionState}</span>
        {data?.nftCollection[0]?.mime_type.indexOf("image") === 0 ? (
            <img alt="" src={data.nftCollection[0]?.imageURL} />
        ) : (
            <img alt="" src={data?.nftCollection[0]?.thumbURL} />
        )}
        <span className="name one-line">{data.nftCollection[0]?.name}</span>
        {/* <span className="end">
            <Countdown startDate={data.endTime * 1000}/>
        </span> */}

    </div>;
};

export default DataItem;