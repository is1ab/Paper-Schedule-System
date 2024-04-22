import { MenuOutlined } from "@ant-design/icons";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import Table, { ColumnsType } from "antd/es/table"
import React from "react";
import { CSS } from '@dnd-kit/utilities';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

interface DataInteface {
    key: string,
}

export default function DragableTable(props: {
    columns: ColumnsType<any>
    dataDispatch: [DataInteface[], React.Dispatch<React.SetStateAction<any[]>>]
}){
    const columns = ([{key: 'sort'}] as ColumnsType<any>).concat(props.columns)
    const [dataSources, dataSetter] = props.dataDispatch
    debugger

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
          dataSetter((previous) => {
            const activeIndex = previous.findIndex((i) => i.key === active.id);
            const overIndex = previous.findIndex((i) => i.key === over?.id);
            return arrayMove<DataInteface>(previous, activeIndex, overIndex);
          });
        }
    };

    const Row = ({ children, ...props }: RowProps) => {
        const {
          attributes,
          listeners,
          setNodeRef,
          setActivatorNodeRef,
          transform,
          transition,
          isDragging,
        } = useSortable({
          id: props['data-row-key'],
        });
      
        const style: React.CSSProperties = {
          ...props.style,
          transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
          transition,
          ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
        };
      
        return (
          <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
              if ((child as React.ReactElement).key === 'sort') {
                return React.cloneElement(child as React.ReactElement, {
                  children: (
                    <MenuOutlined
                      ref={setActivatorNodeRef}
                      style={{ touchAction: 'none', cursor: 'move' }}
                      {...listeners}
                    />
                  ),
                });
              }
              return child;
            })}
          </tr>
        );
    };

    return (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext items={dataSources.map(i => i.key)}>
                <Table 
                    components={{
                        body: {
                            row: Row
                        }
                    }} 
                    rowKey="key"
                    columns={columns} 
                    dataSource={dataSources}
                    pagination={false}
                />
            </SortableContext>
        </DndContext>
    )
}