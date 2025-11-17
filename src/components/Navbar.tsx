import { NavLink, useNavigate } from "react-router-dom"
import { auth, storage } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { database } from "../config/firebase";
import { collection, query, getDocs, where, QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { FaReact } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";

export function Navbar (){
  type Details = {
    username: string;
    "full-name": string;
    "photo-url": string

  }

    const [details, setDetails] = useState<Details | null>(null);
    const navigate = useNavigate()
    const detailsRef = collection(database, 'details')
    const [user] = useAuthState(auth)
    const imageListRef = ref(storage, `images/`)
    const [downloadURL, setDownloadURL] = useState<string | null>(null);

    const signUserOut = async ()=>{
        signOut(auth)
        navigate('/login')
    }



    async function loadDetails() {
        if (!user?.uid) return;
        
        try {
            const loggedInRef = query(detailsRef, where("userId", '==', user.uid))
            const data = await getDocs(loggedInRef)
            const detail = data.docs.map((doc) => ({
                userId: doc.data()["userId"], 
                docId: doc.id, 
                fullName: doc.data()["full-name"], 
                username: doc.data().username, 
                photoUrl: doc.data()["profile-url"]
            }))

            if (detail && detail.length > 0) {
                const { username, fullName, photoUrl } = detail[0];
                setDetails({
                    username: username,
                    "full-name": fullName,
                    "photo-url": photoUrl
                });
            } else {
                setDetails({
                    username: user?.displayName ?? '',
                    "full-name": user?.displayName ?? '',
                    "photo-url": user?.photoURL ?? ''
                });
            }
        } catch (err) {
            console.error('Error loading user details:', err)
        }
    }

    useEffect(() => {
        if (!user?.uid) return;

        // Load user details
        loadDetails();

        // Load profile image
        listAll(imageListRef)
            .then((res) => {
                res.items.forEach((item) => {
                    if (item.name === user.uid) {
                        getDownloadURL(item).then((url) => {
                            setDownloadURL(url);
                        })
                    }
                })
            })
            .catch((error) => {
                console.error("Error listing images:", error);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.uid])

    return <header>
        <div className="Navbar">
            <div className="logo">
                <IoSparkles />
                SocialSphere
            </div>

            <div className="navlinks">
                <NavLink to='/'>Home</NavLink>
                {!user ? <NavLink to='/login'>Login</NavLink> : <NavLink to='/createpost'>Create Post</NavLink>}
            </div>

            {user &&
                <div className="profile">
                    <p id="big" onClick={() => { navigate(`/profile/${user?.uid}`) }}>{details?.username || user?.displayName}</p>
                    <img src={downloadURL || user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} width="40" height="40" alt="profile-pic" className="profile-img" onClick={() => { navigate(`/profile/${user?.uid}`) }} />
                    <button onClick={signUserOut} className="logout">
                        <span id="big">Logout</span>
                        <span id="small">Out</span>
                    </button>
                </div>
            }
        </div>
    </header>
}