import React from "react";
import {Card, Col, Row, Select, Table} from "antd";
import IntlMessages from "../../../util/IntlMessages";

const Option = Select.Option;

const columns = [
    {
        title: <IntlMessages id="statistics.table.id"/>,
        dataIndex: 'id'
    },
    {
        title: <IntlMessages id="statistics.table.transaction.id"/>,
        dataIndex: 'transactionId'
    },
    {
        title: <IntlMessages id="statistics.table.amount"/>,
        dataIndex: 'amount'
    },
    {
        title: <IntlMessages id="statistics.table.from"/>,
        dataIndex: 'from'
    },
    {
        title: <IntlMessages id="statistics.table.to"/>,
        dataIndex: 'to'
    },
    {
        title: <IntlMessages id="statistics.table.time"/>,
        dataIndex: 'time'
    },
    {
        title: <IntlMessages id="statistics.table.paygate"/>,
        dataIndex: 'paygate'
    }
];

const data = [
    {
        id: '1',
        transactionId: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        amount: '-1000',
        from: 'John Brown',
        to: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        paygate: 'MoonPay'
    },
    {
        id: '1',
        transactionId: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        amount: '-1000',
        from: 'John Brown',
        to: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        paygate: 'MoonPay'
    },
    {
        id: '1',
        transactionId: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        amount: '-1000',
        from: 'John Brown',
        to: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        paygate: 'MoonPay'
    },
    {
        id: '1',
        transactionId: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        amount: '-1000',
        from: 'John Brown',
        to: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        paygate: 'MoonPay'
    },
    {
        id: '1',
        transactionId: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        amount: '-1000',
        from: 'John Brown',
        to: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        paygate: 'MoonPay'
    },
    {
        id: '1',
        transactionId: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        amount: '-1000',
        from: 'John Brown',
        to: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        paygate: 'MoonPay'
    },
    {
        id: '1',
        transactionId: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        amount: '-1000',
        from: 'John Brown',
        to: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        paygate: 'MoonPay'
    },
    {
        id: '1',
        transactionId: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        amount: '-1000',
        from: 'John Brown',
        to: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        paygate: 'MoonPay'
    }
];

const TotalTokensWithdraws = () => {
    const selectStyle = {width: '100%'};
    return <Card className="statistics" title={
        <div className="header">
            <Row>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <h3><IntlMessages id="statistics.total.tokens.withdraws"/></h3>
                </Col>
            </Row>
            <Row>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <h1><span className="total">10,000 USD</span></h1>
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <span className="description">
                        <IntlMessages id="statistics.type"/>
                    </span>
                    <br/>
                    <Select className="gx-mb-3" defaultValue="lucy" style={selectStyle}>
                        <Option value="lucy">All</Option>
                    </Select>
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <span className="description">
                        <IntlMessages id="statistics.time"/>
                    </span>
                    <br/>
                    <Select className="gx-mb-3" defaultValue="lucy" style={selectStyle}>
                        <Option value="lucy">All</Option>
                    </Select>
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <span className="description">
                        <IntlMessages id="statistics.pagate"/>
                    </span>
                    <br/>
                    <Select className="gx-mb-3" defaultValue="lucy" style={selectStyle}>
                        <Option value="lucy">All</Option>
                    </Select>
                </Col>
            </Row>
            <IntlMessages id="statistics.transactions"/>
        </div>
    }>
        <Table className="gx-table-responsive"
               columns={columns}
               dataSource={data}
        />
    </Card>
}

export default TotalTokensWithdraws;