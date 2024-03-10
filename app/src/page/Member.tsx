import { Card, Container } from "react-bootstrap";
import { Avatar } from "rsuite";

function Member(){
    return (
        <Container className="p-5 text-center">
            <h2>實驗室成員</h2>
            <hr></hr>
            <div className="pb-4 d-flex flex-column gap-3">
                <h4>Professor</h4>
                <div className="d-flex flex-row" style={{flexWrap: "wrap"}}>
                    <div className="w-50 p-2">
                        <Card className="p-3 d-flex flex-row gap-3">
                            <div className="d-flex flex-column">
                                <Avatar size="lg" className="my-auto" circle></Avatar>
                            </div>
                            <div className="d-flex flex-column text-start">
                                <span className="fs-5 font-bold">Name</span>
                                <span>Professor</span>
                                <span>some@email.com</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="pb-4 d-flex flex-column gap-3">
                <h4>Guest</h4>
                <div className="d-flex flex-row" style={{flexWrap: "wrap"}}>
                    <div className="w-50 p-2">
                        <Card className="p-3 d-flex flex-row gap-3">
                            <div className="d-flex flex-column">
                                <Avatar size="lg" className="my-auto" circle></Avatar>
                            </div>
                            <div className="d-flex flex-column text-start">
                                <span className="fs-5 font-bold">Name</span>
                                <span>Guest</span>
                                <span>some@email.com</span>
                            </div>
                        </Card>
                    </div>
                    <div className="w-50 p-2">
                        <Card className="p-3 d-flex flex-row gap-3">
                            <div className="d-flex flex-column">
                                <Avatar size="lg" className="my-auto" circle></Avatar>
                            </div>
                            <div className="d-flex flex-column text-start">
                                <span className="fs-5 font-bold">Name</span>
                                <span>Role 1</span>
                                <span>some@email.com</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="pb-4 d-flex flex-column gap-3">
                <h4>Student</h4>
                <div className="d-flex flex-row" style={{flexWrap: "wrap"}}>
                    <div className="w-50 p-2">
                        <Card className="p-3 d-flex flex-row gap-3">
                            <div className="d-flex flex-column">
                                <Avatar size="lg" className="my-auto" circle></Avatar>
                            </div>
                            <div className="d-flex flex-column text-start">
                                <span className="fs-5 font-bold">Name</span>
                                <span>Student</span>
                                <span>some@email.com</span>
                            </div>
                        </Card>
                    </div>
                    <div className="w-50 p-2">
                        <Card className="p-3 d-flex flex-row gap-3">
                            <div className="d-flex flex-column">
                                <Avatar size="lg" className="my-auto" circle></Avatar>
                            </div>
                            <div className="d-flex flex-column text-start">
                                <span className="fs-5 font-bold">Name</span>
                                <span>Student</span>
                                <span>some@email.com</span>
                            </div>
                        </Card>
                    </div>
                    <div className="w-50 p-2">
                        <Card className="p-3 d-flex flex-row gap-3">
                            <div className="d-flex flex-column">
                                <Avatar size="lg" className="my-auto" circle></Avatar>
                            </div>
                            <div className="d-flex flex-column text-start">
                                <span className="fs-5 font-bold">Name</span>
                                <span>Student</span>
                                <span>some@email.com</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Member;