import { Container, Nav, Navbar } from "react-bootstrap"
import logo from "../assets/logo.png"

function Is1abNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
      <Container>
        <Navbar.Brand href="/" className="text-center">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          資訊安全實驗室
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/event">活動</Nav.Link>
            <Nav.Link href="/member">實驗室成員</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/login">登入</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Is1abNavbar
