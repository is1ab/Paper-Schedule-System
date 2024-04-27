import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hook";
import Logo from "../../assets/logo.png"
import { getUserAvatar } from "../../store/dataApi/UserApiSlice";
import { Image } from "antd";

function UserImage(props: {
    width: string | number
    className?: string,
    account: string
}){
    const dispatch = useAppDispatch()
    const width = props.width;
    const account = props.account;
    const [ avatarSource, setAvatarSource ] = useState<string>(Logo)

    useEffect(() => {
        dispatch(getUserAvatar(account)).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload as Blob;
                setAvatarSource(URL.createObjectURL(payload))
            }
        })
    }, [account])

    return (
        <Image width={width} height={width} className={`my-auto`} src={avatarSource}></Image>
    )
}

export default UserImage;