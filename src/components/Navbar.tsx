import { NavLink, useNavigate,  } from "react-router-dom"
import {auth, storage} from '../config/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {signOut} from 'firebase/auth';
import {Button, ButtonGroup} from "@nextui-org/react";
import { database } from "../config/firebase";
import { collection, doc, query, addDoc, getDocs, where, QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { getDownloadURL, listAll, ref } from "firebase/storage";

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
    const [profileURL, setProfileURL] = useState<QueryDocumentSnapshot | string>("")
    // const detailDoc =  query(detailsRef, where('userId', '==', user?.uid))
    const imageListRef = ref(storage, `images/`)
    const [downloadURL, setDownloadURL] = useState<string | null>(null);

    const signUserOut = async ()=>{
        signOut(auth)
        navigate('/login')
    }



    async function loadDetails() {
  try{
    const loggedInRef = detailsRef && query(detailsRef, where("userId", '==', user?.uid))
    console.log(loggedInRef)
    const data = loggedInRef && await getDocs(loggedInRef)
  console.log(data?.docs)
  const detail = data?.docs.map((doc)=>({userId: doc.data()["userId"], docId: doc.id, fullName: doc.data()["full-name"], username: doc.data().username, photoUrl: doc.data()["profile-url"]}))

  if (detail && detail.length > 0) {
        const { username, fullName, photoUrl } = detail[0];
        setDetails({
          username: username,
          "full-name": fullName,
          "photo-url": photoUrl
        });
       
      } else{
         const { username, fullName, photoUrl } = detail[0];
        setDetails({
          username: user?.displayName ?? '',
          "full-name": user?.displayName ?? '',
          "photo-url": user?.photoURL ?? ''
        });
      }

      console.log(details?.["photo-url"])
  }catch(err){
    console.log(err)
  }

}
 useEffect(()=>{

  listAll(imageListRef)
    .then((res) => {
      res.items.forEach((item) => {

        if (item.name === user?.uid) {
          getDownloadURL(item).then((url) => {
            setDownloadURL(url);
          })
        }
      })
    })
    .catch((error) => {
      console.error("Error listing images:", error);
    });

    
    

 }, [user?.uid])

    return <div className="Navbar" onLoad={loadDetails}>

        <header>
            <div className="navlinks">
                <NavLink to= '/'>Home</NavLink>
                {!user ? <NavLink to= '/login'>Login</NavLink>: <NavLink to= '/createpost'>Post</NavLink>}
                
            </div>
        


        {user && 
        <div className="profile">
            <p onClick = {()=>{navigate(`/profile/${user?.uid}`)}}>{details?.username || user?.displayName}</p>
            <img src ={downloadURL || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" || null || undefined} width = "20" height = "20" alt="profile-pic" className="profile-img" onClick={()=>{navigate(`/profile/${user?.uid}`)}}/>
            <button onClick ={signUserOut} className="logout" >LogOut</button>
        </div>

        }
        {/* <div className= 'ham'><RxHamburgerMenu /></div> */}
        </header>

        

    </div>
}