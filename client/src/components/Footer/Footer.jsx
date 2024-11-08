import React from 'react';
import { SiTiktok, SiSnapchat, SiWhatsapp } from 'react-icons/si'; // TikTok, Snapchat, WhatsApp icons using react-icons
import { PhoneOutlined, MailOutlined, FacebookOutlined, InstagramOutlined } from '@ant-design/icons';

const FooterComponent = () => {
  return (
    <footer className="py-5 text-last bg-primary">
      <div className="container mx-auto">
        {/* Contact Information */}
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:justify-center md:space-x-8">
          <div className="flex items-center gap-2">
            <PhoneOutlined />
            <a href="tel:0910584040" className="text-last">0911234567</a>
          </div>
          <div className="flex items-center gap-2">
            <MailOutlined />
            <a href="mailto:support@libocare.com" className="text-last">costumercare@souq.com</a>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-last">
            <FacebookOutlined className="text-lg" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-last">
            <InstagramOutlined className="text-lg" />
          </a>
          <a href="https://www.snapchat.com" target="_blank" rel="noopener noreferrer" className="text-last">
            <SiSnapchat className="text-lg" />
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="text-last">
            <SiTiktok className="text-lg" />
          </a>
          <a href="https://wa.me/0910584040" target="_blank" rel="noopener noreferrer" className="text-last">
            <SiWhatsapp className="text-lg" />
          </a>
        </div>

        {/* Footer Text */}
        <div className="mt-4 text-center">
          <p className="text-last">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
