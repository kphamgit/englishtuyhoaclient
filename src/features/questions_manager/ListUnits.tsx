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
import NewUnit from './NewUnit';
import EditUnit from './EditUnit';

export interface MyNavLinkProps {
  name: string,
  pathname: string
}

export interface NewUnitModalContentProps {
  subCategoryId: string;
}

export interface EditUnitModalContentProps {
  unit_id: string;
  unit_number: number;
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

 
      const [isModalEditVisible, setIsModalEditVisible] = useState(false); // State for modal visibility
        const [editModalContent, setEditModalContent] = useState<any | null>(null);
       
  const [isModalNewVisible, setIsModalNewVisible] = useState(false); // State for modal visibility
   const [newModalContent, setNewModalContent] = useState<NewUnitModalContentProps | null>(null);

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

const [createNewUnit, setCreateNewUnit] = useState(false)

const editUnit = (unit_id: string, unit_number: number) => {
  //console.log("createQuestion called with ^^^^^^^^^^^^^^ selectedFormat:", selectedFormat);

  setEditModalContent({ unit_id: unit_id, unit_number: unit_number });
  setIsModalEditVisible(true);
}

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
        <>
       
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => {
            console.log("Edit unit:", info.row.original.itemId, info.row.original.item_number);
              editUnit(info.row.original.itemId, info.row.original.item_number)
            } 
            
          }
        >
          Edit
        </button>
        </>
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

     
    
  const rowDeleted = async (unit_id: string) => {
    // for the use of originals, see cloneQuestion function
    
    //const updatedQuestions = row.filter(q => q.itemId !== question_id);
    setUnits(prev => prev.filter(vs => vs.itemId !== unit_id));
  };

 const closeModal = (params: any) => {
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
    const updatedUnits = units.map(q => 
      {
        //console.log("q.itemId =", q.itemId, " editModalContent?.question_id =", editModalContent?.question_id)
      if (q.itemId === editModalContent?.unit_id) {
        return {
          ...q,
          item_number: params.unit_number,
          name: params.name || q.name,
        };
      }
      return q;
    }); 
    
   // console.log("updatedQuestions =", updatedQuestions)
    //setQuestions(updatedQuestions);
    setUnits(updatedUnits.map(q => ({
      ...q,
      item_number: Number(q.item_number),
      name: q.name,
    })));
  }

  if (params.action === "new") {
    // add the new quiz to the list of quizzes
    setIsModalNewVisible(false);
    setNewModalContent(null);
    const new_unit: any = {
      itemId: params.id!,
      item_number: Number(params.unit_number!),
      name: params.name,
    }
    //console.log("new_unit =", new_unit)
    setUnits(prev => [...prev, new_unit]);
  
  }

  /*
      //console.log("closeModal called with params =", params)
    
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
  
      */
  }


  
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
        parent_notify_delete_row={rowDeleted}
        />

      {isModalEditVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EditUnit 
           modal_content={editModalContent!} onClose={closeModal} />
        </div>
      )}

      <div className='bg-bgColor2 text-textColor2 p-3'>
      <button className='bg-bgColor4 text-textColor4 bg-2 rounded-lg w-40 p-2 m-2'
          onClick={() => 
          {
            setNewModalContent({ 
              subCategoryId: params.sub_categoryId || '',
            });
            setIsModalNewVisible(true)
          }

          }
        >
          Create New Unit
        </button>
        {isModalNewVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <NewUnit
              modal_content={newModalContent!} onClose={closeModal} />
          </div>
        )}
      </div>
      <Outlet />
    </>
  )
      
}

/*
    <div className='bg-bgColor2 text-textColor2 p-3'>
        <button className='text-textColor1 bg-bgColor1 rounded-lg p-2 m-2'
          onClick={() => setCreateNewUnit(!createNewUnit)}
        >
          {createNewUnit ? 'Cancel' : 'Create New Unit'}
        </button>
       
      </div>
*/

// <DataTable columns={columns} data={data} />
/*
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
*/

