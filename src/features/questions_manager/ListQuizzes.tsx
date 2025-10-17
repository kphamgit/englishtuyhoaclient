
import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { ColumnDef, SortingState} from '@tanstack/table-core';

import { UnitProps } from './types';
import { CreateQuizProps, NewQuizModalContentProps, QuizCloseModalProps } from './NewQuiz';
import NewQuiz from './NewQuiz';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useRootUrl } from '../../contexts/root_url';

import {useSortable } from '@dnd-kit/sortable';

import GenericSortableTable, { genericItemType } from './GenericSortableTable';
import EditQuiz from './EditQuiz';

export interface EditQuizModalContentProps {
  quiz_id: string;
  quiz_number: number;
}



export interface ShortQuizProps extends genericItemType {
  name?: string;
  video_url?: string;
}



interface CloseModalProps {
  action: "edit" | "new" | "cancel",
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

      const [isModalEditVisible, setIsModalEditVisible] = useState(false); // State for modal visibility
      const [editModalContent, setEditModalContent] = useState<EditQuizModalContentProps | null>(null);
     
      const [isModalNewVisible, setIsModalNewVisible] = useState(false); // State for modal visibility
      const [newModalContent, setNewModalContent] = useState<NewQuizModalContentProps | null>(null);
  

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

const editQuiz = (quiz_id: string, quiz_number: number) => {
  //console.log("createQuestion called with ^^^^^^^^^^^^^^ selectedFormat:", selectedFormat);

  setEditModalContent({ quiz_id: quiz_id, quiz_number: quiz_number });
  setIsModalEditVisible(true);
}

const columns = useMemo<ColumnDef<ShortQuizProps>[]>(
  () => [
    {
      id: "drag-handle",
      header: "Move",
      cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
      size: 60,
    },
    {
      accessorKey: "itemId",
      header: "Id",
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
        <>
       
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => {
              editQuiz(info.row.original.itemId, info.row.original.item_number)
            } 
            
          }
        >
          Edit
        </button>
        </>
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

  const rowDeleted = async (quiz_id: string) => {
    // for the use of originals, see cloneQuestion function
    
    //const updatedQuestions = row.filter(q => q.itemId !== question_id);
    setQuizzes(prev => prev.filter(vs => vs.itemId !== quiz_id));
  };
   
  const closeModal = (params: QuizCloseModalProps) => {
      //console.log("closeModal called with params =", params)
      if (params.action === "cancel") {
        setIsModalNewVisible(false);
        setIsModalEditVisible(false);
        setNewModalContent(null);
        setEditModalContent(null);
        return;
      }
      if (params.action === "edit") {
        // refresh the list of quizzes
        setIsModalEditVisible(false);
        setEditModalContent(null);
        const updatedQuizzes = quizzes.map(q => 
          {
            //console.log("q.itemId =", q.itemId, " editModalContent?.question_id =", editModalContent?.question_id)
          if (q.itemId === editModalContent?.quiz_id) {
            return {
              ...q,
              item_number: params.quiz_number,
              name: params.name || q.name,
              video_url: params.video_url || q.video_url,
            };
          }
          return q;
        }); 
        
       // console.log("updatedQuestions =", updatedQuestions)
        //setQuestions(updatedQuestions);
        setQuizzes(updatedQuizzes.map(q => ({
          ...q,
          item_number: Number(q.item_number),
          name: q.name,
        })));
      }
      if (params.action === "new") {
        // add the new quiz to the list of quizzes
        setIsModalNewVisible(false);
        setNewModalContent(null);
        const new_quiz: ShortQuizProps = {
          itemId: params.id!,
          item_number: Number(params.quiz_number!),
          name: params.name,
          video_url: params.video_url,
        }
        console.log("new_quiz =", new_quiz)
        setQuizzes(prev => [...prev, new_quiz]);
      
      }

     

  }

  return (
    <>
      <GenericSortableTable 
        input_data={quizzes} 
        columns={columns} 
        data_type='quizzes'
        parent_notify_delete_row={rowDeleted}
        />
 
      {isModalEditVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EditQuiz 
           modal_content={editModalContent!} onClose={closeModal} />
        </div>
      )}
      <div className='bg-bgColor2 text-textColor2 p-3 my-3'>
      <button className='bg-bgColor4 text-textColor4 bg-2 rounded-lg w-40 p-2 m-2'
          onClick={() => 
          {
            setNewModalContent({ 
              unitId: params.unitId || '',
            });
            setIsModalNewVisible(true)
          }

          }
        >
          Create New Quiz
        </button>
      {isModalNewVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <NewQuiz
              modal_content={newModalContent!} onClose={closeModal} />
          </div>
        )}
      </div>
    </>
  )
      
}


