import React, {Fragment, useEffect, useState} from "react";
import IntlMessages from "../../../util/IntlMessages";
import {Button, Card, Form, Input, Modal, Select, Table, Tooltip} from "antd";
import * as AdminService from '../../../services/Admin';
import {NotificationManager} from "react-notifications";
import SweetAlert from "react-bootstrap-sweetalert";

const ListAdmin = () => {

    const adminColumns = [
        {
            title: <IntlMessages id="admin.management.list.table.id"/>,
            dataIndex: 'ID'
        },
        {
            title: <IntlMessages id="admin.management.list.table.userName"/>,
            dataIndex: 'user_name'
        },
        {
            title: <IntlMessages id="admin.management.list.table.displayName"/>,
            dataIndex: 'display_name',
        },
        {
            title: <IntlMessages id="admin.management.list.table.avatar"/>,
            render: (rowData) => {
                return <img alt="avatar"
                            className="border-50"
                            src={(rowData.avatar && rowData.avatar !== "") ? rowData.avatar : "https://via.placeholder.com/150"}
                            width={30}/>
            }
        },
        {
            title: <IntlMessages id="admin.management.list.table.email"/>,
            dataIndex: 'email'
        },
        {
            title: <IntlMessages id="admin.management.list.table.phone"/>,
            dataIndex: 'phone'
        },
        {
            title: <IntlMessages id="admin.management.list.table.block"/>,
            render: (rowData) => {
                return rowData.block ? <IntlMessages id="yes"/> : <IntlMessages id="no"/>
            }
        },
        {
            title: "",
            render: (rowData) => {
                return <Fragment>
                    <Tooltip title={<IntlMessages id="admin.management.list.grantPermission"/>}>
                        <i className="icon icon-setting cursor-pointer" style={{color: 'blue'}}
                           onClick={() => handleGrantPermission(rowData)}/>
                    </Tooltip>
                    &nbsp;&nbsp;
                    <Tooltip title={<IntlMessages id="admin.management.list.resetPassword"/>}>
                        <i className="icon icon-reset-password cursor-pointer" style={{color: 'green'}}
                           onClick={() => handleResetPassword(rowData)}/>
                    </Tooltip>
                    &nbsp;&nbsp;
                    {
                        rowData.block ?
                            <Tooltip title={<IntlMessages id="unblock"/>}>
                                <i className="icon icon-signin cursor-pointer" style={{color: 'red'}}
                                   onClick={() => handleUnblockAdmin(rowData)}/>
                            </Tooltip>
                            :
                            <Tooltip title={<IntlMessages id="block"/>}>
                                <i className="icon icon-lock-screen cursor-pointer" style={{color: 'red'}}
                                   onClick={() => handleBlockAdmin(rowData)}/>
                            </Tooltip>
                    }
                </Fragment>
            }
        }
    ];

    const [adminList, setAdminList] = useState([]);
    const [totalAdmin, setTotalAdmin] = useState(0);
    const [currentAdminPage, setCurrentAdminPage] = useState(1);
    const [adminPageSize] = useState(10);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [grantPermissionOpen, setGrantPermissionOpen] = useState(false);
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const [blockAdminOpen, setBlockAdminOpen] = useState(false);
    const [unblockAdminOpen, setUnblockAdminOpen] = useState(false);
    const [createAdminOpen, setCreateAdminOpen] = useState(false);
    const [formCreateAdmin] = Form.useForm();
    const [formResetPassword] = Form.useForm();
    const [formGrantAcl] = Form.useForm();
    const [roles, setRoles] = useState([]);

    const onAdminPageSizeChange = (page) => {
        setCurrentAdminPage(page);
    }

    const loadAdminList = async () => {
        const res = await AdminService.getListAdmin(currentAdminPage, adminPageSize);
        setAdminList(res.data.data);
        setTotalAdmin(res.data.total);
    }

    const loadRole = async () => {
        const res = await AdminService.getRoles();
        setRoles(res.data);
    }

    const handleGrantPermission = (currentAdmin) => {
        setCurrentAdmin(currentAdmin);
        setGrantPermissionOpen(true);
    }

    const cancelGrantPermission = () => {
        setCurrentAdmin(null);
        setGrantPermissionOpen(false);
    }

    const confirmGrantPermission = () => {
        setCurrentAdmin(null);
        setGrantPermissionOpen(false);
        loadAdminList();
    }

    const handleResetPassword = (currentAdmin) => {
        formResetPassword.resetFields();
        setCurrentAdmin(currentAdmin);
        setResetPasswordOpen(true);
    }

    const cancelResetPassword = () => {
        setCurrentAdmin(null);
        setResetPasswordOpen(false);
    }

    const confirmResetPassword = () => {
        formResetPassword.validateFields().then(res => {
            const admin = formResetPassword.getFieldsValue();

            if (admin.confirmPassword !== admin.password) {
                NotificationManager.warning(<IntlMessages
                    id="admin.management.list.create.confirmPassword.notMatch"/>, "");
                return;
            }

            AdminService.resetPassword(currentAdmin.user_name, admin.password).then(res => {
                setCurrentAdmin(null);
                setResetPasswordOpen(false);
                loadAdminList();
            });
        });
    }

    const handleBlockAdmin = (currentAdmin) => {
        setCurrentAdmin(currentAdmin);
        setBlockAdminOpen(true);
    }

    const cancelBlockAdmin = () => {
        setCurrentAdmin(null);
        setBlockAdminOpen(false);
    }

    const confirmBlockAdmin = () => {
        AdminService.blockAdmin(currentAdmin.ID).then(res => {
            setCurrentAdmin(null);
            setBlockAdminOpen(false);
            loadAdminList();
        });
    }

    const handleUnblockAdmin = (currentAdmin) => {
        setCurrentAdmin(currentAdmin);
        setUnblockAdminOpen(true);
    }

    const cancelUnblockAdmin = () => {
        setCurrentAdmin(null);
        setUnblockAdminOpen(false);
    }

    const confirmUnblockAdmin = () => {
        AdminService.unblockAdmin(currentAdmin.ID).then(res => {
            setCurrentAdmin(null);
            setUnblockAdminOpen(false);
            loadAdminList();
        });
    }

    const handleCreateAdmin = () => {
        formCreateAdmin.resetFields();
        setCreateAdminOpen(true);
    }

    const cancelCreateAdmin = () => {
        setCreateAdminOpen(false);
    }

    const confirmCreateAdmin = () => {
        formCreateAdmin.validateFields().then(res => {
            const admin = formCreateAdmin.getFieldsValue();

            if (admin.confirmPassword !== admin.password) {
                NotificationManager.warning(<IntlMessages
                    id="admin.management.list.create.confirmPassword.notMatch"/>, "");
                return;
            }

            AdminService.createAdmin(admin).then(res => {
                NotificationManager.success(<IntlMessages id="admin.management.list.create.success"/>, "");
                setCreateAdminOpen(false);
                loadAdminList();
            });
        });
    }

    useEffect(() => {
        loadAdminList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAdminPage, adminPageSize]);

    useEffect(() => {
        loadRole();
    }, [])

    return <Card title={
        <Fragment>
            <h1><IntlMessages id="admin.management.list.title"/></h1>
            <br/>
            <Button type="primary"
                    className="float-right"
                    onClick={handleCreateAdmin}>
                <IntlMessages id="admin.management.list.create"/>
            </Button>
        </Fragment>
    }>
        <Table className="gx-table-responsive"
               columns={adminColumns}
               rowKey="ID"
               dataSource={adminList}
               pagination={{
                   current: currentAdminPage,
                   defaultCurrent: currentAdminPage,
                   pageSize: adminPageSize,
                   defaultPageSize: adminPageSize,
                   total: totalAdmin,
                   onChange: onAdminPageSizeChange,
                   showTotal: (total) => {
                       return <Fragment>
                           <IntlMessages id="total"/> {total} <IntlMessages id="items"/>
                       </Fragment>
                   }
               }}
        />

        <Modal closable={false}
               title={<IntlMessages id="admin.management.list.create"/>}
               visible={createAdminOpen}
               onOk={confirmCreateAdmin}
               onCancel={cancelCreateAdmin}
               okText={<IntlMessages id="confirm"/>}
               cancelText={<IntlMessages id="cancel"/>}
        >
            <Form layout="vertical"
                  name="createAdmin"
                  form={formCreateAdmin}>
                <Form.Item label={<IntlMessages id="admin.management.list.create.displayName"/>}
                           name="displayName"
                           rules={[{
                               required: true,
                               message: <IntlMessages id="admin.management.list.create.displayName.require"/>
                           }]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item label={<IntlMessages id="admin.management.list.create.userName"/>}
                           name="userName"
                           rules={[{
                               required: true,
                               message: <IntlMessages id="admin.management.list.create.userName.require"/>
                           }]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item label={<IntlMessages id="admin.management.list.create.password"/>}
                           name="password"
                           rules={[{
                               required: true,
                               message: <IntlMessages id="admin.management.list.create.password.require"/>
                           }]}>
                    <Input size="large" type="password"/>
                </Form.Item>
                <Form.Item label={<IntlMessages id="admin.management.list.create.confirmPassword"/>}
                           name="confirmPassword"
                           rules={[{
                               required: true,
                               message: <IntlMessages id="admin.management.list.create.confirmPassword.require"/>
                           }]}>
                    <Input size="large" type="password"/>
                </Form.Item>
                <Form.Item label={<IntlMessages id="admin.management.list.create.email"/>}
                           name="email"
                           rules={[{
                               required: true,
                               message: <IntlMessages id="admin.management.list.create.email.require"/>
                           }]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item label={<IntlMessages id="admin.management.list.create.phone"/>}
                           name="phone"
                           rules={[{
                               required: true,
                               message: <IntlMessages id="admin.management.list.create.phone.require"/>
                           }]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item label={<IntlMessages id="admin.management.list.create.avatar"/>}
                           name="avatar">
                    <Input size="large"/>
                </Form.Item>
            </Form>
        </Modal>

        {
            currentAdmin &&
            <Modal closable={false}
                   title={<IntlMessages id="admin.management.list.resetPassword.title"/>}
                   visible={resetPasswordOpen}
                   onOk={confirmResetPassword}
                   onCancel={cancelResetPassword}
                   okText={<IntlMessages id="confirm"/>}
                   cancelText={<IntlMessages id="cancel"/>}
            >
                <Form layout="vertical"
                      name="resetPassword"
                      form={formResetPassword}>
                    <Form.Item label={<IntlMessages id="admin.management.list.table.id"/>}>
                        <Input size="large" value={currentAdmin.ID} readOnly={true}/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="admin.management.list.table.userName"/>}>
                        <Input size="large" value={currentAdmin.user_name} readOnly={true}/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="admin.management.list.create.password"/>}
                               name="password"
                               rules={[{
                                   required: true,
                                   message: <IntlMessages id="admin.management.list.create.password.require"/>
                               }]}>
                        <Input size="large" type="password"/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="admin.management.list.create.confirmPassword"/>}
                               name="confirmPassword"
                               rules={[{
                                   required: true,
                                   message: <IntlMessages id="admin.management.list.create.confirmPassword.require"/>
                               }]}>
                        <Input size="large" type="password"/>
                    </Form.Item>
                </Form>
            </Modal>
        }

        {
            currentAdmin &&
            <Modal closable={false}
                   title={<IntlMessages id="admin.management.list.grantAcl.title"/>}
                   visible={grantPermissionOpen}
                   onOk={confirmGrantPermission}
                   onCancel={cancelGrantPermission}
                   okText={<IntlMessages id="confirm"/>}
                   cancelText={<IntlMessages id="cancel"/>}
            >
                <Form layout="vertical"
                      name="grantAcl"
                      form={formGrantAcl}>
                    <Form.Item label={<IntlMessages id="admin.management.list.table.id"/>}>
                        <Input size="large" value={currentAdmin.ID} readOnly={true}/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="admin.management.list.table.userName"/>}>
                        <Input size="large" value={currentAdmin.user_name} readOnly={true}/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="admin.management.list.table.role"/>}>
                        <Select className="gx-mb-3"
                                placeholder={<IntlMessages id="admin.management.list.table.role.placeholder"/>}
                        >
                            {
                                roles.map((role, index) => {
                                    return <Select.Option value={role.id}
                                                          key={index}>{role.name_acl}</Select.Option>;
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        }

        {
            currentAdmin &&
            <SweetAlert show={blockAdminOpen}
                        warning
                        showCancel
                        cancelBtnText={<IntlMessages id="cancel"/>}
                        confirmBtnText={<IntlMessages id="confirm"/>}
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title={<IntlMessages id="admin.management.list.block.title"/>}
                        onConfirm={confirmBlockAdmin}
                        onCancel={cancelBlockAdmin}
                        focusConfirmBtn={false}>
                <IntlMessages id="admin.management.list.block.content"/>
                &nbsp;
                <strong>{currentAdmin.user_name}</strong>
            </SweetAlert>
        }

        {
            currentAdmin &&
            <SweetAlert show={unblockAdminOpen}
                        warning
                        showCancel
                        cancelBtnText={<IntlMessages id="cancel"/>}
                        confirmBtnText={<IntlMessages id="confirm"/>}
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title={<IntlMessages id="admin.management.list.unblock.title"/>}
                        onConfirm={confirmUnblockAdmin}
                        onCancel={cancelUnblockAdmin}
                        focusConfirmBtn={false}>
                <IntlMessages id="admin.management.list.unblock.content"/>
                &nbsp;
                <strong>{currentAdmin.user_name}</strong>
            </SweetAlert>
        }
    </Card>
};

export default ListAdmin;