import { forwardRef, useState, useImperativeHandle, useEffect} from 'react'
import { Radio } from "flowbite-react";
import { RadioComponentHandle, RadioComponentProps } from './types';
//import { NewQuestion } from './NewQuestion';

/*
export interface RadioProps {
    id: number
    choice_1_text: string
    choice_2_text: string
    choice_3_text: string
    choice_4_text: string
    selected: string
    questionId: number
  }
*/

 
  
    //const EditRadio= forwardRef(function NewRadio({radio_data: RadioProps}, ref) {
     
    export const EditRadio = forwardRef<RadioComponentHandle, RadioComponentProps>((props, ref) => {
    
        const [choice1Text, setChoice1Text] = useState('')
        const [choice2Text, setChoice2Text] = useState('')
        const [choice3Text, setChoice3Text] = useState('')
        const [choice4Text, setChoice4Text] = useState('')

    const handleChange = (value: any) => {
        //console.log("in handlChange")
        //setAnswerKey(value)
        props.set_radio_answer_key(value)
    }
    /*
        useImperativeHandle defines the functions that you want to expose to the parent, in this case, QuestionEditor.
    */
    useImperativeHandle(ref, () => ({
        //define child component handle functions to be called by parent component
        getRadioTexts(base_params:any) {
            const my_params = {
                choice_1_text: choice1Text,
                choice_2_text: choice2Text,
                choice_3_text: choice3Text,
                choice_4_text: choice4Text,
            }
            //return {...base_params, ...my_params}
            return my_params
        }
      }));

    useEffect(() => {
     
      setChoice1Text(props.radio_data.choice_1_text)
      setChoice2Text(props.radio_data.choice_2_text)
      setChoice3Text(props.radio_data.choice_3_text)
      setChoice4Text(props.radio_data.choice_4_text)
    },[props.radio_data])

    return (
        <>
        <div className='mx-12 my-10'>
    <fieldset className="flex max-w-md flex-col gap-4">
      <legend className="mb-4">Choose your favorite country</legend>
      <div className="flex items-center gap-2">
        { props.answer_key === "choice1" 
            ?
            <Radio onChange={e => handleChange(e.target.value)} id="choice1" name="choices" value="choice1" defaultChecked />
            :
            <Radio onChange={e => handleChange(e.target.value)} id="choice1" name="choices" value="choice1" />
        }
    
        <input type='text' value={choice1Text}  onChange={e => setChoice1Text(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
      { props.answer_key === "choice2" 
            ?
            <Radio onChange={e => handleChange(e.target.value)} id="choice2" name="choices" value="choice2" defaultChecked />
            :
            <Radio onChange={e => handleChange(e.target.value)} id="choice2" name="choices" value="choice2" />
        }
        <input type='text' value={choice2Text}  onChange={e => setChoice2Text(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
      { props.answer_key === "choice3" 
            ?
            <Radio onChange={e => handleChange(e.target.value)} id="choice3" name="choices" value="choice3" defaultChecked />
            :
            <Radio onChange={e => handleChange(e.target.value)} id="choice3" name="choices" value="choice3" />
        }
        <input type='text' value={choice3Text}  onChange={e => setChoice3Text(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
      { props.answer_key === "choice4" 
            ?
            <Radio onChange={e => handleChange(e.target.value)} id="choice4" name="choices" value="choice4" defaultChecked />
            :
            <Radio onChange={e => handleChange(e.target.value)} id="choice4" name="choices" value="choice4" />
        }
        <input type='text' value={choice4Text}  onChange={e => setChoice4Text(e.target.value)} />
      </div>
    </fieldset>
    </div>
        </>
    )
})

export default EditRadio