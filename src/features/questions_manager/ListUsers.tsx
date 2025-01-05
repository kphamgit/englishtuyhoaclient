//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { useEffect, useState } from 'react';
//import { cloneQuestion, deleteQuestion } from '../services/list';
//import Table from '../components/data-table_old';
//import { renumberQuestions } from '../services/list';
import DataTable from './data-table';
import { DataRowProps, QuestionProps, UnitProps } from './types';
import { Link, Outlet, useParams } from 'react-router-dom';
import { getAllGamee } from '../../services/list';

/*
interface QuizProps {
    id: string;
    name: string;
    quiz_number: string;
    disabled: boolean;
    video_url: string | undefined;
    unitId: string;
    questions: QuestionProps[]
  }
*/
  
//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListUsers(props:any) {
    
        const [data, setData] = useState<DataRowProps[]| undefined>([])
        const [games, setGames] = useState([])
        const params = useParams<{ categoryId: string, sub_categoryId: string, unit_id: string}>();
        //const [newQuestionFormat, setNewQuestionFormat] = useState('1')
        /*
 user_name | varchar(255) | YES  |     | NULL    |                |
| full_name | varchar(255) | YES  |     | NULL    |                |
| role      | varchar(255) | NO   |     | NULL    |                |
| level     | varchar(255) | NO   |     | NULL    |                |
| message   | text         | YES  |     | NULL    |                |
| password  | varchar(64)  | YES  |     | NULL    |                |
| classId  
        */
        //const url = `match_games`

          const columns = [
            { Header: 'Id', accessor: 'id' },
            { Header: 'Game No.', accessor: 'item_number' },
            { Header: 'Game Name', accessor: 'item_name' },
            { Header: 'Edit', accessor: 'edit_link' },
            { Header: 'Clone', accessor: 'clone_button' },
            { Header: 'Delete', accessor: 'delete_button' },
          ];
      
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

        return (
          <>
           <div className='flex flex-row justify-center text-xl bg-bgColor1 text-textColor2 p-2'>Games</div>
            <div className='flex flex-row  bg-bgColor1 justify-start'>
            <div><DataTable columns={columns} data={data} data_type="users" /></div>
            <div className='bg-bgColor1 text-textColor1 mb-10'>
            <Link 
                    to={`/new_game`}
                  >
                    New Game
                </Link>
                </div>
            </div>
            </>
          );
}

// <DataTable columns={columns} data={data} />
