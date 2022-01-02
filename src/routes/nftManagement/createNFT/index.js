import React, { Fragment, useEffect, useState } from "react";
import IntlMessages from "../../../util/IntlMessages";
import {
  Card,
  Divider,
  Input,
  Row,
  Col,
  Button,
  Form,
  Upload,
  Select,
  Tooltip,
  Table,
  Modal,
} from "antd";
import { NotificationManager } from "react-notifications";
import ipfs from "../../../modules/IPFS";
import { createNFT, getNFTTypes } from "../../../services/NFT";
import { validateNFTFileType } from "../../../modules/Utils";
import { UploadOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";
import Resizer from "react-image-file-resizer";
import S3 from "react-aws-s3";
import { configS3 } from "../../../constants/utils";
import VideoSnapshot from "video-snapshot";

const CreateNFT = () => {
  const propertiesColumns = [
    {
      title: "#",
      render: (value, item, index) => {
        return index + 1;
      },
    },
    {
      title: <IntlMessages id="name" />,
      dataIndex: "propName",
    },
    {
      title: <IntlMessages id="value" />,
      dataIndex: "propValue",
    },
    {
      title: <IntlMessages id="action" />,
      render: (rowData) => {
        return (
          <Fragment>
            <Tooltip title={<IntlMessages id="delete" />}>
              <i
                className="icon icon-trash cursor-pointer"
                style={{ color: "red" }}
                onClick={() => removeProp(rowData.id)}
              />
            </Tooltip>
          </Fragment>
        );
      },
    },
  ];

  const itemColumns = [
    {
      title: "#",
      render: (value, item, index) => {
        return index + 1;
      },
    },
    {
      title: <IntlMessages id="nft.create.item.subItems.name" />,
      render: (rowData) => {
        return (
          <Tooltip title={rowData.name}>
            {rowData.name.substring(0, 20)}
          </Tooltip>
        );
      },
    },
    {
      title: <IntlMessages id="nft.create.item.subItems.url" />,
      render: (rowData) => {
        return (
          <Tooltip title={rowData.url}>
            <span className="nft-url-item">
              <i className="icon icon-link" />
              &nbsp;
              {rowData.url.substring(0, 20)}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: <IntlMessages id="nft.create.item.subItems.description" />,
      render: (rowData) => {
        return (
          <Tooltip title={rowData.short_content}>
            {rowData.short_content.substring(0, 15)}
          </Tooltip>
        );
      },
    },
    {
      title: <IntlMessages id="action" />,
      render: (rowData) => {
        return (
          <Fragment>
            <Tooltip title={<IntlMessages id="delete" />}>
              <i
                className="icon icon-trash cursor-pointer"
                style={{ color: "red" }}
                onClick={() => removeItem(rowData.id)}
              />
            </Tooltip>
          </Fragment>
        );
      },
    },
  ];

  const [formCreateNft] = Form.useForm();
  const [nftUrl, setNftUrl] = useState(null);
  const [nftTypes, setNftTypes] = useState([]);
  const [nftMimeType, setNftMimeType] = useState(null);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [addPropOpen, setAddPropOpen] = useState(false);
  const [nftProps, setNftProps] = useState([]);
  const [formAddProp] = Form.useForm();
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [nftItems, setNftItems] = useState([]);
  const [formAddItem] = Form.useForm();
  const [itemUploadFileList, setItemUploadFileList] = useState([]);
  const [nftItemUrl, setNftItemUrl] = useState(null);
  const [nftItemMimeType, setNftItemMimeType] = useState(null);
  const [fileAWS, setFileAWS] = useState();
  const [fileAWSSnap, setFileAWSsnap] = useState();
  const onNameChange = (e) => {
    document.getElementById("nft-name-preview").innerHTML = e.target.value;
  };

  const onDescriptionChange = (e) => {
    document.getElementById("nft-description-preview").innerHTML =
      e.target.value;
  };

  const onEditionChange = (e) => {
    document.getElementById("nft-edition-preview").innerHTML = e.target.value;
  };

  const onTypeChange = (value, option) => {
    document.getElementById("nft-type-preview").innerHTML = option.children;
  };

  const onUploadChange = (file) => {
    const length = file.fileList.length;
    setUploadFileList([file.fileList[length - 1]]);
  };

  const beforeUploadNft = (file) => {
    if (!validateNFTFileType(file.type)) {
      NotificationManager.warning(
        <IntlMessages id="nft.create.item.fileOnly" />,
        ""
      );
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 1024;
    if (!isLt2M) {
      NotificationManager.warning(
        <IntlMessages id="nft.create.item.smallThan" />,
        ""
      );
      return false;
    }

    setNftMimeType(file.type);

    return true;
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        600,
        500,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  const handleUploadNft = async ({ file, onSuccess }) => {
    ipfs.add(file).then((res) => {
      setNftUrl("https://ipfs.infura.io/ipfs/" + res.path);
      onSuccess("ok");
    });
    if (file.type !== "video/mp4") {
      resizeFile(file).then((res) => {
        new S3(configS3).uploadFile(res, `${res.name}`).then((res) => {
          setFileAWS(res.location);
        });
      });
    } else {
      const snapshoter = new VideoSnapshot(file);
      const previewSrc = await snapshoter.takeSnapshot(11);
      const blob = await fetch(previewSrc).then((res) => res.blob());

      new S3(configS3).uploadFile(file, `${file.name}`).then((res) => {
        setFileAWS(res.location);
      });

      new S3(configS3).uploadFile(blob, `snap-${file.name}`).then((res) => {
        setFileAWSsnap(res.location);
      });
    }
  };

  const onItemUploadChange = (file) => {
    const length = file.fileList.length;
    setItemUploadFileList([file.fileList[length - 1]]);
  };

  const beforeUploadNftItem = (file) => {
    if (!validateNFTFileType(file.type)) {
      NotificationManager.warning(
        <IntlMessages id="nft.create.item.fileOnly" />,
        ""
      );
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 1024;
    if (!isLt2M) {
      NotificationManager.warning(
        <IntlMessages id="nft.create.item.smallThan" />,
        ""
      );
      return false;
    }

    setNftItemMimeType(file.type);

    return true;
  };

  const handleUploadNftItem = ({ file, onSuccess }) => {
    ipfs.add(file).then((res) => {
      setNftItemUrl("https://ipfs.infura.io/ipfs/" + res.path);
      onSuccess("ok");
    });
  };

  const handleAddProp = () => {
    formAddProp.resetFields();
    setAddPropOpen(true);
  };

  const closeAddProp = () => {
    setAddPropOpen(false);
  };

  const confirmAddProp = () => {
    formAddProp.validateFields().then((res) => {
      const nftProp = {
        id: new Date().getTime(),
        ...formAddProp.getFieldsValue(),
      };
      setNftProps((nftProps) => [...nftProps, nftProp]);
      setAddPropOpen(false);
    });
  };

  const removeProp = (index) => {
    setNftProps((nftProps) => nftProps.filter((item) => item.id !== index));
  };

  const handleAddItem = () => {
    formAddItem.resetFields();
    setAddItemOpen(true);
  };

  const closeAddItem = () => {
    setAddItemOpen(false);
  };

  const confirmAddItem = () => {
    formAddItem.validateFields().then((res) => {
      const item = {
        id: new Date().getTime(),
        mime_type: nftItemMimeType,
        name: formAddItem.getFieldsValue().itemName,
        short_content: formAddItem.getFieldsValue().description,
        url: nftItemUrl,
        url_backup: "",
      };
      setNftItems((nftItems) => [...nftItems, item]);
      setAddItemOpen(false);
      setItemUploadFileList([]);
    });
  };

  const removeItem = (index) => {
    setNftItems((nftItems) => nftItems.filter((item) => item.id !== index));
  };

  const confirmCreateNft = () => {
    const dynamicProps = {};

    formCreateNft.validateFields().then((res) => {
      const formValues = formCreateNft.getFieldsValue();

      nftProps.forEach((prop) => {
        dynamicProps[prop.propName] = prop.propValue;
      });

      nftItems.forEach((item) => {
        delete item["id"];
      });

      const nftItem = {
        edition: Number(formValues.nftEdition),
        flow_account: "",
        image_url: fileAWS,
        meta_data: JSON.stringify(dynamicProps),
        mime_type: nftMimeType,
        name: formValues.nftName,
        nft_type_id: formValues.nftType,
        owner_uid: "",
        short_content: JSON.stringify(formValues.nftDescription),
        sub_items: nftItems,
        url: nftUrl,
        url_backup: "",
        thumb_url: fileAWSSnap,
        royalties: Number(formValues.nftRoyalties),
      };

      createNFT(nftItem).then((res) => {
        NotificationManager.success(
          <IntlMessages id="nft.create.item.success" />,
          ""
        );
        clear();
      });
    });
  };

  const clear = () => {
    formCreateNft.resetFields();
    formAddItem.resetFields();
    formAddProp.resetFields();
    setNftUrl(null);
    setNftItemUrl(null);
    setNftMimeType(null);
    setNftItemMimeType(null);
    setNftProps([]);
    setNftItems([]);
    setUploadFileList([]);
    setItemUploadFileList([]);
    document.getElementById("nft-name-preview").innerHTML = "NFT name";
    document.getElementById("nft-description-preview").innerHTML =
      "NFT description";
    document.getElementById("nft-edition-preview").innerHTML = "Edition";
    document.getElementById("nft-type-preview").innerHTML = "Type";
  };

  const loadNFTTypes = async () => {
    const res = await getNFTTypes();
    setNftTypes(res.data);
  };

  const displayPreview = () => {
    if (nftMimeType.indexOf("image") === 0) {
      return <img alt="" className="img-preview" src={nftUrl} />;
    } else {
      return (
        <ReactPlayer
          url={nftUrl}
          className="img-preview"
          playing={true}
          loop={true}
        />
      );
    }
  };

  useEffect(() => {
    loadNFTTypes();
  }, []);

  return (
    <Card
      className="nft-create"
      title={
        <h1>
          <IntlMessages id="nft.create.title" />
        </h1>
      }
    >
      <Row>
        <Col lg={16} md={16} sm={24} xs={24}>
          <Form name="createNft" form={formCreateNft} layout="">
            <h4>
              <IntlMessages id="nft.create.upload.file" />
            </h4>
            <span className="description">
              <IntlMessages id="nft.create.item.type.support" />
            </span>
            <br />
            <br />
            <Form.Item
              name="nftUrl"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="nft.create.item.upload.require" />,
                },
              ]}
            >
              <Upload
                multiple={false}
                name="nftUrl"
                fileList={uploadFileList}
                onChange={onUploadChange}
                customRequest={handleUploadNft}
                beforeUpload={beforeUploadNft}
              >
                <Button icon={<UploadOutlined />}>
                  &nbsp;
                  <IntlMessages id="nft.create.upload.button" />
                </Button>
              </Upload>
            </Form.Item>
            <h4>
              <IntlMessages id="nft.create.item.details" />
            </h4>
            <Form.Item
              name="nftName"
              label={<IntlMessages id="nft.create.item.name" />}
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="nft.create.item.name.require" />,
                },
              ]}
            >
              <Input size="large" onChange={onNameChange} />
            </Form.Item>
            <Form.Item
              name="nftDescription"
              label={<IntlMessages id="nft.create.item.description" />}
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="nft.create.item.description.require" />
                  ),
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                size="large"
                onChange={onDescriptionChange}
              />
            </Form.Item>
            <Row gutter={24}>
              <Col lg={8} md={8} sm={8} xs={8}>
                <Form.Item
                  label={<IntlMessages id="nft.create.item.royalties" />}
                  initialValue={10}
                  name="nftRoyalties"
                >
                  <Input size="large" type="number" />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={8} xs={8}>
                <Form.Item
                  label={<IntlMessages id="nft.create.item.edition" />}
                  name="nftEdition"
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="nft.create.item.edition.require" />
                      ),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    type="number"
                    onChange={onEditionChange}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={8} xs={8}>
                <Form.Item
                  label={<IntlMessages id="nft.create.item.type" />}
                  name="nftType"
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="nft.create.item.type.require" />
                      ),
                    },
                  ]}
                >
                  <Select size="large" onChange={onTypeChange}>
                    {nftTypes.map((item, index) => {
                      return (
                        <Select.Option value={item.id} key={index}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <div className="properties">
              <h4>
                <IntlMessages id="nft.create.item.properties" />
              </h4>
              <Button type="normal" onClick={handleAddProp}>
                <IntlMessages id="add" />
              </Button>
            </div>
            {nftProps.length > 0 && (
              <Table
                className="gx-table-responsive"
                columns={propertiesColumns}
                dataSource={nftProps}
                rowKey="id"
                pagination={false}
              />
            )}
            <div className="sub-item">
              <h4>
                <IntlMessages id="nft.create.item.subItems" />
              </h4>
              <Button type="normal" onClick={handleAddItem}>
                <IntlMessages id="add" />
              </Button>
            </div>
            {nftItems.length > 0 && (
              <Table
                className="gx-table-responsive"
                columns={itemColumns}
                dataSource={nftItems}
                rowKey="id"
                pagination={false}
              />
            )}
          </Form>
          <Divider />
          <br />
          <Button type="primary" onClick={confirmCreateNft}>
            <IntlMessages id="nft.create.item" />
            &nbsp;&nbsp;&nbsp;
            <img
              alt=""
              src="/assets/images/icons/arrow-right.png"
              className="img-icon"
            />
          </Button>
          <Button type="normal" onClick={() => clear()}>
            <img
              alt=""
              src="/assets/images/icons/close.png"
              className="img-icon"
            />
            &nbsp;&nbsp;&nbsp;
            <IntlMessages id="nft.create.preview.clear" />
          </Button>
        </Col>
        {/*Preview*/}
        <Col lg={8} md={8} sm={24} xs={24}>
          <Card
            className="gx-card preview"
            title={
              <span
                style={{
                  margin: "20px",
                }}
              >
                <IntlMessages id="nft.create.preview" />
              </span>
            }
          >
            {nftUrl && displayPreview()}
            <div className="name">
              <span id="nft-name-preview">NFT name</span>
            </div>
            <div className="description">
              <span id="nft-type-preview">Type</span>,{" "}
              <span id="nft-edition-preview">Edition</span>
            </div>
            <br />
            <div className="description">
              <span id="nft-description-preview">NFT description</span>
            </div>
            {nftProps.length > 0 && (
              <Fragment>
                <br />
                <h4>
                  <IntlMessages id="nft.create.preview.properties" />
                </h4>
              </Fragment>
            )}
            {nftProps.map((prop, index) => {
              return (
                <div className="description prop" key={index}>
                  {prop.propName}: {prop.propValue}
                </div>
              );
            })}
            {nftItems.length > 0 && (
              <Fragment>
                <br />
                <h4>
                  <IntlMessages id="items" />
                </h4>
              </Fragment>
            )}
            {nftItems.map((item, index) => {
              return (
                <div className="item" key={index}>
                  <span>{item.name}</span>
                  <div className="nft-url-item">
                    <i className="icon icon-link" />
                    &nbsp;
                    <span>{item.url}</span>
                  </div>
                  <span className="description">{item.short_content}</span>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>

      {/*Add property*/}
      <Modal
        closable={false}
        onCancel={closeAddProp}
        title={<IntlMessages id="nft.create.item.props.title" />}
        visible={addPropOpen}
        footer={null}
        width={350}
      >
        <Form layout="vertical" name="addProp" form={formAddProp}>
          <Form.Item
            label={<IntlMessages id="name" />}
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="nft.create.item.props.name.require" />
                ),
              },
            ]}
            name="propName"
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label={<IntlMessages id="value" />}
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="nft.create.item.props.value.require" />
                ),
              },
            ]}
            name="propValue"
          >
            <Input size="large" />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          style={{ width: "100%" }}
          onClick={confirmAddProp}
        >
          <IntlMessages id="nft.create.item.props.add" />
        </Button>
        <Button type="normal" style={{ width: "100%" }} onClick={closeAddProp}>
          <IntlMessages id="cancel" />
        </Button>
      </Modal>

      {/*Add sub item*/}
      <Modal
        closable={false}
        onCancel={closeAddItem}
        title={<IntlMessages id="nft.create.item.subItems.add" />}
        visible={addItemOpen}
        footer={null}
        width={450}
      >
        <Form layout="vertical" name="addItem" form={formAddItem}>
          <Form.Item
            label={<IntlMessages id="nft.create.item.subItems.name" />}
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="nft.create.item.subItems.name.require" />
                ),
              },
            ]}
            name="itemName"
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label={<IntlMessages id="nft.create.item.subItems.description" />}
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="nft.create.item.subItems.description.require" />
                ),
              },
            ]}
            name="description"
          >
            <Input.TextArea rows={3} size="large" />
          </Form.Item>
          <h5>
            <IntlMessages id="nft.create.item.subItems.uploadFile" />
          </h5>
          <h6 className="description">
            <IntlMessages id="nft.create.item.type.support" />
          </h6>
          <Form.Item
            name="itemUrl"
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="nft.create.item.subItems.uploadFile.require" />
                ),
              },
            ]}
          >
            <Upload
              multiple={false}
              name="itemUrl"
              fileList={itemUploadFileList}
              onChange={onItemUploadChange}
              customRequest={handleUploadNftItem}
              beforeUpload={beforeUploadNftItem}
            >
              <Button icon={<UploadOutlined />}>
                &nbsp;
                <IntlMessages id="nft.create.upload.button" />
              </Button>
            </Upload>
          </Form.Item>
        </Form>
        <Button
          type="primary"
          style={{ width: "100%" }}
          onClick={confirmAddItem}
        >
          <IntlMessages id="nft.create.item.subItems.add" />
        </Button>
        <Button type="normal" style={{ width: "100%" }} onClick={closeAddItem}>
          <IntlMessages id="cancel" />
        </Button>
      </Modal>
    </Card>
  );
};

export default CreateNFT;
