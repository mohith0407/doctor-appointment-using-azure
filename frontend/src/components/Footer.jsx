import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Smart Healthcare</h3>
                        <p className="text-gray-300">
                            Providing innovative healthcare solutions for a better tomorrow.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
                            <li><a href="/services" className="text-gray-300 hover:text-white">Services</a></li>
                            <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>Email: info@smarthealthcare.com</li>
                            <li>Phone: (555) 123-4567</li>
                            <li>Address: 123 Healthcare Ave</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
                    <p>&copy; {new Date().getFullYear()} Smart Healthcare. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
