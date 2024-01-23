import { NavLink } from "react-router-dom"
import {auth} from '../config/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';

import {signOut} from 'firebase/auth'


export function Navbar (){

    const [user] = useAuthState(auth)

    const signUserOut = async ()=>{
        await signOut(auth)
    }

    return <div>
         <NavLink to= '/'>Home</NavLink>
         <NavLink to= '/login'>Login</NavLink>

         <div>
            <p>{user?.displayName}</p>
            <img src ={user?.photoURL ?? ''} width = "100" height = "100"/>
            <button onClick ={signUserOut}>LogOut</button>
         </div>
    </div>
}