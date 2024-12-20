import { forwardRef, useState, useImperativeHandle, useEffect} from 'react'
import { Radio } from "flowbite-react";
import { WordScrambleComponentHandle } from './types';
//import { NewQuestion } from './NewQuestion';


/*
export interface EditWordScrambleComponentProps {
    direction: string
  }
*/
    export const NewWordScramble = forwardRef<WordScrambleComponentHandle, any>((props, ref) => {
          const [direction, setDirection] = useState<string>('')
    

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setDirection(event.target.value);
    }
    
    //useEffect(() => {
     //   setDirection(props.direction)
    //}, [props])
    /*
        useImperativeHandle defines the functions that you want to expose to the parent, in this case, QuestionEditor.
    */
    useImperativeHandle(ref, () => ({
        //define child component handle functions to be called by parent component
        getDirection() {
            return direction
        }
      }));

    return (
        <>
        <div className='mx-12 my-10'>
        <div>
                        <select value={direction} onChange={handleChange}>
                            <option value="x" >x</option>
                            <option value="y">y</option>
                        </select>
                    </div>
    </div>
        </>
    )
})

export default NewWordScramble