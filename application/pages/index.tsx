import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

import { Layout, Menu, Icon, List } from "antd";

const { Header, Content, Footer, Sider } = Layout;

export default () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/articles")
      .then(({ data }) => setArticles(data));
  }, []);

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
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
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
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <List
              header={<h3>Articles</h3>}
              bordered
              dataSource={articles}
              renderItem={item => (
                <List.Item actions={[<a>download</a>]}>{item.title}</List.Item>
              )}
            />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
