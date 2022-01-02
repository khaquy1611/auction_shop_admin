import React, { Fragment, useEffect, useState } from "react";
import IntlMessages from "../../../util/IntlMessages";
import { Card, Form, Input, Modal, Table, Tooltip } from "antd";
import * as UserService from "../../../services/Users";
import SweetAlert from "react-bootstrap-sweetalert";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ListUsers = () => {
  const userColumns = [
    {
      title: <IntlMessages id="users.management.list.table.displayName" />,
      dataIndex: "display_name",
    },
    {
      title: <IntlMessages id="users.management.list.table.avatar" />,
      render: (rowData) => {
        return (
          <img
            alt="avatar"
            className="border-50"
            src={
              rowData.avatar && rowData.avatar !== ""
                ? rowData.avatar
                : "https://via.placeholder.com/150"
            }
            width={30}
          />
        );
      },
    },
    {
      title: <IntlMessages id="users.management.list.table.email" />,
      dataIndex: "email",
    },
    {
      title: <IntlMessages id="users.management.list.table.block" />,
      render: (rowData) => {
        return rowData.block ? (
          <IntlMessages id="yes" />
        ) : (
          <IntlMessages id="no" />
        );
      },
    },
    {
      title: <IntlMessages id="users.management.list.table.following" />,
      dataIndex: "total_people_following",
    },
    {
      title: <IntlMessages id="users.management.list.table.followers" />,
      dataIndex: "total_your_followers",
    },

    {
      title: "",
      render: (rowData) => {
        return (
          <Fragment>
            <Tooltip title={<IntlMessages id="users.management.list.detail" />}>
              <EditOutlined
                className="icon icon-detail cursor-pointer"
                style={{ color: "green" }}
                onClick={() => handleGetProfileUser(rowData)}
              />
            </Tooltip>
            &nbsp;&nbsp;
            <Tooltip title={<IntlMessages id="users.management.list.delete" />}>
              <DeleteOutlined
                className="icon icon-delete cursor-pointer"
                style={{ color: "red" }}
                onClick={() => handleDeteleUser(rowData)}
              />
            </Tooltip>
            &nbsp;&nbsp;
          </Fragment>
        );
      },
    },
  ];

  const [UserList, setUserList] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [userPageSize] = useState(10);
  const [currentUser, setCurrentUser] = useState(null);
  const [detailUserOpen, setDetailUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);

  const onUserPageSizeChange = (page) => {
    setCurrentUserPage(page);
  };

  const loadUserList = async () => {
    const res = await UserService.getListUser(currentUserPage, userPageSize);
    setUserList(res.data.data);
    setTotalUser(res.data.total);
  };

  const handleGetProfileUser = async (currentUser) => {
    const res = await UserService.getProfileUser(currentUser.sub);
    setCurrentUser(res.data);
    setDetailUserOpen(true);
  };

  const cancelDetailUser = () => {
    setCurrentUser(null);
    setDetailUserOpen(false);
  };

  const confirmDetailUser = () => {
    setCurrentUser(null);
    setDetailUserOpen(false);
    loadUserList();
  };

  const handleDeteleUser = (currentUser) => {
    setCurrentUser(currentUser);
    setDeleteUserOpen(true);
  };

  const cancelUnblockUser = () => {
    setCurrentUser(null);
    setDeleteUserOpen(false);
  };

  const confirmDeleteUser = async () => {
    await UserService.deleteUser(currentUser.sub);
    setDeleteUserOpen(false);
    loadUserList();
  };

  useEffect(() => {
    loadUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserPage, userPageSize]);
  return (
    <Card
      title={
        <Fragment>
          <h1>
            <IntlMessages id="users.management.list.title" />
          </h1>
          <br />
        </Fragment>
      }
    >
      <Table
        className="gx-table-responsive"
        columns={userColumns}
        rowKey="ID"
        dataSource={UserList}
        pagination={{
          current: currentUserPage,
          defaultCurrent: currentUserPage,
          pageSize: userPageSize,
          defaultPageSize: userPageSize,
          total: totalUser,
          onChange: onUserPageSizeChange,
          showTotal: (total) => {
            return (
              <Fragment>
                <IntlMessages id="total" /> {total} <IntlMessages id="items" />
              </Fragment>
            );
          },
        }}
      />
      {currentUser && (
        <Modal
          closable={false}
          title={<IntlMessages id="users.management.modal.detail.title" />}
          visible={detailUserOpen}
          onOk={confirmDetailUser}
          onCancel={cancelDetailUser}
          okText={<IntlMessages id="confirm" />}
          cancelText={<IntlMessages id="cancel" />}
        >
          <Form layout="vertical" name="detailUser">
            <Form.Item
              label={
                <IntlMessages id="users.management.list.table.displayName" />
              }
            >
              <Input
                size="large"
                value={currentUser.displayName}
                readOnly={true}
              />
            </Form.Item>
            <Form.Item
              label={<IntlMessages id="users.management.list.table.email" />}
            >
              <Input size="large" value={currentUser.email} readOnly={true} />
            </Form.Item>
            <Form.Item
              label={<IntlMessages id="users.management.list.table.block" />}
            >
              <Input
                size="large"
                value={currentUser.block ? "Yes" : " No"}
                readOnly={true}
              />
            </Form.Item>
            <Form.Item
              label={
                <IntlMessages id="users.management.list.table.following" />
              }
            >
              <Input
                size="large"
                value={currentUser.total_people_following}
                readOnly={true}
              />
            </Form.Item>
            <Form.Item
              label={
                <IntlMessages id="users.management.list.table.followers" />
              }
            >
              <Input
                size="large"
                value={currentUser.total_your_followers}
                readOnly={true}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
      {currentUser && (
        <SweetAlert
          show={deleteUserOpen}
          warning
          showCancel
          cancelBtnText={<IntlMessages id="cancel" />}
          confirmBtnText={<IntlMessages id="confirm" />}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title={<IntlMessages id="users.management.modal.delete.title" />}
          onConfirm={confirmDeleteUser}
          onCancel={cancelUnblockUser}
          focusConfirmBtn={false}
        >
          <IntlMessages id="users.management.list.delete.content" />
          &nbsp;
          <strong>{currentUser.user_name}</strong>
        </SweetAlert>
      )}
    </Card>
  );
};

export default ListUsers;
