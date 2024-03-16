import { Avatar } from "./BlogCard"
import { Link } from "react-router-dom";

export const Appbar = () => {
    return <div className="border-b flex justify-between px-10 py-4">
        <Link to= {'/'}>
        <div className="flex flex-col justify-center cursor-pointer">
            Eren
        </div>
        </Link>
        <div>
            <Avatar size = {"big"} name="Meet"></Avatar>
        </div>
    </div>
}