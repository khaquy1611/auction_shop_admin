import React, { useState } from "react";
import { Button } from "antd";
import IntlMessages from "../../../util/IntlMessages";
import { formatAmount } from "../../../modules/Utils"
import ReactPlayer from "react-player";

const DataItem = (props) => {
    const nft = props?.data.nft
    const [play, setPlay] = useState();

    return (
        <div key={props?.key} className={"nft-item grid"}>
            {nft?.mime_type?.indexOf("image") === 0 ? (
            <img alt="" src={nft?.imageURL} />
            ) : (
                <img alt="" src={nft?.thumbURL} />
            )}
            <div className="ml-5">
                <div className="nft-item-description">
                    {nft?.name &&
                        <span className="title">
                            {nft?.name} 
                        </span>
                    }
                     {!nft?.name && <br/>}
                </div>
                <span className="price">
                    <img alt="" src="/assets/images/icons/usd-2.png" className="img-icon" />
                    <span className="description"></span> ${formatAmount(props?.data?.salePrice)}
                </span>
                <div>
                    <Button onClick={() => props.onRemove(props?.data?.listingId)} type="danger"><IntlMessages id="nft.remove" /></Button>
                </div>
            </div>
        </div>
    )

    // <div className="nft-item-description">
    // <span className="title">
    //     NFT Item
    // </span>
    // <span className="min-price">
    //     {/* <img alt="" src="/assets/images/icons/usd-2.png" className="img-icon"/> */}
    //     <span className="description"><IntlMessages id="nft.min.price" />:</span> $669
    // </span>
    // <span className="current-bid">
    //     {/* <img alt="" src="/assets/images/icons/usd-3.png" className="img-icon"/> */}
    //     <span className="description"><IntlMessages id="nft.current.bid" />:</span> $1200
    // </span>
    // <span className="total-bid">
    //     {/* <img alt="" src="/assets/images/icons/auction-2.png" className="img-icon"/> */}
    //     <span className="description"><IntlMessages id="nft.total.bid" />:</span> 29
    // </span>
    // <span className="end">
    //     {/* <img alt="" src="/assets/images/icons/clock.png" className="img-icon"/> */}
    //     <span className="description"><IntlMessages id="nft.end.in" /></span> 1 <span className="description"><IntlMessages id="nft.days" /></span> 10:49:14
    // </span>
    // </div>
    // <div className="nft-item-action">
    // <Button type="default"><IntlMessages id="nft.view.detail" /></Button>
    // <Button type="primary"><IntlMessages id="nft.approve" /></Button>
    // <Button type="danger"><IntlMessages id="nft.remove" /></Button>
    // </div>
};

export default DataItem;