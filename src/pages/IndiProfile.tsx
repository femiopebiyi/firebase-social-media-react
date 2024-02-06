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

 async function saveChanges() {
  setLoadingSave('Saving')
  try{
    
  const loggedInRef = query(detailsRef, where("userId", '==', user?.uid ))
  const data = await getDocs(loggedInRef)
  const detail = data.docs.map((doc)=>({userId: doc.data()["userId"], docId: doc.id}))
  
  
  
      if(detail.length === 0){
    await addDoc(detailsRef, {
    "full-name": value,
    "profile-url": user?.photoURL,
    "userId": user?.uid,
    username: valueUser
  }).then(()=>{window.location.reload()})
  } else if(detail.length === 1){
    const {docId, userId} = detail[0]
    const docRef = doc(database, 'details', docId)
    await updateDoc(docRef, {
      "full-name": value,
      "profile-url": downloadURL,
      "userId": user?.uid,
      username: valueUser
    }).then(()=>{window.location.reload()})
    setLoadingSave("Saved")
  }
  } catch(err){
  console.log(err)
 }
 
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
        setValue(user?.displayName ?? "")  ;
        setValueUser(user?.displayName ?? "");
      }

  
  } catch(err){
    console.log(err)
  }
  
 }





    return <div className="profile-con" onLoad={loadDetails}>
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
                    <input type="text" disabled = {clickedFull} value= {value || 'not set'} onChange={(e)=>{setValue(e.target.value); setLoadingSave("Save Changes")}}/></div>
                </div>
                <div className="username card">
                    <h4>Username:</h4>
                    <div className="edit-con" style={{border: !clickedUser ? '1px solid black' : 'none'}}>
                    <input type="text" disabled={clickedUser} value={valueUser || 'not set'} onChange={(e)=>{setValueUser(e.target.value); setLoadingSave("Save Changes")}}/>
                    
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
            } else if (valueUser.length > 8 ){
              setError("username should be less than 8 char")
            } else{
              saveChanges()
            }

            
          
          }}>{loadingSave}</button> */}
    </div>
}