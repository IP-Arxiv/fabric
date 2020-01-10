import { useState } from "react";
import axios from "axios";
import Link from "next/link";

import { Layout, Menu, Icon, Form, Input, Button, Upload } from "antd";

const { Header, Content, Footer, Sider } = Layout;

function handleSubmit(e: any, values: any, file: File) {
  e.preventDefault();
  const { title } = values;

  const url = `http://localhost:3000/articles/${title}`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("username", "author");
  const config = { headers: { "content-type": "multipart/form-data" } };

  axios
    .post(url, formData, config)
    .then((res: any) => console.log("res", res))
    .catch(err => console.error("err", err));
}

const addArticle = (props: any) => {
  const { getFieldDecorator, getFieldsValue } = props.form;
  const [file, setFile] = useState(null);

  const uploadProps = {
    beforeUpload: (file: File) => {
      setFile(file);
      return false;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1">
            <Link href="/">
              <div>
                <Icon type="book" />
                <span className="nav-text">Journal</span>
              </div>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/addArticle">
              <div>
                <Icon type="upload" />
                <span className="nav-text">Submit Article</span>
              </div>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <Form onSubmit={e => handleSubmit(e, getFieldsValue(), file)}>
            <Form.Item label="Title">
              {getFieldDecorator("title", {
                rules: [{ required: true, message: "Please input a title" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item>
              <Upload {...uploadProps}>
                <Button>
                  <Icon type="upload" />
                  Select File
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

const wrappedForm = Form.create({ name: "addArticle" })(addArticle);
export default wrappedForm;
