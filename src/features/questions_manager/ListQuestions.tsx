//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { ColumnDef, createColumnHelper , SortingState} from '@tanstack/table-core';
import { QuizProps } from './types';
import { useRootUrl } from '../../contexts/root_url';

import { useSortable } from '@dnd-kit/sortable';

import GenericSortableTable from './GenericSortableTable';
import { genericItemType } from './ListQuizzes';
import NewQuestion from './NewQuestion';

interface ShortQuestionProps extends genericItemType{
  format: string
  content: string,
  video_segment_id?: string
}


const formatOptions = [
  { value: "1", label: "Cloze" },
  { value: "2", label: "Button Cloze Select" },
  { value: "3", label: "Button Select" },
  { value: "4", label: "Radio" },
  { value: "5", label: "Checkbox" },
  { value: "6", label: "Word Scramble" },
  { value: "7", label: "Speech Recognition" },
  { value: "8", label: "Word Select" },
  { value: "9", label: "Recording" },
  { value: "10", label: "Drop Down" },
  { value: "11", label: "Letter Cloze" },
];


//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListQuestions(props:any) {
  //<a class="italic text-blue-300" href="/categories/4/sub_categories/9/list_quizzes/27/questions/135">Questions</a>
  const params = useParams<{ categoryId: string, sub_categoryId: string, unit_id: string, quiz_id: string}>();
  console.log("***************** params = ", params)
  //const url = `units/${params.unit_id}`;
  const [enabledFetchUnit, setEnabledFetchUnit] = useState(true)
  const [questions, setQuestions] = useState<ShortQuestionProps[]>([])
  //const [selectedFormat, setSelectedFormat] = useState<string>("1"); // State for dropdown selection
  const selectedFormat = useRef<string>("1")
  const navigate = useNavigate()

  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [modalContent, setModalContent] = useState<string | null>(null); // State for modal content


const { rootUrl } = useRootUrl();

 const url = `/quizzes/${params.quiz_id}/get_questions`
 const { data: quiz } = useAxiosFetch<QuizProps>({ url: url, method: 'get' })

 console.log("LIST question ***** quiz = ", quiz)

  useEffect(() => {
      if (quiz && quiz.questions) {
        const shortQuestions: ShortQuestionProps[] = quiz.questions.map(({ id, format, question_number }) => ({
          itemId: id,
          item_number: question_number.toString(),
          format: format.toString(),
          content: "content....",
        }));
        console.log("UUUUUUU shortQuestions = ", shortQuestions)
        setQuestions(shortQuestions);
      }
    }, [quiz]);

    const cloneQuestion = async (question_id: string, originals: any) => {
      console.log("cloneQuestion called with question_id:", question_id);
      const response = await fetch(`${rootUrl}/api/questions/${question_id}/clone`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
       // Remove the deleted segment from local state
      //setQuestions(prev => prev.filter(vs => vs.itemId !== question_id));
      // update the local state with the new cloned question
      const data = await response.json();
      //console.log("&&&&&&& cloneQuestion newQuestion =", data)
      const new_question = data.new_question;
      // add data.new_question to the originals array after the original question
      // REMEMBER, have to use originals, not questions, to update the local state
      const index = originals.findIndex((q : ShortQuestionProps)=> q.itemId === question_id);
      if (index !== -1) {
        const updatedQuestions = [
          ...originals.slice(0, index + 1),
          {
            itemId: new_question.id,
            item_number: new_question.question_number.toString(),
            format: new_question.format.toString(),
            content: new_question.content || 'content....',
          },
          ...originals.slice(index + 1),
        ];
        //console.log("Updated questions after cloning:", updatedQuestions);
        setQuestions(updatedQuestions);
      //
      }
      /*
      setQuestions(prev => [...prev, {
        itemId: data.new_question.id,
        item_number: data.new_question.question_number.toString(),
        format: data.new_question.format.toString(),
        content: data.new_question.content || 'content....',
      }]);
      */

      //return response.json();
    };

    const deleteQuestion = async (question_id: string,  originals: ShortQuestionProps[]) => {
      // for the use of originals, see cloneQuestion function
      console.log("deleteQuiz called with quiz_id:", question_id);
      
    const response = await fetch(`${rootUrl}/api/questions/${question_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      console.log("Successfully deleted question with id:", question_id);
      // Update the local state to remove the deleted question
      const updatedQuestions = originals.filter(q => q.itemId !== question_id);
      setQuestions(updatedQuestions);
    } else {
      console.error("Failed to delete question with id:", question_id);
    }
    return response.json();
    
      
    };

//const { data: unit, loading, error } = useAxiosFetch<UnitProps>({ url: url, method: 'get' })
//console.log("***** quizzes = ", unit?.quizzes)

const [createNewQuestion, setCreateNewQuestion] = useState(false)

const [sorting, setSorting] = useState<SortingState>([]);

 const columnHelper = createColumnHelper<any>();

const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <button {...attributes} {...listeners}>
      🟰
    </button>
  );
};

const child_reset_item_numbers = (new_numbers: {itemId: string, item_number: string}[]) => {
  //console.log("test_function called value =", value)
  console.log("child_reset_item_numbers called new_numbers =", new_numbers)
  // use fetch api to post new_numbers to backend /api/questions/renumber',
  const response = fetch(`${rootUrl}/api/questions/renumber`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_number_pairs: new_numbers }),
  })
  return response;

}

const updateQuestion = (question_id: string, video_segment_id: string) => {
  console.log("updateQuestion called with question_id:", question_id, "video_segment_id:", video_segment_id);
  
  // get the video_segment_id f
  const update_params = {
    video_segment_id: video_segment_id
  }
  const response = fetch(`${rootUrl}/api/questions/${question_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update_params),
  });
  
  //const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_questions/${params.quiz_id}/edit_question/${question_id}`
  //console.log("updateQuestion navigate to url:", url);
  //navigate(url)
  //return response.json();
};

const columns = useMemo<ColumnDef<ShortQuestionProps>[]>(
  () => [
    {
      id: "drag-handle",
      header: "Move",
      cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
      size: 60,
    },
    {
      accessorKey: "itemId",
      header: "Question ID",
    },
    {
      accessorKey: "item_number",
      header: "Question Number",
      //enableSorting: true, // Enable sorting for this column
    },
    {
      accessorKey: "format",
      header: "Format",
    },
    {
      accessorKey: "content",
      header: "Content",
    }, 
    {
      accessorKey: "video_segment_id",
      header: "Video Segment ID",
      cell: info => {
        const initialValue = info.getValue() as string | undefined;
        const rowIndex = info.row.index; // Get the row index
        const [value, setValue] = useState(initialValue);
        const inputRef = useRef<HTMLInputElement>(null);
        const onBlur = () => {
          //console.log(`Updated cell value for ${info.column.id} in row ${info.row.index}: ${value}`);
        setQuestions(prev => {
        const updatedSegments = [...prev];
        updatedSegments[rowIndex] = {
          ...updatedSegments[rowIndex],
          video_segment_id: value, // Update the segment_number
        };
        //console.log("Updated row:", updatedSegments[rowIndex]);
        return updatedSegments;
      });
  
        };
        return (
          <div className='flex items-center'>
          <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-16 mx-1'
          ref={inputRef} // Attach the ref to the input field
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
          />
          </div>
        );
      },
    }, 
    {
      id: "edit",
      header: "Edit",
      cell: (info) => (
        <Link className="italic text-blue-300" to={`edit_question/${info.row.original.itemId}`}>
          Edit
        </Link>
      ),
    },
    {
      id: "update",
      header: "Update",
      cell: (info) => (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => updateQuestion(info.row.original.itemId, info.row.original.video_segment_id || '')}
        >
          Update
        </button>
      ),
    },
    {
      id: "delete",
      header: "Delete",
      cell: (info) => (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => { 
            const originals = info.table.getRowModel().rows.map((row: any) => row.original);
            console.log("cloneQuestion originals =", originals);
            deleteQuestion( info.row.original.itemId, originals)
          }
        }
        >
          Delete
        </button>
      ),
    },
    {
      id: "clone",
      header: "Clone",
      cell: (info) => (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => {
            const originals = info.table.getRowModel().rows.map((row: any) => row.original);
            console.log("cloneQuestion originals =", originals);
            cloneQuestion(info.row.original.itemId, originals)
          }
          }
        >
          Clone
        </button>
      ),
    },
    {
      id: "create",
      header: "Create",
      cell: (info) => (
        <>
       
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => {
              createQuestion(info.row.original.item_number)
            } 
            
          }
        >
          Create
        </button>
        </>
      ),
    },
  ],
  [] // No dependencies, so the columns are memoized once
);


  const deleteQuiz = async (quiz_id: string) => {
    console.log("deleteQuiz called with quiz_id:", quiz_id);
    const response = await fetch(`${rootUrl}/api/quizzes/${quiz_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  //<Route path="sub_categories/:sub_categoryId/list_questions/:quiz_id/create_question/:format/:last_question_number" element={<QuestionCreator
  const createQuestion = (current_question_id: string) => {
    console.log("createQuestion called with ^^^^^^^^^^^^^^ selectedFormat:", selectedFormat);

    setModalContent(`Creating question with ID: ${current_question_id}`);
    setIsModalVisible(true);

    /*
    //console.log("createQuestion called with question_props:", question_props);
    const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_questions/${params.quiz_id}/create_question/${selectedFormat.current}/${current_question_id}`
   // console.log("createQuestion ******** navigate to url:", url);
    navigate(url)
    */
    
  };

  /*
{
    "categoryId": "10",
    "sub_categoryId": "24",
    "unit_id": "71",
    "quiz_id": "310"
}
  */

/*
            categoryId: string, 
            sub_categoryId: string, 
            unit_id: string, 
            quiz_id: string, 
            format: string, 
            last_question_number: string
*/


  return (
    <>
    <div className='bg-bgColor2 text-textColor2'>Selected fornat: {selectedFormat.current}</div>
    <div className='bg-bgColor2 text-textColor1 p-2 flex flex-row justify-center text-xl mt-3 mb-3'>
    <select
        id="formatDropdown"
        className="bg-bgColor2 border border-gray-300 rounded p-2"
        //value={selectedFormat.current}
        //onChange={(e) => setSelectedFormat(e.target.value)} // Update state on selection
        onChange={(e) => selectedFormat.current = e.target.value} // Update state on selection
      >
        {formatOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    <div className='bg-bgColor2 text-textColor2 mb-5  text-xl'>Quiz id: {quiz?.id}</div>
      <GenericSortableTable 
        input_data={questions} 
        columns={columns} 
        parent_notify_reset_item_numbers={child_reset_item_numbers}
        />
      <div className='bg-bgColor2 text-textColor2 p-3'>

      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <NewQuestion quiz_id={params.quiz_id || ""} content={modalContent || ""} onClose={closeModal} />
        </div>
      )}
      
      </div>
      <Outlet />
    </>
  )
      
}

//categories/4/sub_categories/9/list_quizzes/27/questions/120/edit_question/2492

///categories/10/sub_categories/24/list_quizzes/71/questions/310/sub_categories/24/list_questions/310/create_question/1/1"
// <DataTable columns={columns} data={data} />

/*
  <button
          className="text-textColor1 bg-bgColor1 rounded-lg p-2 m-2"
          onClick={() => {
            setCreateNewQuestion(!createNewQuestion); // Toggle the state
            if (!createNewQuestion) {
              createQuestion(); // Call the createQuestion function
            }
          }}
        >
          {createNewQuestion ? "Cancel" : "Create New Question"}
        </button>
*/

