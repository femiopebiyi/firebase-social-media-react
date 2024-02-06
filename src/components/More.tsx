import { useState } from "react";
import { PiDotsThreeOutlineDuotone } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { database } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import {auth} from '../config/firebase';
interface Props{
    getPost: ()=> Promise<void>
    postId: string
    userId: string
}

export function More(props: Props ){
const [more, setMore] = useState<boolean>(false)

    const { getPost, postId, userId } = props;

    const [user] = useAuthState(auth)

    async function deletePost(){
        const docRef = doc(database, "posts", postId)

        deleteDoc(docRef).then(()=>{getPost(); setMore(!more)})
    }

    return <div className="more-con">
        <div className="more" onClick={()=>{setMore(!more)}}><PiDotsThreeOutlineDuotone /></div>

            <div className="more-details" style={{
                display: !more ? "none" : "flex"
            }}>
                <button className="delete"onClick={deletePost} style ={{
                    display: user?.uid !== userId ? "none" : "flex"
                }}>Delete</button>
                <NavLink to = '#' className="profile">Profile</NavLink>
                <NavLink to = '#' className="about">About</NavLink>
            </div>
        </div>
}