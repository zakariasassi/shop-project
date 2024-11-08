import { useState } from "react";
import { MegaMenu, Navbar } from "flowbite-react";
import { HiChevronDown } from "react-icons/hi";
import BannerView from "../Bannar/BannerView";
import Hero from "../Hero/Hero";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
    
      <Hero />
    </>
  );
}

export default Header;
