
import { useEffect, useState } from 'react';
import {auth, database} from '../../config/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { Posts } from './posts';
import { useAuthState } from 'react-firebase-hooks/auth';

export interface PostsInt {
    id: string
    userId : string,
    title: string,
    username: string,
    description: string
}




export function Main (){
    const [user]= useAuthState(auth)

    


    const [postsLists, setPostLists] = useState<PostsInt[] | null>(null)
    const colRef = collection(database, "posts");

    async function getPost (){
        const data = await getDocs(colRef)
        setPostLists(data.docs.map((doc)=>({...doc.data(), id: doc.id})) as PostsInt[])
    }

    
    useEffect(()=>{
            getPost()
    }, [])

    if(!user){
        return <div>
            <h1>please login</h1>
        </div>
    }

    return <div>{postsLists?.map((post, index)=> <Posts key={index} post={post}/>)}
    </div>
}