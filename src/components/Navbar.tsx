import { NavLink, useNavigate,  } from "react-router-dom"
import {auth} from '../config/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {signOut} from 'firebase/auth';
import {Button, ButtonGroup} from "@nextui-org/react";
import { database } from "../config/firebase";
import { collection, doc, query, addDoc, getDocs, where, QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function Navbar (){
    const navigate = useNavigate()
    const detailsRef = collection(database, 'details')
    const [user] = useAuthState(auth)
    const [profileURL, setProfileURL] = useState<QueryDocumentSnapshot | string>("")
    // const detailDoc =  query(detailsRef, where('user-id', '==', user?.uid))

    const signUserOut = async ()=>{
        signOut(auth)
        navigate('/login')
    }

    // async function getDetails(){
        
    //     const data = await getDocs(detailDoc)
    //     console.log(data.docs.map((doc)=>({userId: doc.data().userId, "profile-url": doc.data()['profile-url']})))
    // }

    // useEffect(()=>{
    //     getDetails()
    // }, [])
    

    return <div className="Navbar">
        <div className="logo">Femi</div>

        <header>
            <div className="navlinks">
                <NavLink to= '/'>Home</NavLink>
                {!user ? <NavLink to= '/login'>Login</NavLink>: <NavLink to= '/createpost'>Create Post</NavLink>}
                
            </div>
        
        {user && 
        <div className="profile">
            <p>{user?.displayName}</p>
            <img src ={user?.photoURL ?? ''} width = "20" height = "20" alt="profile-pic" className="profile-img" onClick={()=>{navigate('/profile')}}/>
            <button onClick ={signUserOut} className="logout" >LogOut</button>
        </div>

        }
        </header>

    </div>
}