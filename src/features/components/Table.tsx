import { Link } from "react-router-dom";
import { cloneQuestion, deleteQuestion } from "../services/list";
import { QuestionProps } from "../questions_manager/ListQuestions";
import { QuestionRowProps } from "../questions_manager/types";
import { useEffect, useState } from "react";
import { ColumnProps } from "../questions_manager/types";


//import {Draggable} from './Draggable';
//import {Droppable} from './Droppable'



interface Props {
    columns: ColumnProps[],
    data: QuestionRowProps[] | undefined,
    renumber_question: () => void
    //clone_func: (event: React.MouseEvent<HTMLButtonElement>) => void; 
  }

//const clone_question: MouseEventHandler<HTMLButtonElement> = (event) => {
export const Table: React.FC<Props> = ({ columns, data, renumber_question}) => {
//export const Table = (props: {columns: ColumnProps[], data: any, clone_func } ) => {
    const [tableData, setTableData] = useState<QuestionRowProps[] | undefined>([])
    //const clone_row = (message: string) => {
       // console.log(message)
   // }

   useEffect(() => {
        setTableData(data)
   },[data])

   // const clone_question: MouseEventHandler<HTMLButtonElement> = (event) => {
    const clone_row = (id: string) => {
        console.log(" CLONING...............")
       
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
            const new_sub_questions = [...tableData as any, sub_question]
            // kpham: typescript tips: use "as any[]" like above to avoid error: type ... must have a '[Symbol.iterator]()' method that returns an iterator.
      
            setTableData(new_sub_questions)
           
        })
        .catch(error => {
            console.log(error)
        })
            //useAxiosFetch({ url: url_clone, method: 'get' })
        ///api/questions/:id/clone',
        //console.log("xxxx", url_clone)
    }

    //const delete_question: MouseEventHandler<HTMLButtonElement> = (event) => {
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

    const display_col = (row: any, column: ColumnProps) => {
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
        return 'black';
    }

    const paginate = () => {
        if (tableData) {
            console.log("XXXXX")
            const sorted_arr = tableData.map((question, index) => {
                return { ...question, question_number: index + 1 }
            })
            //console.log("test arr", test_arr)
            setTableData(sorted_arr)
            renumber_question()
        }
    }

    
    return (
      <div className="overflow-x-auto">
        <button className='text-textColor1 m-2 p-1 rounded-md bg-bgColor2' onClick={paginate}>Paginate</button>
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((column) => (
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
          </tbody>
        </table>
      </div>
   
    );
    
  };
  
  export default Table;

  /*
 {tableData.map((row, rowIndex:number) => (
            <QuestionItem key={row.id} {...row} row_index={rowIndex} columns={columns} />
          ))}
  */

/*
   { (column.accessor !== 'edit_link') ?
                       row[column.accessor]
                       :
                       <Link to={"EE"}>EDIT</Link>
                    }
*/
  //  <Link className='underline text-sm mr-2' to=
  /*
    <td>
                    <Link to={props.edit_root_link + '/' + "1000"}>Edit</Link>
                </td>
  */
  //{`/categories/${params.categoryId}/sub_categories/${params.sub_category_name}/list_questions/${params.quiz_id}/edit_question/${question.id}`}>
  //Edit
  //</Link>