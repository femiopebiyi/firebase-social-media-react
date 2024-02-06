import { useState } from "react";
import { PiDotsThreeOutlineDuotone } from "react-icons/pi";
import { NavLink } from "react-router-dom";



export function More(){
const [more, setMore] = useState<boolean>(false)


    return <div className="more-con">
        <div className="more" onClick={()=>{setMore(!more)}}><PiDotsThreeOutlineDuotone /></div>

            <div className="more-details" style={{
                display: !more ? "none" : "flex"
            }}>
                <button className="delete">Delete</button>
                <NavLink to = '#' className="profile">Profile</NavLink>
                <NavLink to = '#' className="about">About</NavLink>
            </div>
        </div>
}