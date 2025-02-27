import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FC, useEffect, useState } from 'react';
//import { ColumnProps, QuestionRowProps } from './types';
import { ColumnProps, DataRowProps } from './types';
//import { cloneQuestion, deleteQuestion } from '../services/list';
//import { QuestionProps } from './ListQuestions';
import { Link } from 'react-router-dom';


interface Props {
  id: string,
  row: DataRowProps,
  columns: ColumnProps[],
  //clone_func: (event: React.MouseEvent<HTMLButtonElement>) => void; 
  parent_clone_func: (id: string) => void;
  parent_delete_func: (id: string) => void;
}

  const DataRow: React.FC<Props> = ({ id, row, columns, parent_clone_func, parent_delete_func}) => {
    
  const [myRow, setMyRow] = useState<DataRowProps>()

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
  
const display_col = (row: any, column: ColumnProps) => {
  
  
  if (row) {
  if (column.accessor === 'edit_link') {
      return <Link to={row[column.accessor]}>EDIT</Link>
  }
  if (column.accessor === 'extra_link') {
    // extra link is in the form of:  'quizzes/id*name'
    // split id and name to make link
    const the_link = row[column.accessor].split('*')[0]
    const the_label = row[column.accessor].split('*')[1]
    return <Link to={the_link}>{the_label}</Link>
}
  if (column.accessor === 'clone_button') {
      const my_id = row["id"]
      return <button onClick={() =>  parent_clone_func(my_id)}>Clone</button>
  }
  if (column.accessor === 'delete_button') {
      const my_id = row["id"]
      return <button onClick={() =>  parent_delete_func(my_id)}>Delete</button>
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
     
      className=' p-4 rounded shadow-md '
    >
       {columns.map((column: ColumnProps) => (
                  <td
                    key={column.accessor}
                    className="py-3 px-4 border-b border-gray-200 bg-bgColor3 text-textColor3 mb-3"
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

