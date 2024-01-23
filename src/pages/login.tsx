import { auth, provider } from "../config/firebase"
import { signInWithPopup } from "firebase/auth"
import {FirebaseError} from 'firebase/app'
import {useNavigate} from 'react-router-dom'
import {signOut} from 'firebase/auth'



export function Login (){
    const navigate = useNavigate()

    async function signInWithGoogle (){

         await signOut(auth);
        try{
            const result = await signInWithPopup(auth, provider)

        console.log(result)
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