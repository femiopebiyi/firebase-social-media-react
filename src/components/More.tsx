import { useState } from "react";
import { PiDotsThreeOutlineDuotone } from "react-icons/pi";



export function More(){
const [more, setMore] = useState<boolean>(false)


    return <div className="more-con">
        <div className="more" onClick={()=>{setMore(!more)}}><PiDotsThreeOutlineDuotone /></div>

            <div className="more-details" style={{
                display: !more ? "none" : "flex"
            }}>
                <button className="delete">Delete</button>
                <button className="profile">Profile</button>
                <button className="about">About</button>
            </div>
        </div>
}