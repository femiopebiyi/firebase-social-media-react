import { useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, database } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSparkles } from "react-icons/io5";


type CreateFormData = {
    title: string,
    description: string
}

export function CreateForm() {
    const navigate = useNavigate()
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [button, setButton] = useState("Publish Post")


    const [user] = useAuthState(auth)
    const schema = yup.object().shape({
        title: yup.string().required('You must add a title').max(50, 'Title is 50 characters max'),
        description: yup.string().required('Please add a description'),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    })


    const colRef = collection(database, "posts")

    async function onCreatePost(data: CreateFormData) {
        try {
            setButton("Publishing....")
            setError("")
            setSuccess("")
            
            await addDoc(colRef, {
                title: data.title,
                description: data.description,
                username: user?.displayName,
                userId: user?.uid,
                time: serverTimestamp()
            })
            
            setButton("Publish Post")
            setSuccess("Post Published Successfully! ✨")
            reset()
            
            setTimeout(() => {
                navigate('/')
            }, 1500);

        } catch (err: unknown) {
            console.error('Error creating post:', err)
            setButton("Publish Post")
            setError("Failed to publish post. Please try again.")
            setTimeout(() => {
                setError("")
            }, 3000);
        }
    }

    return <div className="form">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <IoSparkles style={{ color: '#667eea' }} /> Create New Post
            </h1>
            <p style={{ color: '#b4b4b4' }}>Share your thoughts with the world</p>
        </div>

        <form onSubmit={handleSubmit(onCreatePost)}>
            <input type="text" placeholder="Give your post a catchy title..." {...register("title")} className="title" />
            {errors.title && <p>{errors.title?.message}</p>}

            <textarea placeholder="What's on your mind? Share your story..." {...register("description")} className="post-des" />
            {errors.description && <p>{errors.description?.message}</p>}

            <input type="submit" className="submit" value={button} disabled={button !== "Publish Post"} />
        </form>

        {success && <h2 className="sucess">{success}</h2>}
        {error && <h2 style={{ color: '#ff3b30', textAlign: 'center', marginTop: '1rem' }}>{error}</h2>}
    </div>
}