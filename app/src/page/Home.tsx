import { Container } from "react-bootstrap"
import Logo from "../assets/logo.png"
import { Alert, Image } from "antd"
import { useAppDispatch } from "../store/hook"
import { useEffect, useState } from "react"
import { getAnnouncments } from "../store/dataApi/SettingApiSlice"

function Home() {
  const dispatch = useAppDispatch()
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([])

  const typeTransform = (type: "ERROR" | "WARNING" | "INFO") => {
    if(type == 'ERROR'){
        return "error"
    }
    if(type == "INFO"){
        return "info"
    }
    if(type == "WARNING"){
        return "warning"
    }
  }

  const typeShowTextTransform = (type: "ERROR" | "WARNING" | "INFO") => {
    if(type == 'ERROR'){
        return "嚴重"
    }
    if(type == "INFO"){
        return "公告"
    }
    if(type == "WARNING"){
        return "警告"
    }
  }

  useEffect(() => {
    dispatch(getAnnouncments()).then((response) => {
        if(response.meta.requestStatus === 'fulfilled'){
            const payload = response.payload;
            const datas = payload["data"] as AnnouncementType[]
            // Sort the announcement by the type of the announcement. (ERROR > WARNING > INFO)
            datas.sort((a: AnnouncementType, _: AnnouncementType) => {
                return a.type == "ERROR" ? -1 : a.type == "WARNING" ? -1 : 1
            })
            setAnnouncements(datas)
        }
    })
  }, [])

  return (
    <Container>
        <div className="w-100 d-flex flex-column">
            <hr className="w-100"></hr>
            <div className="d-flex flex-column gap-3">
                { 
                    announcements.map((announcement) => {
                        return (
                            <Alert
                                message={typeShowTextTransform(announcement.type)}
                                description={announcement.description}
                                type={typeTransform(announcement.type)}
                                showIcon
                                closable
                            />
                        )
                    }) 
                }
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
