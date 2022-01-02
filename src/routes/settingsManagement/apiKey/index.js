import React, {Fragment} from "react";
import {Card, Divider, Input, Form, Button} from "antd";
import IntlMessages from "../../../util/IntlMessages";

const ApiKey = () => {
    const formItemLayout = {
        labelCol: {
            span: 3,
        },
        wrapperCol: {
            span: 14,
        },
    };

    return <Card title={
        <Fragment>
            <h1><IntlMessages id="settings.api.key.management"/></h1>
            <span>
                <IntlMessages id="settings.api.key.management.description"/>
            </span>
        </Fragment>
    }>
        <span><IntlMessages id="settings.api.key.details"/></span>
        <Divider/>
        <Form {...formItemLayout}>
            <Form.Item label={<span className="description"><IntlMessages id="settings.api.key.cognito"/></span>}>
                <Input type="large"/>
            </Form.Item>
            <Form.Item label={<span className="description"><IntlMessages id="settings.api.key.firebase"/></span>}>
                <Input type="large"/>
            </Form.Item>
            <Form.Item label={<span className="description"><IntlMessages id="settings.api.key.email"/></span>}>
                <Input type="large"/>
            </Form.Item>
            <Form.Item label={<span className="description"><IntlMessages id="settings.api.key.aws"/></span>}>
                <Input type="large"/>
            </Form.Item>
            <Form.Item label={<span className="description"><IntlMessages id="settings.api.key.coinbase"/></span>}>
                <Input type="large"/>
            </Form.Item>
            <Form.Item label={<span className="description"><IntlMessages id="settings.api.key.tax"/></span>}>
                <Input type="large"/>
            </Form.Item>
            <Form.Item label="">
                <Button type="primary"><IntlMessages id="settings.api.key.save"/></Button>
            </Form.Item>
        </Form>
    </Card>
}

export default ApiKey;