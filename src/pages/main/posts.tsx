import { addDoc, collection, getDocs, query, where, deleteDoc, doc} from "firebase/firestore"
import { PostsInt } from "./main"
import { auth, database } from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect, useState } from "react"

interface Props{
    
    post: PostsInt
}

interface Like {
    likeId :string
    userId: string
}

export function Posts (props: Props){
    const {post} = props
    const [user] = useAuthState(auth)
    const [likes, setLikes] = useState<Like[] | null>(null)

    const likesRef = collection(database, "likes");
    const likesDoc = query(likesRef, where('postId', '==', post.id));

    const addLike = async () => {
        try{
           const newDoc = await addDoc(likesRef, {userId: user?.uid, postId: post.id})

        if(user){
            setLikes((prev) => prev ? [...prev, {userId: user.uid, likeId: newDoc.id }] : [{userId: user.uid, likeId: newDoc.id}])
        }

        } catch(error){
            console.log(error)
        }
    }

    async function getLikes(){
        const data = await getDocs(likesDoc)
        setLikes(data.docs.map((doc)=>({userId: doc.data().userId, likeId: doc.id})))
    }

    const hasUserLiked = likes?.find((like) =>  like.userId === user?.uid)

    useEffect(()=>{
        getLikes()
    }, [])

    async function removeLike(){
        try{
            const likeToDeleteQuery = query(likesRef, where('postId', '==', post.id), where("userId", '==', user?.uid));
            const likeToDeleteData = await getDocs(likeToDeleteQuery)
            const likeToDelete = doc(database, 'likes' , likeToDeleteData.docs[0].id)
            await deleteDoc(likeToDelete)

            if(user){
                setLikes((prev)=> prev && prev.filter((like) => like.likeId !== likeToDeleteData.docs[0].id))
            }
        } catch(err){
            console.log(err)
        }
        
    }


    return <div className='post-con'>
        <div className="post-title">
            <h2>{post.title}</h2>
        </div>

        <div className="body">
            <p>{post.description}</p>
        </div>

        <div className="footer">
            <p>@{post.username}</p>
            <button onClick={hasUserLiked ? removeLike : addLike} style={{
            backgroundColor: hasUserLiked ? '#1877F2' : 'rgb(220, 220, 220)'
        }}>&#128077;</button>

        </div>
        {likes && <p>Likes: {likes.length}</p>}
    </div>
}