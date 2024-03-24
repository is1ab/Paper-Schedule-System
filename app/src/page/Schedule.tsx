import { Card, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Uploader } from "rsuite";
import UserCard from "./components/UserCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFloppyDisk, faGlobe, faLink, faPaperclip, faUser } from "@fortawesome/free-solid-svg-icons";

function Schedule(){
    const { scheduleId } = useParams()
    const fileList = [
        { name: 'file1.jpg', fileKey: 1 },
        { name: 'file2.jpg', fileKey: 2 }
    ];
    return (
        <Container className="p-5">
            <h2 className="text-center mb-5">活動資訊</h2>
            <div className="d-flex flex-column gap-3">
                <Card className="p-5 fs-3 text-left">
                    <strong><p className="my-0">{"EPREKM: ElGamal proxy re‐encryption‐based key management scheme with constant rekeying cost and linear public bulletin size"}</p></strong>
                </Card>
                <div className="w-100 d-flex flex-row gap-5">
                    <div className="w-50">
                        <div className="">
                            <h5 className="text-center mb-3">活動資訊</h5>
                            <Card className="p-4">
                                <div className="px-4 py-3 d-flex flex-row gap-5">
                                    <div className="w-25 d-flex flex-row justify-content-end">
                                        <FontAwesomeIcon size="xl" width={21} icon={faUser} className="my-auto w-fit-content text-primary"></FontAwesomeIcon>
                                    </div>
                                    <div className="w-100 d-flex flex-row justify-content-start">
                                        <p className="my-0 w-75 text-left">黃漢軒 &lt;t109590031@ntut.org.tw&gt; </p>
                                    </div>
                                </div>
                                <div className="px-4 py-3 d-flex flex-row gap-5">
                                    <div className="w-25 d-flex flex-row justify-content-end">
                                        <FontAwesomeIcon size="xl" width={21} icon={faCalendar} className="my-auto w-fit-content text-primary"></FontAwesomeIcon>
                                    </div>
                                    <div className="w-100 d-flex flex-row justify-content-start">
                                        <p className="my-0 w-75 text-left">等待審核後配置</p>
                                    </div>
                                </div>
                                <div className="px-4 py-3 d-flex flex-row gap-5">
                                    <div className="w-25 d-flex flex-row justify-content-end">
                                        <FontAwesomeIcon size="xl" width={21} icon={faLink} className="my-auto w-fit-content text-primary"></FontAwesomeIcon>
                                    </div>
                                    <div className="w-100 d-flex flex-row justify-content-start">
                                        <p className="my-0 w-75 text-left">https://doi.org/10.1002/cpe.8078</p>
                                    </div>
                                </div>
                                <div className="px-4 py-3 d-flex flex-row gap-5">
                                    <div className="w-25 d-flex flex-row justify-content-end">
                                        <FontAwesomeIcon size="xl" icon={faFloppyDisk} className="my-auto w-fit-content text-primary"></FontAwesomeIcon>
                                    </div>
                                    <div className="w-100 d-flex flex-row justify-content-start">
                                        <p className="my-0 w-75 text-left">paper.pdf</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className="w-50">
                        <h5 className="text-center mb-3">活動日誌</h5>
                        <Card className="p-5">
                            <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                                <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                                <p className="my-0"> 活動已建立</p>
                            </div>
                            <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                                <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                                <p className="my-0"> 活動已審核通過 </p>
                            </div>
                            <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                                <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                                <p className="my-0"> 完成發信提醒 </p>
                            </div>
                            <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                                <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                                <p className="my-0"> 活動已開始 </p>
                            </div>
                            <div className="ms-5 border-start border-info border-4 p-3 d-flex flex-row gap-5">
                                <div className="rounded-circle bg-info my-auto" style={{width: "14px", height: "14px", marginLeft: "-24.5161px"}}></div>
                                <p className="my-0"> 活動已結束 </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Schedule;