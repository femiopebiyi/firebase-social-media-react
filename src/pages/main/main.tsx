
import { useEffect, useState } from 'react';
import { auth, database } from '../../config/firebase';
import { getDocs, collection, Timestamp } from 'firebase/firestore';
import { Posts } from './posts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom"
import { IoSparkles } from "react-icons/io5";

export interface PostsInt {
    id: string
    userId: string,
    title: string,
    username: string,
    description: string
    time: Timestamp
    getPost: () => Promise<void>
}


export function Main() {
    const [user] = useAuthState(auth)
    const navigate = useNavigate()

    const [postsLists, setPostLists] = useState<PostsInt[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const colRef = collection(database, "posts");

    async function getPost() {
        try {
            setLoading(true)
            setError(null)
            const data = await getDocs(colRef)
            const posts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as PostsInt[]
            
            // Sort posts by timestamp (newest first)
            const sortedPosts = posts.sort((a, b) => {
                if (!a.time || !b.time) return 0;
                return b.time.toMillis() - a.time.toMillis();
            });
            
            setPostLists(sortedPosts)
        } catch (error) {
            console.error('Error fetching posts:', error)
            setError('Failed to load posts. Please try again.')
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getPost()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
            <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: '800', 
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <IoSparkles /> Feed
            </h1>
            <p style={{ color: '#b4b4b4', fontSize: '1.1rem' }}>
                {user ? 'Discover what\'s happening' : 'Sign in to interact with posts'}
            </p>
        </div>

        {loading ? (
            <div style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.18)'
            }}>
                <p style={{ fontSize: '1.2rem', color: '#b4b4b4' }}>Loading posts...</p>
            </div>
        ) : error ? (
            <div style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem',
                background: 'rgba(255, 59, 48, 0.1)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 59, 48, 0.3)'
            }}>
                <p style={{ fontSize: '1.2rem', color: '#ff3b30' }}>{error}</p>
                <button onClick={getPost} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Retry</button>
            </div>
        ) : postsLists && postsLists.length > 0 ? (
            postsLists.map((post) => <Posts key={post.id} post={post} getPost={getPost} />)
        ) : (
            <div style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.18)'
            }}>
                <p style={{ fontSize: '1.2rem', color: '#b4b4b4' }}>No posts yet. Be the first to share something!</p>
            </div>
        )}
    </div>
}