import React, {Fragment, useEffect, useState} from "react";
import {Button, Card, Checkbox, Divider, Form, Input, Modal, Select, Table, Tooltip} from "antd";
import IntlMessages from "../../../util/IntlMessages";
import * as AdminService from "../../../services/Admin";
import {toDateWithTime} from "../../../modules/Utils";
import {NotificationManager} from "react-notifications";

const ManageACL = () => {
    const rolesColumns = [
        {
            title: <IntlMessages id="admin.management.acl.roles.table.id"/>,
            dataIndex: 'ID'
        },
        {
            title: <IntlMessages id="admin.management.acl.roles.table.name"/>,
            dataIndex: 'name_acl'
        },
        {
            title: <IntlMessages id="admin.management.acl.roles.table.lock"/>,
            render: (rowData) => {
                return rowData.lock ? <IntlMessages id="yes"/> : <IntlMessages id="no"/>
            }
        },
        {
            title: <IntlMessages id="admin.management.acl.roles.table.createdAt"/>,
            render: (rowData) => {
                return toDateWithTime(new Date(rowData.CreatedAt))
            }
        },
        {
            title: <IntlMessages id="admin.management.acl.roles.table.updatedAt"/>,
            render: (rowData) => {
                return toDateWithTime(new Date(rowData.UpdatedAt))
            }
        },
        {
            title: "",
            render: (rowData) => {
                return <Fragment>
                    <Tooltip title={<IntlMessages id="admin.management.acl.roles.table.showActions"/>}>
                        <i className="icon icon-all-contacts cursor-pointer" style={{color: 'green'}}
                           onClick={() => handleShowActions(rowData)}/>
                    </Tooltip>
                    &nbsp;&nbsp;
                    <Tooltip title={<IntlMessages id="edit"/>}>
                        <i className="icon icon-editor cursor-pointer" style={{color: 'orange'}}
                           onClick={() => handleEditRole(rowData)}/>
                    </Tooltip>
                </Fragment>
            }
        }
    ];

    const actionColumns = [
        {
            title: <IntlMessages id="admin.management.acl.actions.table.id"/>,
            dataIndex: 'ID'
        },
        {
            title: <IntlMessages id="admin.management.acl.actions.table.name"/>,
            dataIndex: 'name_action'
        },
        {
            title: <IntlMessages id="admin.management.acl.actions.table.method"/>,
            dataIndex: 'method'
        },
        {
            title: <IntlMessages id="admin.management.acl.actions.table.url"/>,
            dataIndex: 'url'
        },
        {
            title: <IntlMessages id="admin.management.acl.actions.table.lock"/>,
            render: (rowData) => {
                return rowData.lock ? <IntlMessages id="yes"/> : <IntlMessages id="no"/>
            }
        },
        {
            title: <IntlMessages id="admin.management.acl.actions.table.createdAt"/>,
            render: (rowData) => {
                return toDateWithTime(new Date(rowData.CreatedAt))
            }
        },
        {
            title: <IntlMessages id="admin.management.acl.actions.table.updatedAt"/>,
            render: (rowData) => {
                return toDateWithTime(new Date(rowData.UpdatedAt))
            }
        }
    ];

    const actionColumnsMini = [
        {
            title: <IntlMessages id="admin.management.acl.actions.table.id"/>,
            dataIndex: 'ID'
        },
        {
            title: <IntlMessages id="admin.management.acl.actions.table.name"/>,
            dataIndex: 'name_action'
        },
        {
            title: <IntlMessages id="admin.management.acl.actions.table.method"/>,
            dataIndex: 'method'
        },
        {
            title: <IntlMessages id="admin.management.acl.actions.table.url"/>,
            dataIndex: 'url'
        },
        {
            title: <IntlMessages id="admin.management.acl.actions.table.lock"/>,
            render: (rowData) => {
                return rowData.lock ? <IntlMessages id="yes"/> : <IntlMessages id="no"/>
            }
        }
    ];

    const [actions, setActions] = useState([]);
    const [currentActionsPage, setCurrentActionsPage] = useState(1);
    const [actionsPageSize] = useState(10);
    const [totalActions, setTotalActions] = useState(0);
    const [createActionOpen, setCreateActionOpen] = useState(false);
    const [formCreateAction] = Form.useForm();
    const [lockAction, setLockAction] = useState(false);

    const [roles, setRoles] = useState([]);
    const [currentRole, setCurrentRole] = useState(null);
    const [showActionsOpen, setShowActionsOpen] = useState(false);

    const [selectedActionId, setSelectedActionId] = useState(null);
    const [formAddActionToRole] = Form.useForm();

    const [createRoleOpen, setCreateRoleOpen] = useState(false);
    const [formCreateRole] = Form.useForm();

    const [editRoleOpen, setEditRoleOpen] = useState(false);
    const [formEditRole] = Form.useForm();

    const onActionsPageSizeChange = (page, pageSize) => {
        setCurrentActionsPage(page);
    }

    const handleCreateAction = () => {
        formCreateAction.resetFields();
        setCreateActionOpen(true);
    }

    const cancelCreateAction = () => {
        setCreateActionOpen(false);
    }

    const confirmCreateAction = () => {
        formCreateAction.validateFields().then(res => {
            const action = {
                lock: lockAction,
                ...formCreateAction.getFieldsValue()
            }

            AdminService.createActions(action).then(res => {
                NotificationManager.success(<IntlMessages id="admin.management.acl.actions.create.success"/>, "");
                setCreateActionOpen(false);
                setLockAction(false);
                loadActions();
            });
        });
    }

    const handleShowActions = (role) => {
        formAddActionToRole.resetFields();
        setCurrentRole(role);
        setShowActionsOpen(true);
    }

    const cancelShowActions = () => {
        setCurrentRole(null);
        setShowActionsOpen(false);
    }

    const onActionsChange = (value) => {
        setSelectedActionId(value);
    }

    const addActionToRole = () => {
        formAddActionToRole.validateFields().then(res => {
            console.log(selectedActionId);
        });
    }

    const handleEditRole = (currentRole) => {
        formEditRole.resetFields();
        setCurrentRole(currentRole);
        setLockAction(currentRole.lock);
        setEditRoleOpen(true);
    }

    const cancelEditRole = () => {
        setEditRoleOpen(false);
        setCurrentRole(null);
        setLockAction(false);
    }

    const confirmEditRole = () => {
        formEditRole.validateFields().then(res => {
            const role = {
                id: currentRole.ID,
                ...formEditRole.getFieldsValue(),
                lock: lockAction
            }

            AdminService.editRole(role).then(res => {
                NotificationManager.success(<IntlMessages id="admin.management.acl.roles.edit.success"/>, "");
                setEditRoleOpen(false);
                setCurrentRole(null);
                setLockAction(false);
                loadRoles();
            });
        });
    }

    const handleCreateRole = () => {
        formCreateRole.resetFields();
        setCreateRoleOpen(true);
    }

    const cancelCreateRole = () => {
        setCreateRoleOpen(false);
    }

    const confirmCreateRole = () => {
        formCreateRole.validateFields().then(res => {
            const role = {
                ...formCreateRole.getFieldsValue(),
                lock: lockAction
            }

            AdminService.createRole(role).then(res => {
                NotificationManager.success(<IntlMessages id="admin.management.acl.roles.create.success"/>, "");
                setCreateRoleOpen(false);
                setLockAction(false);
                loadRoles();
            });
        });
    }

    const loadActions = async (page, pageSize) => {
        const res = await AdminService.getActions(page || currentActionsPage, pageSize || actionsPageSize);
        setActions(res.data.data);
        setTotalActions(res.data.total);
    }

    const loadRoles = () => {
        const res = AdminService.getRoles();
        setRoles(res.data);
    };

    useEffect(() => {
        loadActions(1, 10000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadRoles();
    }, [])

    return <Card title={<h1><IntlMessages id="admin.management.acl.title"/></h1>}>
        <h3><IntlMessages id="admin.management.acl.roles.title"/></h3>
        <Button type="primary" className="float-right" onClick={handleCreateRole}>
            <IntlMessages id="admin.management.acl.roles.create"/>
        </Button>
        <Table className="gx-table-responsive"
               columns={rolesColumns}
               rowKey="ID"
               dataSource={roles}
               pagination={false}
        />
        <br/>
        <br/>
        <br/>
        <Divider/>
        <h3><IntlMessages id="admin.management.acl.actions.title"/></h3>
        <Button type="primary" className="float-right"
                onClick={() => handleCreateAction()}>
            <IntlMessages id="admin.management.acl.actions.create"/>
        </Button>
        <Table className="gx-table-responsive"
               columns={actionColumns}
               rowKey="ID"
               dataSource={actions}
               pagination={{
                   current: currentActionsPage,
                   defaultCurrent: currentActionsPage,
                   pageSize: actionsPageSize,
                   defaultPageSize: actionsPageSize,
                   total: totalActions,
                   onChange: onActionsPageSizeChange,
                   showTotal: (total) => {
                       return <Fragment>
                           <IntlMessages id="total"/> {total} <IntlMessages id="items2"/>
                       </Fragment>
                   }
               }}
        />

        <Modal closable={false}
               title={<IntlMessages id="admin.management.acl.actions.create"/>}
               visible={createActionOpen}
               onOk={confirmCreateAction}
               onCancel={cancelCreateAction}
               okText={<IntlMessages id="confirm"/>}
               cancelText={<IntlMessages id="cancel"/>}
        >
            <Form layout="vertical"
                  name="createAction"
                  form={formCreateAction}>
                <Form.Item label={<IntlMessages id="admin.management.acl.actions.table.name"/>}
                           name="method"
                           rules={[{
                               required: true,
                               message: <IntlMessages id="admin.management.acl.actions.table.name.require"/>
                           }]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item label={<IntlMessages id="admin.management.acl.actions.table.method"/>}
                           name="nameAction"
                           rules={[{
                               required: true,
                               message: <IntlMessages id="admin.management.acl.actions.table.method.require"/>
                           }]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item label={<IntlMessages id="admin.management.acl.actions.table.url"/>}
                           name="url"
                           rules={[{
                               required: true,
                               message: <IntlMessages id="admin.management.acl.actions.table.url.require"/>
                           }]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item>
                    <Checkbox defaultChecked={lockAction}
                              onChange={(e) => setLockAction(e.target.checked)}>
                        <IntlMessages id="admin.management.acl.actions.table.lock"/>
                    </Checkbox>
                </Form.Item>
            </Form>
        </Modal>

        {
            currentRole &&
            <Modal closable={false}
                   title={<IntlMessages id="admin.management.acl.roles.table.showActions"/>}
                   visible={showActionsOpen}
                   onOk={cancelShowActions}
                   onCancel={cancelShowActions}
                   okText={<IntlMessages id="confirm"/>}
                   cancelText={<IntlMessages id="close"/>}
            >
                <Form layout="vertical"
                      name="addActionToRole"
                      form={formAddActionToRole}>
                    <Form.Item label={<IntlMessages id="admin.management.acl.roles.table.id"/>}>
                        <Input size="large" value={currentRole.ID} readOnly={true}/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="admin.management.acl.roles.table.name"/>}>
                        <Input size="large" value={currentRole.name_acl} readOnly={true}/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="admin.management.acl.roles.table.actions"/>}
                               name="actionId"
                               rules={[{
                                   required: true,
                                   message: <IntlMessages id="admin.management.acl.roles.table.action.require"/>
                               }]}
                    >
                        <Select className="gx-mb-3"
                                showSearch
                                placeholder={<IntlMessages id="admin.management.acl.roles.table.searchActions"/>}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={onActionsChange}
                        >
                            {
                                actions.map((action, index) => {
                                    return <Select.Option value={action.id}
                                                          key={index}>{action.name_action}</Select.Option>;
                                })
                            }
                        </Select>
                        <Button type="primary" onClick={addActionToRole}>
                            <IntlMessages id="add"/>
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Table className="gx-table-responsive"
                               columns={actionColumnsMini}
                               rowKey="id"
                               dataSource={roles.role_action}
                               pagination={false}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        }

        <Modal closable={false}
               title={<IntlMessages id="admin.management.acl.roles.create.title"/>}
               visible={createRoleOpen}
               onOk={confirmCreateRole}
               onCancel={cancelCreateRole}
               okText={<IntlMessages id="confirm"/>}
               cancelText={<IntlMessages id="close"/>}
        >
            <Form layout="vertical"
                  name="createRole"
                  form={formCreateRole}>
                <Form.Item label={<IntlMessages id="admin.management.acl.roles.table.name"/>}
                           name="nameAcl"
                           rules={[{
                               required: true,
                               message: <IntlMessages id="admin.management.acl.roles.table.name.require"/>
                           }]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item>
                    <Checkbox defaultChecked={lockAction}
                              onChange={(e) => setLockAction(e.target.checked)}>
                        <IntlMessages id="admin.management.acl.roles.table.lock"/>
                    </Checkbox>
                </Form.Item>
            </Form>
        </Modal>

        {
            currentRole &&
            <Modal closable={false}
                   title={<IntlMessages id="admin.management.acl.roles.edit.title"/>}
                   visible={editRoleOpen}
                   onOk={confirmEditRole}
                   onCancel={cancelEditRole}
                   okText={<IntlMessages id="confirm"/>}
                   cancelText={<IntlMessages id="close"/>}
            >
                <Form layout="vertical"
                      name="editRole"
                      form={formEditRole}>
                    <Form.Item label={<IntlMessages id="admin.management.acl.roles.table.name"/>}
                               name="nameAcl"
                               initialValue={currentRole.name_acl}
                               rules={[{
                                   required: true,
                                   message: <IntlMessages id="admin.management.acl.roles.table.name.require"/>
                               }]}>
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item>
                        <Checkbox defaultChecked={lockAction}
                                  onChange={(e) => setLockAction(e.target.checked)}>
                            <IntlMessages id="admin.management.acl.roles.table.lock"/>
                        </Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        }
    </Card>
};

export default ManageACL;