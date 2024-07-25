import { useState } from "react";

function Header() {
  return (
    <header
      className="d-flex flex-wrap justify-content-center py-2 px-3"
      style={{ background: "#1a272e"}}
    >
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none text-light"
      >
        <span className="fs-2">The Pallanck Lab</span>
      </a>
    </header>
  );
}
export default Header;