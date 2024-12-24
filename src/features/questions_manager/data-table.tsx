import { useEffect, useState } from 'react';
import DataRow from './data-row'
import { ColumnProps, DataRowProps } from './types';

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
import { clone_a_row, deleteQuestion, renumberQuestions } from '../services/list';

//interface ColumnProps { 
   //// Header: string, accessor: string 
//}

 //const DataTable: React.FC<Props> = ({ columns, data, renumber_question}) => {
 
  const DataTable = (props: { columns: ColumnProps[], data: DataRowProps[] | undefined }) => {

  const [tableData, setTableData] = useState<DataRowProps[] | undefined >([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (props.data) {
      //console.log("x x x x x x x x data=", props.data)
        setTableData(props.data)
    }
},[props.data])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
        setTableData((items) => {
        if (items) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        }
          
      });
    }
  }

    const clone_row = (id: string) => {
      clone_a_row(id, "question")
        .then((data) => {  //returns the id and the question number of the newly cloned row
          //look for row in tableData that has the same question number
          const cloned_row = tableData?.find(row => row.item_number === data?.item_number.toString())
          if (tableData) {
            // add cloned row to table, remember to set its id to that of the newly created row in database
            const new_table_data = [...tableData, { ...cloned_row, id: data?.id }]
            if (new_table_data) {
              setTableData(new_table_data as any)
              //have to use "as any" here for typescript to work. Don't know why. kpham
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    }

  const delete_row = (id: string) => {
    //const el = event.target as HTMLButtonElement
    deleteQuestion(id)
    .then(data => {
        const reduced_rows = tableData?.filter(row => row.id != data.id)
        setTableData(reduced_rows)
        // kpham: typescript tips: use "as any[]" like above to avoid error: type ... must have a '[Symbol.iterator]()' method that returns an iterator.
        // why???
    })
    .catch(error => {
        console.log(error)
    })
}

        const renumber_rows = () => {
          if (tableData) {
            //console.log(" tableData =", tableData)
            const table_with_sorted_item_numbers = tableData.map((row, index) => {
                return {...row, item_number: (index+1).toString()}
            })
            //console.log("MMQQQQQQ ids", table_with_sorted_item_numbers)
            setTableData(table_with_sorted_item_numbers)

            //extract only ids to send to server
            const ids_table = tableData.map((row) => {
              return row.id
            })
            renumberQuestions(ids_table)
            .then( response => {
                //console.log("eeeee", response)
            })
            .catch( err =>
                console.log(err)
            )
        }
      }
      
  return (
    
    <div className='w-auto grid-cols-5 gap-2 my-10'>
      <div><button className='text-textColor1 bg-bgColor2 rounded-lg p-2' onClick={renumber_rows}>Renumber rows</button></div>
     
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={tableData as any}   //kpham: have to use "as any" here to get rid of typescript error. kpham
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
          {tableData && tableData.map((row) => (
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
