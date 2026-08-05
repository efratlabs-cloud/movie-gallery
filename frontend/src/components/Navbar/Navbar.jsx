import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { handleLogout } from "../../lib/logout";
import { getToken } from "../../lib/token";

export default function Navbar() {
 const navigate = useNavigate();
 const isLoggedin = getToken();
  return (
   
    <nav className={styles.nav}>
    {isLoggedin && <Button btnDescription="Logout" onClick={() => handleLogout(navigate)} />}
 </nav>
  )
}
