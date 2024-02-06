
import { useEffect, useState } from 'react';
import {auth, database} from '../../config/firebase';
import { getDocs, collection, Timestamp } from 'firebase/firestore';
import { Posts } from './posts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink, useNavigate,  } from "react-router-dom"

export interface PostsInt {
    id: string
    userId : string,
    title: string,
    username: string,
    description: string
    time: Timestamp
    getPost: ()=>  Promise<void>
}




export function Main (){
    const [user]= useAuthState(auth)

        const navigate = useNavigate()
        


    const [postsLists, setPostLists] = useState<PostsInt[] | null>(null)
    const colRef = collection(database, "posts");

    async function getPost (){
        try{
            const data = await getDocs(colRef)
        setPostLists(data.docs.map((doc)=>({...doc.data(), id: doc.id})) as PostsInt[])
        } catch(error){
            console.log(error)
        }
        
    }

    
    useEffect(()=>{
            getPost()
    }, [])

    if(!user){
        return <div>
            <div>{postsLists?.map((post, index)=> <Posts key={index} post={post} getPost={getPost}/>)}
    </div>
        </div>
    }

    return <div>{postsLists?.map((post, index)=> <Posts key={index} post={post} getPost = {getPost}/>)}
    </div>
}