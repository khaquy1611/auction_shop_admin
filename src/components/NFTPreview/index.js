import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Select, Input, Row, Col, Modal, Form, Spin } from "antd";
import IntlMessages from "../../util/IntlMessages";
import ReactPlayer from "react-player";
import { getNFTStatus } from "../../modules/Utils";
import { EditOutlined } from "@ant-design/icons";

const NFTPreview = ({nftDetail, handleApproveNft, handleCreateAuction}) => {

    const [play, setPlay] = useState();

    return (
        <Card className="gx-card preview">
            {nftDetail && (
                <Fragment>
                    {nftDetail.mime_type.indexOf("images") === 0 ? (
                        <img alt="" className="img-preview" src={nftDetail?.url} />
                    ) : (
                        <div
                            onMouseOver={() => {
                                setPlay(true);
                            }}
                            onMouseLeave={() => {
                                setPlay(false);
                            }}
                        >
                            <ReactPlayer
                                url={nftDetail?.url}
                                className="img-preview"
                                playing={play}
                                loop={true}
                            />
                        </div>
                    )}
                    <span className="status">
                        {getNFTStatus(nftDetail?.status)}
                    </span>
                    <div className="name">{nftDetail?.name}</div>
                    <div className="description">
                        {nftDetail?.nft_type?.name}, {nftDetail?.edition}
                    </div>
                    <br />
                    <div className="description">{nftDetail?.short_content}</div>
                    { nftDetail?.meta_data && nftDetail?.meta_data !== "{}" && (
                        <Fragment>
                            <br />
                            <h4>
                                <IntlMessages id="nft.create.preview.properties" />
                            </h4>
                        </Fragment>
                    )}
                    {Object.keys(nftDetail?.props).map((key, index) => {
                        return (
                            <div className="description prop" key={index}>
                                {key}: {nftDetail?.props[key]}
                            </div>
                        );
                    })}
                    {nftDetail?.sub_items.length > 0 && (
                        <Fragment>
                            <br />
                            <h4>
                                <IntlMessages id="items" />
                            </h4>
                        </Fragment>
                    )}
                    {nftDetail?.sub_items.map((item, index) => {
                        return (
                            <div className="item" key={index}>
                                <span>{item.name}</span>
                                <div className="nft-url-item">
                                    <i className="icon icon-link" />
                          &nbsp;
                          <span>{item.url}</span>
                                </div>
                                <span className="description">
                                    {item.short_content}
                                </span>
                            </div>
                        );
                    })}
                    <br />
                    {nftDetail?.status === "pending" ? (
                        <Fragment>
                            <Button type="primary" onClick={handleApproveNft}>
                                <IntlMessages id="nft.approve" />
                            </Button>
                            <Button className="btn-remove">
                                <IntlMessages id="nft.remove" />
                            </Button>
                            {/* <Button
                                icon={<EditOutlined />}
                                className="btn-edit float-right"
                                onClick={goToDetailNft}
                            ></Button> */}
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button type="primary" onClick={handleCreateAuction}>
                                <IntlMessages id="nft.createAuction" />
                            </Button>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </Card>
    )

}

export default NFTPreview;