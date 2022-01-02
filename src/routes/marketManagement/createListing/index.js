import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Input, Row, Col, Modal, Form, Spin } from "antd";
import IntlMessages from "../../../util/IntlMessages";
import DataItem from "../../auctionManagement/createAuction/DataItemAuction";
import { getNFT, getNFTTypes } from "../../../services/NFT";
import { createListing } from "../../../services/MarketPlace";
import { NotificationManager } from "react-notifications";
import ReactPlayer from "react-player";
import { toNumber } from "lodash-es";
import { useHistory } from "react-router-dom";
import { JOB_STATUS } from "../../../constants/utils";
import { handleCheckJobId } from "../../../services/JobService";
import { customGetCollectionMeta } from "../../../apiContracts/listenNFT";
import { Pagination } from 'antd';

const CreateListing = () => {
  const history = useHistory();
  const [nftTypeId, setNftTypeId] = useState(-1);
  const [nftName, setNftName] = useState("");
  const [orderTime, setOrderTime] = useState(true);
  const [mostLike, setMostLike] = useState(true);

  const [nftTypes, setNftTypes] = useState([]);
  const [nftList, setNftList] = useState([]);
  const [totalNft, setTotalNft] = useState(0);
  const [nftCurrentPage, setNftCurrentPage] = useState(1);
  const [nftPageSize] = useState(10);
  const [currentNftId, setCurrentNftId] = useState(null);
  const [nftDetail, setNftDetail] = useState(null);
  const [createListingOpen, setCreateListingOpen] = useState(null);
  const [formCreateListing] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageNFTs, setPageNFTs] = useState([]);

  useEffect(() => {
    loadNFTTypes();
    loadNFTs();
  }, []);

  useEffect(() => {
    setNftCurrentPage(1);
  }, [orderTime, mostLike, nftTypeId, nftName]);

  const loadNFTTypes = async () => {
    const res = await getNFTTypes();
    setNftTypes(res.data);
  };

  const loadNFTs = () => {
    setLoading(true);
    customGetCollectionMeta(process.env.REACT_APP_LISTEN_MARKET_PLACE)
      .then((res) => {
        res?.sort((a, b) => parseInt(b?.id) - parseInt(a?.id))
        setNftList(res);
        const offset = (currentPage - 1) * pageSize
        const limit = pageSize
        const pageNFTs = res.slice(offset, limit)
        setPageNFTs([...pageNFTs])
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onPageChanged = (page, pageSize) => {
    setPageSize(pageSize)
    setCurrentPage(page)
    const offset = (page - 1) * pageSize
    const limit = page * pageSize
    const pageNFTs = nftList.slice(offset, limit)
    setPageNFTs([...pageNFTs])
  }

  const loadNFTDetail = (nftId) => {
    getNFT(nftId).then((res) => {
      const nftDetail = res.data;
      nftDetail.props = JSON.parse(res.data.meta_data);
      setNftDetail(nftDetail);
    });
  };

  const handleCreateAuction = () => {
    setCreateListingOpen(true);
  };

  const cancelCreateListing = () => {
    setCreateListingOpen(false);
  };

  const onCreateListingSuccess = () => {
    setLoading(false);
    setCreateListingOpen(false);
    history.push("/market/listing");
  };

  const onCreateListingFailed = () => {
    setLoading(false);
    setCreateListingOpen(false);
  };

  const confirmCreateListing = () => {
    formCreateListing.validateFields().then(() => {
      const marketPlaceItem = {
        itemId: toNumber(currentNftId),
        price: formCreateListing.getFieldsValue().price,
      };
      setCreateListingOpen(false);
      setLoading(true);

      createListing(marketPlaceItem)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.status == JOB_STATUS.ACCEPTED) {
              handleCheckJobId(
                res.data.jobId,
                onCreateListingSuccess,
                onCreateListingFailed
              );
            }
          } else {
            NotificationManager.error(<IntlMessages id="failed" />, "");
          }
        })
        .catch(() => {
          NotificationManager.error(<IntlMessages id="failed" />, "");
          setLoading(false);
        });
    });
  };

  const handleOnclickDetail = (event, value) => {
    setCurrentNftId(value.nftId);
    setNftDetail(value);
  };
  return (
    <Card
      title={
        <Fragment>
          <h1></h1>
          <h1>
            {" "}
            <IntlMessages id={"market.create.title"} />
          </h1>
          <br />
          {/* <Button
            type={nftTypeId === -1 ? "primary" : "default"}
            className="no-border"
            onClick={() => setNftTypeId(-1)}
          >
            <IntlMessages id="nft.all.items" />
          </Button>
          {nftTypes.map((type, index) => {
            return (
              <Button
                type={nftTypeId === type.id ? "primary" : "default"}
                className="no-border"
                key={index}
                onClick={() => setNftTypeId(type.id)}
              >
                <IntlMessages id={"nft." + type.key_language} />
              </Button>
            );
          })}
          <Button type="primary" className="float-right" onChange={resetFilter}>
            <IntlMessages id="nft.clear.filter" />
          </Button> */}
        </Fragment>
      }
    >
      <Spin spinning={loading} size="large" className="loading">
        {/* <Row gutter={24}>
          <Col lg={8} md={8} sm={8} xs={8}>
            <span className="description">
              <IntlMessages id="nft.name" />
            </span>
            <Input size="large" onChange={onNftNameChange} value={nftName} />
          </Col>
          <Col lg={8} md={8} sm={8} xs={8}>
            <span className="description">
              <IntlMessages id="nft.sort.by" />
            </span>
            <Select
              size="large"
              style={selectStyle}
              value={orderTime}
              onChange={onOrderTimeChange}
            >
              <Option value={true}>
                <IntlMessages id="nft.sort.by.recentlyAdded" />
              </Option>
              <Option value={false}>
                <IntlMessages id="nft.sort.by.oldest" />
              </Option>
            </Select>
          </Col>
          <Col lg={8} md={8} sm={8} xs={8}>
            <span className="description">
              <IntlMessages id="nft.likes" />
            </span>
            <Select
              size="large"
              style={selectStyle}
              value={mostLike}
              onChange={onMostLikeChange}
            >
              <Option value={true}>
                <IntlMessages id="nft.likes.mostLiked" />
              </Option>
              <Option value={false}>
                <IntlMessages id="nft.likes.leastLiked" />
              </Option>
            </Select>
          </Col>
        </Row>
        <br />
        <br /> */}
        <Row gutter={24}>
          <Col lg={16} md={16} sm={24} xs={24}>
            <Row gutter={24}>
              <Col lg={24} md={24} sm={24} xs={24}>
                {pageNFTs.map((nft, index) => {
                  return (
                    <DataItem
                      key={index}
                      data={nft}
                      currentId={nftDetail?.nftId}
                      handleClick={handleOnclickDetail}
                    />
                  );
                })}
              </Col>
              <Pagination
                  total={nftList?.length}
                  showSizeChanger
                  defaultCurrent={currentPage}
                  currentPage={currentPage}
                  onChange={onPageChanged}
                  onShowSizeChange={onPageChanged}
                  showTotal={total => `${total} items`}
                />
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                style={{ textAlign: "center" }}
              >
               
              </Col>
            </Row>
          </Col>
          {nftDetail && (
            <Col lg={8} md={8} sm={24} xs={24}>
              <Card className="gx-card preview">
                <Fragment>
                  {nftDetail.mime_type === "video/mp4" ? (
                    <ReactPlayer
                      url={nftDetail?.imageURL}
                      className="img-preview"
                      loop={true}
                      controls={true}
                    />
                  ) : (
                    <img alt="" className="img-preview" src={nftDetail.imageURL} />
                  )}
                  <div className="name">{nftDetail.name}</div>
                  <div className="description">
                    ID: {nftDetail?.nftId}
                  </div>
                  <div className="description">
                    {nftDetail.nftTypeName}, {nftDetail.edition}
                  </div>
                  <br />
                  <div className="description">{nftDetail.description}</div>
                  {/* {nftDetail.meta_data !== "{}" && (
                    <Fragment>
                      <br />
                      <h4>
                        <IntlMessages id="nft.create.preview.properties" />
                      </h4>
                    </Fragment>
                  )}
                  {Object.keys(nftDetail.props).map((key, index) => {
                    return (
                      <div className="description prop" key={index}>
                        {key}: {nftDetail.props[key]}
                      </div>
                    );
                  })} */}
                  {/* {nftDetail && nftDetail?.subItem !== '' && nftDetail?.subItem?.length > 0 && (
                    <Fragment>
                      <br />
                      <h4>
                        <IntlMessages id="items" />
                      </h4>
                    </Fragment>
                  )}
                  {nftDetail && nftDetail?.subItem !== '' && nftDetail?.subItem?.length > 0 && nftDetail?.subItem?.map((item, index) => {
                    return (
                      <div className="item" key={index}>
                        <span>{item.name}</span>
                        <div className="nft-url-item">
                          <i className="icon icon-link" />
                          &nbsp;
                          <span target='_black'>{item.url}</span>
                        </div>
                        <span className="description">
                          {item.short_content}
                        </span>
                      </div>
                    );
                  })} */}
                  <br />
                  <Fragment>
                    <Button type="primary" onClick={handleCreateAuction}>
                      <IntlMessages id="market.create.listing" />
                    </Button>
                  </Fragment>
                </Fragment>
              </Card>
            </Col>
          )}
        </Row>
        {nftDetail && nftDetail && (
          <Modal
            closable={false}
            title={<IntlMessages id="market.create.listing" />}
            visible={createListingOpen}
            onOk={confirmCreateListing}
            onCancel={cancelCreateListing}
            okText={<IntlMessages id="confirm" />}
            cancelText={<IntlMessages id="cancel" />}
          >
            <Form
              layout="vertical"
              name="createListing"
              form={formCreateListing}
            >
              <Form.Item
                label={<IntlMessages id="nft.createAuction.itemName" />}
              >
                <Input size="large" value={nftDetail.name} readOnly={true} />
              </Form.Item>
              <Form.Item
                label={<IntlMessages id="market.create.price" /> }
                name="price"
                rules={[
                  {
                    required: true,
                    message: <IntlMessages id="market.create.price.require" />,
                  },
                ]}
              >
                <Input size="large" type="number" />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </Spin>
    </Card>
  );
};

export default CreateListing;
