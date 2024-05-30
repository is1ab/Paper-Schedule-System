import { Layout, Menu, MenuProps } from "antd";
import logo from "../assets/logo.png"
import UserBadge from "../components/UserBadge";
import { useNavigate } from "react-router-dom";

function Is1abNavbar() {
  const { Header } = Layout;
  const navigate = useNavigate()

  const leftItems: MenuProps['items'] = [
    {
      label: <div onClick={() => navigate("/Event")}>活動</div>,
      key: 'event',
    },
    {
      label: <div onClick={() => navigate("/Member")}>實驗室成員</div>,
      key: 'member',
    }
  ]

  return (
    <Header style={{background: "#DDDDDD00"}} className="w-100">
      <div className="d-flex flex-row justify-content-between" >
        <div className="d-flex flex-row gap-3">
          <div className="mx-auto d-flex flex-row gap-3" style={{cursor: "pointer"}} onClick={() => navigate("/")}>
            <img
              alt=""
              src={logo}
              width="40"
              height="40"
              className="my-auto"
            />
            <span className="text-nowrap">資訊安全實驗室</span>
          </div>
          <div>
            <Menu
                className="w-100"
                mode="horizontal"
                items={leftItems}
                style={{background: "transparent", border: "0"}}
                selectedKeys={[]}
            />
          </div>
        </div>
        <div className="d-flex flex-row w-fit-content">
          <div className="my-auto">
            <UserBadge></UserBadge>
          </div>
        </div>
      </div>
    </Header>
  )
}

export default Is1abNavbar
