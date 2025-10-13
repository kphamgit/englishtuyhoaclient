
import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { ColumnDef, SortingState} from '@tanstack/table-core';

import { UnitProps } from './types';
import NewQuiz, { CreateQuizProps } from './NewQuiz';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useRootUrl } from '../../contexts/root_url';

import {useSortable } from '@dnd-kit/sortable';

import GenericSortableTable, { genericItemType } from './GenericSortableTable';


export interface ShortQuizProps extends genericItemType {
  name?: string;
  video_url?: string;
}

const queryClient = new QueryClient();  

//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListQuizzes(props:any) {
  const params = useParams<{ categoryId: string, sub_categoryId: string, unitId: string}>();
  //console.log("in ListQuizzes (*********** params = ", params)
 
  const [quizzes, setQuizzes] = useState<ShortQuizProps[]>([])

     const location = useLocation(); // Get the location object
     const queryParams = new URLSearchParams(location.search); // Pars
     const categoryFilter = queryParams.get('category');
     //console.log("ListQuizzes:  categoryFilter=", categoryFilter);
     const subCategoryFilter = queryParams.get('sub_category');
      //console.log("ListQuizzes:  subCategoryFilter=", subCategoryFilter);
      const unitFilter = queryParams.get('unit');
      //console.log("ListQuizzes:  unitFilter=", unitFilter);

const { rootUrl } = useRootUrl();

  const [unitLink, setUnitLink] = useState<string>('');


    const [subCategoryLink, setSubCategoryLink] = useState<string>();


const {data: unit} = useQuery({
  queryKey: ['unit', params.unitId],
  queryFn: async () => {
    //console.log("Fetching unit data for unit_id:", params.unit_id);
    const url = `${rootUrl}/api/units/${params.unitId}`;
    //console.log("url =", url)
   // console.log("Query key:", ['unit', params.unit_id]);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json() as Promise<UnitProps>;
  },
  //enabled: !!params.unit_id, // Only run the query if unit_id is available
  enabled:  !!params.unitId, // Only run the query if unit_id is available
  //staleTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 0  // 5 minutes
  // if the query is accessed again within 5 minutes, 
  // it will use the cached data
  // if the query is accessed after 5 minutes, React Query will consider the data to be
  // stale and will refetch it in the background
});

useEffect(() => {
  if (unit) {
    //console.log("in ListQuizzes, Unit data:", unit);
    /*
<td class="bg-bgColor2 text-textColor2 px-2 text-lg"><a class="italic text-blue-300"
 href="/categories/1/list_sub_categories/1/list_units/2/list_quizzes/questions/2">Questions</a></td>
    */
    setQuizzes(
      (unit.quizzes || []).map(quiz => ({
        itemId: quiz.id,
        name: quiz.name,
        item_number: Number(quiz.quiz_number),
        video_url: quiz.video_url,
      }))
    );
    // append unit name to current navigation context

  }
}, [unit]);

//const { data: unit, loading, error } = useAxiosFetch<UnitProps>({ url: url, method: 'get' })
//console.log("***** quizzes = ", unit?.quizzes)

const [createNewQuiz, setCreateNewQuiz] = useState(false)

///categories/1/list_sub_categories/1/list_units
 useEffect(() => {
  // Add a custom entry to the history
  if (unit) {
      // set the previous path to the second to last item in history
      setUnitLink(`/${params.categoryId}/list_sub_categories/${params.sub_categoryId}/list_units?category=${categoryFilter}&sub_category=${subCategoryFilter}`);
      setSubCategoryLink(`/${params.categoryId}/list_sub_categories?category=${categoryFilter}`);
     //setPreviousPath(history.length > 1 ? history[history.length - 2] : '/');
  }
}, [location, unit]);

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
      accessorKey: "item_number",
      header: "Quiz Number",
    },
    {
      accessorKey: "video_url",
      header: "Video Url",
    },
 
    {
      accessorKey: "questions",
      header: "Questions",
      cell: info => (
        <Link className='italic underline text-blue-300' to={`${info.row.original.itemId}/list_questions?category=${categoryFilter}&sub_category=${subCategoryFilter}&unit=${unitFilter}`}>Questions</Link>
      )
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
    {
      id: "assign",
      header: "Assign",
      cell: (info) => (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          
            onClick={() => alert(`/sub_categories/${params.sub_categoryId}/take_quiz/${info.row.original.itemId}` + " " + info.row.original.name)}
          
        >
          Assign
        </button>
      ),
    },
    
  ],
  [] // No dependencies, so the columns are memoized once
);
     
     const createQuiz = async ({ name, quiz_number, video_url, unitId, video_segments }: CreateQuizProps) => {
      console.log("createQuiz called with:", { name, quiz_number, video_url, unitId, video_segments });
   
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
      console.log("Calling mutate to create quiz")
      mutate({ name, quiz_number, video_url, unitId, video_segments });
      // Perform additional logic with the properties
  };

  const {mutate} = useMutation({
    mutationFn: createQuiz,
    onSuccess: (data) => {
      console.log("Successfully created quiz:", data);
      // update local state to include the new quiz
      setQuizzes(prev => [...prev, {
        itemId: data.id,
        name: data.name,
        item_number: data.quiz_number.toString(),
        video_url: data.video_url,
      }]);
      // Invalidate and refetch
      console.log("All queries in cache:", queryClient.getQueryCache().getAll());
      console.log("In mutate, Query key:", ['unit', params.unitId]);
      queryClient.invalidateQueries({ queryKey: ['unit', params.unitId] });
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
     // Remove the deleted segment from local state
    setQuizzes(prev => prev.filter(vs => vs.itemId !== quiz_id));
    return response.json();
  };
   
  return (
    <>
     <div className='flex justify-between items-center mb-4'>
      <Link to="/" className='bg-bgColor2 text-textColor2 text-2xl italic'>Home</Link>
      </div>
      <div className='bg-bgColor2 text-textColor2 flex flex-row justify-start items-center mb-4'>
        <div>
          <Link className='bg-bgColor2 italic underline text-textColor2 text-xl my-4 mx-1' to={subCategoryLink || ''}>
            {` ${categoryFilter}`}
          </Link> {'->'}
        </div>
        <div>
          <Link className='bg-bgColor2 italic underline text-textColor2 text-xl my-4 mx-1' to={unitLink}>
            {` ${subCategoryFilter}`}
          </Link> {'->'}
        </div>
        <div className='bg-bgColor2 italic text-textColor2 text-xl p-3'>{unit?.name}</div>
      </div>

      <GenericSortableTable input_data={quizzes} columns={columns} />
      <div className='bg-bgColor2 text-textColor2 p-3'>
        <button className='text-textColor1 bg-bgColor1 rounded-lg p-2 m-2'
          onClick={() => setCreateNewQuiz(!createNewQuiz)}
        >
          {createNewQuiz ? 'Cancel' : 'Create New Quiz'}
        </button>
        {createNewQuiz &&
          <NewQuiz categoryId={params.categoryId || ''} sub_categoryId={params.sub_categoryId || ''} unit_id={params.unitId || ''} parent_func={onQuizCreated} />
        }
      </div>
      <Outlet />
    </>
  )
      
}

//
// <DataTable columns={columns} data={data} />
