import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { FaPen } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { storage } from "../config/firebase";
import {ref, uploadBytes, getDownloadURL, listAll} from 'firebase/storage'



export function Profile (){
  
    const [user] = useAuthState(auth)
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [downloadURL, setDownloadURL] = useState<string | null>(null);
    const imageListRef = ref(storage, `images/`)

  const handleProfileClick = () => {
    // Trigger a click on the file input when the profile-pic-con div is clicked
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.click();
    }
  }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file change logic here
    const selectedFile = event.target.files && event.target.files[0];
    // Do something with the selected file
    if(selectedFile) {
        setSelectedImage(selectedFile)

    const imageRef = ref(storage, `images/${user?.uid}`)
    if(selectedImage)
    uploadBytes(imageRef, selectedImage).then((res)=>{
        console.log("dey play my fans")
    }).catch(()=>{
      console.log("error contractor")
    })
    }

  };

  useEffect(()=>{
      listAll(imageListRef).then((res):void=>{
        const img = res.items[0]
        getDownloadURL(img).then((res)=>{
          setDownloadURL(res)
          console.log(downloadURL || 'errorcr')
        }).catch(()=>{
          console.log("error due to contractor")
        })
      })
  },[])

    return <div className="profile-con" onClick={handleProfileClick}>
        <main>
            <h1>My Profile</h1>

              <div className="profile-pic-con" onClick={handleProfileClick}>
        
          {downloadURL ? (
            <img src ={downloadURL} alt="profile-image" className="profile-pic" />
          ) : (
            <img src={user?.photoURL ?? ''} alt="profile-image" className="profile-pic" />
          )}
          <div className='edit'><FaPen/></div>
        </div>

            

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

          <input
            type="file"
            id="fileInput"
            className="upload"
            onChange={handleFileChange}
          />
    </div>
}