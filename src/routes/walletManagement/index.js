import React, {Fragment, useEffect, useState} from "react";
import {Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select, Table, Tooltip, Modal} from "antd";
import IntlMessages from "../../util/IntlMessages";
import * as WalletService from '../../services/Wallet';
import SweetAlert from "react-bootstrap-sweetalert";
import {NotificationManager} from "react-notifications";

const Option = Select.Option;

const WalletManagement = () => {
    const selectStyle = {width: '100%'};
    const walletGroupColumns = [
        {
            title: <IntlMessages id="wallet.table.id"/>,
            dataIndex: 'id'
        },
        {
            title: <IntlMessages id="wallet.table.name"/>,
            dataIndex: 'wallet_group_name'
        },
        {
            title: <IntlMessages id="wallet.table.isFiat"/>,
            render: (rowData) => {
                return rowData.is_fiat ? <IntlMessages id="yes"/> : <IntlMessages id="no"/>
            }
        },
        {
            title: <IntlMessages id="wallet.table.orderPosition"/>,
            dataIndex: 'order_position'
        },
        {
            title: <IntlMessages id="wallet.table.delete"/>,
            render: (rowData) => {
                return <Fragment>
                    <Tooltip title={<IntlMessages id="edit"/>}>
                        <i className="icon icon-editor cursor-pointer" style={{color: 'orange'}}
                           onClick={() => handleEditWalletGroup(rowData)}/>
                    </Tooltip>
                    &nbsp;&nbsp;
                    <Tooltip title={<IntlMessages id="delete"/>}>
                        <i className="icon icon-trash cursor-pointer" style={{color: 'red'}}
                           onClick={() => handleDeleteWalletGroup(rowData)}/>
                    </Tooltip>
                </Fragment>;
            }
        },
    ];

    const walletTypeColumns = [
        {
            title: <IntlMessages id="wallet.table.id"/>,
            dataIndex: 'id'
        },
        {
            title: <IntlMessages id="wallet.table.name"/>,
            dataIndex: 'wallet_name'
        },
        {
            title: <IntlMessages id="wallet.table.image"/>,
            dataIndex: 'wallet_image',
            render: (row) => {
                return <img alt={row} src={row}/>
            }
        },
        {
            title: <IntlMessages id="wallet.table.type"/>,
            dataIndex: 'wallet_type'
        },
        {
            title: <IntlMessages id="wallet.table.url"/>,
            dataIndex: 'wallet_url'
        },
        {
            title: <IntlMessages id="wallet.table.group"/>,
            render: (rowData) => {
                return walletGroupMap[rowData.wallet_group_id]
            }
        },
        {
            title: <IntlMessages id="wallet.table.orderPosition"/>,
            dataIndex: 'order_position'
        },
        {
            title: <IntlMessages id="wallet.table.delete"/>,
            render: (rowData) => {
                return <Fragment>
                    <Tooltip title={<IntlMessages id="edit"/>}>
                        <i className="icon icon-editor cursor-pointer" style={{color: 'orange'}}
                           onClick={() => handleEditWalletBase(rowData)}/>
                    </Tooltip>
                    &nbsp;&nbsp;
                    <Tooltip title={<IntlMessages id="delete"/>}>
                        <i className="icon icon-trash cursor-pointer" style={{color: 'red'}}
                           onClick={() => handleDeleteWalletBase(rowData)}/>
                    </Tooltip>
                </Fragment>
            }
        },
    ];

    const [walletGroup, setWalletGroup] = useState([]);
    const [fiat, setFiat] = useState(false);
    const [currentWalletGroup, setCurrentWalletGroup] = useState(null);
    const [walletGroupMap, setWalletGroupMap] = useState({});
    const [formWalletGroup] = Form.useForm();
    const [formWalletBase] = Form.useForm();
    const [formEditWalletGroup] = Form.useForm();
    const [formEditWalletBase] = Form.useForm();
    const [walletBase, setWalletBase] = useState([]);
    const [currentWalletBase, setCurrentWalletBase] = useState(null);
    const [modalEditWalletGroupOpen, setModalEditWalletGroupOpen] = useState(false);
    const [modalEditWalletBaseOpen, setModalEditWalletBaseOpen] = useState(false);
    const [confirmDeleteWalletGroupOpen, setConfirmDeleteWalletGroupOpen] = useState(false);
    const [confirmDeleteWalletBaseOpen, setConfirmDeleteWalletBaseOpen] = useState(false);
    const [walletGroupIsFiat, setWalletGroupIsFiat] = useState(null);

    const loadWalletGroup = () => {
        WalletService.getWalletGroup().then(res => {
            setWalletGroup(res.data);

            let walletBase = [];
            let walletGroupMap = {};

            res.data.forEach(item => {
                walletGroupMap[item.id] = item.wallet_group_name;
                walletBase = walletBase.concat(item.list_wallet_base);
            });

            setWalletBase(walletBase);
            setWalletGroupMap(walletGroupMap);
        });
    }

    const createWalletGroup = (values) => {
        const walletGroup = values;
        walletGroup.isFiat = fiat;

        WalletService.createWalletGroup(walletGroup).then(res => {
            NotificationManager.success(<IntlMessages id="wallet.group.add.success"/>, "");
            formWalletGroup.resetFields();
            setFiat(false);
            loadWalletGroup();
        });
    }

    const handleFiatChecked = e => {
        setFiat(e.target.checked);
    }

    const handleEditWalletGroup = (walletGroup) => {
        formEditWalletGroup.resetFields();
        setCurrentWalletGroup(walletGroup);
        setModalEditWalletGroupOpen(true);
        setWalletGroupIsFiat(walletGroup.is_fiat)
    }

    const cancelEditWalletGroup = () => {
        setCurrentWalletGroup(null);
        setModalEditWalletGroupOpen(false);
    }

    const confirmEditWalletGroup = () => {
        formEditWalletGroup.validateFields().then(res => {
            const walletGroup = {
                id: currentWalletGroup.id,
                ...formEditWalletGroup.getFieldsValue(),
                walletGroupIsFiat
            }
            WalletService.editWalletGroup(walletGroup).then(res => {
                NotificationManager.success(<IntlMessages id="wallet.group.edit.success"/>, "");
                setCurrentWalletGroup(null);
                setWalletGroupIsFiat(null);
                setModalEditWalletGroupOpen(false);
                setFiat(false);
                loadWalletGroup();
            });
        });
    }

    const handleDeleteWalletGroup = (walletGroup) => {
        setCurrentWalletGroup(walletGroup);
        setConfirmDeleteWalletGroupOpen(true);
    }

    const cancelDeleteWalletGroup = () => {
        setCurrentWalletGroup(null);
        setConfirmDeleteWalletGroupOpen(false);
    }

    const confirmDeleteWalletGroup = () => {
        WalletService.deleteWalletGroup(currentWalletGroup.id).then(res => {
            NotificationManager.success(<IntlMessages id="wallet.group.delete.success"/>, "");
            setCurrentWalletGroup(null);
            setConfirmDeleteWalletGroupOpen(false);
            loadWalletGroup();
        });
    }

    const createWallet = (values) => {
        WalletService.createWalletBase(values).then(res => {
            NotificationManager.success(<IntlMessages id="wallet.add.success"/>, "");
            loadWalletGroup();
            formWalletBase.resetFields();
        });
    }

    const handleEditWalletBase = (walletBase) => {
        formEditWalletBase.resetFields();
        setCurrentWalletBase(walletBase);
        setModalEditWalletBaseOpen(true);
    }

    const cancelEditWalletBase = () => {
        setCurrentWalletBase(null);
        setModalEditWalletBaseOpen(false);
    }

    const confirmEditWalletBase = () => {
        formEditWalletBase.validateFields().then(res => {
            const walletBase = {
                id: currentWalletBase.id,
                ...formEditWalletBase.getFieldsValue()
            }

            WalletService.editWalletBase(walletBase).then(res => {
                NotificationManager.success(<IntlMessages id="wallet.edit.success"/>, "");
                setCurrentWalletBase(null);
                setModalEditWalletBaseOpen(false);
                loadWalletGroup();
            });
        });
    }

    const handleDeleteWalletBase = (walletBase) => {
        setCurrentWalletBase(walletBase);
        setConfirmDeleteWalletBaseOpen(true);
    }

    const cancelDeleteWalletBase = () => {
        setCurrentWalletBase(null);
        setConfirmDeleteWalletBaseOpen(false);
    }

    const confirmDeleteWalletBase = () => {
        WalletService.deleteWalletBase(currentWalletBase.wallet_group_id, currentWalletBase.id).then(res => {
            NotificationManager.success(<IntlMessages id="wallet.delete.success"/>, "");
            setCurrentWalletBase(null);
            setConfirmDeleteWalletBaseOpen(false);
            loadWalletGroup();
        });
    }

    useEffect(() => {
        loadWalletGroup();
    }, []);

    return <Card title={<h1><IntlMessages id="wallet.management"/></h1>}>
        <h3><IntlMessages id="wallet.group"/></h3>
        <br/>
        <Form layout="inline"
              form={formWalletGroup}
              name="walletGroup"
              onFinish={createWalletGroup}>
            <Row gutter={24}>
                <Col lg={16} md={16} sm={12} xs={24}>
                    <Form.Item label={<IntlMessages id="wallet.groupName"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireGroupName"/>}]}
                               name="walletGroupName">
                        <Input size="large"/>
                    </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item label={<IntlMessages id="wallet.position"/>}
                               name="orderPosition"
                               initialValue="0">
                        <InputNumber size="large"/>
                    </Form.Item>
                </Col>
                <Col lg={16} md={16} sm={12} xs={24}>
                    <Form.Item>
                        <Checkbox checked={fiat} onChange={handleFiatChecked}><IntlMessages
                            id="wallet.isFiat"/></Checkbox>
                    </Form.Item>
                </Col>
                <Col lg={16} md={16} sm={12} xs={24}>
                    <Form.Item>
                        <Button type="primary"
                                htmlType="submit">
                            <IntlMessages id="wallet.add"/>
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <br/>
        <br/>
        <Row>
            <Col md={12}>
                <Table className="gx-table-responsive"
                       columns={walletGroupColumns}
                       dataSource={walletGroup}
                       rowKey="id"
                       pagination={false}
                />
            </Col>
        </Row>
        <br/>
        <br/>
        <br/>
        <br/>
        <h3><IntlMessages id="wallet.type.title"/></h3>
        <br/>
        <Form layout="inline"
              form={formWalletBase}
              name="walletBase"
              onFinish={createWallet}>
            <Row gutter={24}>
                <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item name="walletName"
                               label={<IntlMessages id="wallet.name"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireName"/>}]}>
                        <Input size="large"/>
                    </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item name="walletType"
                               label={<IntlMessages id="wallet.type"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireType"/>}]}>
                        <Input size="large"/>
                    </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item name="walletUrl"
                               label={<IntlMessages id="wallet.url"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireUrl"/>}]}>
                        <Input size="large"/>
                    </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item name="walletImage"
                               label={<IntlMessages id="wallet.image"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireImage"/>}]}>
                        <Input size="large"/>
                    </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item name="walletGroupId" label={<IntlMessages id="wallet.group"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireGroupId"/>}]}>
                        <Select className="gx-mb-3" style={selectStyle}>
                            {
                                walletGroup.map((group, index) => {
                                    return <Option value={group.id} key={index}>{group.wallet_group_name}</Option>;
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item name="position"
                               initialValue="0"
                               label={<IntlMessages id="wallet.orderPosition"/>}>
                        <Input size="large"/>
                    </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            <IntlMessages id="wallet.add"/>
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <br/>
        <br/>
        <Table className="gx-table-responsive"
               columns={walletTypeColumns}
               rowKey="id"
               dataSource={walletBase}
               pagination={false}
        />
        {
            currentWalletGroup &&
            <Modal closable={false}
                   title={<IntlMessages id="wallet.group.edit.title"/>}
                   visible={modalEditWalletGroupOpen}
                   onOk={confirmEditWalletGroup}
                   onCancel={cancelEditWalletGroup}
                   okText={<IntlMessages id="confirm"/>}
                   cancelText={<IntlMessages id="cancel"/>}
            >
                <Form layout="vertical"
                      name="editWalletGroup"
                      form={formEditWalletGroup}>
                    <Form.Item label={<IntlMessages id="wallet.groupName"/>}
                               initialValue={currentWalletGroup.wallet_group_name}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireGroupName"/>}]}
                               name="walletGroupName">
                        <Input size="large" defaultValue={currentWalletGroup.wallet_group_name}/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="wallet.position"/>}
                               initialValue={currentWalletGroup.order_position}
                               name="walletGroupOrderPosition">
                        <InputNumber size="large" defaultValue={currentWalletGroup.order_position}/>
                    </Form.Item>
                    <Form.Item>
                        <Checkbox defaultChecked={currentWalletGroup.is_fiat}
                                  onChange={(e) => setWalletGroupIsFiat(e.target.checked)}>
                            <IntlMessages id="wallet.isFiat"/>
                        </Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        }

        {
            currentWalletBase &&
            <Modal closable={false}
                   title={<IntlMessages id="wallet.edit.title"/>}
                   visible={modalEditWalletBaseOpen}
                   onOk={confirmEditWalletBase}
                   onCancel={cancelEditWalletBase}
                   okText={<IntlMessages id="confirm"/>}
                   cancelText={<IntlMessages id="cancel"/>}
            >
                <Form layout="vertical"
                      name="editWalletBase"
                      form={formEditWalletBase}>
                    <Form.Item label={<IntlMessages id="wallet.name"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireName"/>}]}
                               initialValue={currentWalletBase.wallet_name}
                               name="walletName">
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="wallet.type"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireType"/>}]}
                               initialValue={currentWalletBase.wallet_type}
                               name="walletType">
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="wallet.image"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireImage"/>}]}
                               initialValue={currentWalletBase.wallet_image}
                               name="walletImage">
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="wallet.url"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireUrl"/>}]}
                               initialValue={currentWalletBase.wallet_url}
                               name="walletUrl">
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="wallet.group"/>}
                               rules={[{required: true, message: <IntlMessages id="wallet.requireGroupId"/>}]}
                               initialValue={currentWalletBase.wallet_group_id}
                               name="walletGroupId">
                        <Select className="gx-mb-3">
                            {
                                walletGroup.map((group, index) => {
                                    return <Option value={group.id} key={index}>{group.wallet_group_name}</Option>;
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="wallet.position"/>}
                               initialValue={currentWalletBase.order_position}
                               name="walletOrderPosition">
                        <InputNumber size="large"/>
                    </Form.Item>
                </Form>
            </Modal>
        }

        {
            currentWalletGroup &&
            <SweetAlert show={confirmDeleteWalletGroupOpen}
                        warning
                        showCancel
                        cancelBtnText={<IntlMessages id="cancel"/>}
                        confirmBtnText={<IntlMessages id="confirm"/>}
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title={<IntlMessages id="admin.management.list.block.title"/>}
                        onConfirm={confirmDeleteWalletGroup}
                        onCancel={cancelDeleteWalletGroup}
                        focusConfirmBtn={false}>
                <IntlMessages id="admin.management.list.block.content"/>
                &nbsp;
                <strong>{currentWalletGroup && currentWalletGroup.wallet_group_name}</strong>
            </SweetAlert>
        }

        {
            currentWalletBase &&
            <SweetAlert show={confirmDeleteWalletBaseOpen}
                        warning
                        showCancel
                        cancelBtnText={<IntlMessages id="cancel"/>}
                        confirmBtnText={<IntlMessages id="confirm"/>}
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title={<IntlMessages id="wallet.delete.title"/>}
                        onConfirm={confirmDeleteWalletBase}
                        onCancel={cancelDeleteWalletBase}
                        focusConfirmBtn={false}>
                <IntlMessages id="wallet.delete.content"/>
                &nbsp;
                <strong>{currentWalletBase && currentWalletBase.wallet_name}</strong>
            </SweetAlert>
        }
    </Card>
};

export default WalletManagement;
