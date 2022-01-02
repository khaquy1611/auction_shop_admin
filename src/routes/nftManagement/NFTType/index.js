import React, { Fragment, useEffect, useState } from "react";
import { Button, Table, Tooltip, Form, Input, Modal, Upload, Popconfirm } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import IntlMessages from "../../../util/IntlMessages";
import { getNFTTypes } from "../../../services/NFT";
import { validateImageFileType } from "../../../modules/Utils";
import { NotificationManager } from "react-notifications";
import S3 from "react-aws-s3";
import { configS3 } from '../../../constants/utils'
import "./styles.scss"
import { createNFTType, getNFTType, updateNFTType, deleteNFTType } from '../../../services/NFTType'

const ListNFT = () => {
  const [nftTypes, setNftTypes] = useState([]);
  const [isShowModalCreate, setShowModalCreate] = useState(false);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [error, setError] = useState();
  const [nftType, setNftType] = useState({
    image_url: "",
    key_language: "",
    name: ""
  })

  useEffect(() => {
    loadNFTTypes();
  }, []);

  const loadNFTTypes = async () => {
    const res = await getNFTTypes();
    setNftTypes(res.data);
  };

  const onClickConfirmModal = () => {
    if (!validateForm()) {
      return
    }

    if (nftType.id) {
      handleUpdateNftType()
    } else {
      handleCreateNftType()
    }
  }

  const handleCreateNftType = () => {
    createNFTType(nftType).then(res => {
      if (res.status == 200) {
        NotificationManager.success(
          <IntlMessages id="sidebar.nft.type.create.success" />,
          ""
        );
        loadNFTTypes()
        setShowModalCreate(false)
        clearForm()
      } else {
        NotificationManager.error(
          <IntlMessages id="sidebar.nft.type.create.error" />,
          ""
        );
        setShowModalCreate(false)
        clearForm()
      }

    });
  }

  const closeModalCreate = () => {
    clearForm();
    setShowModalCreate(false);
  }

  const clearForm = () => {
    setNftType({
      image_url: "",
      key_language: "",
      name: ""
    })
    setUploadFileList([])
    setError('')
  }

  const onUploadChange = (file) => {
    const length = file.fileList.length;
    setUploadFileList([file.fileList[length - 1]]);
  };

  const beforeUpload = (file) => {
    if (!validateImageFileType(file.type)) {
      setError(<IntlMessages id="upload.file.not.support" />)

      setNftType({
        ...nftType,
        image_url: ''
      })
      setUploadFileList([])
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
    return true;
  };

  const handleUploadFile = ({ file, onSuccess }) => {
    new S3(configS3).uploadFile(file, `${file}`).then((res) => {
      setNftType({
        ...nftType,
        image_url: res.location
      })
      onSuccess("ok");
    })
  };

  const removeUploadedImage = () => {
    setNftType({
      ...nftType, image_url: ""
    })
    setUploadFileList([])
  }

  const validateForm = () => {
    if (!nftType.name) {
      setError(<IntlMessages id="sidebar.nft.type.create.name.empty" />)
      return false;
    }
    if (!nftType.image_url) {
      setError(<IntlMessages id="sidebar.nft.type.create.image.empty" />)
      return false;
    }
    return true;
  }

  const openModalUpdate = (id) => {
    const editNftType = nftTypes.filter(item => item.id === id)
    setNftType(editNftType[0])
    setShowModalCreate(true)
  }

  const handleUpdateNftType = () => {
    updateNFTType(nftType).then(res => {
      handleResponse(res)
    })
  }

  const handleDeleteNftType = (id) => {
    deleteNFTType(id).then(res => {
      handleResponse(res)
    })
  }

  const handleResponse = (res) => {
    if (res.status == 200) {
      NotificationManager.success(
        <IntlMessages id="success" />,
        ""
      );
      loadNFTTypes()
      setShowModalCreate(false)
      clearForm()
    } else {
      NotificationManager.error(
        <IntlMessages id="failed" />,
        ""
      );
      setShowModalCreate(false)
      clearForm()
    }
  }

  const columns = [
    {
      title: <IntlMessages id="sidebar.nft.type.column.id" />,
      dataIndex: "id",
      width: '5%'
    },
    {
      title: <IntlMessages id="sidebar.nft.type.column.name" />,
      dataIndex: "name",
      width: '40%',
      sorter: (a, b) => a.name.length - b.name.length
    },
    {
      title: <IntlMessages id="sidebar.nft.type.column.image" />,
      dataIndex: "image_url",
      width: '40%',
      render: (image_url) => {
        return (
          <img
            alt={image_url}
            className="border-5"
            src={
              image_url !== ""
                ? image_url :
                "https://via.placeholder.com/150"
            }
            height={96}
          />
        );
      },
    },
    {
      title: <IntlMessages id="sidebar.nft.type.column.actions" />,
      dataIndex: "id",
      width: '10%',
      render: (id) => {
        return (
          <Fragment>
            <Tooltip title={<IntlMessages id="sidebar.nft.type.edit" />}>
              <img onClick={() => openModalUpdate(id)} src='/assets/images/icons/icon_edit.svg' className="cursor-pointer" ></img>
            </Tooltip>
            &nbsp;&nbsp;
            <Tooltip title={<IntlMessages id="sidebar.nft.type.delete" />}>

              <Popconfirm
                onConfirm={() => handleDeleteNftType(id)}
                title={<IntlMessages id="confirm.delete..message" />}>
                <img src='/assets/images/icons/icon_delete.svg' className="cursor-pointer" ></img>
              </Popconfirm>
            </Tooltip>
            &nbsp;&nbsp;
          </Fragment>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-row">
        <div className="flex-1">
          <h2><IntlMessages id="sidebar.nft.type" /></h2>
        </div>
        <Button onClick={() => setShowModalCreate(true)} type="primary"><IntlMessages id="sidebar.nft.type.create" /></Button>
      </div>
      <Table
        className="gx-table-responsive"
        columns={columns}
        rowKey={record => record.id}
        dataSource={nftTypes}
        pagination={{ position: ['bottomCenter'] }}
      />


      {isShowModalCreate &&
        <Modal
          closable={false}
          title={!nftType.id ? <IntlMessages id="sidebar.nft.type.create" /> : <IntlMessages id="sidebar.nft.type.edit.title" />}
          visible={isShowModalCreate}
          footer={null}
        >
          <Form layout="vertical" name="detailUser">
            {error &&
              <p className="danger">{error}</p>
            }
            <Form.Item
              label={
                <IntlMessages id="sidebar.nft.type.column.name" />
              }
            >
              <Input
                size="large"
                value={nftType.name}
                onChange={(e) => setNftType({
                  ...nftType, name: e.target.value
                })}
              />
            </Form.Item>
            <h4>
              <IntlMessages id="nft.create.upload.file" />
            </h4>
            <span className="description">
              <IntlMessages id="nft.create.image.type.support" />
            </span>
            <br />
            <br />

            <div className="flex flex-row">
              <div className="flex-1">
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
                    accept="image/*"
                    showUploadList={false}
                    fileList={uploadFileList}
                    onRemove={() => setUploadFileList([])}
                    onChange={onUploadChange}
                    customRequest={handleUploadFile}
                    beforeUpload={beforeUpload}
                  >
                    <Button icon={<UploadOutlined />}>
                      &nbsp;
                  <IntlMessages id="nft.create.upload.button" />
                    </Button>
                  </Upload>
                </Form.Item>
              </div>
              <Tooltip title={<IntlMessages id="sidebar.nft.type.delete" />}>
                <img onClick={removeUploadedImage} src='/assets/images/icons/icon_delete.svg' className="cursor-pointer" ></img>
              </Tooltip>
            </div>
            {nftType.image_url &&
              <div className="text-center">
                <img className="img-preview-upload" src={nftType.image_url}>
                </img>
              </div>
            }
            <Button onClick={onClickConfirmModal} style={{ width: '100%' }} type="primary">
              {nftType.id ? <IntlMessages id="save" /> : <IntlMessages id="sidebar.nft.type.create.confirm" />}
            </Button>
            <br />
            <br />
            <Button onClick={closeModalCreate} style={{ width: '100%' }} ><IntlMessages id="sidebar.nft.type.create.cancel" /></Button>
          </Form>
        </Modal>
      }
    </>
  );
};

export default ListNFT;
