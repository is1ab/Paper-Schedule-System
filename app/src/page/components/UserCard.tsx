import { Card } from "react-bootstrap"
import { Avatar } from "rsuite"

function UserCard(props: {
    name: string,
    email: string,
    note: string
}) {
    const name = props.name
    const email = props.email
    const note = props.note

    return (
        <div className="w-50 p-2">
            <Card className="p-3 d-flex flex-row gap-3">
                <div className="d-flex flex-column">
                    <Avatar size="lg" className="my-auto" circle></Avatar>
                </div>
                <div className="d-flex flex-column text-start">
                    <span className="fs-5 font-bold">{name}</span>
                    <span><small>{note}</small></span>
                    <span>{email}</span>
                </div>
            </Card>
        </div>
    )
}

export default UserCard;