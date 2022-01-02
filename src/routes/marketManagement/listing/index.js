import React, { Fragment, useEffect, useState } from "react";
import { Card, Select, Spin } from "antd";
import IntlMessages from "../../../util/IntlMessages";
import DataItem from "./DataItem";
import { customGetMarket, customGetListing, customGetMeta } from "../../../apiContracts/listenAuction"
import { removeMarketPlaceItem } from "../../../services/MarketPlace"
import { JOB_STATUS } from '../../../constants/utils'
import { handleCheckJobId } from "../../../services/JobService";

const Option = Select.Option;

const Listing = () => {
    const [loading, setLoading] = useState(false);
    const [marketPlaceIds, setMarketPlaceIds] = useState([]);
    const [marketPlaceItems, setMarketPlaceItems] = useState([]);
    const [filter, setFilter] = useState("all");
    const [displayMode, setDisplayMode] = useState("grid");
    const filterStyle = {
        width: '23%',
        marginRight: '20px'
    };
    const selectStyle = { width: '100%' };

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        var mpItems = []
        setLoading(true)
        customGetMarket(process.env.REACT_APP_LISTEN_MARKET_PLACE).then(res => {
            if (res) {
                res.forEach(async mpItemId => {
                    const mpItem = await customGetListing(process.env.REACT_APP_LISTEN_MARKET_PLACE, mpItemId)
                    const nftId = mpItem.nftIDs[0]
                    const nft = await customGetMeta(process.env.REACT_APP_LISTEN_MARKET_PLACE, nftId)
                    mpItem["nft"] = nft
                    mpItem["listingId"] = mpItemId
                    mpItems.push(mpItem)
                    setMarketPlaceItems([...mpItems])
                    setLoading(false)
                });
            }
            setLoading(false)
        })
    }

    const onCreateListingSuccess = () => {
        loadData()
    }

    const onCreateListingFailed = () => {
        setLoading(false)
    }

    const onRemoveMarketPlaceItem = (id) => {
        setLoading(true)
        removeMarketPlaceItem(id).then(res => {
            if (res?.status === 200) {
                if (res?.data.status === JOB_STATUS.ACCEPTED) {
                    handleCheckJobId(res?.data?.jobId, onCreateListingSuccess, onCreateListingFailed)
                }
            }
        })
    }

    const renderItem = () => {
        const marketPlace = marketPlaceItems.map((item, index) => (
          <DataItem onRemove={onRemoveMarketPlaceItem} data={item} key={index} />
        ));
        return <div>{marketPlace}</div>;
      };


    return <Card title={
        <Fragment>
            <h1><IntlMessages id="market.management" /></h1>
            <Spin spinning={loading} size="large" style={{ position: 'absolute', zIndex: 999, left: '50%', top: '100%' }}></Spin>
            {/* <br />
            <Button type={filter === "all" ? "primary" : "default"}
                className="no-border"
                onClick={() => setFilter(("all"))}><IntlMessages id="market.all.items" /></Button>
            <Button type={filter === "art" ? "primary" : "default"}
                className="no-border"
                onClick={() => setFilter(("art"))}><IntlMessages id="market.art" /></Button>
            <Button type={filter === "game" ? "primary" : "default"}
                className="no-border"
                onClick={() => setFilter(("game"))}><IntlMessages id="market.game" /></Button>
            <Button type={filter === "photo" ? "primary" : "default"}
                className="no-border"
                onClick={() => setFilter(("photo"))}><IntlMessages id="market.photo" /></Button>
            <Button type={filter === "music" ? "primary" : "default"}
                className="no-border"
                onClick={() => setFilter(("music"))}><IntlMessages id="market.music" /></Button>
            <Button type={filter === "video" ? "primary" : "default"}
                className="no-border"
                onClick={() => setFilter(("video"))}><IntlMessages id="market.video" /></Button>
            <Button type="primary" className="float-right">
                <IntlMessages id="market.clear.filter" />
            </Button> */}
        </Fragment>
    }>
        {/* <Form layout="inline">
            <div style={filterStyle}>
                <span className="description"><IntlMessages id="market.price.range" /></span>
                <br />
                <Slider defaultValue={30} min={30} max={1000} />
            </div>
            <div style={filterStyle}>
                <span className="description"><IntlMessages id="market.sort.by" /></span>
                <br />
                <Select className="gx-mb-3" defaultValue="lucy" style={selectStyle}>
                    <Option value="lucy">Recently added</Option>
                </Select>
            </div>
            <div style={filterStyle}>
                <span className="description"><IntlMessages id="market.likes" /></span>
                <br />
                <Select className="gx-mb-3" defaultValue="lucy" style={selectStyle}>
                    <Option value="lucy">Most liked</Option>
                </Select>
            </div>
            <div style={filterStyle}>
                <span className="description"><IntlMessages id="market.creator" /></span>
                <br />
                <Select className="gx-mb-3" defaultValue="lucy" style={selectStyle}>
                    <Option value="lucy">Verified only</Option>
                </Select>
            </div>
        </Form>

        <br />
        <Button type="default"><IntlMessages id="market.shuffle" /></Button>
        <Button type="default"><IntlMessages id="market.rotate" /></Button>
        <Button type="default" className="float-right no-border"
            onClick={() => setDisplayMode("grid")}>
            <i className="icon icon-apps" />
        </Button>
        <Button type="default" className="float-right no-border"
            onClick={() => setDisplayMode("list")}>
            <i className="icon icon-listing-dbrd" />
        </Button>
        <br />
        <br /> */}
        {
            marketPlaceItems && renderItem()
        }
    </Card>
};

export default Listing;