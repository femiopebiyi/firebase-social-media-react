import { PostsInt } from "./main"

interface Props{
    post: PostsInt
}

export function Posts (props: Props){
    const {post} = props

    return <div>
        <div className="title">
            <h1>{post.title}</h1>
        </div>

        <div className="body">
            <p>{post.description}</p>
        </div>

        <div className="footer">
            <p>{post.username}</p>
            <button>&#128077;</button>
        </div>
    </div>
}