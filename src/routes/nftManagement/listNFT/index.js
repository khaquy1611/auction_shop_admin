import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Select, Input, Row, Col, Modal, Form, Spin } from "antd";
import IntlMessages from "../../../util/IntlMessages";
import DataItem from "../tempNFT/DataItem";
import {
  getNFT,
  approveNFT,
  getNFTTypes,
} from "../../../services/NFT";
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { createAuction } from "../../../services/Auction";
import { NotificationManager } from "react-notifications";
import ReactPlayer from "react-player";
import { customGetCollectionMeta } from "../../../apiContracts/listenNFT"
import { Pagination } from 'antd';


const ListNFT = () => {
  const [nftTypes, setNftTypes] = useState([]);
  const [nftList, setNftList] = useState([]);
  const [currentNftId, setCurrentNftId] = useState(null);
  const [nftDetail, setNftDetail] = useState();
  const [approveNftOpen, setApproveNftOpen] = useState(false);
  const [createAuctionOpen, setCreateAuctionOpen] = useState(null);
  const [formCreateAuction] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageNFTs, setPageNFTs] = useState([]);

  useEffect(() => {
    loadNFTTypes();
    loadNFTs();
  }, []);

  const loadNFTTypes = async () => {
    const res = await getNFTTypes();
    setNftTypes(res.data);
  };

  const loadNFTs = async () => {
    setLoading(true)
    customGetCollectionMeta(process.env.REACT_APP_LISTEN_NFT).then(res => {
      res?.sort((a, b) => parseInt(b?.id) - parseInt(a?.id))
      setNftList(res);

      const offset = (currentPage - 1) * pageSize
      const limit = pageSize
      const pageNFTs = res.slice(offset, limit)
      setPageNFTs([...pageNFTs])
      setLoading(false)
    }).catch(ex => {
      setLoading(false)
    })
  };

  const loadNFTDetail = (nftId) => {
    getNFT(nftId).then((res) => {
      const nftDetail = res.data;
      nftDetail.props = JSON.parse(res.data.meta_data);
      setNftDetail(nftDetail);
    });
  };

  const cancelApproveNft = () => {
    setApproveNftOpen(false);
  };

  const confirmApproveNft = () => {
    approveNFT(currentNftId).then((res) => {
      setApproveNftOpen(false);
      setLoading(false);
      loadNFTs();
      loadNFTDetail(currentNftId);
    });
    setLoading(true);
  };

  const cancelCreateAuction = () => {
    setCreateAuctionOpen(false);
  };

  const confirmCreateAuction = () => {
    formCreateAuction.validateFields().then((res) => {
      const auction = {
        itemId: currentNftId,
        bidStep: formCreateAuction.getFieldsValue().bidStep,
        minimumPrice: formCreateAuction.getFieldsValue().minimumPrice,
      };

      let startTime = new Date(
        formCreateAuction.getFieldsValue().startDate +
        " " +
        formCreateAuction.getFieldsValue().startTime
      );
      startTime = moment(startTime).unix();
      auction.beginTime = startTime;

      let endTime = new Date(
        formCreateAuction.getFieldsValue().endDate +
        " " +
        formCreateAuction.getFieldsValue().endTime
      );
      endTime = moment(endTime).unix();
      auction.endTime = endTime;

      createAuction(auction).then((res) => {
        setCreateAuctionOpen(false);
        NotificationManager.success(
          <IntlMessages id="nft.createAuction.success" />,
          ""
        );
        history.push("/auction/list-auction");
      });
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

  return (
    <> <Spin spinning={loading} size="large"
      style={{ position: "absolute", zIndex: 9999 }}>
      <Card
        title={
          <Fragment>
            <h1>
              <IntlMessages id="nft.management" />
            </h1>
            {/* <br />
          <Button
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
        </Row>*/}
        <Row gutter={24}>
          <Col lg={16} md={16} sm={24} xs={24}>
            <Row gutter={24}>
              <Col lg={24} md={24} sm={24} xs={24}>
                {pageNFTs?.map((nft, index) => {
                  return (
                    <DataItem
                      key={index}
                      data={nft}
                      currentId={nftDetail?.id}
                      handleClick={() => {
                        nft.metaData = JSON.parse(nft?.metaData)
                        setNftDetail(nft)
                      }}
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
                lg={24} md={24} sm={24} xs={24}
                style={{ textAlign: "center" }}
              >
                {/* <Button type="primary" onClick={loadMore}>
                  <IntlMessages id="loadMore" />
                </Button> */}
              </Col>
            </Row>
          </Col>
          {nftDetail && (

            <Col lg={8} md={8} sm={24} xs={24}>
              <Card className="gx-card preview">

                <Fragment>
                  {nftDetail.mime_type.indexOf("image") === 0 ? (
                    <img alt="" className="img-preview" src={nftDetail?.imageURL} />
                  ) : (
                      <ReactPlayer
                        url={nftDetail?.mediaUrl}
                        className="img-preview"
                        loop={true}
                        controls={true}
                      />
                  )}
                  <div className="name">{nftDetail?.name}</div>
                  <div className="description">
                    {nftDetail?.nftTypeName}, {nftDetail?.edition}
                  </div>
                  <br />
                  <div className="description">{nftDetail?.description}</div>
                  {nftDetail.metaData !== "{}" && (
                    <Fragment>
                      <br />
                      <h4>
                        <IntlMessages id="nft.create.preview.properties" />
                      </h4>
                    </Fragment>
                  )}
                  {nftDetail?.metaData && Object.keys(nftDetail?.metaData).map((key, index) => {
                    return (
                      <div className="description prop" key={index}>
                        {key}: {nftDetail?.metaData[key]}
                      </div>
                    );
                  })}
                  {nftDetail?.subItems?.length > 0 && (
                    <Fragment>
                      <br />
                      <h4>
                        <IntlMessages id="items" />
                      </h4>
                    </Fragment>
                  )}
                  {nftDetail?.subItems && nftDetail?.subItems?.map((item, index) => {
                    return (
                      <div className="item" key={index}>
                        <span>{item?.name}</span>
                        <div className="nft-url-item">
                          <i className="icon icon-link" />
                          &nbsp;
                          <span>{item?.url}</span>
                        </div>
                        <span className="description">
                          {item?.description}
                        </span>
                      </div>
                    );
                  })}
                  <br />
                  <Fragment>
                    <Button type="primary">
                      <IntlMessages id="nft.transfer" />
                    </Button>
                    <Button type="danger">
                      <IntlMessages id="nft.remove" />
                    </Button>
                  </Fragment>
                </Fragment>
              </Card>
            </Col>

          )}

        </Row>

        {nftDetail && (
          <SweetAlert
            show={approveNftOpen}
            warning
            showCancel
            cancelBtnText={<IntlMessages id="cancel" />}
            confirmBtnText={<IntlMessages id="confirm" />}
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title={<IntlMessages id="nft.approve.title" />}
            onConfirm={confirmApproveNft}
            onCancel={cancelApproveNft}
            focusConfirmBtn={false}
          >
            <IntlMessages id="nft.approve.content" />
            &nbsp;
            <strong>{nftDetail.name}</strong>
          </SweetAlert>
        )}
        {nftDetail && (
          <Modal
            closable={false}
            title={<IntlMessages id="nft.createAuction.title" />}
            visible={createAuctionOpen}
            onOk={confirmCreateAuction}
            onCancel={cancelCreateAuction}
            okText={<IntlMessages id="confirm" />}
            cancelText={<IntlMessages id="cancel" />}
          >
            <Form
              layout="vertical"
              name="createAuction"
              form={formCreateAuction}
            >
              <Form.Item
                label={<IntlMessages id="nft.createAuction.itemName" />}
              >
                <Input size="large" value={nftDetail.name} readOnly={true} />
              </Form.Item>
              <Form.Item
                label={<IntlMessages id="nft.createAuction.minPrice" />}
                name="minimumPrice"
                rules={[
                  {
                    required: true,
                    message: (
                      <IntlMessages id="nft.createAuction.minPrice.require" />
                    ),
                  },
                ]}
              >
                <Input size="large" type="number" />
              </Form.Item>
              <Form.Item
                label={<IntlMessages id="nft.createAuction.bidStep" />}
                name="bidStep"
                rules={[
                  {
                    required: true,
                    message: (
                      <IntlMessages id="nft.createAuction.bidStep.require" />
                    ),
                  },
                ]}
              >
                <Input size="large" type="number" />
              </Form.Item>
              <Form.Item
                label={<IntlMessages id="nft.createAuction.startDate" />}
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: (
                      <IntlMessages id="nft.createAuction.startDate.require" />
                    ),
                  },
                ]}
              >
                <Input size="large" type="date" />
              </Form.Item>
              <Form.Item
                label={<IntlMessages id="nft.createAuction.startTime" />}
                name="startTime"
                rules={[
                  {
                    required: true,
                    message: (
                      <IntlMessages id="nft.createAuction.startTime.require" />
                    ),
                  },
                ]}
              >
                <Input size="large" type="time" />
              </Form.Item>
              <Form.Item
                label={<IntlMessages id="nft.createAuction.endDate" />}
                name="endDate"
                rules={[
                  {
                    required: true,
                    message: (
                      <IntlMessages id="nft.createAuction.endDate.require" />
                    ),
                  },
                ]}
              >
                <Input size="large" type="date" />
              </Form.Item>
              <Form.Item
                label={<IntlMessages id="nft.createAuction.endTime" />}
                name="endTime"
                rules={[
                  {
                    required: true,
                    message: (
                      <IntlMessages id="nft.createAuction.endTime.require" />
                    ),
                  },
                ]}
              >
                <Input size="large" type="time" />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </Card>
      </Spin>
    </>
  );
};

export default ListNFT;
