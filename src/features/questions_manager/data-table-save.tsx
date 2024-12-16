import { useEffect, useState } from 'react';
import DataRow from './data-row'
import { CategoryRowProps, QuestionRowProps } from './types';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { clone_a_row } from '../services/list';

interface ColumnProps { 
    Header: string, accessor: string 
}
interface Props {
    columns: ColumnProps[],
    //data: QuestionRowProps[] | undefined,
    data: any,
    renumber_question: () => void
    //clone_func: (event: React.MouseEvent<HTMLButtonElement>) => void; 
  }

 //const DataTable: React.FC<Props> = ({ columns, data, renumber_question}) => {
 
  const DataTableSave = (props: { columns: ColumnProps[], data: QuestionRowProps[] | CategoryRowProps[], renumber_question: () => void }) => {

  const [tableData, setTableData] = useState<QuestionRowProps[] | CategoryRowProps[] >([])
  //const [tableData, setTableData] = useState([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (props.data) {
      console.log("x x x x x x x x data=", props.data)
        setTableData(props.data)
    }
},[props.data])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
        setTableData((items) => {
         
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
          
      });
    }
  }

  const clone_row = (id: string) => {
    clone_a_row(id, "question")
    .then((data) => {
        const all_new_rows = [...tableData as any, data]
        //console.log("")
        setTableData(all_new_rows)
    })
    .catch(error => {
        console.log(error)
    })
  }
  return (
    <div className='max-w-2xl mx-auto grid gap-2 my-10'>
      <h2 className='text-2xl text-textColor1 mb-4'>User List</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={tableData}
          strategy={verticalListSortingStrategy}
        >
            <table>
            <thead className="bg-gray-200">
            <tr>
              {props.columns.map((column) => (
                <th
                  key={column.accessor}
                  className="py-2 px-4 border-b border-gray-200 text-left text-gray-600"
                >
                  abd
                </th>
              ))}
            </tr>
          </thead>
            <tbody>
          {tableData.map((row) => (
            <DataRow key={row.id} id={row.id} row={row} columns={props.columns} parent_clone_func={clone_row} />
          ))}
           </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DataTable;

/*
id: string;
    question_number: number;
    format: number;
    content: string;
    answer_key: string;
    edit_link: string;
    clone_button: string;
    delete_button: string;
*/
/*
  return (
    <div className='max-w-2xl mx-auto grid gap-2 my-10'>
      <h2 className='text-2xl font-bold mb-4'>User List</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={userList}
          strategy={verticalListSortingStrategy}
        >
          {userList.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
*/