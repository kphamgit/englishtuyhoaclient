import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FC, useEffect, useState } from 'react';
import { ColumnProps, QuestionRowProps, QuestionRowPropsExtended } from './types';
import { cloneQuestion, deleteQuestion } from '../services/list';
import { QuestionProps } from './ListQuestions';
import { Link } from 'react-router-dom';

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

interface Props {
  id: string,
  row: QuestionRowProps,
  columns: ColumnProps[],
  //clone_func: (event: React.MouseEvent<HTMLButtonElement>) => void; 
  parent_func: (new_row: QuestionRowProps) => void;
}

//const UserItem: FC<QuestionRowProps> = (props) => {
  const QuestionItem: React.FC<Props> = ({ id, row, columns, parent_func}) => {
    //const QuestionItem = (props: QuestionRowPropsExtended) => {
  
    const [myRow, setMyRow] = useState<QuestionRowProps>()
        //const { id, question_number, row_index, format, content, answer_key, edit_link, clone_button, delete_button, columns } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    
    if (row) {
      //console.log("yyyyy row", row)
      setMyRow(row)
    }
  }, [row])

  const clone_row = (id: string) => {
    //console.log(" CLONING...............id =", id)
   
    cloneQuestion(id)
    .then((data: QuestionProps ) => {
        //console.log("mmmmm", data)
        const sub_question: QuestionRowProps = {
            id: data.id,
            question_number: data.question_number, 
            format: data.format,
            content: data.content,
            answer_key: data.answer_key,
            edit_link: "",
            clone_button: "",
            delete_button: ""
        }
        //console.log("MMMMM MMMM", sub_question)
        //const new_sub_questions = [...tableData as any, sub_question]
        // kpham: typescript tips: use "as any[]" like above to avoid error: type ... must have a '[Symbol.iterator]()' method that returns an iterator.
        parent_func(sub_question)
        //setTableData(new_sub_questions)
        //setTableData(test_arr)
    })
    .catch(error => {
        console.log(error)
    })
    
        //useAxiosFetch({ url: url_clone, method: 'get' })
    ///api/questions/:id/clone',
    //console.log("xxxx", url_clone)
}

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
      return <button onClick={() =>  clone_row(my_id)}>Clone</button>
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

export default QuestionItem;

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
