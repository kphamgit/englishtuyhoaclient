//import { useAxiosFetch } from '../components/services/useAxiosFetch';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link} from 'react-router-dom';
import { ColumnDef} from '@tanstack/table-core';
import { CategoryProps} from './types';
import { CreateQuizProps } from './NewQuiz';
import {  useQuery } from '@tanstack/react-query';
import { useRootUrl } from '../../contexts/root_url';

import { arrayMove, useSortable } from '@dnd-kit/sortable';

import GenericSortableTable, { genericItemType } from './GenericSortableTable';

export interface ShortCategoryProps extends genericItemType {
 
  name?: string;
}


//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListCagegories(props:any) {
  
  //console.log("***** params = ", params)
  //const url = `units/${params.unit_id}`;

  //const [quizzes, setQuizzes] = useState<ShortQuizProps[]>([])
  //const [units, setUnits] = useState<ShortUnitProps[]>([])
  const [categories, setCategories] = useState<ShortCategoryProps[]>([])

const { rootUrl } = useRootUrl();
//

const {data: my_categories} = useQuery({
  queryKey: ['categories'],
  queryFn: async () => {
    //console.log("Fetching unit data for unit_id:", params.unit_id);
    const url = `${rootUrl}/api/categories`;
 
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json() as Promise<CategoryProps[]>;
  },
  //enabled: !!params.unit_id, // Only run the query if unit_id is available
  enabled:  true, // Only run the query if unit_id is available
  //staleTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 0  // 5 minutes
  // if the query is accessed again within 5 minutes, 
  // it will use the cached data
  // if the query is accessed after 5 minutes, React Query will consider the data to be
  // stale and will refetch it in the background
});


useEffect(() => {
  if (my_categories) {
    //console.log(" ListCategories:  data:", my_categories);
    setCategories(my_categories.map(cat => ({
      itemId: cat.id,
      item_number: cat.category_number,
      name: cat.name
    }))
    )
    //setUnits(unit.units || [])
    
  }
}, [my_categories]);

//const { data: unit, loading, error } = useAxiosFetch<UnitProps>({ url: url, method: 'get' })
//console.log("***** quizzes = ", unit?.quizzes)

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

const columns = useMemo<ColumnDef<ShortCategoryProps>[]>(
  () => [
    {
      id: "drag-handle",
      header: "Move",
      cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
      size: 60,
    },
    {
      accessorKey: "itemId",
      header: "Category ID",
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: info => (
        <Link className='italic underline text-blue-300' to={`/${info.row.original.itemId}/list_sub_categories?category_name=${info.row.original.name}`}>{info.row.original.name}</Link>
      )
    },
  
    {
      accessorKey: "item_number",
      header: "Category Number",
      enableSorting: true
    },
    {
      id: "edit",
      header: "Edit",
      cell: (info) => (
        <Link className="italic text-blue-300" to={`edit_category/${info.row.original.itemId}`}>
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
  [] // No dependencies, so the columns are memoized once
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
    const response = fetch(`${rootUrl}/api/categories/renumber`, {
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
    
    <Link to ="/" className='bg-bgColor2 text-textColor2 text-2xl italic'>Home</Link>

      <GenericSortableTable input_data={categories || []} columns={columns} parent_notify_reset_item_numbers={child_reset_item_numbers} />
      <div className='bg-bgColor2 text-textColor2 p-3'>
     
       
      </div>
      
    </>
  )
      
}

//
// <DataTable columns={columns} data={data} />
