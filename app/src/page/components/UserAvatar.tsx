import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hook";
import Logo from "../../assets/logo.png"
import { getUserAvatar } from "../../store/dataApi/UserApiSlice";
import { Avatar } from "rsuite";
import { TypeAttributes } from "rsuite/esm/@types/common";

function UserAvatar(props: {
    size: TypeAttributes.Size
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
            }
        })
    }, [])

    return (
        <Avatar size={size} className="my-auto" circle src={avatarSource}></Avatar>
    )
}

export default UserAvatar;