import {useState, useEffect, useImperativeHandle} from 'react'

export interface EditButtonClozeComponentProps {
    //define the props that you want to pass to the child component
    ref: React.Ref<EditButtonClozeRef>; // use this to access the child component handle
    button_cloze_choices?: string; // optional prop to initialize choices
    question_content: string;
    set_answer_key: (answer_string: string) => void;
}

export interface EditButtonClozeRef {
    //declare or type the child component handle
    getChoices: () => {};  // return a string separated by slashes
  }

const EditButtonCloze: React.FC<EditButtonClozeComponentProps> = ({ question_content, set_answer_key, button_cloze_choices, ref }) => {
     const [questionContent, setQuestionContent] = useState("")
    const [choices, setChoices] = useState<string>('')
      
    useEffect(() => {
        if (button_cloze_choices) {
            setChoices(button_cloze_choices);
        }
        if (question_content) {
            setQuestionContent(question_content);
        }
    }, [button_cloze_choices, question_content]);

    const getChoices = () => {
        if (choices) {
           return choices
        } else {
            return ''
        }
    }

    useImperativeHandle(ref, () => ({
      getChoices,
  }));

  const getAnswerKey = () => {
    // 
    // use regular expression to extract the answer key inside the square brackets from question_content
    const regex = /\[(.*?)\]/g;
    console.log("question_content = ", questionContent)
    const matches = questionContent.match(regex);
    if (matches && matches.length > 0) {
       // remove the square brackets from the matches
        const answerKey = matches.map(match => match.replace(/[\[\]]/g, '')).join('/');
        set_answer_key(answerKey)
        // also set the choices state
        setChoices(answerKey);
    }
}
    return (
        <div className='mx-14'>
        <div className='mx-20 my-3 text-textColor1 pb-10'><span>&nbsp;<button className='bg-bgColor4 p-1' onClick={getAnswerKey}>Get Answer Key</button></span></div>
        <div>
          <div className='bg-bgColor2 text-textColor3 mb-3 mt-5'>Choices (separated by slashes)</div>
        <input className='bg-bgColor4 text-textColor4 m-2 p-2 mb-10' type="text"
                value={choices}
                onChange={e => setChoices(e.target.value)}
                size={70}
                placeholder="choice1/choice2"
        />
        </div>
        </div>
    )
}

export default EditButtonCloze;
