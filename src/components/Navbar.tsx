import { NavLink } from "react-router-dom"

export function Navbar (){

    return <div>
         <NavLink to= '/'>Home</NavLink>
         <NavLink to= '/login'>Login</NavLink>
    </div>
}