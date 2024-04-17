import { Container } from "react-bootstrap"
import Logo from "../assets/logo.png"
import { Alert, Image } from "antd"

function Home() {
  return (
    <Container>
        <div className="w-100 d-flex flex-column" style={{height: "50vh"}}>
            <hr className="w-100"></hr>
            <div className="d-flex flex-column gap-3">
                <Alert
                    message="警告"
                    description="還沒做完，極高機率會被打穿"
                    type="error"
                    showIcon
                    closable
                />
                <Alert
                    message="注意"
                    description="希望不要變成某週的攻防組主題 QAQ"
                    type="warning"
                    showIcon
                    closable
                />
            </div>
            <hr className="w-100"></hr>
            <div className="my-auto h-fit-content text-center">
                <div className="w-25 mx-auto">
                    <Image preview={false} src={Logo} className="mx-auto w-100"></Image>
                </div>
                <br/>
                <h1>國立臺北科技大學 資訊安全實驗室</h1>
                <h2> Information Security Lab, NTUT </h2>
            </div>
            <hr className="w-100"></hr>
        </div>
    </Container>
  )
}

export default Home
