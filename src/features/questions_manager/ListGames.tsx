
import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { ColumnDef, SortingState} from '@tanstack/table-core';

import { UnitProps } from './types';
import NewQuiz, { CreateQuizProps } from './NewQuiz';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useRootUrl } from '../../contexts/root_url';

import {useSortable } from '@dnd-kit/sortable';

import GenericSortableTable, { genericItemType } from './GenericSortableTable';


 interface GameProps extends genericItemType {
  name?: string;
}

const queryClient = new QueryClient();  

//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListGames(props:any) {
  
 
     
  
const { rootUrl } = useRootUrl();

    const [allGames, setAllGames] = useState<any[]>([]);


const {data: games} = useQuery({
  queryKey: ['games'],
  queryFn: async () => {
    //console.log("Fetching unit data for unit_id:", params.unit_id);
    //const url = `${rootUrl}/api/units/${params.unitId}`;   
    const url = `${rootUrl}/api/match_games` 
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json() as Promise<any[]>;
  },
  //enabled: !!params.unit_id, // Only run the query if unit_id is available
  enabled:  true,
  //staleTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 0  // 5 minutes
});

/*
 const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/match_games` 
    const response = await axios.get(url)
    return response.data

   useEffect(() => {
            getAllGamee()
                .then((data) => {
                    //console.log("..xxxxxxx.", data)
                    if (data) {
                      //console.log("mmmmnnnn cccccc ", unit.quizzes)
                      const game_rows: DataRowProps[] | undefined = data?.map((game:any) => {
                          return {
                                id: game.id.toString(), 
                                item_number: game.game_number, 
                                item_name: `${game.name}`, 
                                edit_link: `edit/${game.id}`, 
                                delete_button: "",
                                clone_button: "",
                                }
                      })
                      //console.log(" games rows =", game_rows)
                      setData(game_rows)
                    }
                    //setGames(data)
                    }
                )
                .catch(error =>
                    console.log(error)
                )
        }, [])

*/

useEffect(() => {
  if (games) {
    setAllGames(
      (games).map(game => ({
        itemId: game.id,
        name: game.name,
        item_number: Number(game.game_number),
        
      }))
    );
    // append unit name to current navigation context

  }
}, [games]);

//const { data: unit, loading, error } = useAxiosFetch<UnitProps>({ url: url, method: 'get' })
//console.log("***** quizzes = ", unit?.quizzes


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

const columns = useMemo<ColumnDef<GameProps>[]>(
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
      header: "Game Number",
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
  [] // No dependencies, so the columns are memoized once
);
     
  /*
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
   */

  return (
    <>

      <GenericSortableTable input_data={allGames} columns={columns} />
   
   
    </>
  )
      
}

//
// <DataTable columns={columns} data={data} />
