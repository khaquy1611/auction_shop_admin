import React, { useEffect, useState } from "react";
import { Button, Table, Tooltip, Form, Input, Modal, Option, Select } from "antd";
import IntlMessages from "../../../util/IntlMessages";
import { NotificationManager } from "react-notifications";
import "./styles.scss"
import { getUserLogs } from '../../../services/Log'
import { PAGE_SIZE } from '../../../constants/utils'
import moment from "moment";

const UserLog = () => {

    const [loading, setLoading] = useState(false)
    const [userLogs, setUserLogs] = useState([])
    const [error, setError] = useState()
    const [filter, SetFilter] = useState({})
    const [dialogContent, setDialogContent] = useState({
        title: '',
        content: ''
    })
    const [isShowDetailDialog, setShowDetailDialog] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalRecord, setTotalRecords] = useState(0)
    const [methods, setMethods] = useState (['GET', 'POST', 'PUSH', 'DELETE', 'PATCH'])
    const [statusCodes, setStatusCodes] = useState([200, 201, 204, 400, 401, 403, 404, 500, 502])
    const { Option } = Select;

    useEffect(() => {
        loadData(filter, currentPage)
    }, [])

    const showDetailContent = (title, content) => {
        const contentDialog = {
            title,
            content
        }
        setDialogContent(contentDialog)
        setShowDetailDialog(true)
    }

    const loadData = (filter, pageNumber) => {
        const requestFilter = {}
        Object.keys(filter).forEach(key => {
            if (filter[key]) {
                requestFilter[key] = filter[key]
            }
        })

        setLoading(true)
        getUserLogs(requestFilter, pageNumber, PAGE_SIZE).then(response => {
            if (response.status == 200) {
                const userLogs = []
                response.data.hits.hits.forEach(item => {
                    userLogs.push(item._source.Data)
                });
                setUserLogs(userLogs)
                setTotalRecords(response.data.hits.total.value)
                setLoading(false)
            }
        })
    }

    const onPagechange = (page) => {
        setCurrentPage(page)
        loadData(filter, page)
    }

    const onSummitFilter = () => {
        setCurrentPage(1)
        loadData(filter, 1)
    }

    const onClearFilter = () => {
        SetFilter({})
    }

    

    const columns = [
        {
            title: <IntlMessages id="logs.management.user.table.column.method" />,
            dataIndex: "method",
            width: '10%',
            sorter: (a, b) => a.length - b.length
        },
        {
            title: <IntlMessages id="logs.management.user.table.column.request.time" />,
            dataIndex: "created",
            width: '20%',
            sorter: (a, b) => a - b,
            render: (created) => {
                const date = moment(new Date(created)).format("DD/MM/yyyy HH:mm:ss")
                return (
                    <div className={'flex flex-row item-center column-1'}>
                        <Tooltip title={date}>
                            <p className="one-line flex-1 text-table-row">{date}</p>
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: <IntlMessages id="logs.management.user.table.column.request.body" />,
            dataIndex: "requestBody",
            width: '10%',
            sorter: (a, b) => a.length - b.length,
            render: (responseBody) => {
                return (
                    <div className={'flex flex-row item-center column-2'}>
                        <p className="one-line flex-1 text-table-row">{responseBody}</p>
                        <img onClick={() => showDetailContent(<IntlMessages id="logs.management.user.table.column.request.body" />, responseBody)}
                            src='/assets/images/icons/icon_zoom.svg' className="cursor-pointer" ></img>
                    </div>
                )
            }
        },
        {
            title: <IntlMessages id="logs.management.user.table.column.request.id" />,
            dataIndex: "requestID",
            width: '20%',
            sorter: (a, b) => a.length - b.length,
            render: (requestID) => {
                return (
                    <div className={'flex flex-row item-center column-3'}>
                        <p className="one-line flex-1 text-table-row">{requestID}</p>
                        <img onClick={() => showDetailContent(<IntlMessages id="logs.management.user.table.column.request.id" />, requestID)}
                            src='/assets/images/icons/icon_zoom.svg' className="cursor-pointer" ></img>
                    </div>
                )
            }
        },
        {
            title: <IntlMessages id="logs.management.user.table.column.response.body" />,
            dataIndex: "responseBody",
            width: '20%',
            sorter: (a, b) => a.length - b.length,
            render: (responseBody) => {
                return (
                    <div className={'flex flex-row item-center column-4'}>
                        <p className="one-line flex-1 text-table-row">{responseBody}</p>
                        <img onClick={() => showDetailContent(<IntlMessages id="logs.management.user.table.column.response.body" />, responseBody)}
                            src='/assets/images/icons/icon_zoom.svg' className="cursor-pointer" ></img>
                    </div>
                )
            }
        },
        {
            title: <IntlMessages id="logs.management.user.table.column.url" />,
            dataIndex: "url",
            width: '20%',
            sorter: (a, b) => a.length - b.length,
            render: (url) => {
                return (
                    <div className={'flex flex-row item-center column-5'}>
                        <Tooltip title={url}>
                            <p className="one-line flex-1 text-table-row">{url}</p>
                        </Tooltip>
                        <img onClick={() => showDetailContent(<IntlMessages id="logs.management.user.table.column.url" />, url)}
                            src='/assets/images/icons/icon_zoom.svg' className="cursor-pointer" ></img>
                    </div>
                )
            }
        },
        {
            title: <IntlMessages id="logs.management.user.table.column.username" />,
            dataIndex: "userName",
            width: '10%',
            sorter: (a, b) => a.length - b.length,
            render: (userName) => {
                return (
                    <Tooltip title={userName}>
                        <p className="one-line flex-1 text-table-row">{userName}</p>
                    </Tooltip>
                )
            }
        }
    ];

    return (
        <>
            <div className="flex flex-row">
                <div className="flex-1">
                    <h2><IntlMessages id="logs.management.user.title" /></h2>
                </div>
            </div>
            <Form layout="vertical" name="detailUser">
                {error &&
                    <p className="danger">{error}</p>
                }
                <Form.Item className="mr-5" label={<IntlMessages id="logs.management.user.filter.appname" />}>
                    <Input
                        size="large"
                        value={filter.appName}
                        style={{ width: '25%' }}
                        onChange={(e) => SetFilter({
                            ...filter, appName: e.target.value
                        })}
                    />
                </Form.Item>

                <div className="flex flex-row">
                    <Form.Item className="flex-1 mr-5 ml-5" label={<IntlMessages id="logs.management.user.filter.statuscode" />}>
                        <Select value={filter.statusCode} onChange={(value) => SetFilter({
                            ...filter, statusCode: parseInt(value)
                        })}>
                            {statusCodes.map(status => (
                                <Option key={status}>{status}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item className="flex-1 mr-5 ml-5" label={<IntlMessages id="logs.management.user.filter.operation" />}>
                        <Input
                            size="large"
                            value={filter.operationName}
                            onChange={(e) => SetFilter({
                                ...filter, operationName: e.target.value
                            })}
                        />
                    </Form.Item>
                    <Form.Item className="flex-1 mr-5 ml-5" label={<IntlMessages id="logs.management.user.filter.email" />}>
                        <Input
                            size="large"
                            value={filter.email}
                            onChange={(e) => SetFilter({
                                ...filter, email: e.target.value
                            })}
                        />
                    </Form.Item>
                    <Form.Item className="flex-1 ml-5" label={<IntlMessages id="logs.management.user.table.column.method" />}>
                        <Select className="item-filter" value={filter.method} onChange={(value) => SetFilter({
                            ...filter, method: value
                        })}>
                            {methods.map(method => (
                                <Option key={method}>{method}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                </div>
                <div className="flex flex-row-reverse">
                    <Button className="no-margin" onClick={onSummitFilter} type="primary"><IntlMessages id="logs.management.user.filter.submit" /></Button>
                    <Button className="mr-10" onClick={onClearFilter} type="primary"><IntlMessages id="logs.management.user.filter.clear" /></Button>
                </div>

            </Form>
            <Table
                className="gx-table-responsive"
                columns={columns}
                rowKey={record => record.id}
                dataSource={userLogs}
                loading={loading}
                pagination={{
                    position: ['bottomCenter'],
                    current: currentPage,
                    pageSize: PAGE_SIZE,
                    total: totalRecord,
                    onChange: onPagechange,
                    showSizeChanger: false
                }}
            />
            {isShowDetailDialog &&
                <Modal
                    onCancel={() => setShowDetailDialog(false)}
                    closable={true}
                    title={dialogContent.title}
                    visible={isShowDetailDialog}
                    footer={null}
                >
                    <div>
                        {dialogContent.content}
                    </div>
                </Modal>
            }
        </>
    );
};

export default UserLog;
