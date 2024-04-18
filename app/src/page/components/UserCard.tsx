import { Card } from "react-bootstrap"
import UserAvatar from "./UserAvatar";

function UserCard(props: {
    className?: string
    account: string
    name: string,
    email: string,
    note: string
}) {
    const account = props.account;
    const name = props.name
    const email = props.email
    const note = props.note
    const className = props.className

    return (
        <div className={className == null ? `col col-md-6 col-12 p-2` : className}>
            <Card className="p-3 d-flex flex-row gap-3">
                <div className="d-flex flex-column">
                    <UserAvatar account={account} size="lg"></UserAvatar>
                </div>
                <div className="d-flex flex-column text-start">
                    <span className="fs-5 font-bold">{name}</span>
                    <span>{note}</span>
                    <span>{email}</span>
                </div>
            </Card>
        </div>
    )
}

export default UserCard;