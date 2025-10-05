//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { ColumnDef, createColumnHelper, getCoreRowModel, getSortedRowModel , SortingState} from '@tanstack/table-core';
import { flexRender, useReactTable } from '@tanstack/react-table';
import { QuizProps, UnitProps } from './types';
import NewQuiz, { CreateQuizProps } from './NewQuiz';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useRootUrl } from '../../contexts/root_url';

import { arrayMove, useSortable } from '@dnd-kit/sortable';

import GenericSortableTable from './GenericSortableTable';
import { genericItemType } from './ListQuizzes';
import QuestionCreator from './QuestionCreator';
import NewQuestion, { NewQuestionProps } from './NewQuestion';
import { create } from 'domain';


interface ShortQuestionProps extends genericItemType{
  format: string
  content: string,
  video_segment_id?: string
}

const queryClient = new QueryClient();  

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

    const cloneQuestion = async (question_id: string) => {
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
      console.log("&&&&&&& cloneQuestion newQuestion =", data)
      
      setQuestions(prev => [...prev, {
        itemId: data.new_question.id,
        item_number: data.new_question.question_number.toString(),
        format: data.new_question.format.toString(),
        content: data.new_question.content || 'content....',
      }]);
      
      //return response.json();
    };

    const deleteQuestion = async (question_id: string) => {
      console.log("deleteQuiz called with quiz_id:", question_id);
      
      const response = await fetch(`${rootUrl}/api/questions/${question_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
       // Remove the deleted segment from local state
      setQuestions(prev => prev.filter(vs => vs.itemId !== question_id));
      console.log("%%%%%%% deleteQuestion response =", response)
      return response.json();
      
    };
/*
const {data: unit} = useQuery({
  queryKey: ['unit', params.unit_id],
  queryFn: async () => {
    console.log("Fetching unit data for unit_id:", params.unit_id);
    const url = `${rootUrl}/api/units/${params.unit_id}`;
    //console.log("url =", url)
    console.log("Query key:", ['unit', params.unit_id]);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json() as Promise<UnitProps>;
  },
  //enabled: !!params.unit_id, // Only run the query if unit_id is available
  enabled:  !!params.unit_id, // Only run the query if unit_id is available
  //staleTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 0  // 5 minutes
  // if the query is accessed again within 5 minutes, 
  // it will use the cached data
  // if the query is accessed after 5 minutes, React Query will consider the data to be
  // stale and will refetch it in the background
});
*/



//const { data: unit, loading, error } = useAxiosFetch<UnitProps>({ url: url, method: 'get' })
//console.log("***** quizzes = ", unit?.quizzes)

const [createNewQuestion, setCreateNewQuestion] = useState(false)

const [sorting, setSorting] = useState<SortingState>([]);

 const columnHelper = createColumnHelper<any>();

 /*
const columns = [
  columnHelper.accessor('id', {
    header: () => <span className='flex items-center'>Id</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: () => <span className='flex items-center'>Name</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('quiz_number', {
    header: () => <span className='flex items-center'>Quiz Number</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('video_url', {
    header: () => <span className='flex items-center'>Video URL</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('edit', {
    header: () => <span className='flex items-center'>Edit</span>,
    cell: info => (
      <Link className='italic text-blue-300' to={`edit_quiz/${info.row.original.id}`}>Edit</Link>
    )
  }),
  columnHelper.accessor('delete', {
    header: () => <span className='flex items-center'>Delete</span>,
    cell: info => (
      <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
      onClick={() => deleteQuiz(info.row.original.id)}
    >
      Delete
    </button>
    )
  }),
  columnHelper.accessor('questions', {
    header: () => <span className='flex items-center'>Questions</span>,
    cell: info => (
      <Link className='italic text-blue-300' to={`questions/${info.row.original.id}`}>Questions</Link>
    )
  }),
  columnHelper.accessor('assign', {
    header: () => <span className='flex items-center'></span>,
    cell: info => (
      <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
      onClick={() => alert(`/sub_categories/${params.sub_categoryId}/take_quiz/${info.row.original.id}` + " " + info.row.original.name)}
    >
      Assign
    </button>
    )
  }),
 
]
*/

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
    body: JSON.stringify({ new_numbers: new_numbers }),
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
          onClick={() => deleteQuestion(info.row.original.itemId)}
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
          onClick={() => cloneQuestion(info.row.original.itemId)}
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

/*
columnHelper.accessor('update_row', {
    header: () => <span className='flex items-center'></span>,
    cell: ({ row }) => (
      <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
      onClick={(e) => {
        // Trigger the onBlur event for the input field
        //console.log(" inputElement exists, onBlur triggered", row.original)
        //console.log(" event target", e.target)
        updateVideoSegment(row.original, e)
      }}
    >
      { row.original.id ? 'Update' : 'Save' }
    </button>
    ),
  }),
*/   

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

  //<Route path="sub_categories/:sub_categoryId/list_questions/:quiz_id/create_question/:format/:last_question_number" element={<QuestionCreator
  const createQuestion = (current_question_id: string) => {
    console.log("createQuestion called with ^^^^^^^^^^^^^^ selectedFormat:", selectedFormat);
    //console.log("createQuestion called with question_props:", question_props);
    const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_questions/${params.quiz_id}/create_question/${selectedFormat.current}/${current_question_id}`
   // console.log("createQuestion ******** navigate to url:", url);
    navigate(url)
    //return response.json();
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

