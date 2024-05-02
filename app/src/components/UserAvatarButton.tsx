import { Button } from "antd"
import UserAvatar from "../page/components/UserAvatar"
import { UserType } from "../type/user/userType";
import { useNavigate } from "react-router-dom";

export default function UserAvatarButton(props: {
    user: UserType
}){
    const navigate = useNavigate()
    const user = props.user;

    return (
        <Button 
            type="default" 
            className="mx-auto d-flex flex-row gap-2 justify-content-center" 
            onClick={() => navigate(`/User/${user.account}/`)}
        >
            <UserAvatar account={user.account} size={22}></UserAvatar>
            <span className="my-auto"> {user.name} </span>
        </Button>
    )
}