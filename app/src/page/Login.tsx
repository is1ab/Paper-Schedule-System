import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import Logo from "../assets/logo.png"
import { useState } from "react";
import { useAppDispatch } from "../store/hook";
import { login, setToken } from "../store/dataApi/AuthApiSlice";
import { LoginRequestPayload, LoginResponse } from "../type/auth/loginPayload";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Login(){
    const [ account, setAccount ] = useState<string>("")
    const [ password, setPassword ] = useState<string>("")
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleAccountOnChange = (value: string) => {
        setAccount(value)
    }

    const handlePasswordOnChange = (value: string) => {
        setPassword(value)
    }

    const tryLogin = () => {
        console.log(account, password)
        dispatch(login({
            account: account,
            password: password
        } as LoginRequestPayload)).then((response) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload as LoginResponse
                Swal.fire({
                    icon: "success",
                    title: "登入成功",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    dispatch(setToken(payload.token))
                    navigate("/", { state: "login success" })
                })
            }else{
                Swal.fire({
                    icon: "error",
                    title: "登入失敗",
                    timer: 2000,
                    showConfirmButton: false
                })
            }
        })
    }

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
                                onChange={(e) => handleAccountOnChange(e.target.value)}
                            />
                            </div>
                            <div>
                            <Form.Label>密碼</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={(e) => handlePasswordOnChange(e.target.value)}
                            />
                            </div>
                        </div>
                        <hr />
                        <div>
                            <Button className="w-100" onClick={() => tryLogin()}> 登入 </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Login