import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useAppDispatch } from "../store/hook";
import { AddUserPayloadType } from "../type/user/userPayloadType";
import { addUser, getUser, modifyUser } from "../store/dataApi/UserApiSlice";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

function EditUser(){
    const { userId } = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [ studentId, setStudentId ] = useState<string>("")
    const [ name, setName ] = useState<string>("")
    const [ email, setEmail ] = useState<string>("")
    const [ role, setRole ] = useState<string>("student")
    const [ note, setNote ] = useState<string>("")

    const handleChangeStudentId = (value: string) => { setStudentId(value) }
    const handleChangeEmail = (value: string) => { setEmail(value) }
    const handleChangeName = (value: string) => { setName(value) }
    const handleChangeRole = (value: string) => { setRole(value) }
    const handleChangeNote = (value: string) => { setNote(value) }

    const handleSubmit = () => {
        if(userId === "0"){
            handleAddUser()
        }else{
            handleModifyUser()
        }
    }

    const handleModifyUser = () => {
        Swal.fire({
            title: "正在更改使用者資訊...",
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading()
                dispatch(modifyUser({
                    id: studentId,
                    name: name,
                    email: email,
                    role: role,
                    note: note
                } as AddUserPayloadType)).then((response) => {
                    if(response.meta.requestStatus === 'fulfilled'){
                        Swal.fire({
                            icon: "success",
                            title: "修改成功",
                            timer: 2000,
                            showConfirmButton: false
                        })
                        navigate("/ManageUser")
                    }else{
                        Swal.fire({
                            icon: "error",
                            title: "修改失敗，請聯繫管理員",
                            timer: 2000,
                            showConfirmButton: false
                        })
                    }
                })
                Swal.close()
            }
        })
    }

    const handleAddUser = () => {
        Swal.fire({
            title: "正在新增使用者...",
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading()
                dispatch(addUser({
                    id: studentId,
                    name: name,
                    email: email,
                    role: role,
                    note: note
                } as AddUserPayloadType)).then((response) => {
                    if(response.meta.requestStatus === 'fulfilled'){
                        Swal.fire({
                            icon: "success",
                            title: "新增成功",
                            timer: 2000,
                            showConfirmButton: false
                        })
                        navigate("/ManageUser")
                    }else{
                        Swal.fire({
                            icon: "error",
                            title: "新增失敗，請聯繫管理員",
                            timer: 2000,
                            showConfirmButton: false
                        })
                    }
                })
                Swal.close()
            }
        })
    }

    useEffect(() => {
        const id = userId;
        if(id === "0" || id === undefined){
            return
        }
        dispatch(getUser(id)).then((response: any) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload;
                const data = payload["data"]
                const id = data["id"]
                const name = data["name"]
                const role = data["role"]
                const note = data["note"]
                const email = data["email"]
                setStudentId(id)
                setName(name)
                setRole(role)
                setNote(note)
                setEmail(email)
            }
        })
    }, [userId])

    return (
        <Container className="p-5">
            <h2 className="text-center pb-4">新增使用者</h2>
            <div className="w-100 border rounded p-5 d-flex flex-column gap-4">
                <div className="p-2">
                    <h4>填寫使用者相關資訊</h4>
                    <p><small>請填寫使用者相關資訊。</small></p>
                </div>
                <div className="d-flex flex-row" style={{flexWrap: "wrap"}}>
                    <div className="p-2 w-50">
                        <Form.Label>學號</Form.Label>
                        <Form.Control
                            type="text"
                            value={studentId}
                            onChange={(e) => handleChangeStudentId(e.target.value)}
                        />
                    </div>
                    <div className="p-2 w-50">
                        <Form.Label>名稱</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => handleChangeName(e.target.value)}
                        />
                    </div>
                    <div className="p-2 w-50">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={email}
                            onChange={(e) => handleChangeEmail(e.target.value)}
                        />
                    </div>
                    <div className="p-2 w-50">
                        <Form.Label>身份組</Form.Label>
                        <Form.Select 
                            value={role} 
                            onChange={(e) => handleChangeRole(e.target.value)}
                        >
                            <option value={"professor"}>Professor</option>
                            <option value={"guest"}>Guest</option>
                            <option value={"student"}>Student</option>
                        </Form.Select>
                    </div>
                    <div className="p-2 w-50">
                        <Form.Label>備註（可註明系級，例如：碩一、博一、大學部、顧問...）</Form.Label>
                        <Form.Control
                            type="text"
                            value={note}
                            onChange={(e) => handleChangeNote(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-100 d-flex justify-content-end p-2">
                    <Button className="ml-auto" variant={"primary"} onClick={() => handleSubmit()}>提交使用者資料</Button>
                </div>
            </div>
        </Container>
    )
}

export default EditUser;