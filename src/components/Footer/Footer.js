import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <nav className={`${styles.navbarWrapper} center`}>
      <div className={`${styles.navbarColumn} center`}>
        <div className={`${styles.navbarInner} center`}>
          <div className="center">
          </div>
        </div>
        <div className={`${styles.footerText} center`}>
        </div>
      </div>
    </nav>
  );
};
export default Footer;
