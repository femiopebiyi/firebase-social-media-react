import {useForm} from "react-hook-form"
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { addDoc, collection, serverTimestamp} from "firebase/firestore";
 import { auth, database } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



type CreateFormData = {
    title: string,
    description: string
}

export function CreateForm (){
    const navigate = useNavigate()
    let [sucess, setSucess] = useState("")
    let [button, setButton] = useState("Post")


    const [user]= useAuthState(auth)
    const schema =yup.object().shape({
        title: yup.string().required('You must add a title').max(15, 'Title is 15 Char max'),
        description: yup.string().required('add a descripition'),
    })

    const {register, handleSubmit, formState: {errors}, reset} = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    })


    const colRef = collection(database, "posts")

    async function onCreatePost(data: CreateFormData){
        try{
            setButton("Posting....")
        console.log(data)
        await addDoc(colRef, {
            title: data.title,
            description: data.description,
            username: user?.displayName,
            userId: user?.uid,
            time: serverTimestamp()
        }).then(()=>{
            setButton("Post")
            setSucess("Post Sucessful ✅")
        setTimeout(() => {
            setSucess("")
        }, 2000);
            reset()
        }).then(()=>{
            navigate('/')
        })
        .catch((error)=>{
            console.log("fff", error)
        })

        } catch(err: unknown){

            if(typeof err === "object"){
                console.log(err)
            }
        }
        


        
    }

    return <div className="form"> 
    <form onSubmit={handleSubmit(onCreatePost)}>
        <input type="text" placeholder="Title..." {...register("title")} className="title"/>

    <p>{errors.title?.message}</p>

        <textarea placeholder="Description" {...register("description")} className="post-des" onKeyUp ={(e)=>{
            e.key === "Enter" && handleSubmit(onCreatePost)()
        }}/>
        <p>{errors.description?.message}</p>
        <input type="submit" className="submit" value={button}/>
    </form>


    <h2 className="sucess">{sucess}</h2>
    </div>
}