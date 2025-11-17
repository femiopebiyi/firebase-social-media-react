import { auth, database, provider } from "../config/firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import { FirebaseError } from 'firebase/app'
import { useNavigate } from 'react-router-dom'
import { collection } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { IoSparkles } from "react-icons/io5";


export function Login() {
    const navigate = useNavigate()
    const detailsRef = collection(database, 'details')
    const [user] = useAuthState(auth)

    async function signInWithGoogle() {
        try {
            const res = await signInWithPopup(auth, provider)
            navigate("/")
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                console.error(err.message);
                alert(`Login failed: ${err.message}`);
            } else {
                console.error("An unexpected error occurred:", err);
                alert('An unexpected error occurred during login');
            }
        }
    }

    return <div className="sign-in-con">
        <div style={{ fontSize: '4rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <IoSparkles style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>Welcome to SocialSphere</h1>
        <p>Sign in with Google to continue your journey</p>
        <button onClick={signInWithGoogle} className="signin">
            <FcGoogle /> Sign in with Google
        </button>
    </div>
}