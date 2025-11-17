import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "../config/firebase";
import { FaPen } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage'
import { addDoc, collection, query, updateDoc, where, getDocs, doc } from "firebase/firestore";
import { IoSparkles, IoPersonCircleOutline, IoMailOutline } from "react-icons/io5";

type Details = {
  username: string;
  "full-name": string;
}

export function Profile() {
  const [details, setDetails] = useState<Details | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const imageListRef = ref(storage, `images/`)
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState('')
  const [loadingSave, setLoadingSave] = useState('Save Changes')

  const [clickedFull, setClickedFull] = useState<boolean>(true);
  const [clickedUser, setClickedUser] = useState<boolean>(true);

  const [value, setValue] = useState(details?.["full-name"]);
  const [valueUser, setValueUser] = useState(details?.username);


  const handleProfileClick = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.click();
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading("Uploading profile picture...")
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setLoadingSave("Save Changes")
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
          setLoading("Upload failed")
        });
    }
  };


  useEffect(() => {
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


  const detailsRef = collection(database, 'details')

  async function saveChanges() {
    setLoadingSave('Saving...')
    try {
      const loggedInRef = query(detailsRef, where("userId", '==', user?.uid))
      const data = await getDocs(loggedInRef)
      const detail = data.docs.map((doc) => ({ userId: doc.data()["userId"], docId: doc.id }))

      if (detail.length === 0) {
        await addDoc(detailsRef, {
          "full-name": value,
          "profile-url": user?.photoURL,
          "userId": user?.uid,
          username: valueUser
        }).then(() => { window.location.reload() })
      } else if (detail.length === 1) {
        const { docId } = detail[0]
        const docRef = doc(database, 'details', docId)
        await updateDoc(docRef, {
          "full-name": value,
          "profile-url": downloadURL,
          "userId": user?.uid,
          username: valueUser
        }).then(() => { window.location.reload() })
        setLoadingSave("Saved ✨")
      }
    } catch (err) {
      console.log(err)
      setLoadingSave("Error - Try Again")
    }
  }

  function setIsClickedFull() {
    setClickedFull((prev) => !prev)
  }

  function setIsClickedUser() {
    setClickedUser((prev) => !prev)
  }

  async function loadDetails() {
    try {
      const loggedInRef = detailsRef && query(detailsRef, where("userId", '==', user?.uid))
      const data = loggedInRef && await getDocs(loggedInRef)
      const detail = data?.docs.map((doc) => ({ userId: doc.data()["userId"], docId: doc.id, fullName: doc.data()["full-name"], username: doc.data().username }))

      if (detail && detail.length > 0) {
        const { username, fullName } = detail[0];
        setDetails({
          username: username,
          "full-name": fullName,
        });
        setValue(fullName);
        setValueUser(username);
      } else {
        setValue(user?.displayName ?? "");
        setValueUser(user?.displayName ?? "");
      }
    } catch (err) {
      console.log(err)
    }
  }

  const [error, setError] = useState("")

  return <div className="profile-con" onLoad={loadDetails}>
    <main>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <IoSparkles style={{ color: '#667eea' }} /> My Profile
        </h1>
        <p style={{ color: '#b4b4b4', fontSize: '1.1rem' }}>Manage your profile and preferences</p>
      </div>

      <div className="profile-pic-con" onClick={handleProfileClick}>
        {downloadURL ? (
          <img src={downloadURL} alt="profile" className="profile-pic" />
        ) : (
          <img src={user?.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'} alt="profile" className="profile-pic" />
        )}
        <div className='edit'><FaPen /></div>
        <input
          type="file"
          id="fileInput"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {loading && <div style={{ marginTop: '1rem', color: '#4facfe', fontWeight: '500' }}>{loading}</div>}

      <div className="info">
        <div className="name card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b4b4b4' }}>
            <IoPersonCircleOutline /> Full Name:
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <div className="edit-con">
              <input
                type="text"
                disabled={clickedFull}
                value={value}
                onChange={(e) => { setValue(e.target.value); setLoadingSave("Save Changes") }}
                style={{ opacity: clickedFull ? 0.7 : 1 }}
              />
            </div>
            <div className='pen' onClick={setIsClickedFull}><FaPen /></div>
          </div>
        </div>

        <div className="username card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b4b4b4' }}>
            @ Username:
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <div className="edit-con">
              <input
                type="text"
                disabled={clickedUser}
                value={valueUser}
                onChange={(e) => { setValueUser(e.target.value); setLoadingSave("Save Changes"); setError("") }}
                style={{ opacity: clickedUser ? 0.7 : 1 }}
              />
            </div>
            <div className='pen' onClick={setIsClickedUser}><FaPen /></div>
          </div>
        </div>
        {error && <p style={{ color: '#ff6b6b', marginTop: '-1rem', fontSize: '0.9rem' }}>{error}</p>}

        <div className="email card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b4b4b4' }}>
            <IoMailOutline /> Email:
          </h4>
          <input type="email" disabled value={user?.email ?? ''} className="email-in" />
        </div>
      </div>
    </main>

    <button className="savechanges" onClick={() => {
      if (!value?.trim() || !valueUser?.trim()) {
        setError("Please fill in all fields")
      } else if (valueUser.length < 3) {
        setError("Username must be at least 3 characters")
      } else if (valueUser.length > 20) {
        setError("Username must be less than 20 characters")
      } else {
        setError("")
        saveChanges()
      }
    }}>{loadingSave}</button>
  </div>
}
