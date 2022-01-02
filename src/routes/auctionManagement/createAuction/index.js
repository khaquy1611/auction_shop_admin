import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Input, Row, Col, Modal, Form, Spin, DatePicker, Space, Select } from "antd";
import IntlMessages from "../../../util/IntlMessages";
import DataItem from "./DataItemAuction";
import { getNFTTypes } from "../../../services/NFT";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { createAuction } from "../../../services/Auction";
import { NotificationManager } from "react-notifications";
import ReactPlayer from "react-player";
import { customGetCollectionMeta } from "../../../apiContracts/listenNFT";
import { handleCheckJobId } from "../../../services/JobService";
import { JOB_STATUS } from "../../../constants/utils"
import "./style.scss"
import { Pagination } from 'antd';

const CreateAuction = () => {
  const [nftTypeId, setNftTypeId] = useState(-1);
  const [nftTypes, setNftTypes] = useState([]);
  const [nftList, setNftList] = useState([]);
  const [nftFilter, setNftFilter] = useState([]);
  const [nftDetail, setNftDetail] = useState(null);
  const [createAuctionOpen, setCreateAuctionOpen] = useState(null);
  const [createMultiAuctionOpen, setCreateMultiAuctionOpen] = useState(null);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [validateAuction, setValidateAuction] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentNftId, setCurrentNftId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageNFTs, setPageNFTs] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState({
    label: "None",
    value: 0
  });
  const [positions, setPositions] = useState([
    {
      label: "None",
      value: 0
    },{
      label: "Top",
      value: 1
    },
    {
      label: "Upcomming",
      value: 2
    },{
      label: "Hot",
      value: 3
    },
    {
      label: "Nomal",
      value: 4
    }
  ]);

  const [formCreateAuction] = Form.useForm();

  useEffect(() => {
    loadNFTTypes();
    loadNFTs();
  }, []);

  const resetFilter = () => {
    setNftFilter([...nftList])
  };

  const loadNFTTypes = async () => {
    const res = await getNFTTypes();
    setNftTypes(res.data);
  };
  
  const loadNFTs = async () => {
    setLoading(true)
    customGetCollectionMeta(process.env.REACT_APP_LISTEN_NFT).then((res) => {
      res?.sort((a, b) => parseInt(b?.id) - parseInt(a?.id))
      setNftList(res);
      setNftFilter(res);
      const offset = (currentPage - 1) * pageSize
      const limit = pageSize
      const pageNFTs = res.slice(offset, limit)
      setPageNFTs([...pageNFTs])
      setLoading(false)
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

  const resetForm = () => {
    setStartDate("")
    setEndDate("")
    formCreateAuction.resetFields()
    setCreateMultiAuctionOpen(false);
    setCreateAuctionOpen(false);
  }

  const onCreateAuctionSuccess = () => {
    resetForm()
    setLoading(false);
    history.push("/auction/list-auction");
  }

  const onCreateAuctionFailed = () => {
    setLoading(false);
    setCreateMultiAuctionOpen(false);
    setCreateAuctionOpen(false);
  }

  const confirmCreateAuction = () => {
    const isCreateMulti = selectedItems?.length > 1
    setValidateAuction(true)
    formCreateAuction.validateFields().then((res) => {
      if (startDate && endDate ) {

        const auction = {
          itemId: parseInt(currentNftId),
          position: formCreateAuction.getFieldsValue().position,
          bidStep: formCreateAuction.getFieldsValue().bidStep,
          minimumPrice: formCreateAuction.getFieldsValue().minimumPrice,
        };

        if (isCreateMulti) {
          const selectedIds = []
          selectedItems.forEach(item => {
            selectedIds.push(item.nftId)
          })
          auction["itemIds"] = selectedIds
        }

        let startTime = moment(startDate.toDate()).unix();
        auction.beginTime = startTime - moment(Date.now()).unix() + 100;

        let endTime = moment(endDate.toDate()).unix();
        auction.endTime = endTime - moment(Date.now()).unix() + 1800;

        setCreateAuctionOpen(false);
        setCreateMultiAuctionOpen(false);
        setLoading(true);
        setValidateAuction(false)
        createAuction(auction, isCreateMulti).then((res) => {
          if (res.status == 200) {
            if (res.data.status == JOB_STATUS.ACCEPTED) {
              handleCheckJobId(
                res.data.jobId,
                onCreateAuctionSuccess,
                onCreateAuctionFailed
              );
            }
          } else {
            NotificationManager.error(<IntlMessages id="failed" />, "");
            setLoading(false);
          }
        })
          .catch(() => {
            NotificationManager.error(<IntlMessages id="failed" />, "");
            setLoading(false);
          });
      }
    });
  };

  const handleOnclickDetail = (event, data) => {
    try {
      data.metaData = JSON.parse(data?.metaData)
    } catch (e) {

    }
    setNftDetail(data);
    setCurrentNftId(data?.nftId)
    if (event.metaKey || event.ctrlKey || event.keyCode == 91 || event.keyCode == 224) {
      const items = [...selectedItems]
      if (items.includes(data)) {
        // remove item
        var index = items.indexOf(data);
        if (index > -1) {
          items.splice(index, 1);
        }
        // end remove item
        if (data === nftDetail) {
          if (items.length > 0) {
            setNftDetail(items[0])
            setCurrentNftId(items[0]?.nftId)
          } else {
            setNftDetail()
            setCurrentNftId()
          }
        } else {
          setNftDetail(items[0])
          setCurrentNftId(items[0]?.nftId)
        }
        setSelectedItems([...items])

      } else {
        // select item
        selectedItems.push(data)
        setSelectedItems([...selectedItems])
      }
    } else {
      // remove multi select mode
      setSelectedItems([])
    }
  };

  const onChangeStartDate = (value, dateString) => {
    setStartDate(value)
  }
  
  const onOkStartDate = (value) => {
    setStartDate(value)
  }

  const onChangeEndDate = (value, dateString) => {
    setEndDate(value)
  }
  
  const onOkEndDate = (value) => {
    setEndDate(value)
  }

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  const disabledStartDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().subtract(1, "days").endOf('day');
  }
  
  const disabledStartDateTime = () => {
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  }

  const disabledEndDate = (current) => {
    // Can not select days before start date
    return current && current < moment(startDate).subtract(1, "days").endOf('day');
  }
  
  const disabledEndDateTime = () => {
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  }

  const onFilter = (typeName) => {
    if (typeName === -1) {
      setNftFilter([...nftList])
    } else {
      const filter = nftList.filter(item => item.nftTypeName === typeName)
      setNftFilter([...filter])
    }
    setNftDetail()
    setCurrentNftId()
  }

  const multiNftName = () => {
    const nftNames = []
    selectedItems.forEach(item => {
      nftNames.push(item.name)
    })
    return nftNames.toString()
  }

  return (
    <Card
      title={
        <Fragment>
          <h1>Auction Management</h1>
          {/* <br />
          <Button
            type={nftTypeId === -1 ? "primary" : "default"}
            className="no-border"
            onClick={() => onFilter(-1)}
          >
            <IntlMessages id="nft.all.items" />
          </Button>
          {nftTypes.map((type, index) => {
            return (
              <Button
                type={nftTypeId === type.id ? "primary" : "default"}
                className="no-border"
                key={index}
                onClick={() => onFilter(type.name)}
              >
                <IntlMessages id={type.name} />
              </Button>
            );
          })}
          <Button type="primary" className="float-right" onClick={resetFilter}>
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
        </Row> */}
        <br />
        <Row gutter={24}>
          <Col lg={16} md={16} sm={24} xs={24}>
            <Row gutter={24}>
              <Col lg={24} md={24} sm={24} xs={24}>
                {pageNFTs?.map((nft, index) => {
                  return (
                    <DataItem
                      key={index}
                      data={nft}
                      currentId={currentNftId}
                      selectedItems={selectedItems}
                      handleClick={handleOnclickDetail}
                    />
                  );
                })}
              </Col>
              <Pagination
                  total={nftList?.length}
                  showSizeChanger
                  defaultCurrent={currentPage}
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
                  {nftDetail?.mime_type === "video/mp4" ? (
                    <ReactPlayer
                      className="img-preview"
                      url={nftDetail?.mediaUrl}
                      loop={true}
                      controls={true}
                    />
                  ) : (
                    <img alt="" src={nftDetail?.mediaUrl} />
                  )}
                  <div className="name">{nftDetail?.name}</div>
                  <span className="description">
                    ID: {nftDetail?.nftId}
                  </span>
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
                    
                    {(selectedItems?.length <= 1 || !selectedItems) &&
                      <Button type="primary" onClick={() => setCreateAuctionOpen(true)}>
                        <IntlMessages id="nft.createAuction" />
                      </Button>
                    }
                    {selectedItems?.length > 1 &&
                      <Button type="primary" className="mt-10" onClick={() => setCreateMultiAuctionOpen(true)}>
                        <IntlMessages id="nft.createAuctions" />
                      </Button>
                    }
                  </Fragment>
                </Fragment>
            </Card>
          </Col>
          )}
        </Row>
        {nftDetail && nftDetail && (
          <Modal
            closable={false}
            title={<IntlMessages id="nft.createAuction.title" />}
            visible={createAuctionOpen}
            onOk={confirmCreateAuction}
            onCancel={resetForm}
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
                  label={<IntlMessages id="nft.create.item.position" />}
                  name="position"
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="nft.create.item.position.require" />
                      ),
                    },
                  ]}
                >
                  <Select value={selectedPosition.value} size="large">
                    {positions.map((item, index) => {
                      return (
                        <Select.Option value={item.value} key={index}>
                          {item.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
              </Form.Item>
              <div className="flex flex-row">
                <Form.Item
                  className="flex-1 mr-5"
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
                  className="flex-1 ml-5"
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
              </div>
              <div className="flex flex-row">
                <Form.Item
                  className={!startDate && validateAuction? "flex-1 mr-5 ant-form-item-has-error" : "flex-1 mr-5"}
                  style={{width: "100%"}}
                  label={<IntlMessages id="nft.createAuction.startDate" />}
                >
                  <Space direction="vertical" size={12}>
                    <DatePicker 
                      format="DD/MM/YYYY HH:mm"
                      disabledDate={disabledStartDate}
                      disabledTime={disabledStartDateTime}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                      onChange={onChangeStartDate} 
                      onOk={onOkStartDate} />
                  </Space>
                  {!startDate && validateAuction &&
                    <p className="error"><IntlMessages id="nft.createAuction.startDate.require" /></p>
                  }
                </Form.Item>

                <Form.Item
                  className={!endDate && validateAuction ? "flex-1 ml-5 ant-form-item-has-error" : "flex-1 ml-5"}
                  style={{width: "100%"}}
                  label={<IntlMessages id="nft.createAuction.endDate" />}
                >
                   <Space direction="vertical" size={12}>
                    <DatePicker 
                      disabled={!startDate}
                      format="DD/MM/YYYY HH:mm"
                      disabledDate={disabledEndDate}
                      disabledTime={disabledEndDateTime}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                      onChange={onChangeEndDate} 
                      onOk={onOkEndDate}
                    />
                  </Space>
                  {!endDate && validateAuction &&
                    <p className="error"><IntlMessages id="nft.createAuction.endDate.require" /></p>
                  }
                </Form.Item>
              </div>
            </Form>
          </Modal>
        )}
        {nftDetail && nftDetail && (
          <Modal
            closable={false}
            title={<IntlMessages id="nft.createAuctions" />}
            visible={createMultiAuctionOpen}
            onOk={confirmCreateAuction}
            onCancel={resetForm}
            okText={<IntlMessages id="confirm" />}
            cancelText={<IntlMessages id="cancel" />}
          >
            <Form
              layout="vertical"
              name="createMultiAuction"
              form={formCreateAuction}
            >
              <Form.Item
                label={<IntlMessages id="nft.createAuction.itemName" />}
              >
                <Input size="large" value={multiNftName()} readOnly={true} />
              </Form.Item>
              <Form.Item
                  label={<IntlMessages id="nft.create.item.position" />}
                  name="position"
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="nft.create.item.position.require" />
                      ),
                    },
                  ]}
                >
                  <Select value={selectedPosition.value} size="large">
                    {positions.map((item, index) => {
                      return (
                        <Select.Option value={item.value} key={index}>
                          {item.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
              </Form.Item>
              <div className="flex flex-row">
                <Form.Item
                  className="flex-1 mr-5"
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
                  className="flex-1 ml-5"
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
              </div>
              <div className="flex flex-row">
                <Form.Item
                  className={!startDate && validateAuction? "flex-1 mr-5 ant-form-item-has-error" : "flex-1 mr-5"}
                  style={{width: "100%"}}
                  label={<IntlMessages id="nft.createAuction.startDate" />}
                >
                  <Space direction="vertical" size={12}>
                    <DatePicker 
                      format="DD/MM/YYYY HH:mm"
                      disabledDate={disabledStartDate}
                      disabledTime={disabledStartDateTime}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                      onChange={onChangeStartDate} 
                      onOk={onOkStartDate} />
                  </Space>
                  {!startDate && validateAuction &&
                    <p className="error"><IntlMessages id="nft.createAuction.startDate.require" /></p>
                  }
                </Form.Item>

                <Form.Item
                  className={!endDate && validateAuction ? "flex-1 ml-5 ant-form-item-has-error" : "flex-1 ml-5"}
                  style={{width: "100%"}}
                  label={<IntlMessages id="nft.createAuction.endDate" />}
                >
                   <Space direction="vertical" size={12}>
                    <DatePicker 
                      disabled={!startDate}
                      format="DD/MM/YYYY HH:mm"
                      disabledDate={disabledEndDate}
                      disabledTime={disabledEndDateTime}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                      onChange={onChangeEndDate} 
                      onOk={onOkEndDate}
                    />
                  </Space>
                  {!endDate && validateAuction &&
                    <p className="error"><IntlMessages id="nft.createAuction.endDate.require" /></p>
                  }
                </Form.Item>
              </div>
            </Form>
          </Modal>
        )}
      </Spin>
    </Card>
  );
};

export default CreateAuction;
