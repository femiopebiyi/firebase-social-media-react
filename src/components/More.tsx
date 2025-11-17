import { useState } from "react";
import { PiDotsThreeOutlineDuotone } from "react-icons/pi";
import { HiDotsVertical } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { database } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from '../config/firebase';

interface Props {
    getPost: () => Promise<void>
    postId: string
    userId: string
}

export function More(props: Props) {
    const [more, setMore] = useState<boolean>(false)
    const { getPost, postId, userId } = props;
    const [user] = useAuthState(auth)

    async function deletePost() {
        const docRef = doc(database, "posts", postId)
        deleteDoc(docRef).then(() => { getPost(); setMore(!more) })
    }

    return <div className="more-con">
        <div className="more" onClick={() => { setMore(!more) }} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#b4b4b4', transition: 'all 0.3s' }}>
            <HiDotsVertical />
        </div>

        {more && (
            <div className="more-details">
                {user?.uid === userId && (
                    <button className="delete" onClick={deletePost}>
                        Delete Post
                    </button>
                )}
                <NavLink to={`/${userId}`} className="profile" onClick={() => setMore(false)}>
                    View Profile
                </NavLink>
            </div>
        )}
    </div>
}