import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FC, useEffect, useState } from 'react';
import { ColumnProps, QuestionRowProps } from './types';
import { cloneQuestion, deleteQuestion } from '../services/list';
import { QuestionProps } from './ListQuestions';
import { Link } from 'react-router-dom';


interface Props {
  id: string,
  row: QuestionRowProps,
  columns: ColumnProps[],
  //clone_func: (event: React.MouseEvent<HTMLButtonElement>) => void; 
  parent_clone_func: (id: string) => void;
}

  const DataRow: React.FC<Props> = ({ id, row, columns, parent_clone_func}) => {
    
  const [myRow, setMyRow] = useState<QuestionRowProps>()

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    
    if (row) {
      setMyRow(row)
    }
  }, [row])

const delete_row = (id: string) => {
  //const el = event.target as HTMLButtonElement
  deleteQuestion(id)
  .then(data => {
      //console.log("mmmmm mmmmmm data ", data)
      //const new_arr = [...questions, data]
      //const reduced_rows = tableData?.filter(row => row.id != id)
     //setTableData(reduced_rows)
      
      // kpham: typescript tips: use "as any[]" like above to avoid error: type ... must have a '[Symbol.iterator]()' method that returns an iterator.
      // why???
      //setQuestions(prev => prev?.push(data))
  })
  .catch(error => {
      console.log(error)
  })
}
  
const display_col = (row: any, column: ColumnProps) => {
  
  
  if (row) {
  if (column.accessor === 'edit_link') {
      return <Link to={row[column.accessor]}>EDIT</Link>
  }
  if (column.accessor === 'clone_button') {
      const my_id = row["id"]
      return <button onClick={() =>  parent_clone_func(my_id)}>Clone</button>
  }
  if (column.accessor === 'delete_button') {
      const my_id = row["id"]
      return <button onClick={() =>  delete_row(my_id)}>Delete</button>
  }
  else {
      return row[column.accessor];
  }
  
}

else  return null

}

  return (
    <tr
      ref={setNodeRef}
      style={style}
     
      className='bg-blue-200 p-4 rounded shadow-md flex justify-between mb-1'
    >
       {columns.map((column: ColumnProps) => (
                  <td
                    key={column.accessor}
                    className="py-2 px-4 border-b border-gray-200 text-gray-800"
                  >{ (column.accessor === 'id') ?
                      <button  {...attributes}  {...listeners} className='cursor-move'>{id}</button>
                    :
                    display_col(myRow, column)
                  }
                  
                  </td>
                ))}
     
    </tr>
  );
};

export default DataRow;

/*
 {...attributes}
      {...listeners}
*/

/*
  { tableData &&
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
  <tr key={rowIndex}>
                {columns.map((column: ColumnProps) => (
                  <td
                    className="py-2 px-4 border-b border-gray-200 text-gray-800"
                  >
                    {display_col(row, column)}
                  </td>
                ))}
            
              </tr>
*/
