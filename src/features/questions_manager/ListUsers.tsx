import { useEffect, useRef, useState } from 'react'
//import { deleteQuizAttempts, getQuizAttempts } from '../services/list'
import { useAxiosFetch } from '../../hooks'
import DataTable from '../questions_manager/data-table';
import { UserProps } from './types';



interface DataRowProps {
    id: string,
    item_number: string,
    item_name: string,
    edit_link: string,
    clone_button: string,
    delete_button: string,
    extra_link?: string,
    data_type: string
}

export interface ColumnProps { 
    Header: string, accessor: string 
}

//format: string; content: string; answer_key: string;

export default function ListUsers(props: any) {
   // const [key, setKey] = useState(0); // Update key to re-render the component
    //const [users, setUsers] = useState<UsersProps[] | undefined>([])
    
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const checkboxesRef = useRef<HTMLInputElement[] | undefined>([]);
     const [data, setData] = useState<DataRowProps[]>([])
    
     const url = `users`
  const { data: users, loading, error } =
        useAxiosFetch<UserProps[]>({ url: url, method: 'get' })

useEffect(() => {
    //console.log("in useEffect ")
    if (users) {
        //console.log("in useEffect users", users)
            const users_row:DataRowProps[] = users.map((user) => {
                return {id: user.id.toString(), 
                                item_number: "1", 
                                item_name: `${user.user_name}`, 
                                edit_link: `edit_user/${user.id}`, 
                                clone_button: "", 
                                delete_button: "",
                                extra_link: `display_user/${user.id}*Users`,
                                data_type: "user"
                                }
                })
            setData(users_row)
    }
}, [users])

const columns = [
    { Header: 'Id', accessor: 'id' },
    { Header: 'User No.', accessor: 'item_number' },
    { Header: 'User name', accessor: 'item_name' },
    { Header: 'Edit', accessor: 'edit_link' },
    { Header: 'Clone', accessor: 'clone_button' },
    { Header: 'Delete', accessor: 'delete_button' },
    { Header: 'Extra Link', accessor: 'extra_link' },
  ];

    const handleCheckboxChange = (value: string) => {
        setCheckedItems((prevCheckedItems) => {
          if (prevCheckedItems.includes(value)) {
            return prevCheckedItems.filter((item) => item !== value);
          } else {
            return [...prevCheckedItems, value];
          }
        });
      };

    const handleCheckAll = () => {
        if (checkboxesRef.current) {
            const allValues = checkboxesRef.current
                .filter((checkbox) => checkbox !== null)
                .map((checkbox) => checkbox.value);

            if (checkedItems.length === allValues.length) {
                setCheckedItems([]);
            } else {
                setCheckedItems(allValues);
            }
        }
    };

    return (
        <>
      <div className='bg-bgColor2 text-textColor2 p-3'>Units: </div>
        <div className='grid grid-rows-2 bg-bgColor3 text-textColor2'>
        <div className='flex flex-row justify-start'>
          <DataTable columns={columns} data={data} data_type='user' />
        </div>
       </div>
       </>
    )
}