import { Alert, Container, Image } from "react-bootstrap"
import Is1abNavbar from "../layout/Navbar"
import Logo from "../assets/logo.png"

function Home() {
  return (
    <Container>
        <div className="w-100 text-center d-flex flex-column" style={{height: "50vh"}}>
            <hr className="w-100"></hr>
            <div>
                <Alert variant={'warning'} className="m-0">
                    <span> 希望不要變成某週的攻防組主題 QAQ </span>
                </Alert>
            </div>
            <hr className="w-100"></hr>
            <div className="my-auto h-fit-content">
                <div className="w-25 mx-auto">
                    <Image src={Logo} className="mx-auto w-100"></Image>
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
