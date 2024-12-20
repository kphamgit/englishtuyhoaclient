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
import { clone_a_row, deleteQuestion } from '../services/list';

interface ColumnProps { 
    Header: string, accessor: string 
}

 //const DataTable: React.FC<Props> = ({ columns, data, renumber_question}) => {
 
  const DataTable = (props: { columns: ColumnProps[], data: QuestionRowProps[] | CategoryRowProps[], renumber_question: () => void }) => {

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

  const delete_row = (id: string) => {
    //const el = event.target as HTMLButtonElement
    deleteQuestion(id)
    .then(data => {
        //console.log("mmmmm mmmmmm data ", data)
        //const new_arr = [...questions, data]
        const reduced_rows = tableData?.filter(row => row.id != id)
        setTableData(reduced_rows)
        // kpham: typescript tips: use "as any[]" like above to avoid error: type ... must have a '[Symbol.iterator]()' method that returns an iterator.
        // why???
        //setQuestions(prev => prev?.push(data))
    })
    .catch(error => {
        console.log(error)
    })
}

  
        const renumber_rows = () => {
          if (tableData) {
            console.log("XXXXX renumber rows, tableData", tableData)
            //const sorted_arr = tableData.map((item, index) => {
           //     return { ...item, question_number: index + 1 }
           // })
            //console.log("test arr", test_arr)
            //setTableData(sorted_arr)
            //renumber_question()
        }
          /*
          if (tableData) {
              console.log("XXXXX")
              const sorted_arr = tableData.map((question, index) => {
                  return { ...question, question_number: index + 1 }
              })
              //console.log("test arr", test_arr)
              setTableData(sorted_arr)
              //renumber_question()
          }
          */
      }
      

  return (
    
    <div className='max-w-2xl mx-auto grid gap-2 my-10'>
      <div><button className='text-textColor1' onClick={renumber_rows}>Renumber rows</button></div>
      <h2 className='text-2xl text-textColor1 mb-4'>Questions</h2>
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
                  {column.Header}
                </th>
              ))}
            </tr>
          </thead>
            <tbody>
          {tableData.map((row) => (
            <DataRow key={row.id} id={row.id} row={row} columns={props.columns} parent_clone_func={clone_row} parent_delete_func={delete_row} />
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
