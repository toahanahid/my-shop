import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5 p-4 text-center">
            <div className="container">
                <p className="mb-0">&copy; {new Date().getFullYear()} MyShop. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;