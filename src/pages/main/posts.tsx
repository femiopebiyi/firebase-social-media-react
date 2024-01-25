import { PostsInt } from "./main"

interface Props{
    post: PostsInt
}

export function Posts (props: Props){
    const {post} = props

    return <div className='post-con'>
        <div className="post-title">
            <h2>{post.title}</h2>
        </div>

        <div className="body">
            <p>{post.description}</p>
        </div>

        <div className="footer">
            <p>@{post.username}</p>
            <button>&#128077;</button>
        </div>
    </div>
}