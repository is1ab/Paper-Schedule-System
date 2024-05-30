import { Container } from "react-bootstrap"
import Logo from "../assets/logo.png"
import { Alert, Image } from "antd"
import { useAppDispatch } from "../store/hook"
import { useEffect, useState } from "react"
import { getAnnouncments, getLabEnName, getLabZhName, getOrganizationEnName, getOrganizationZhName } from "../store/dataApi/SettingApiSlice"
import { useSelector } from "react-redux"

function Home() {
  const dispatch = useAppDispatch()
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([])
  const labZhName = useSelector(getLabZhName)
  const labEnName = useSelector(getLabEnName)
  const orgZhName = useSelector(getOrganizationZhName)
  const orgEnName = useSelector(getOrganizationEnName)

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
                { announcements.length != 0 &&
                    <hr className="w-100"></hr>
                }
            </div>
            <div className="my-auto h-fit-content text-center">
                <div className="w-25 mx-auto">
                    <Image preview={false} src={Logo} className="mx-auto w-100"></Image>
                </div>
                <br/>
                <h1>{orgZhName} {labZhName}</h1>
                <h2>{labEnName}, {orgEnName} </h2>
            </div>
            <hr className="w-100"></hr>
        </div>
    </Container>
  )
}

export default Home
