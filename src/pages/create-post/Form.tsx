import {useForm} from "react-hook-form"
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { addDoc, collection} from "firebase/firestore";
 import { auth, database } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";



type CreateFormData = {
    title: string,
    description: string
}

export function CreateForm (){
    let [sucess, setSucess] = useState("")

    const [user]= useAuthState(auth)
    const schema =yup.object().shape({
        title: yup.string().required('You must add a title'),
        description: yup.string().required('add a descripition'),
    })

    const {register, handleSubmit, formState: {errors}, reset} = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    })


    const colRef = collection(database, "posts")

    async function onCreatePost(data: CreateFormData){
        console.log(data)
        await addDoc(colRef, {
            title: data.title,
            description: data.description,
            username: user?.displayName,
            userId: user?.uid
        })


        setSucess("Post Sucessful")
        setTimeout(() => {
            setSucess("")
        }, 1200);
        reset()
    }

    return <div className="form"> 
    <form onSubmit={handleSubmit(onCreatePost)}>
        <input type="text" placeholder="Title..." {...register("title")} className="title"/>

    <p>{errors.title?.message}</p>

        <textarea placeholder="Description" {...register("description")} className="post-des"/>
        <p>{errors.description?.message}</p>
        <input type="submit" className="submit"/>
    </form>


    <h2 className="sucess">{sucess}</h2>
    </div>
}