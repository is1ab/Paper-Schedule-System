import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import Logo from "../assets/logo.png"

function Login(){
    return (
        <Container className="p-5" style={{height: "70vh"}}>
            <Row className="gap-5 w-100 justify-content-center">
                <Col lg={5} md={12} className="d-flex">
                    <div className="my-auto h-fit-content text-center">
                        <div className="w-25 mx-auto">
                            <Image src={Logo} className="mx-auto w-100"></Image>
                        </div>
                        <br/>
                        <h3>國立臺北科技大學 資訊安全實驗室</h3>
                        <h4>Information Security Lab, NTUT </h4>
                    </div>
                </Col>
                <Col lg={5} md={12} className="d-flex">
                    <div className="my-auto w-100 h-fit-content p-5 border border-black mx-auto rounded shadow">
                        <div className="text-center">
                            <h1>登入</h1>
                        </div>
                        <hr />
                        <div className="d-flex flex-column gap-4 py-3">
                            <div>
                            <Form.Label>北科學號或管理員名稱</Form.Label>
                            <Form.Control
                                type="text"
                                id="inputPassword5"
                                aria-describedby="passwordHelpBlock"
                            />
                            </div>
                            <div>
                            <Form.Label>密碼</Form.Label>
                            <Form.Control
                                type="password"
                                id="inputPassword5"
                                aria-describedby="passwordHelpBlock"
                            />
                            </div>
                        </div>
                        <hr />
                        <div>
                            <Button className="w-100"> 登入 </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Login