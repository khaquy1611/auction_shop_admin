import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Row, Col, Spin } from "antd";
import IntlMessages from "../../../util/IntlMessages";
import DataItem from "../listCompleteAuction/DataItem";
import { getNFTTypes } from "../../../services/NFT";
import { settleAuction, removeAuction } from "../../../services/Auction";
import { checkJobId } from "../../../services/JobService";
import Countdown from "../listCompleteAuction/Countdown";
import { customeGetAucionsMeta } from '../../../apiContracts/listenAuction'
import { NotificationManager } from "react-notifications";
import { JOB_STATUS } from "../../../constants/utils"
import { formatAmount } from "../../../modules/Utils"
import ReactPlayer from "react-player";
import { Pagination } from 'antd';

const ListAuction = () => {
    const [nftTypes, setNftTypes] = useState([]);
    const [auctionDetail, setAuctionDetail] = useState(null);
    const [nftDetail, setNftDetail] = useState(null);
    const [subItem, setSubItem] = useState(null);
    const [metaData, setMetaData] = useState("");
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageData, setPageData] = useState([]);

    useEffect(() => {
        setLoading(true)
        loadNFTTypes();
        customeGetAucionsMeta().then(auctions => {
            auctions?.sort((a, b) => parseInt(b?.auctionID) - parseInt(a?.auctionID))
            setAuctions(auctions)
            const offset = (currentPage - 1) * pageSize
            const limit = pageSize
            const page = auctions.slice(offset, limit)
            setPageData([...page])
            setLoading(false)
        })
    }, []);

    const onPageChanged = (page, pageSize) => {
        setPageSize(pageSize)
        setCurrentPage(page)
        const offset = (page - 1) * pageSize
        const limit = page * pageSize
        const pages = auctions.slice(offset, limit)
        setPageData([...pages])
    }

    const loadNFTTypes = async () => {
        const res = await getNFTTypes();
        setNftTypes(res.data);
    }

    const setCurrentAuction = (auction) => {
        setAuctionDetail(auction)
        setNftDetail(auction.nftCollection[0])
        const subItem = JSON.parse(auction.nftCollection[0].subItem)
        setSubItem(subItem)
        const nftMetaData = JSON.parse(auction.nftCollection[0].metaData)
        if (nftMetaData !== "{}" && nftMetaData !== "") {
            setMetaData(nftMetaData)
        } else {
            setMetaData(null)
        }
    }

    const onClickSettleAuction = (auctionId) => {
        setLoading(true)
        settleAuction(auctionId).then(res => {
            if (res.status == 200) {
                if (res.data.status == JOB_STATUS.ACCEPTED) {
                    handleCheckJobId(res.data.jobId)
                }
            } else {
                NotificationManager.error(<IntlMessages id="failed" />, "");
            }
            setLoading(false)
        })
    }

    const onClickRemoveAuction = (auctionId) => {
        removeAuction(auctionId).then(res => {
            if (res.status == 200) {
                if (res.data.status == "Accepted") {
                    NotificationManager.success(<IntlMessages id="success" />, "");
                }
            } else {
                NotificationManager.error(<IntlMessages id="failed" />, "");
            }
            setLoading(false)
        })
    }

    const handleCheckJobId = (jobId) => {
        checkJobId(jobId).then((res) => {
            if (res?.data?.status === JOB_STATUS.ERROR) {
                NotificationManager.error(<IntlMessages id="failed" />, "");
            }
            if (res?.data.status === JOB_STATUS.ACCEPTED) {
                NotificationManager.success(<IntlMessages id="waiting" />, "");
                const interval = setInterval(() => {
                    checkJobId(jobId).then((res) => {
                        if (res?.data?.status === JOB_STATUS.COMPLETE) {
                            clearInterval(interval);
                            NotificationManager.success(<IntlMessages id="success" />, "");
                        }
                        if (res?.data?.status === JOB_STATUS.ERROR) {
                            clearInterval(interval);
                            NotificationManager.error(<IntlMessages id="failed" />, "");
                        }
                    });
                }, 3000);
                setTimeout(() => {
                    clearInterval(interval);
                }, 30000);
            }
        })
    }

    return <Card title={
        <Fragment>
            <h1><IntlMessages id="list.auction.management" /></h1>
            <br />
            {/* <Button type={nftTypeId === -1 ? "primary" : "default"}
                    className="no-border"
                    onClick={() => setNftTypeId(-1)}><IntlMessages id="nft.all.items"/></Button>
            {
                nftTypes.map((type, index) => {
                    return <Button type={nftTypeId === type.id ? "primary" : "default"}
                                   className="no-border"
                                   key={index}
                                   onClick={() => setNftTypeId(type.id)}>
                        {type.name}
                    </Button>
                })
            }
            <Button type="primary" className="float-right" onClick={resetFilter}>
                <IntlMessages id="list.auction.clear.filter"/>
            </Button> */}
        </Fragment>
    }>
        {/* <Row gutter={24}>
            <Col lg={6} md={6} sm={6} xs={6}>
                <span className="description"><IntlMessages id="list.auction.price.range"/></span>
                <br/>
                <Slider defaultValue={30} min={30} max={1000}/>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6}>
                <span className="description"><IntlMessages id="list.auction.sort.by"/></span>
                <Select size="large" style={selectStyle}
                        value={orderTime} onChange={onOrderTimeChange}>
                    <Option value={true}><IntlMessages id="list.auction.sort.by.recentlyAdded"/></Option>
                    <Option value={false}><IntlMessages id="list.auction.sort.by.oldest"/></Option>
                </Select>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6}>
                <span className="description"><IntlMessages id="list.auction.likes"/></span>
                <Select size="large" style={selectStyle}
                        value={mostLike} onChange={onMostLikeChange}>
                    <Option value={true}><IntlMessages id="list.auction.likes.mostLiked"/></Option>
                    <Option value={false}><IntlMessages id="list.auction.likes.leastLiked"/></Option>
                </Select>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6}>
                <span className="description"><IntlMessages id="list.auction.creator"/></span>
                <br/>
                <Select className="gx-mb-3" style={selectStyle}
                        value={creator} onChange={onCreatorChange}>
                    <Option value={1}><IntlMessages id="list.auction.creator.verifiedOnly"/></Option>
                    <Option value={2}><IntlMessages id="list.auction.creator.all"/></Option>
                    <Option value={3}><IntlMessages id="list.auction.creator.mostLiked"/></Option>
                </Select>
            </Col>
        </Row> */}
        <br />
        <br />
        <Spin spinning={loading} className="loading" style={{ position: 'absolute', zIndex: 999, left: '50%' }}></Spin>
        <Row gutter={24}>
            <Col lg={16} md={16} sm={24} xs={24}>
                <Row gutter={24}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        {
                            pageData?.map((auction, index) => {
                                return <DataItem data={auction} key={index}
                                    currentId={auctionDetail?.auctionID}
                                    handleClick={() => setCurrentAuction(auction)}
                                />;
                            })
                        }
                    </Col>
                    <Pagination
                        total={auctions?.length}
                        showSizeChanger
                        defaultCurrent={currentPage}
                        onChange={onPageChanged}
                        onShowSizeChange={onPageChanged}
                        showTotal={total => `${total} items`}
                />
                </Row>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
                <Card className="gx-card preview">
                    {
                        auctionDetail && nftDetail &&
                        <Fragment>
                            {nftDetail?.mime_type === "video/mp4" ? (
                                <ReactPlayer
                                className="img-preview"
                                url={nftDetail?.imageURL}
                                loop={true}
                                controls={true}
                                />
                            ) : (
                                <img alt="" className="img-preview" src={nftDetail?.imageURL} />
                            )}
                            <span className="status">{auctionDetail.auctionState}</span>
                            <div className="name">
                                {nftDetail.name}
                            </div>
                            <br />
                            <div className="description">
                                AuctionId: {auctionDetail?.auctionID} - NFTId: {nftDetail?.id} 
                            </div>
                            <div className="description">
                                {nftDetail.short_content}
                            </div>
                            <div className="auction-detail">
                                <img alt="" src="/assets/images/icons/icon_description.svg" className="img-icon" />
                                &nbsp;
                                <span className="description">
                                    <IntlMessages id="description" />: {nftDetail.description}
                                </span>
                            </div>
                            <div className="auction-detail">
                                <img alt="" src="/assets/images/icons/usd-2.png" className="img-icon" />
                                &nbsp;
                                <span className="description">
                                    <IntlMessages id="minPrice" />: ${formatAmount(auctionDetail.startingPrice)}
                                </span>
                            </div>
                            <div className="auction-detail">
                                <img alt="" src="/assets/images/icons/usd-3.png" className="img-icon" />
                                &nbsp;
                                <span className="description">
                                    <IntlMessages id="currentBid" />: ${formatAmount(auctionDetail.currentBid)}
                                </span>
                            </div>
                            <div className="auction-detail">
                                <img alt="" src="/assets/images/icons/auction-2.png" className="img-icon" />
                                &nbsp;
                                <span className="description">
                                    <IntlMessages id="bid" />: {auctionDetail.history.length}
                                </span>
                            </div>
                            <div className="auction-detail">
                                <Countdown status={auctionDetail.auctionState} startDate={auctionDetail.endTime * 1000} />
                            </div>
                            {
                                metaData !== "" &&
                                <Fragment>
                                    <br />
                                    <h4>
                                        <IntlMessages id="nft.create.preview.properties" />
                                    </h4>
                                </Fragment>
                            }
                            {
                                Object.keys(metaData).map((key, index) => {
                                    return <div className="description prop" key={index}>
                                        {key}: {metaData[key]}
                                    </div>
                                })
                            }
                            {
                                subItem.length > 0 &&
                                <Fragment>
                                    <br />
                                    <h4>
                                        <IntlMessages id="items" />
                                    </h4>
                                </Fragment>
                            }
                            {
                                subItem.map((item, index) => {
                                    return <div className="item" key={index}>
                                        <span>{item.name}</span>
                                        <div className="nft-url-item">
                                            <i className="icon icon-link" />
                                            &nbsp;
                                            <span>{item.url}</span>
                                        </div>
                                        <span className="description">{item.short_content}</span>
                                    </div>
                                })
                            }
                            <Fragment>
                                <Button className="mt-10" type="primary" onClick={() => onClickSettleAuction(auctionDetail.auctionID)}>
                                    <IntlMessages id="list.auction.settle" />
                                </Button>
                                <Button className="btn-remove mt-10" onClick={() => onClickRemoveAuction(auctionDetail.auctionID)}>
                                    <IntlMessages id="list.auction.remove" />
                                </Button>
                            </Fragment>
                        </Fragment>
                    }
                </Card>
            </Col>
        </Row>

    </Card>
};

export default ListAuction;