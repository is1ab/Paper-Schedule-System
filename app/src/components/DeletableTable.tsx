import { CloseOutlined } from "@ant-design/icons"
import { Button } from "antd"
import Table, { ColumnType } from "antd/es/table"

interface DataInteface {
    key: string,
}

export default function DeletableTable(props: {
    columns: ColumnType<any>[]
    dataDispatch: [DataInteface[], React.Dispatch<React.SetStateAction<any[]>>]
}){
    const [dataSources, dataSetter] = props.dataDispatch
    const onDelete = (key: string) => {
        const datas = []
        for(const data of dataSources){
            if(data.key === key){
                continue
            }
            datas.push(data)
        }
        dataSetter(datas)
    }
    const columns = props.columns.concat({
        title: "操作",
        className: "text-center",
        render: (_text: string, records: DataInteface, _index: number) => {
            return (
                <Button type="primary" danger icon={<CloseOutlined />} onClick={() => onDelete(records.key)}>刪除</Button>
            )
        }
    } as ColumnType<any>)
    return (
        <Table columns={columns} dataSource={dataSources}></Table>
    )
}