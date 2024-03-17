import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Steps, Uploader } from "rsuite";
import { useAppDispatch } from "../store/hook";
import { addSchedule, checkDuplicateUrl } from "../store/dataApi/ScheduleApiSlice";
import Swal from "sweetalert2";
import { FileType } from "rsuite/esm/Uploader";
import _ from "lodash"
import { AddSchedulePayloadType, AddScheduleAttachmentPayloadType } from "../type/schedule/ScheduleType";
import LoadingBox from "./components/LoadingBox";
import { useNavigate } from "react-router-dom";

function AddSchedule(){
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [ current, setCurrent ] = useState<number>(0);
    const [ name, setName ] = useState<string>("");
    const [ url, setUrl ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");
    const [ fileList, setFileList ] = useState<{virtualFileName: string, realFile: FileType}[]>([]);
    const [ isSending, setIsSending ] = useState<boolean>(false)
    const handleInfo = () => {
        dispatch(checkDuplicateUrl(url)).then((response) => {
            if(response.meta.requestStatus == 'fulfilled'){
                setCurrent(current + 1)
            }else{
                Swal.fire({
                    icon: "error",
                    title: "該論文已被報告過",
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        })
    }
    const handleAttachmentUploadSuccess = (response: {data: string, status: string}, file: FileType) => {
        setFileList(fileList.concat({
            virtualFileName: response.data,
            realFile: file
        }))
    }
    const handleAttachmentRemove = (file: FileType) => {
        const newList = _.remove(fileList, (bundle, _value, _array) => bundle.realFile.name != file.name)
        setFileList(newList)
    }
    const getRsuiteFormatFileList = (): FileType[] => {
        return fileList.map((bundle) => bundle.realFile);
    }
    const backPerviousStep = () => {
        setCurrent(current - 1)
    }
    const handleDetailInfo = () => {
        setCurrent(current + 1)
    }
    const handleAttachment = () => {
        setCurrent(current + 1)
    }
    const handleSubmit = () => {
        setIsSending(true)
        setCurrent(current + 1)
        dispatch(addSchedule({
            name: name,
            link: url,
            description: description,
            attachments: fileList.map((bundle) => {
                return {
                    fileKey: bundle.virtualFileName,
                    realName: bundle.realFile.name
                } as AddScheduleAttachmentPayloadType
            })
        } as AddSchedulePayloadType)).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                setIsSending(false)
            }
        })
    }
    const PreviousStepButton = () => {
        return (
            <Button className="ml-auto border" variant={"light"} onClick={() => backPerviousStep()}>上一步</Button>
        )
    }
    return (
        <Container className="p-5 d-flex flex-column gap-4 mx-auto">
            <h2 className="text-center">新增論文報告請求</h2>
            <Steps className="w-100 p-5 d-none d-md-flex border rounded" current={current}>
                <Steps.Item title={"填寫論文相關資訊"} />
                <Steps.Item title={"填寫詳細資訊"} />
                <Steps.Item title={"上傳論文附件"} />
                <Steps.Item title={"確認請求相關資訊"} />
                <Steps.Item title={"完成"} />
            </Steps>
            {current == 0 && 
                <div className="w-100 border rounded p-5 d-flex flex-column gap-4">
                    <div className="p-2">
                        <h4>填寫論文相關資訊</h4>
                        <p><small>請填寫論文名稱與論文 doi，系統將確認是否為已經報過的論文。</small></p>
                    </div>
                    <div className="d-flex">
                        <div className="p-2 w-50">
                            <Form.Label>論文名稱</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>
                        <div className="p-2 w-50">
                            <Form.Label>論文 doi</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) => setUrl(e.target.value)}
                                value={url}
                            />
                        </div>
                    </div>
                    <div className="w-100 d-flex justify-content-end p-2">
                        <Button className="ml-auto" variant={"primary"} onClick={() => handleInfo()}>提交論文相關資訊</Button>
                    </div>
                </div>
            }
            {current == 1 && 
                <div className="w-100 border rounded p-5 d-flex flex-column gap-4">
                    <div className="p-2">
                        <h4>填寫報告行程簡介</h4>
                        <p><small>請填寫報告行程簡介，將以信件方式傳送給所有實驗室成員。</small></p>
                    </div>
                    <div className="d-flex">
                        <div className="p-2 w-100">
                            <Form.Label>報告簡介</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            />
                        </div>
                    </div>
                    <div className="w-100 d-flex justify-content-end p-2 gap-3">
                        <PreviousStepButton />
                        <Button className="ml-auto" variant={"primary"} onClick={() => handleDetailInfo()}>提交報告簡介</Button>
                    </div>
                </div>
            }
            {current == 2 &&
                <div className="w-100 border rounded p-5 d-flex flex-column gap-4">
                    <div className="p-2">
                        <h4>上傳論文附件</h4>
                        <p><small>請上傳論文附件，僅限上傳 PDF，將以信件方式傳送給所有實驗室成員。</small></p>
                    </div>
                    <div className="d-flex">
                        <div className="p-2 w-100">
                            <Form.Label>論文附件</Form.Label>
                            <Uploader 
                                className="text-center text-secondary" 
                                draggable 
                                action="/api/schedule/upload_attachment"
                                style={{cursor: "pointer"}}
                                fileList={getRsuiteFormatFileList()}
                                onSuccess={handleAttachmentUploadSuccess}
                                onRemove={handleAttachmentRemove}
                            >
                                <div style={{lineHeight: "200px"}}>Click or Drag files to this area to upload</div>
                            </Uploader>
                        </div>
                    </div>
                    <div className="w-100 d-flex justify-content-end p-2 gap-3">
                        <PreviousStepButton />
                        <Button className="ml-auto" variant={"primary"} onClick={() => handleAttachment()}>提交論文附件</Button>
                    </div>
                </div>
            }
            {current == 3 &&
                <div className="w-100 border rounded p-5 d-flex flex-column gap-4">
                    <div className="p-2">
                        <h4>確認請求相關資訊</h4>
                        <p><small>請再次確認以下資訊，完成後請點擊「送出」。</small></p>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="p-2 w-100 d-flex flex-row">
                            <div className="p-2 w-50">
                                <Form.Label>論文名稱</Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={name}
                                />
                            </div>
                            <div className="p-2 w-50">
                                <Form.Label>論文 doi</Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={url}
                                />
                            </div>
                        </div>
                        <div className="p-2 w-100 d-flex flex-row">
                            <div className="p-2 w-100">
                                <Form.Label>簡介</Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    value={description}
                                />
                            </div>
                        </div>
                        <div className="p-2 w-100 d-flex flex-row">
                            <div className="p-2 w-100">
                                <Form.Label>附件</Form.Label>
                                <Uploader
                                    plaintext
                                    defaultFileList={getRsuiteFormatFileList()}
                                    action=""
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-100 d-flex justify-content-end p-2 gap-3">
                        <PreviousStepButton />
                        <Button className="ml-auto" variant={"primary"} onClick={() => handleSubmit()}>送出</Button>
                    </div>
                </div>
            }
            {current == 4 && 
                <div className="w-100 border rounded p-5 d-flex flex-column gap-5">
                    { isSending ? 
                        <LoadingBox /> : 
                        <>
                            <div className="d-flex flex-column gap-4">
                                <div className="mx-auto my-auto d-flex flex-row gap-4">
                                    <div className="d-flex flex-column justify-content-center">
                                        <FontAwesomeIcon icon={faCalendarCheck} size="2xl"></FontAwesomeIcon>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <h4 className="text-center my-auto"> 報告請求新增成功 </h4>
                                        <p className="text-center my-0">請等待系統管理員進行審核</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mx-auto d-flex flex-row gap-4">
                                <Button className="ml-auto" variant={"secondary"} onClick={() => {navigate("/")}}>回到首頁</Button>
                                <Button className="ml-auto" variant={"primary"} onClick={() => {navigate("/Event")}}>查看已審核完成之活動</Button>
                            </div>
                        </>
                    }
                </div>
            }
        </Container>
    )
}

export default AddSchedule;