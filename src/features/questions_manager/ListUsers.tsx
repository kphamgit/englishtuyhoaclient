import { useEffect, useMemo, useRef, useState } from 'react'
//import { deleteQuizAttempts, getQuizAttempts } from '../services/list'
import { useAxiosFetch } from '../../hooks'
import DataTable from '../questions_manager/data-table';
import { UserProps } from './types';
import { Outlet, useNavigate } from 'react-router-dom';


//import { useTable } from '@tanstack/react-table
import { getCoreRowModel, flexRender,  createColumnHelper, useReactTable} from '@tanstack/react-table'
//import { COLUMNS } from '../questions_manager/columns';


import { DataRowProps } from './types';
import { get } from 'http';
import { col, s } from 'framer-motion/client';
import { useRootUrl } from '../../contexts/root_url';

export interface ColumnProps { 
    Header: string, accessorKey: string 
}

export interface AssignmentProps {
    assignment_number: number;
    message: string;
    quiz_link: string;
    quiz_name: string;
    completed: boolean;
    userId: number;
}
  /*
assignment_number | int          | NO   |     | 1                 |                   |
| message           | varchar(255) | NO   |     |                   |                   |
| quiz_link         | varchar(255) | NO   |     |                   |                   |
| quiz_name         | varchar(255) | NO   |     |                   |                   |
| completed         | tinyint(1)   | NO   |     | 0                 |                   |
| userId      
     */

//format: string; content: string; answer_key: string;
const mockData = [
  {
    "id": 1,
    "name": "User1",
    "email": "kp@gmail.com",
    "phone": "1234567890",
  },
  {
    "id": 2,
    "name": "User2",
    "email": "kp@gmail.com",
    "phone": "1234567890",
  },
  {
    "id": 3,
    "name": "User2",
    "email": "kp@gmail.com",
    "phone": "1234567890",
  },
]

interface MyUserProps {
    id: number;
    user_name: string;
    edit_link: string;
    delete_button: string;
    select: string;
}

export default function ListUsers(props: any) {
   // const [key, setKey] = useState(0); // Update key to re-render the component
    //const [users, setUsers] = useState<UsersProps[] | undefined>([])
    const [disabled, setDisabled] = useState<boolean>(false);
const { rootUrl } = useRootUrl();

  const { data: users, loading, error } =
    useAxiosFetch<UserProps[]>({ url: 'users', method: 'get' })

    const shortUsers: MyUserProps[] = []

    // reduce users to only id, user_name, edit_link, delete_button, select
    useEffect(() => {
    if (users) {
      console.log("users in ListUsers", users)
      users.map((user) => {
        shortUsers?.push({
          id: user.id,
          user_name: user.user_name,
          edit_link: `edit_user/${user.id}`,
          delete_button: "",
          select: ""
        })
      })
    }
  }, [users, shortUsers])

    const [data, setData] = useState(() => [...mockData]); // use spread operator to ensure that
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const [assignmentMessage, setAssignmentMessage] = useState<string>("");
    const [assignmentQuizLink, setAssignmentQuizLink] = useState<string>("");
    const [assignmentQuizName, setAssignmentQuizName] = useState<string>("");

    //console.log("users data in ListUsers", users)
    // convert users to json array of objects 
     const navigate = useNavigate()

     const handleRowSelect = (id: number) => {
      setSelectedRows((prev) =>
        prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
      );
    };
  
    const handleSelectAll = (isChecked: boolean) => {
      if (isChecked) {
        setSelectedRows(data.map((row) => row.id));
      } else {
        setSelectedRows([]);
      }
    };

     const columnHelper = createColumnHelper<any>();

     const user_columns = [
      columnHelper.accessor('id', {
        header: () => <span className='flex items-center'>Id</span>,
        cell: info => info.getValue(),
      }),
  
      columnHelper.accessor('user_name', {
        header: () => <span className='flex items-center'>User Name</span>,
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('edit_link', {
        header: () => <span className='flex items-center'>Edit</span>,
        cell: info => (
          <span className = "italic text-blue-300">{info.getValue()}</span>
        )
      }),
      columnHelper.accessor('delete_button', {
        header: () => <span className='flex items-center'>Delete</span>,
        cell: info => (
          <button className = "italic text-blue-300"
            onClick={() => alert(`Delete user with id ${info.row.original.id} `)}
          >
            Delete
          </button>
        )
      }),
      columnHelper.display({
        id: 'select',
        header: () => (
          <input
            type="checkbox"
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={selectedRows.length === data.length && data.length > 0}
          />
        ),
        cell: (info) => (
          <input
            type="checkbox"
            checked={selectedRows.includes(info.row.original.id)}
            onChange={() => handleRowSelect(info.row.original.id)}
          />
        ),
      }),
    ]

     useEffect(() => {
        console.log("Selected Rows: ", selectedRows)
        // retrieve data for selected rows
        selectedRows.forEach((id) => {
          const rowData = data.find((row) => row.id === id);
          console.log("Row data for id ", id, " is ", rowData)
        }
        )

     }, [selectedRows])

     const table = useReactTable({
      data: users ? users : [],
      columns: user_columns,
     
      getCoreRowModel: getCoreRowModel(),
     })

     /*
assignment_number | int          | NO   |     | 1                 |                   |
| message           | varchar(255) | NO   |     |                   |                   |
| quiz_link         | varchar(255) | NO   |     |                   |                   |
| quiz_name         | varchar(255) | NO   |     |                   |                   |
| completed         | tinyint(1)   | NO   |     | 0                 |                   |
| userId      
     */

  const send_assignments = () => {
        if (selectedRows.length === 0) {
          alert("Select at least one user to send assignment")
          return
        }
        //console.log("Send assignment to user with id ", id)
        fetch(`${rootUrl}/api/assignments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
             user_ids: JSON.stringify(selectedRows),
             message: assignmentMessage, 
             quiz_link: assignmentQuizLink, 
             quiz_name: assignmentQuizName }),
        })
          .then((response) => {
              alert(response.statusText)
              setAssignmentMessage("")
              setAssignmentQuizLink("")
              setAssignmentQuizName("")
              setSelectedRows([])
          })
          .catch((error) => {
          })
      
    }

   
       
            
    return (
      <div className='p-2'>
        <div className='flex flex-col justify-start text-textColor1 bg-bgColor1 mx-3 p-1 text-lg'>
          <label className='mx-2'>Message: </label>
          <input className='message bg-bgColor2' type="text" placeholder='Type your message here'
          onChange={(e) => setAssignmentMessage(e.target.value)}
          value={assignmentMessage}
          />
           <label className='mx-2'>Quiz link: </label>
          <input className='message bg-bgColor2' type="text" placeholder='Quiz link'
          onChange={(e) => setAssignmentQuizLink(e.target.value)}
          value={assignmentQuizLink}
          />
               <label className='mx-2'>Quiz name: </label>
          <input className='message bg-bgColor2' type="text" placeholder='Quiz name'
          onChange={(e) => setAssignmentQuizName(e.target.value)}
          value={assignmentQuizName}
          />
          <button  className='bg-bgColor3 mt-5'
          onClick={send_assignments}
          >
          Send message to selected Users
        </button>
        </div>
        <div className='text-textColor1 p-2 flex flex-row justify-center text-xl mt-3 mb-3'>
          <table className='table-auto border-separate border border-slate-400 ...'>
            <thead className='bg-bgColor3 text-textColor1'>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='border border-slate-300 p-2'>
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className='bg-bgColor1 text-textColor2'>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className='border border-slate-300 p-2'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      
      </div>
    );

  }
   