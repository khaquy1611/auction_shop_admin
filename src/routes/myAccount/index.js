import React from "react";
import IntlMessages from "../../util/IntlMessages";
import {Button, Card, Col, Form, Input, Row} from "antd";
import * as AdminService from "../../services/Admin";
import {NotificationManager} from "react-notifications";

const MyAccount = () => {
    const [formChangePassword] = Form.useForm();

    const changePassword = values => {
        console.log(values)
        if (values.confirmNewPassword !== values.newPassword) {
            NotificationManager.warning(<IntlMessages id="myAccount.changePassword.confirmNotMatch"/>, "");
            return;
        }

        AdminService.changePassword(values.currentPassword, values.confirmNewPassword).then(res => {
            NotificationManager.success(<IntlMessages id="myAccount.changePassword.success"/>, "");
            formChangePassword.resetFields();
        });
    }

    return <Card title={<h1><IntlMessages id="myAccount.title"/></h1>}>
        <h3><IntlMessages id="myAccount.changePassword"/></h3>
        <Row gutter={24}>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Form name="changePassword"
                      layout="vertical"
                      form={formChangePassword}
                      onFinish={changePassword}>
                    <Form.Item label={<IntlMessages id="myAccount.changePassword.current"/>}
                               rules={[{
                                   required: true,
                                   message: <IntlMessages id="myAccount.changePassword.current.require"/>
                               }]}
                               name="currentPassword">
                        <Input type="password" size="large"/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="myAccount.changePassword.new"/>}
                               rules={[{
                                   required: true,
                                   message: <IntlMessages id="myAccount.changePassword.new.require"/>
                               }]}
                               name="newPassword">
                        <Input type="password" size="large"/>
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="myAccount.changePassword.confirm"/>}
                               rules={[{
                                   required: true,
                                   message: <IntlMessages id="myAccount.changePassword.confirm.require"/>
                               }]}
                               name="confirmNewPassword">
                        <Input type="password" size="large"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"
                                htmlType="submit">
                            <IntlMessages id="myAccount.changePassword.save"/>
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    </Card>
}

export default MyAccount;