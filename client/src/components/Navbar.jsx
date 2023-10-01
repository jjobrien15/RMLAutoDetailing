//Navbar css in located in main.scss
import { useState, useEffect } from "react"
import RMLLogo from "../assets/RMLLogo.png"
import Socials from "../components/Socials"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

const NavLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "Services" },
    { name: "Gallery", href: "Gallery" },
    { name: "About", href: "About" },
    { name: "Shop Vehicles", href: "Vehicles" },
]

const Navbar = () => {
  //State to check if scrolled away from top of page to add styling to navbar if moved
  const [scrolling, setScrolling] = useState(false)

  //Use cookies to check if a user is logged in
  const [cookies, setCookies] = useCookies(["access_token"]);

  //Used to navigate to login page on logout
  const navigate = useNavigate();

  //Logout function
  const logout = () => {
    setCookies("access_token", "")
    window.localStorage.removeItem("userID")
    navigate("/login")
  }

  const RightNavLinks = [
    { name: "Schedule Service", href: "Schedule" },
    { name: "Login", href: "Login" },
  ]
  
  const RightNavLinksLoggedIn = [
    { name: "Schedule Service", href: "Schedule" },
    { name: "Logout", href: "#"},
  ]

  //Effect that will handle logic for scrolling away from top of screen to add style/class to Navbar
  useEffect(() => {

    if (scrolling > 150) {
      setScrolling(window.scrollY > 150);
    }

    const handleScroll = () => {
      setScrolling(window.scrollY > 150);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
   }, [])

  return (
    <nav className={scrolling ? "scrolling" : ""}>
      <div className="logo"><a href="/"><img src={RMLLogo} alt="RML Auto Detailing" /></a></div>

      <ul>
        {NavLinks.map((link) => (
            <li className="navLinks" key={link.name}><a href={link.href}>{link.name}</a></li>
        ))}
      </ul>

      <ul>
        {!cookies.access_token ?
            RightNavLinks.map((link) => (
              <li className="rightNavLinks" key={link.name}><a href={link.href}>{link.name}</a></li>
            ))
            :
            RightNavLinksLoggedIn.map((link) => (
              <li className="rightNavLinks" key={link.name}><a href={link.href} onClick={link.name == "Logout" ? logout : ""}>{link.name}</a></li>
            ))
        }
      </ul>

      {/* <Socials scrolling={scrolling ? "scrollingSocials" : ""} /> */}

    </nav>
  )
}

export default Navbar
