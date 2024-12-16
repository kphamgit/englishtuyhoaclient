import { useEffect, useState } from 'react';
import QuestionItem from './question-item'
import { QuestionRowProps } from './types';

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

interface ColumnProps { 
    Header: string, accessor: string 
}
interface Props {
    columns: ColumnProps[],
    data: QuestionRowProps[] | undefined,
    renumber_question: () => void
    //clone_func: (event: React.MouseEvent<HTMLButtonElement>) => void; 
  }

 const QuestionList: React.FC<Props> = ({ columns, data, renumber_question}) => {
 
  const [tableData, setTableData] = useState<QuestionRowProps[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (data) {
        setTableData(data)
    }
},[data])

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
  //console.log(userList);
  const handle_clone = (row: QuestionRowProps) => {
      console.log("HANDDLLLE", row )
      const all_new_rows = [...tableData as any, row]
      setTableData(all_new_rows)
  }

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
          items={tableData}
          strategy={verticalListSortingStrategy}
        >
            <table>
            <tbody>
          {tableData.map((row, rowIndex:number) => (
            <QuestionItem key={row.id} id={row.id} row={row} columns={columns} parent_func={handle_clone} />
          ))}
           </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default QuestionList;

/*
  tableData.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="even:bg-gray-50">
                {columns.map((column: ColumnProps) => (
                  <td
                    key={column.accessor}
                    className="py-2 px-4 border-b border-gray-200 text-gray-800"
                  >
                    {display_col(row, column)}
                  </td>
                ))}
            
              </tr>
            ))}
*/

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