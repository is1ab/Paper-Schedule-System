import { Card, Container, Image } from "react-bootstrap";
import Logo from "../assets/logo.png"

function User(){
    return (
        <Container className="p-5 d-flex flex-row gap-5">
            <div className="d-flex flex-column gap-3 text-center">
                <Image roundedCircle width={256} height={256} src={Logo} className="border"></Image>
                <h2>User 0</h2>
                <div className="w-100">
                    <div className="border p-3 rounded d-flex flex-row gap-3">
                        <div className="w-100 d-flex flex-column gap-1">
                            <div className="bg-primary p-3 w-100 text-white fs-2">
                                <span>3</span>
                            </div>
                            <span>即將到來</span>
                        </div>
                        <div className="w-100 d-flex flex-column gap-1">
                            <div className="bg-secondary p-3 w-100 text-white fs-2">
                                <span>3</span>
                            </div>
                            <span>已完成</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-75 p-3">
                <div className="w-100 p-3 rounded border">
                    <div>
                        <h2 className="pt-3">近期活動</h2>
                        <div className="d-flex flex-column py-3 gap-3">
                            <Card className="p-3 d-flex flex-row gap-3">
                                <div className="d-flex flex-column text-start">
                                    <span className="fs-5 font-bold">Presentation (2024/03/10)</span>
                                    <span>... by ..., ... and ...</span>
                                </div>
                            </Card>
                            <Card className="p-3 d-flex flex-row gap-3">
                                <div className="d-flex flex-column text-start">
                                    <span className="fs-5 font-bold">Presentation (2024/03/10)</span>
                                    <span>... by ..., ... and ...</span>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <hr></hr>
                    <div>
                        <h2 className="pt-3">已完成活動</h2>
                        <div className="d-flex flex-column py-3 gap-3">
                            <Card className="p-3 d-flex flex-row gap-3">
                                <div className="d-flex flex-column text-start">
                                    <span className="fs-5 font-bold">Presentation (2024/03/10)</span>
                                    <span>... by ..., ... and ...</span>
                                </div>
                            </Card>
                            <Card className="p-3 d-flex flex-row gap-3">
                                <div className="d-flex flex-column text-start">
                                    <span className="fs-5 font-bold">Presentation (2024/03/10)</span>
                                    <span>... by ..., ... and ...</span>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div> 
        </Container>
    )
}

export default User;