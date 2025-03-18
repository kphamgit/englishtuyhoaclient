import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export function Utils(props: any) {
    

    return (
        <>
            <div className='flex flex-row justify-around text-textColor1 bg-bgColor1'>
            <div className='text-textColor1 bg-bgColor1 p-2 flex flex-row justify-start'>
                <NavLink
                    to={`/utils/manage_quiz_attempts`}
                >
                    Manage Quiz Attempts
                </NavLink>
            </div>
            <div className='text-textColor1 bg-bgColor1 p-2'>
                <NavLink
                    to={`/utils/manage_s3_objects`}
                >
                    Manage Objects
                </NavLink>
            </div>
            <div className='text-textColor1 bg-bgColor1 p-2'>
                <NavLink
                    to={`/utils/upload_file`}
                >
                    File Upload
                </NavLink>
            </div>
            <div className='text-textColor1 bg-bgColor1 p-2'>
                <NavLink
                    to={`/utils/list_games`}
                >
                    Manage Games
                </NavLink>
            </div>
            <div className='text-textColor1 bg-bgColor1 p-2'>
                <NavLink
                    to={`/utils/manage_users`}
                >
                    Manage Users
                </NavLink>
            </div>
            <div className='text-textColor1 bg-bgColor1 p-2'>
                <NavLink
                    to={`/utils/manage_orphan_questions`}
                >
                    Manage Orphan Questions
                </NavLink>
            </div>
            </div>
            <Outlet />
        </>
    )


}

/*
  return (
        <>
            <div>UTILS</div>
            <div className='text-textColor1 bg-bgColor1 p-2'>
               <NavLink
                    to={`/utils/manage_quiz_attempts`}
                  >
                    Manage Quiz Attempts
                </NavLink>
                </div>
            <Outlet />
        </>
    )
*/