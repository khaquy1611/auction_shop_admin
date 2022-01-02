import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Select, Input, Row, Col, Modal, Form, Spin } from "antd";
import IntlMessages from "../../../util/IntlMessages";
import DataItem from "./DataItem";
import {
  getNFT,
  getNFTs,
  approveNFT,
  getNFTTypes,
  approveMultiNFT
} from "../../../services/NFT";
import { EditOutlined } from "@ant-design/icons";
import { getNFTStatus } from "../../../modules/Utils";
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { createAuction } from "../../../services/Auction";
import { NotificationManager } from "react-notifications";
import ReactPlayer from "react-player";
const Option = Select.Option;

const ListNFT = () => {
  const [nftTypeId, setNftTypeId] = useState(-1);
  const [nftName, setNftName] = useState("");
  const [orderTime, setOrderTime] = useState(true);
  const [mostLike, setMostLike] = useState(true);
  const selectStyle = { width: "100%" };
  const [play, setPlay] = useState();

  const [nftTypes, setNftTypes] = useState([]);
  const [nftList, setNftList] = useState([]);
  const [totalNft, setTotalNft] = useState(0);
  const [nftCurrentPage, setNftCurrentPage] = useState(1);
  const [nftPageSize] = useState(10);
  const [currentNftId, setCurrentNftId] = useState(null);
  const [nftDetail, setNftDetail] = useState(null);
  const [approveNftOpen, setApproveNftOpen] = useState(false);
  const [approveMultiNftOpen, setApproveMultiNftOpen] = useState(false);
  const [createAuctionOpen, setCreateAuctionOpen] = useState(null);
  const [formCreateAuction] = Form.useForm();
  const [formApproveMultiNFT] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const onNftNameChange = (e) => {
    setNftName(e.target.value);
  };

  const onOrderTimeChange = (value) => {
    setOrderTime(value);
  };

  const onMostLikeChange = (value) => {
    setMostLike(value);
  };

  const resetFilter = () => {
    setNftName("");
    setNftTypeId(-1);
    setOrderTime(true);
    setMostLike(true);
  };

  const loadNFTTypes = async () => {
    const res = await getNFTTypes();
    setNftTypes(res.data);
  };

  const loadNFTs = async () => {
    const res = await getNFTs(
      nftCurrentPage,
      nftPageSize,
      orderTime,
      mostLike,
      nftTypeId,
      nftName
    );
    if (res.data.data.length > 0) {
      if (nftCurrentPage === 1) {
        setNftList(res.data.data);
      } else {
        setNftList((nftList) => nftList.concat(res.data.data));
      }
      setTotalNft(res.data.total);
    }
    if (res.data.total > 0 && currentNftId === null && nftCurrentPage === 1) {
      setCurrentNftId(res.data.data[0].id);
      loadNFTDetail(res.data.data[0].id);
    }
  };

  const loadNFTDetail = (nftId) => {
    getNFT(nftId).then((res) => {
      const nftDetail = res.data;
      nftDetail.props = JSON.parse(res.data.meta_data);
      setNftDetail(nftDetail);
    });
  };

  const setCurrentNft = (nftId) => {
    setCurrentNftId(nftId.id);
    loadNFTDetail(nftId.id);
  };

  const handleApproveNft = () => {
    setApproveNftOpen(true);
  };

  const handleApproveMultiNft = () => {
    setApproveMultiNftOpen(true);
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

  const handleCreateAuction = () => {
    setCreateAuctionOpen(true);
  };

  const cancelCreateAuction = () => {
    setCreateAuctionOpen(false);
  };

  const cancelApproveMultiNft = () => {
    setApproveMultiNftOpen(false);
    setError()
    formApproveMultiNFT.resetFields()
  };

  const confirmApproveMultiNFT = () =>{
    formApproveMultiNFT.validateFields().then(res => {
      const fromEdition = formApproveMultiNFT.getFieldsValue().fromEdition
      const toEdition = formApproveMultiNFT.getFieldsValue().toEdition
      const editionSize = formApproveMultiNFT.getFieldsValue().editionSize
      if (parseInt(fromEdition) > parseInt(toEdition)) {
        setError(<IntlMessages id="nft.approve.multi.nft.fromEdition.less.than.toEdition" />)
        return
      }
      if (parseInt(editionSize) < parseInt(toEdition)) {
        setError(<IntlMessages id="nft.approve.multi.nft.editionSize.larger.than.toEdition" />)
        return
      }
      setLoading(true);
      setApproveMultiNftOpen(false);

      approveMultiNFT(currentNftId, fromEdition, toEdition, editionSize).then((res) => {
        setLoading(false);
        if (res.status == 200) {
          if (res.data?.Success === true) {
            loadNFTs();
            loadNFTDetail(currentNftId);
            cancelApproveMultiNft()
            NotificationManager.success(<IntlMessages id="success" />, "");
          } else {
            NotificationManager.error(<IntlMessages id="failed" />, "");
          }
        } else {
          NotificationManager.error(<IntlMessages id="failed" />, "");
        }
      }).catch(ex => {
        console.error("approveMultiNFT error", ex);
        NotificationManager.error(<IntlMessages id="failed" />, "");
        setLoading(false)
      })
    })
  }

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

  const goToDetailNft = () => {
    history.push("/nft/detail/" + currentNftId);
  };

  const loadMore = () => {
    if (nftList.length < totalNft) {
      setNftCurrentPage((nftCurrentPage) => nftCurrentPage + 1);
    }
  };

  useEffect(() => {
    loadNFTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftCurrentPage, nftPageSize, orderTime, mostLike, nftTypeId, nftName]);

  useEffect(() => {
    loadNFTTypes();
  }, []);

  useEffect(() => {
    setNftCurrentPage(1);
  }, [orderTime, mostLike, nftTypeId, nftName]);

  return (
    <Spin spinning={loading} size="large" style={{ position: "absolute", zIndex: 999 }}>
    <Card
      title={
        <Fragment>
          <h1>
            <IntlMessages id="nft.management" />
          </h1>
          <br />
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
                {type.name}
              </Button>
            );
          })}
          <Button type="primary" className="float-right" onChange={resetFilter}>
            <IntlMessages id="nft.clear.filter" />
          </Button>
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
        </Row> */}
        <br />
        <br />
        <Row gutter={24}>
          <Col lg={16} md={16} sm={24} xs={24}>
            <Row gutter={24}>
              <Col lg={24} md={24} sm={24} xs={24}>
                {nftList.map((nft, index) => {
                  return (
                    <DataItem
                      key={index}
                      data={nft}
                      currentId={currentNftId}
                      handleClick={setCurrentNft}
                    />
                  );
                })}
              </Col>
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                style={{ textAlign: "center" }}
              >
                {/* <Button type="primary" onClick={loadMore}>
                  <IntlMessages id="loadMore" />
                </Button> */}
              </Col>
            </Row>
          </Col>
          <Col lg={8} md={8} sm={24} xs={24}>
            <Card className="gx-card preview">
              {nftDetail && (
                <Fragment>
                  {nftDetail.mime_type.indexOf("images") === 0 ? (
                    <img alt="" className="img-preview" src={nftDetail.url} />
                  ) : (
                      <ReactPlayer
                        url={nftDetail.url}
                        className="img-preview"
                        playing={play}
                        loop={true}
                        controls={true}
                      />
                  )}
                  <span className="status">
                    {getNFTStatus(nftDetail.status)}
                  </span>
                  <div className="name">{nftDetail.name}</div>
                  <div className="description">
                    {nftDetail.nft_type.name}, {nftDetail.edition}
                  </div>
                  <br />
                  <div className="description">{nftDetail.short_content}</div>
                  {nftDetail.meta_data !== "{}" && (
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
                  })}
                  {nftDetail.sub_items.length > 0 && (
                    <Fragment>
                      <br />
                      <h4>
                        <IntlMessages id="items" />
                      </h4>
                    </Fragment>
                  )}
                  {nftDetail.sub_items.map((item, index) => {
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
                  {nftDetail.status === "pending" ? (
                    <Fragment>
                      <Button type="primary" onClick={handleApproveNft}>
                        <IntlMessages id="nft.approve" />
                      </Button>
                      <Button type="primary" onClick={handleApproveMultiNft}>
                        <IntlMessages id="nft.approve.multi" />
                      </Button>
                      <Button className="btn-remove">
                        <IntlMessages id="nft.remove" />
                      </Button>
                    </Fragment>
                  ): null}
                </Fragment>
              )}
            </Card>
          </Col>
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
        {approveMultiNftOpen && (
          <Modal
            closable={false}
            title={<IntlMessages id="nft.create.multi.nft.title" />}
            visible={approveMultiNftOpen}
            onOk={confirmApproveMultiNFT}
            onCancel={cancelApproveMultiNft}
            okText={<IntlMessages id="confirm" />}
            cancelText={<IntlMessages id="cancel" />}
          >
            <Form
              layout="vertical"
              name="createAuction"
              form={formApproveMultiNFT}
            >
              <div className="flex flex-row">
                <Form.Item
                  className="flex-1 mr-5"
                  label={<IntlMessages id="nft.approve.multi.nft.fromEdition" />}
                  name="fromEdition"
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="nft.approve.multi.nft.fromEdition.require" />
                      ),
                    },
                  ]}
                >
                  <Input size="large" type="number" min="0"/>
                  
                </Form.Item>
                <Form.Item
                  className="flex-1 mr-5"
                  label={<IntlMessages id="nft.approve.multi.nft.toEdition" />}
                  name="toEdition"
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="nft.approve.multi.nft.toEdition.require" />
                      ),
                    },
                  ]}
                >
                  <Input size="large" type="number" min="0"/>
                </Form.Item>
                <Form.Item
                  className="flex-1"
                  label={<IntlMessages id="nft.approve.multi.nft.editionSize" />}
                  name="editionSize"
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="nft.approve.multi.nft.editionSize.require" />
                      ),
                    },
                  ]}
                >
                  <Input size="large" type="number" min="0"/>
                </Form.Item>
              </div>
            </Form>
            <p className="danger">{error}</p>

          </Modal>
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

  );
};

export default ListNFT;
