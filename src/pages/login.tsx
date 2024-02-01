import { auth, database, provider } from "../config/firebase"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import {FirebaseError} from 'firebase/app'
import {useNavigate} from 'react-router-dom'
import { addDoc, collection, query, where } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"




export function Login (){
    const navigate = useNavigate()
    const detailsRef = collection(database, 'details')
    const [user] = useAuthState(auth)
    
    async function signInWithGoogle (){
        try{
            signOut(auth);
            const res = await signInWithPopup(auth, provider)
            console.log(res.user)
            const {displayName, email, photoURL, uid} = res.user
            navigate("/")

        
        } catch (err: unknown) {
        if (err instanceof FirebaseError) {
            console.log(err.message);
        } else {
            console.error("An unexpected error occurred:", err);
        }
    }
        
    } 

    return <div>
        <p>Sign in with Google To continue</p>
        <button onClick={signInWithGoogle}>Sign in With Google</button>
    </div>
}