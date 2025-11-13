import React from "react";
import { Toaster } from "sonner";

const Footer = () => {
    return (
        <div>
            <Toaster expand={false} position="top-center" richColors closeButton />
        </div>
    );
};

export default Footer;
