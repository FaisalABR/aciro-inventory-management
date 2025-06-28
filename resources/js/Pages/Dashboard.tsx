import { Button } from "antd";
import React from "react";
import Layout, { Content } from "antd/es/layout/layout";
import RootLayout from "../Layouts/RootLayout";

const Home: React.FC = () => {
    let foo: string = "React";
    let bar: string = "Typescript";

    return (
        <RootLayout type="main" title="Dashboard">
            <Layout>
                <Content style={{ backgroundColor: "white" }}>
                    <h1>
                        Hello Welcome to {foo} + {bar}
                        <Button>Test</Button>
                    </h1>
                </Content>
            </Layout>
        </RootLayout>
    );
};

export default Home;
