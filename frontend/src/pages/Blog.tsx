import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";
import { BlogId} from "../components/BlogId";
//atom
export const Blog = () => {
    const { id } = useParams();
    const {loading, blog} = useBlog({
        id: id || ""
    });
    if(loading || !blog){
        return <div></div>
        }
        return(
        <BlogId blog={blog}/>
        )
}