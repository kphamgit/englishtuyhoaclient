//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { ColumnDef, createColumnHelper, getCoreRowModel, getSortedRowModel , SortingState} from '@tanstack/table-core';
import { flexRender, useReactTable } from '@tanstack/react-table';
import { UnitProps } from './types';
import NewQuiz, { CreateQuizProps } from './NewQuiz';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useRootUrl } from '../../contexts/root_url';

import { arrayMove, useSortable } from '@dnd-kit/sortable';

import GenericSortableTable from './GenericSortableTable';


export type ShortQuizProps = {
  itemId: string;
  name: string;
  quiz_number: string;
  video_url?: string;
}

const queryClient = new QueryClient();  

//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListQuizzes(props:any) {
  const params = useParams<{ categoryId: string, sub_categoryId: string, unit_id: string}>();
  //console.log("***** params = ", params)
  //const url = `units/${params.unit_id}`;
  const [enabledFetchUnit, setEnabledFetchUnit] = useState(true)
  const [quizzes, setQuizzes] = useState<ShortQuizProps[]>([])

const { rootUrl } = useRootUrl();



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

useEffect(() => {
  if (unit) {
    console.log("Unit data updated:", unit);
    /*
[
    {
        "id": 310,
        "name": "Video Quiz",
        "quiz_number": 1,
        "disabled": false,
        "video_url": "https://www.youtube.com/watch?v=wNVL1zNjYf8",
        "unitId": 71
    },
]
    */

    setQuizzes(
      (unit.quizzes || []).map(quiz => ({
        itemId: quiz.id,
        name: quiz.name,
        quiz_number: quiz.quiz_number.toString(),
        video_url: quiz.video_url,
      }))
    );
    
  }
}, [unit]);

//const { data: unit, loading, error } = useAxiosFetch<UnitProps>({ url: url, method: 'get' })
//console.log("***** quizzes = ", unit?.quizzes)

const [createNewQuiz, setCreateNewQuiz] = useState(false)

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

const columns = useMemo<ColumnDef<ShortQuizProps>[]>(
  () => [
    {
      id: "drag-handle",
      header: "Move",
      cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "quiz_number",
      header: "Quiz Number",
    },
    {
      accessorKey: "video_url",
      header: "Video Url",
    },
    {
      id: "edit",
      header: "Edit",
      cell: (info) => (
        <Link className="italic text-blue-300" to={`edit_quiz/${info.row.original.itemId}`}>
          Edit
        </Link>
      ),
    },
    {
      accessorKey: "questions",
      header: "Questions",
      cell: info => (
        <Link className='italic text-blue-300' to={`questions/${info.row.original.itemId}`}>Questions</Link>
      )
    },
    {
      id: "delete",
      header: "Delete",
      cell: (info) => (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => deleteQuiz(info.row.original.itemId)}
        >
          Delete
        </button>
      ),
    },
  ],
  [] // No dependencies, so the columns are memoized once
);

//router.delete("/:id", quizzes.delete);
//https://www.englishtuyhoa.com/categories/4/sub_categories/9/edit_quiz/120

     
     const createQuiz = async ({ name, quiz_number, video_url, unitId, video_segments }: CreateQuizProps) => {
      console.log("createQuiz called with:", { name, quiz_number, video_url, unitId, video_segments });
      //console.log("Quiz Name:", name);
      //console.log("Quiz Number:", quiz_number);
      //console.log("Video URL:", video_url);
      //console.log("Unit ID:", unitId);
      //console.log("Video Segments:", video_segments);
      //${rootUrl}/api/quizzes`
      const response = await fetch(`${rootUrl}/api/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          quiz_number: quiz_number,
          video_url: video_url,
          unitId: unitId,
          video_segments: video_segments
        }),
      });
      return response.json();
  
      // Perform additional logic with the properties
  };

     //const onQuizCreated = async (create_quiz_props : CreateQuizProps) => {
     const onQuizCreated = async ({ name, quiz_number, video_url, unitId, video_segments }: CreateQuizProps) => {
      //console.log("Quiz Name:", name);
      //console.log("Quiz Number:", quiz_number);
      //console.log("Video URL:", video_url);
      //console.log("Unit ID:", unitId);
      //console.log("Video Segments:", video_segments);
      console.log("Calling mutate to create quiz")
      mutate({ name, quiz_number, video_url, unitId, video_segments });
      // Perform additional logic with the properties
  };

  const {mutate} = useMutation({
    mutationFn: createQuiz,
    onSuccess: (data) => {
      console.log("Successfully created quiz:", data);
      // Invalidate and refetch
      console.log("All queries in cache:", queryClient.getQueryCache().getAll());
      console.log("In mutate, Query key:", ['unit', params.unit_id]);
      queryClient.invalidateQueries({ queryKey: ['unit', params.unit_id] });
      setCreateNewQuiz(false)
    },
  
  });

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

                /*
                     useEffect(() => {
                      // Retrieve all rows from the table
                      const rows = table.getRowModel().rows;
                  
                      // Extract the values of the "id" column
                      const idColumnValues = rows.map((row) => row.original.id);
                  
                      console.log("Values of the 'id' column:", idColumnValues);
                      // sent to server to update ids of quizzes in this unit
                    }, [table, sorting]);
                    */

   
  return (
    <>
     <GenericSortableTable quiz_data = {quizzes} renumberedColumnId = "quiz_number" columns={columns} />
     <Outlet />
    </>
  )
      
}

//
// <DataTable columns={columns} data={data} />
