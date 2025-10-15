//import { useAxiosFetch } from '../components/services/useAxiosFetch';

//import { QuestionProps } from '../components/Question';
import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { ColumnDef} from '@tanstack/table-core';

import { SubCategoryProps } from './types';
import { CreateQuizProps } from './NewQuiz';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { useRootUrl } from '../../contexts/root_url';

import { useSortable } from '@dnd-kit/sortable';

import GenericSortableTable, { genericItemType } from './GenericSortableTable';

export interface MyNavLinkProps {
  name: string,
  pathname: string
}


export interface ShortUnitProps extends genericItemType {
  name?: string;
  
}

const queryClient = new QueryClient();  

//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListUnits(props:any) {
  const params = useParams<{ categoryId: string, sub_categoryId: string}>();

  const [units, setUnits] = useState<ShortUnitProps[]>([])
 
const { rootUrl } = useRootUrl();

  const [subCategoryLink, setSubCategoryLink] = useState<MyNavLinkProps>();

  const location = useLocation(); // Get the location object
  const queryParams = new URLSearchParams(location.search); // Pars

  //console.log(" List units queryParams = ", queryParams.toString())
  //queryParams =  category=Grammar
  const categoryFilter = queryParams.get('category');
  //console.log(" List units categoryFilter = ", categoryFilter)

  const subCategoryFilter = queryParams.get('sub_category');
 // console.log(" List units subCategoryFilter = ", subCategoryFilter)

const {data: sub_category} = useQuery({
  queryKey: ['sub_category', params.sub_categoryId],
  queryFn: async () => {
    //console.log("Fetching unit data for unit_id:", params.unit_id);
    const url = `${rootUrl}/api/sub_categories/${params.sub_categoryId}`;
    console.log("url =", url)
  
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json() as Promise<SubCategoryProps>;
  },
  //enabled: !!params.unit_id, // Only run the query if unit_id is available
  enabled:  !!params.sub_categoryId, // Only run the query if unit_id is available
  //staleTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 0  // 5 minutes
  // if the query is accessed again within 5 minutes, 
  // it will use the cached data
  // if the query is accessed after 5 minutes, React Query will consider the data to be
  // stale and will refetch it in the background
});

useEffect(() => {
  if (sub_category) {
    //console.log("ListUnits, Unit data:", sub_category);
    setUnits(sub_category.units ? sub_category.units.map(unit => ({
      itemId: unit.id.toString(),
      item_number: unit.unit_number,
      name: unit.name
    })) : []);
    //setSubCategoryLink(`/categories/${params.categoryId}/list_sub_categories`);
    setSubCategoryLink({ name: sub_category.name, pathname: `/${params.categoryId}/list_sub_categories?category=${categoryFilter}` });
 

  }
}, [sub_category]);

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

const columns = useMemo<ColumnDef<ShortUnitProps>[]>(
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
      accessorKey: "itemId",
      header: "Unit ID",
    },
    {
      accessorKey: "item_number",
      header: "Unit Number",
    },
    {
      accessorKey: "quizzes",
      header: "Quizzes",
      cell: (info) =>
        sub_category ? (
          <Link
            className="italic underline text-blue-300"
            to={`${info.row.original.itemId}/list_quizzes?category=${categoryFilter}&sub_category=${sub_category.name}&unit=${info.row.original.name}`}
          >
            Quizzes
          </Link>
        ) : (
          "Loading..."
        ),
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
    
  ],
  [sub_category] // No dependencies, so the columns are memoized once
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

  const rowDeleted = async (quiz_id: string) => {
    // for the use of originals, see cloneQuestion function
    
    //const updatedQuestions = row.filter(q => q.itemId !== question_id);
    setUnits(prev => prev.filter(vs => vs.itemId !== quiz_id));
  };

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
      <Link to="/" className='bg-bgColor2 text-textColor2 text-2xl italic'>Home</Link>
      </div>
      <div className='bg-bgColor2 text-textColor2 flex flex-row justify-start items-center mb-4'>
        <div>
          <Link className='bg-bgColor2 italic underline text-textColor2 text-xl my-4 mx-1' to={subCategoryLink?.pathname || '#'}>
            {` ${categoryFilter}`}
          </Link> {'->'}
        </div>
        <div className='bg-bgColor2 italic text-textColor2 text-xl p-3'>{sub_category?.name}</div>
      </div>
  
      <GenericSortableTable 
        input_data={units} 
        columns={columns} 
        data_type='units'
        />

      <div className='bg-bgColor2 text-textColor2 p-3'>
        <button className='text-textColor1 bg-bgColor1 rounded-lg p-2 m-2'
          onClick={() => setCreateNewQuiz(!createNewQuiz)}
        >
          {createNewQuiz ? 'Cancel' : 'Create New Unit'}
        </button>
       
      </div>
      <Outlet />
    </>
  )
      
}

//
// <DataTable columns={columns} data={data} />
