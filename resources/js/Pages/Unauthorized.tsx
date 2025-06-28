import { Button } from "antd";
import { Link } from "@inertiajs/react";
import React from "react";
import RootLayout from "../Layouts/RootLayout";

const Unauthorized: React.FC = () => {
    return (
        <RootLayout type="main" title="Unauthorized">
            <p>403 Unauthorized</p>
            <p>Kamu tidak memiliki akses untuk laman ini</p>
            <Button>
                <Link href="/">Return to Home</Link>
            </Button>
        </RootLayout>
    );
};

export default Unauthorized;
