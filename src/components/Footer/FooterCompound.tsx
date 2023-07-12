import React from 'react';
import './FooterStyles.css';
import FooterLink from './FooterLink';
import Image from 'next/image';

function FooterCompound() {
  return (
    <footer className="footer-wrapper inner">
      <div className="footer-title">
        <Image
          className="logo"
          src={`/images/logo3.png`}
          width={100}
          height={50}
          alt=""
        />
        <div className="mt-3">
          cyket is a Web3 native Tiketing platform built on CyberConnect
          protocol.
        </div>
      </div>
      <div className="footer-row">
        <div className="footer-column">
          <FooterLink isTitle={true} newTarget="">
            My Account
          </FooterLink>
          <FooterLink link="/project" newTarget="">
            My Account
          </FooterLink>
          <FooterLink link="/profile" newTarget="">
            Profile
          </FooterLink>
        </div>
        <div className="footer-column">
          <FooterLink isTitle={true} newTarget="">
            Resources
          </FooterLink>
          <FooterLink link="https://discord.gg/fBCX6uCs" newTarget="_blank">
            Discord
          </FooterLink>
          <FooterLink
            link="https://github.com/anseungwoo/Like_Lion_test"
            newTarget="_blank"
          >
            git
          </FooterLink>
        </div>
      </div>
    </footer>
  );
}

export default FooterCompound;
