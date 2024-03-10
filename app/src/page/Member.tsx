import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { UserType } from "../type/user/userType";
import { useAppDispatch } from "../store/hook";
import { getUsers } from "../store/dataApi/UserApiSlice";
import UserCard from "./components/UserCard";

function Member(){
    const [ students, setStudents ] = useState<UserType[]>([])
    const [ guests, setGuests ] = useState<UserType[]>([])
    const [ professors, setProfessors ] = useState<UserType[]>([])
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getUsers()).then((response) => {
            if(response.meta.requestStatus == 'fulfilled'){
                const payload = response.payload;
                const users = payload["data"] as UserType[]
                const students = users.filter((user) => user.role == "student")
                const guests = users.filter((user) => user.role == "guest")
                const professors = users.filter((user) => user.role == "professor")
                setStudents(students)
                setGuests(guests)
                setProfessors(professors)
            }
        })
    }, [])

    return (
        <Container className="p-5 text-center">
            <h2>實驗室成員</h2>
            <hr></hr>
            { professors.length == 0 ? 
                null : 
                <div className="pb-4 d-flex flex-column gap-3">
                    <h4>Professor</h4>
                    <div className="d-flex flex-row" style={{flexWrap: "wrap"}}>
                        {professors.map((professor) => {
                            return (
                                <UserCard 
                                    name={professor.name} 
                                    email={professor.email} 
                                    note={professor.note}
                                />
                            )
                        })}
                    </div>
                </div>
            }
            { guests.length == 0 ? 
                null :
                <div className="pb-4 d-flex flex-column gap-3">
                    <h4>Guest</h4>
                    <div className="d-flex flex-row" style={{flexWrap: "wrap"}}>
                        {guests.map((guest) => {
                            return (
                                <UserCard 
                                    name={guest.name} 
                                    email={guest.email} 
                                    note={guest.note}
                                />
                            )
                        })}
                    </div>
                </div>
            }   
            { students.length == 0 ? 
                null :
                <div className="pb-4 d-flex flex-column gap-3">
                    <h4>Student</h4>
                    <div className="d-flex flex-row" style={{flexWrap: "wrap"}}>
                        {students.map((student) => {
                            return (
                                <UserCard 
                                    name={student.name} 
                                    email={student.email} 
                                    note={student.note}
                                />
                            )
                        })}
                    </div>
                </div>
            }
        </Container>
    )
}

export default Member;