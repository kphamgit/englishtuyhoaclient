import { useEffect, useState } from 'react'


import { useNavigate, useParams } from 'react-router-dom';
import { updateUnit } from '../services/list';
import { UnitProps } from './types';
import { useAxiosFetch } from '../../hooks/useAxiosFetch';
import { useRootUrl } from '../../contexts/root_url';


export default function UnitEditor(props: any) {

     
  
        return (
            <div className='bg-bgColor1 text-textColor2'>
                IN UNIT EDITOR
            </div>
            )
}

/*
       return (
            <div className='bg-bgColor1 text-textColor2'>
               <div className='mx-10 text-textColor1 mb-2'>Name
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={name}
                    onChange={e => setName(e.target.value)}></input>
                </div>
    
                <div className='mx-10 text-textColor1 mb-2'>Unit Number
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={unitNumber}
                    onChange={e => setUnitNumber(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Level
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={level}
                    onChange={e => setLevel(e.target.value)}></input>
                </div>
                <div className='flex flex-row justify-start gap-2 mx-14'>
                    <button className='bg-bgColor3 m-3 p-1' onClick={update_unit}>Save unit</button>
                    <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
            )
*/