import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { UserType } from "../type/user/userType";
import { useAppDispatch } from "../store/hook";
import { getUsers } from "../store/dataApi/UserApiSlice";
import { Table } from "rsuite";
import { SortType } from "rsuite/esm/Table";
import { UserTableType } from "../type/user/userTableType";

const { Column, HeaderCell, Cell } = Table;

export default function ManageUserWeight(){
    
    const dispatch = useAppDispatch()
    const [users, setUsers] = useState<UserType[]>([]);
    const [editableUserTableData, setEditableUserTableData] = useState<UserTableType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<string>("");
    const [sortType, setSortType] = useState<SortType | undefined>();

    const handleSortColumn = (sortColumn: string, sortType: SortType | undefined) => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setSortColumn(sortColumn);
          setSortType(sortType);
        }, 500);
    };

    const handleWeightChange = (id: number, weight: number) => {
        const nextData = Object.assign([] as UserTableType[], editableUserTableData);
        const activeItem = nextData.find(item => item.id === id);
        if(activeItem === undefined){
            return
        }
        activeItem.weight = weight
        setEditableUserTableData(nextData)
    }

    useEffect(() => {
        let datas = users;
        if(sortColumn && sortType){
            datas = datas.sort((a, b) => {
                if(sortColumn == "id"){
                    return a.id - b.id
                }
                if(sortColumn == "name"){
                    return a.name.localeCompare(b.name)
                }
                if(sortColumn == "account"){
                    return a.account.localeCompare(b.account)
                }
                if(sortColumn == "email"){
                    return a.email.localeCompare(b.email)
                }
                if(sortColumn == "role"){
                    return a.role.name.localeCompare(b.role.name)
                }
                if(sortColumn == "note"){
                    return a.note.localeCompare(b.note)
                }
                return b.role.name.localeCompare(a.role.name);
            })
            if (sortType == "desc"){
                datas.reverse()
            }
        }else{
            datas = datas.sort((a, b) => {
                return a.role.name.localeCompare(b.role.name);
            })
        }
        setEditableUserTableData(datas.map((data) => {
            return {
                "id": data.id,
                "name": data.name,
                "account": data.account,
                "email": data.email,
                "role": data.role.name,
                "note": data.note,
                "weight": 0,
                "continuous": 1,
            } as UserTableType
        }))
    }, [users, sortColumn, sortType])

    useEffect(() => {
        dispatch(getUsers()).then((response) => {
            if(response.meta.requestStatus === 'fulfilled'){
                const payload = response.payload;
                const users = payload["data"] as UserType[]
                setUsers(users)
            }
        })
    }, [])

    return (
        <Container className="p-5">
            <h2 className="text-center pb-4">管理報告順序權重</h2>
            <div className="d-flex flex-row gap-3">
                <div className="w-100">
                    <Table 
                        height={600} 
                        className="w-fit-content overflow-x-auto" 
                        data={editableUserTableData} 
                        onSortColumn={handleSortColumn}
                        sortColumn={sortColumn}
                        sortType={sortType}
                        loading={loading}
                    >
                        <Column width={100} align="center" sortable>
                            <HeaderCell>ID</HeaderCell>
                            <Cell dataKey="id" />
                        </Column>
                        <Column width={250} align="center" sortable>
                            <HeaderCell>名稱</HeaderCell>
                            <Cell dataKey="name" />
                        </Column>
                        <Column width={200} align="center" sortable>
                            <HeaderCell>帳號</HeaderCell>
                            <Cell dataKey="account" />
                        </Column>
                        <Column width={250} align="center" sortable>
                            <HeaderCell>身份組</HeaderCell>
                            <Cell dataKey="role" />
                        </Column>
                        <Column width={250} align="center" sortable>
                            <HeaderCell>備註</HeaderCell>
                            <Cell dataKey="note" />
                        </Column>
                        <Column width={100} align="center">
                            <HeaderCell>權重</HeaderCell>
                            <Cell dataKey="weigth">
                                { (rowData) => <input className="rs-input text-center h-100" min={0} defaultValue={rowData.weight} onChange={
                                    event => handleWeightChange(rowData.id, Number.parseInt(event.target.value))
                                }></input> }
                            </Cell>
                        </Column>
                    </Table>
                </div>
            </div>
        </Container>
    )
}