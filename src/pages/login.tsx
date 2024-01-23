import { auth, provider } from "../config/firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import {FirebaseError} from 'firebase/app'
import {useNavigate} from 'react-router-dom'




export function Login (){
    const navigate = useNavigate()

    async function signInWithGoogle (){
        try{
            signOut(auth);
            await signInWithPopup(auth, provider)
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