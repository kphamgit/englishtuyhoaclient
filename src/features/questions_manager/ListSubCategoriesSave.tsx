//import { QuestionProps } from '../components/Question';
import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { ColumnDef} from '@tanstack/table-core';
import { CategoryProps} from './types';
import { CreateQuizProps } from './NewQuiz';
import { useQuery } from '@tanstack/react-query';
import { useRootUrl } from '../../contexts/root_url';

import { useSortable } from '@dnd-kit/sortable';

import GenericSortableTable, { genericItemType } from './GenericSortableTable';



interface ShortSubCategoriesProps extends genericItemType {
  name?: string;
  
}


//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListSubCategoriesSave(props:any) {
  const params = useParams<{ categoryId: string}>();
  //console.log("***** params = ", params)
  //const url = `units/${params.unit_id}`;
  //const [quizzes, setQuizzes] = useState<ShortQuizProps[]>([])
  const [subCategories, setSubCategories] = useState<ShortSubCategoriesProps[]>([])
  
  
const { rootUrl } = useRootUrl();

const {data: category} = useQuery({
  queryKey: ['category', params.categoryId],
  queryFn: async () => {
    //console.log("Fetching unit data for unit_id:", params.unit_id);
    const url = `${rootUrl}/api/categories/${params.categoryId}`;
    console.log("url =", url)
  
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json() as Promise<CategoryProps>;
  },
  //enabled: !!params.unit_id, // Only run the query if unit_id is available
  enabled:  !!params.categoryId, // Only run the query if unit_id is available
  //staleTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 0  // 5 minutes
  // if the query is accessed again within 5 minutes, 
  // it will use the cached data
  // if the query is accessed after 5 minutes, React Query will consider the data to be
  // stale and will refetch it in the background
});

useEffect(() => {
  if (category) {
    //console.log("ListUnits, Unit data:", sub_category);
    setSubCategories(category.sub_categories ? category.sub_categories.map(sub => ({
      itemId: sub.id.toString(),
      item_number: sub.sub_category_number,
      name: sub.name
    })) : []);
    //console.log("current path = ", location.pathname);
   
    
  }
}, [category]);


//const { data: unit, loading, error } = useAxiosFetch<UnitProps>({ url: url, method: 'get' })
//console.log("***** quizzes = ", unit?.quizzes)

const [createNewQuiz, setCreateNewQuiz] = useState(false)

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

const columns = useMemo<ColumnDef<ShortSubCategoriesProps>[]>(
  () => [
    {
      id: "drag-handle",
      header: "Move",
      cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
      size: 60,
    },
    {
      accessorKey: "itemId",
      header: "Sub Category ID",
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) =>
        category ? (
          <Link
            className="italic underline text-blue-300"
            to={`${info.row.original.itemId}/list_units?category=${category.name}&sub_category=${info.row.original.name}`}
          >
            {info.row.original.name}
          </Link>
        ) : (
          "Loading..."
        ),
    },
  
    {
      accessorKey: "item_number",
      header: "Sub Category Number",
    },
    {
      id: "edit",
      header: "Edit",
      cell: (info) => (
        <Link className="italic text-blue-300" to={`edit_sub_category/${info.row.original.itemId}`}>
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
          onClick={() => deleteUnit(info.row.original.itemId)}
        >
          Delete
        </button>
      ),
    },
    
  ],
  [category] // No dependencies, so the columns are memoized once
);
//https://www.englishtuyhoa.com/categories/4/sub_categories/9/list_quizzes/27/questions/120

/*
App.tsx:90 No routes matched location "/categories/1/sub_categories/3/quizzes/7"
*/

//router.delete("/:id", quizzes.delete);
//https://www.englishtuyhoa.com/categories/4/sub_categories/9/edit_quiz/120

     
     const createUnit = async ({ name, quiz_number, video_url, unitId, video_segments }: CreateQuizProps) => {
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

    

  const deleteUnit = async (unit_id: string) => {
    console.log("deleteQuiz called with quiz_id:", unit_id);
    /*
    const response = await fetch(`${rootUrl}/api/quizzes/${quiz_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
     // Remove the deleted segment from local state
    setQuizzes(prev => prev.filter(vs => vs.itemId !== quiz_id));
    return response.json();
    */
  };

  const child_reset_item_numbers = (new_numbers: {itemId: string, item_number: number}[]) => {
    //console.log("test_function called value =", value)
    //console.log("child_reset_item_numbers called new_numbers =", new_numbers)
    // use fetch api to post new_numbers to backend /api/questions/renumber',
    const response = fetch(`${rootUrl}/api/sub_categories/renumber`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_number_pairs: new_numbers }),
    })
    return response;
  
  }

  return (
    <>
    <div className='flex justify-between items-center mb-4'>
      <Link to="/" className='bg-bgColor2 text-textColor2 text-2xl italic'>Home</Link>
      </div>
    <div className='bg-bgColor2 text-textColor2 text-xl px-10 py-5'>{category?.name}</div>
   
      <GenericSortableTable input_data={subCategories} columns={columns} parent_notify_reset_item_numbers={child_reset_item_numbers} />
      <div className='bg-bgColor2 text-textColor2 p-3'>
        <button className='text-textColor1 bg-bgColor1 rounded-lg p-2 m-2'
          onClick={() => setCreateNewQuiz(!createNewQuiz)}
        >
          {createNewQuiz ? 'Cancel' : 'Create New Quiz'}
        </button>
       
      </div>
      <Outlet />
    </>
  )
      
}

//
// <DataTable columns={columns} data={data} />
