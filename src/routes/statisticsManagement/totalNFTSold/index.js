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
        title: <IntlMessages id="statistics.table.name.nft"/>,
        dataIndex: 'nameNFT'
    },
    {
        title: <IntlMessages id="statistics.table.ceiling.price"/>,
        dataIndex: 'ceilingPrice'
    },
    {
        title: <IntlMessages id="statistics.table.owner"/>,
        dataIndex: 'owner'
    },
    {
        title: <IntlMessages id="statistics.table.time"/>,
        dataIndex: 'time'
    },
    {
        title: <IntlMessages id="statistics.table.buyer"/>,
        dataIndex: 'buyer'
    },
    {
        title: <IntlMessages id="statistics.table.transaction.id"/>,
        dataIndex: 'transactionId'
    }
];

const data = [
    {
        id: '1',
        nameNFT: 'NFT item',
        ceilingPrice: '1000',
        owner: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        buyer: 'John Brown',
        transactionId: '0x89d2...0359'
    },
    {
        id: '1',
        nameNFT: 'NFT item',
        ceilingPrice: '1000',
        owner: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        buyer: 'John Brown',
        transactionId: '0x89d2...0359'
    },
    {
        id: '1',
        nameNFT: 'NFT item',
        ceilingPrice: '1000',
        owner: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        buyer: 'John Brown',
        transactionId: '0x89d2...0359'
    },
    {
        id: '1',
        nameNFT: 'NFT item',
        ceilingPrice: '1000',
        owner: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        buyer: 'John Brown',
        transactionId: '0x89d2...0359'
    },
    {
        id: '1',
        nameNFT: 'NFT item',
        ceilingPrice: '1000',
        owner: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        buyer: 'John Brown',
        transactionId: '0x89d2...0359'
    },
    {
        id: '1',
        nameNFT: 'NFT item',
        ceilingPrice: '1000',
        owner: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        buyer: 'John Brown',
        transactionId: '0x89d2...0359'
    },
    {
        id: '1',
        nameNFT: 'NFT item',
        ceilingPrice: '1000',
        owner: 'John Brown',
        time: 'Apr 1 2021, 11:00 AM 07',
        buyer: 'John Brown',
        transactionId: '0x89d2...0359'
    }
];

const TotalNFTSold = () => {
    const selectStyle = {width: '100%'};
    return <Card className="statistics" title={
        <div className="header">
            <Row>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <h3><IntlMessages id="statistics.total.nft.sold"/></h3>
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

export default TotalNFTSold;