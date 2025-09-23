import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

function Footer() {
  return (
    <motion.div 
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.6, delay: 0.2}}
    className="px-6 md:px-16 1g:px-24 xl:px-32 mt-60 text-sm text-gray-500">
      <div className="flex flex-wrap justify-between items-start gap-8 pb-6 border-b border-borderColor">
        <div>
          <img src={assets.logo} alt="logo" className="h-8 md:h-9" /> <div />
          <p className="max-w-80 mt-3">
            Premium car rental service with a wide selection of luxury and
            everyday vehicles for all your driving needs.
          </p>
          <div className='flex items-center gap-3 mt-6'>
            <a href="#"> <img src={assets.facebook_logo} className='w-5 h-5' alt="" /> </a>
            <a href="#"> <img src={assets.instagram_logo}
            className='w-5 h-5' alt="" /> </a>
            <a href="#"> <img src={assets.twitter_logo} className='w-5
            h-5' alt="" /> </a>
            <a href="#"> <img src={assets.gmail_logo} className='w-5
            h-5' alt="" /> </a>
          </div>
        </div>
        <div>
            <h2 className='text-base font-medium text-gray-800
            uppercase'>Quick Links</h2>
            <ul className='mt-3 flex flex-col gap-1.5'>
            <li><a href="#">Home</a></li>
            <li><a href="#">Browse Cars</a></li>
            <li><a href="#">List Your Car</a></li>
            <li><a href="#">About Us</a></li>
            </ul>
        </div>
        <div>
            <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
            <ul className='mt-3 flex flex-col gap-1.5'>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Insurance</a></li>
            </ul>
        </div>
        <div>
            <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
            <ul className='mt-3 flex flex-col gap-1.5'>
            <li><a href="#">1234 Luxary Drive</a></li>
            <li><a href="#">San Francisco, CA 94107</a></li>
            <li><a href="#">+1 (650) 989-8608</a></li>
            <li><a href="#">rydex@contact.com</a></li>
            </ul>
        </div>
      </div>
      <div className='flex flex-col md:flex-row gap-2 items-center
            justify-between py-5'>
            <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
            <ul className='flex items-center gap-4'>
            <li><a href="#">Privacy</a></li>
            <li>|</li>
            <li><a href="#">Terms</a></li>
            <li>|</li>
            <li><a href="#">Cookies</a></li>
            </ul>
        </div>
    </motion.div>
  );
}

export default Footer;
