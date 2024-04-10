import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserType } from "../type/user/userType";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function QueuePreview(props: {
    users: UserType[]
}) {
    const users = props.users;
    const showUsers = users.filter((user) => user.weight != 0 && !Number.isNaN(user.weight));

    return showUsers.length == 0 ? 
        (
            <div className="w-100 p-3 border rounded">
                <div className="d-flex flex-column justify-content-center" style={{minHeight: "6.6rem"}}>
                    <p className="text-center m-0"> 請嘗試變更權重來建造佇列。</p>
                </div>
            </div>
        ) :
        (
            <div className="w-100 p-3 border rounded d-flex flex-row gap-3 justify-content-center overflow-x-auto">
                {
                    users.filter((user) => user.weight != 0 && !Number.isNaN(user.weight)).map((user) => {
                        return (
                            <div className="p-3 d-flex flex-column gap-3 border rounded" style={{minWidth: "6rem", minHeight: '6.6rem'}}>
                                <FontAwesomeIcon size="2x" icon={faUser}></FontAwesomeIcon>
                                <p className="text-center m-0 text-nowrap">{user.name}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
}