import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import style from '@/styles/Nav.module.css'
import DDGSearch from "./DDGSearch";

export default function App() {
  return (
    <Navbar isBordered maxWidth="full" className={style.nav}>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem className={style.item}>
          <Link href="/">
            <FontAwesomeIcon className="fa-lg fa-regular" icon={faHouse} />
          </Link>
        </NavbarItem>
        {/* Masters has been deprecated for now? */}
        {/* <NavbarItem>
          <Link href="/masters">
            Masters
          </Link>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end" className="ml-auto">
        <NavbarItem>
          <div className={style.search}>
            <DDGSearch />
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}