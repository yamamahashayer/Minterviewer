'use client';
import { useState, useEffect } from "react";
import "./Navbar.css";
import ListItem from "./list";
import logo from "../../../public/Covering.png";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose, IoMenu } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../../../Context/ThemeContext";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    router.push("/login");
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/AboutUS" },
    { title: "Mentors", path: "/PublicMentors" },
    { title: "Contact Us", path: "/ContactUs" },
    { title: "Join Us", path: "/JoinUs" },
  ];

  return (
    <nav className="nav fixed top-0 left-0 z-50 lg:px-[60px] md:px-[45px] px-8 bg-dark flex flex-shrink-0 items-center justify-between w-full h-20">
      {/* logo */}
      <Link href="/" className="flex items-center py-2">
        <Image
          className="cursor-pointer w-auto"
          src={logo}
          alt="MentorHub Logo"
          width={180}
          height={72}
          priority
          quality={100}
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            height: '48px'
          }}
        />
      </Link>

      {/* list navbar */}
      <div className="md:flex hidden md:w-auto items-center px-5 transition-all duration-300 z-50">
        <ul className="flex md:flex-row flex-col md:items-center justify-center lg:gap-[12px] md:gap-[4px] gap-1">
          {navLinks.map((link) => (
            <ListItem key={link.path} link={link.path}>
              {link.title}
            </ListItem>
          ))}
        </ul>
      </div>

      {/* theme & Sign in */}
      <div className="flex items-center justify-center self-stretch gap-3 p-2">
        <button
          onClick={toggle}
          className="hidden md:flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          <div className="opacity-0 transition-opacity duration-200" style={{ opacity: mounted ? 1 : 0 }}>
            {isDark ? (
              <BsSunFill className="lg:w-[24px] lg:h-[24px] md:w-[22px] md:h-[22px] text-yellow-300" />
            ) : (
              <BsMoonFill className="lg:w-[24px] lg:h-[24px] md:w-[22px] md:h-[22px] text-gray-300" />
            )}
          </div>
        </button>
        <button
          onClick={handleClick}
          className="btn-nav hover:bg-[var(--secondary)] hidden md:flex items-center justify-center gap-2"
        >
          <h5 className="lg:text-[14px] md:text-[13px]">Sign in</h5>
          <IoIosArrowForward />
        </button>
        <span
          onClick={() => setOpen(!open)}
          className="text-3xl cursor-pointer md:hidden"
        >
          {open ? <IoClose /> : <IoMenu />}
        </span>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden fixed left-0 w-full bg-dark transition-all duration-300 overflow-auto z-40 ${open ? "top-16 max-h-screen" : "top-16 max-h-0"
          }`}
      >
        <ul className="flex flex-col items-center gap-[20px] py-6">
          {navLinks.map((link) => (
            <li
              key={link.path}
              className="flex-col items-center md:p-2 lg:text-[14px] md:text-[13px] w-full"
            >
              <Link
                href={link.path}
                onClick={() => setOpen(false)}
                className={pathname === link.path ? "activeMobile w-full items-center py-4" : ""}
              >
                {link.title}
              </Link>
            </li>
          ))}
          <li className="flex items-center justify-center w-full py-4">
            <button
              onClick={() => {
                toggle();
                setOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              <div className="opacity-0 transition-opacity duration-200" style={{ opacity: mounted ? 1 : 0 }}>
                {isDark ? (
                  <>
                    <BsSunFill className="w-6 h-6 text-yellow-300" />
                    <span className="text-sm">Light Mode</span>
                  </>
                ) : (
                  <>
                    <BsMoonFill className="w-6 h-6 text-gray-300" />
                    <span className="text-sm">Dark Mode</span>
                  </>
                )}
              </div>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
