import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "../config/firebase";
import { FaPen } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { storage } from "../config/firebase";
import {ref, uploadBytes, getDownloadURL, listAll} from 'firebase/storage'
import { addDoc, collection } from "firebase/firestore";



export function Profile (){
  

    
    const [downloadURL, setDownloadURL] = useState<string | null>(null);
    const imageListRef = ref(storage, `images/`)
    const [user] = useAuthState(auth)
    const  [loading, setLoading] = useState('')
    const detailsRef = collection(database, 'details')

  const handleProfileClick = () => {
    
    // Trigger a click on the file input when the profile-pic-con div is clicked
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.click();
    }
  }

    const handleFileChange =  (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoading("Uploading......")
    // Handle file change logic here
    const selectedFile = event.target.files && event.target.files[0];
    // Do something with the selected file
    if(selectedFile) {
        

    const imageRef = ref(storage, `images/${user?.uid}`)

      uploadBytes(imageRef, selectedFile)
    .then((res) => {
      console.log("Upload successful. Response:", res);
      const ref = res.ref;
      return getDownloadURL(ref);
    })
    .then((url) => {
      setDownloadURL(url);
      console.log("Download URL:", url);
      setLoading("")
    })
    .catch((error) => {
      console.error("Error in the process:", error);
    });

    }
    
    

  };
  


  listAll(imageListRef)
    .then((res) => {
      res.items.forEach((item) => {
        if (item.name === user?.uid) {
          getDownloadURL(item).then((url) => {
            console.log(item.name);
            setDownloadURL(url);
          });
        }
      });
    })
    .catch((error) => {
      console.error("Error listing images:", error);
    });

 async function saveChanges() {
  try{
    addDoc(detailsRef, {
    "full-name": user?.displayName,
    "profile-url": downloadURL ?? user?.photoURL,
    "user-id": user?.uid,
    username: user?.displayName
  })
  } catch(err){
    console.log(err)
  }
  
 }

    return <div className="profile-con">
        <main>
            <h1>My Profile</h1>

              <div className="profile-pic-con" onClick={handleProfileClick}>
        
          {downloadURL ? (
            <img src ={downloadURL} alt="profile" className="profile-pic" />
          ) : (
            <img src={user?.photoURL ?? ''} alt="profile" className="profile-pic" />
          )}
          <div className='edit'><FaPen/></div>
          <input
            type="file"
            id="fileInput"
            hidden
            onChange={handleFileChange}
          />
        </div>

            <div>{loading}</div>

            <div className="info">
                <div className="name card">
                    <h4>Full Name:</h4>
                    <input type="text" disabled value={user?.displayName ?? ''}/>
                </div>
                <div className="username card">
                    <h4>Username:</h4>
                    <input type="text" disabled value={user?.displayName ?? ''}/>
                </div>
                <div className="email card">
                    <h4>Email:</h4>
                    <input type="email" disabled value={user?.email ?? ''}/>
                </div>
            </div>
        </main>

          
          <button className="savechanges" onClick={saveChanges}>Save Changes</button>
    </div>
}