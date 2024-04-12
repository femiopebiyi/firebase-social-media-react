import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "../config/firebase";
import { FaPen } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { storage } from "../config/firebase";
import {ref, uploadBytes, getDownloadURL, listAll} from 'firebase/storage'
import { addDoc, collection, query, updateDoc, where, getDocs, doc } from "firebase/firestore";
import {useParams} from 'react-router-dom'



export function ProfileInd (){
  type Details = {
    username: string;
    "full-name": string;

  }




    const [details, setDetails] = useState<Details | null>(null);
    const [downloadURL, setDownloadURL] = useState<string | null>(null);
    const imageListRef = ref(storage, `images/`)
    const [user] = useAuthState(auth)
    const  [loading, setLoading] = useState('')
    const  [loadingSave, setLoadingSave] = useState('Save Changes')
    
    const [clickedFull, setClickedFull] = useState<boolean>(true);
  const [clickedUser, setClickedUser] = useState<boolean>(true);
  
  const [value, setValue] = useState(details?.["full-name"]);
  const [valueUser, setValueUser] = useState(details?.username);
  const [altnames, SetAltnames] = useState("")





  const { userId } = useParams();

 useEffect(()=>{

  listAll(imageListRef)
    .then((res) => {
      res.items.forEach((item) => {

        if (item.name === userId) {
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
  

    const detailsRef = collection(database, 'details')

    const postRef = collection(database,"posts")

 async function loadOtherNames(){
  const altNameQuery = query(postRef, where("userId", "==", userId))
  const altNameRef = await getDocs(altNameQuery)
  const altnames = altNameRef.docs.map((doc)=>({usernames: doc.data().username, likeId: doc.id}))

  const {usernames} = altnames[0]
  SetAltnames(usernames)

 }

 function setIsClickedFull(){
  setClickedFull((prev)=> !prev)
 }
 function setIsClickedUser(){
  setClickedUser((prev)=> !prev)
 }


      console.log(userId)

  async function loadDetails() {
  try{

    const loggedInRef = detailsRef && query(detailsRef, where("userId", '==', userId))
    console.log(loggedInRef)
    const data = loggedInRef && await getDocs(loggedInRef)
    console.log(data?.docs)
  const detail = data?.docs.map((doc)=>({userId: doc.data()["userId"], docId: doc.id, fullName: doc.data()["full-name"], username: doc.data().username}))
  

  if (detail && detail.length > 0) {
        const { username, fullName } = detail[0];
        setDetails({
          username: username,
          "full-name": fullName,
        });
        setValue(fullName)  ;
        setValueUser(username);
      } else{
        setValue(altnames ?? "")  ;
        setValueUser(altnames ?? "");
      }

  
  } catch(err){
    console.log(err)
  }
  
 }

useEffect(()=>{
  loadDetails()
},[])



    return <div className="profile-con" onLoad={()=>{
      loadOtherNames()
      loadDetails()
    }} style={{height: "90vh"}}>
        <main>
            <h1>Profile</h1>

              <div className="profile-pic-con">
        
          {downloadURL ? (
            <img src ={downloadURL} alt="profile" className="profile-pic" />
          ) : (
            <img src= "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" alt="profile" className="profile-pic" />
          )}
          <div className='edit'><FaPen/></div>
          <input
            type="file"
            id="fileInput"
            hidden
            
          />
        </div>

            <div>{loading}</div>

            <div className="info">
                <div className="name card">
                    <h4>Full Name:</h4>
                    <div className="edit-con" style={{border: !clickedFull ? '1px solid black' : 'none'}}>
                    <input type="text" disabled = {clickedFull} value= {value || altnames} onChange={(e)=>{setValue(e.target.value); setLoadingSave("Save Changes")}}/></div>
                </div>
                <div className="username card">
                    <h4>Username:</h4>
                    <div className="edit-con" style={{border: !clickedUser ? '1px solid black' : 'none'}}>
                    <input type="text" disabled={clickedUser} value={valueUser || altnames} onChange={(e)=>{setValueUser(e.target.value); setLoadingSave("Save Changes")}}/>
                    
                    </div>
                </div>
                {/* <div className="email card">
                    <h4>Email:</h4>
                    <input type="email" disabled value={user?.email ?? ''} className="email-in"/>
                </div> */}
            </div>
        </main>

          
          {/* <button className="savechanges" onClick={()=>{
            if(!value?.trim() || !valueUser?.trim()){
              setError("dont leave any input empty")
            } else if (valueUser.length < 3){
              setError("username should be more than 3 char")
            

            
          
          }}>{loadingSave}</button> */}
    </div>
}