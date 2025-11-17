import { addDoc, collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore"
import { PostsInt } from "./main"
import { auth, database } from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { More } from "../../components/More"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"


interface Props {
    getPost: () => Promise<void>
    post: PostsInt
}

interface Like {
    likeId: string
    userId: string
}

export function Posts(props: Props) {
    const navigate = useNavigate()
    const { post, getPost } = props
    const [user] = useAuthState(auth)
    const [likes, setLikes] = useState<Like[] | null>(null)
    const [isLiking, setIsLiking] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    const likesRef = collection(database, "likes");
    const likesDoc = query(likesRef, where('postId', '==', post.id));


    const addLike = async () => {
        if (!user || isLiking) return;
        
        // Optimistic update - add like immediately to UI
        const tempLikeId = `temp-${Date.now()}`;
        setLikes((prev) => prev ? [...prev, { userId: user.uid, likeId: tempLikeId }] : [{ userId: user.uid, likeId: tempLikeId }]);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
        
        setIsLiking(true);
        try {
            const newDoc = await addDoc(likesRef, { userId: user.uid, postId: post.id })
            // Replace temp like with real one
            setLikes((prev) => {
                if (!prev) return [{ userId: user.uid, likeId: newDoc.id }];
                return prev.map(like => 
                    like.likeId === tempLikeId ? { userId: user.uid, likeId: newDoc.id } : like
                );
            });
        } catch (error) {
            console.error('Error adding like:', error)
            // Rollback optimistic update on error
            setLikes((prev) => prev ? prev.filter(like => like.likeId !== tempLikeId) : null);
        } finally {
            setIsLiking(false);
        }
    }

    async function getLikes() {
        try {
            const data = await getDocs(likesDoc)
            setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id })))
        } catch (error) {
            console.error('Error fetching likes:', error)
        }
    }

    const hasUserLiked = likes?.find((like) => like.userId === user?.uid)

    useEffect(() => {
        getLikes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post.id])

    async function removeLike() {
        if (!user || isLiking) return;
        
        // Optimistic update - remove like immediately from UI
        const userLike = likes?.find(like => like.userId === user.uid);
        if (userLike) {
            setLikes((prev) => prev ? prev.filter(like => like.userId !== user.uid) : null);
        }
        
        setIsLiking(true);
        try {
            const likeToDeleteQuery = query(likesRef, where('postId', '==', post.id), where("userId", '==', user.uid));
            const likeToDeleteData = await getDocs(likeToDeleteQuery)
            if (likeToDeleteData.docs.length > 0) {
                const likeToDelete = doc(database, 'likes', likeToDeleteData.docs[0].id)
                await deleteDoc(likeToDelete)
            }
        } catch (err) {
            console.error('Error removing like:', err)
            // Rollback optimistic update on error
            if (userLike) {
                setLikes((prev) => prev ? [...prev, userLike] : [userLike]);
            }
        } finally {
            setIsLiking(false);
        }
    }

    const timestamp = post.time.toDate()
    const year = timestamp.getFullYear()
    const month = timestamp.getMonth() + 1;
    const day = timestamp.getDate();
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();

    const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
    const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;


    return <div className='post-con'>
        <div className="post-title">
            <h2>
                <span>{post.title}</span>
                <More getPost={getPost} postId={post.id} userId={post.userId} />
            </h2>
            <p><em>{formattedDate},  {formattedTime}</em></p>
        </div>

        <div className="body">
            <p>{post.description}</p>
        </div>

        <div className="footer">
            <p className="post-username">
                <Link to={user?.uid === post.userId ? `/profile/${post.userId}` : `/${post.userId}`}>
                    @{post.username}
                </Link>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {likes && <p style={{ color: '#b4b4b4', fontWeight: '500' }}>{likes.length} {likes.length === 1 ? 'like' : 'likes'}</p>}
                <button 
                    onClick={() => {
                        if (!user) {
                            navigate("/login");
                            return;
                        }
                        hasUserLiked ? removeLike() : addLike();
                    }} 
                    className={`like-button ${isAnimating ? 'like-animate' : ''}`}
                    style={{
                        backgroundColor: 'transparent',
                        color: hasUserLiked ? '#ff4757' : '#b4b4b4',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        padding: '0.5rem'
                    }}>
                    {hasUserLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>
            </div>
        </div>

    </div>
}

