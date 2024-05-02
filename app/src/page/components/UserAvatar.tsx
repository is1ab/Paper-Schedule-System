import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hook";
import Logo from "../../assets/logo.png"
import { getUserAvatar } from "../../store/dataApi/UserApiSlice";
import { Avatar } from "antd";
import { AvatarSize } from "antd/es/avatar/AvatarContext";

function UserAvatar(props: {
    size: AvatarSize | undefined
    account: string
}){
    const dispatch = useAppDispatch()
    const size = props.size;
    const account = props.account;
    const [ avatarSource, setAvatarSource ] = useState<string>(Logo)

    useEffect(() => {
        dispatch(getUserAvatar(account)).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload as Blob;
                setAvatarSource(URL.createObjectURL(payload))
            }else{
                setAvatarSource(Logo)
            }
        })
    }, [account])

    return (
        <Avatar size={size} className="my-auto" src={avatarSource} style={{backgroundColor: "#bbbbbb"}}></Avatar>
    )
}

export default UserAvatar;