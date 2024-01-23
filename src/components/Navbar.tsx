import { NavLink, useNavigate,  } from "react-router-dom"
import {auth} from '../config/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';

import {signOut} from 'firebase/auth'


export function Navbar (){
    const navigate = useNavigate()

    const [user] = useAuthState(auth)

    const signUserOut = async ()=>{
        signOut(auth)
        navigate('/login')
    }

    return <div className="Navbar">
        <div className="logo">Femi</div>

        <header>
            <div className="navlinks">
                <NavLink to= '/'>Home</NavLink>
                <NavLink to= '/login'>Login</NavLink>
            </div>
        
        {user && 
        <div className="profile">
            <p>{user?.displayName}</p>
            <img src ={user?.photoURL ?? ''} width = "20" height = "20" alt="profile-pic"/>
            <button onClick ={signUserOut}>LogOut</button>
        </div>

        }
        </header>

    </div>
}