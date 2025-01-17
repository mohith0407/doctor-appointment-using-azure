import React from 'react';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import homepageImage from '../assets/front.jpg';

const Home = () => (
    <>
        <div className='sticky top-0 z-20'>
        <Navbar />
        </div>
        
        <div
            className="relative min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${homepageImage})` }}
        >
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-gray-800 opacity-50"></div>

            {/* Main content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen text-center text-white px-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 drop-shadow-lg">
                    Welcome to Smart Healthcare
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl drop-shadow-md">
                    Experience seamless, patient-centric healthcare services with our innovative online appointment booking system.
                </p>

                {/* Buttons */}
                <div className="flex gap-6">
                    <Button to="/signup/patient" label="Patient Signup" color="blue" isLink />
                    <Button to="/signup/doctor" label="Doctor Signup" color="green" isLink />
                    <Button to="/signup/admin" label="Admin Signup" color="purple" isLink />
                </div>
            </div>
        </div>
        <Footer />
    </>
);

export default Home;
