import React from "react";

const Navbar = () => {
  return (
    <>
      <nav className="flex sm:justify-center space-x-4">
        {[
          ["Home", "/"],
          ["Profile", "/profile"],
          ["About", "/about"],
          ["Work Experience", "/work-experience"],
          ["Education", "/education"],
          ["Work", "/work"],
          ["Skills", "/skills"],
          ["Hire Me", "/hire-me"],
          ["Customer-Support", "/customer-support"],
        ].map(([title, url]) => (
          <a key={url}
            href={url}
            className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900"
          >
            {title}
          </a>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
