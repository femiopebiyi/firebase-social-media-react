import {useForm} from "react-hook-form"
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { addDoc, collection} from "firebase/firestore";
 import { auth, database } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";



type CreateFormData = {
    title: string,
    description: string
}

export function CreateForm (){

    const [user]= useAuthState(auth)
    const schema =yup.object().shape({
        title: yup.string().required('You must add a title'),
        description: yup.string().required('add a descripition'),
    })

    const {register, handleSubmit, formState: {errors}} = useForm<CreateFormData>({
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
    }

    return <form onSubmit={handleSubmit(onCreatePost)}>
        <input type="text" placeholder="Title..." {...register("title")}/>

    <p>{errors.title?.message}</p>

        <textarea placeholder="Description" {...register("description")}/>
        <p>{errors.description?.message}</p>
        <input type="submit" />
    </form>
}