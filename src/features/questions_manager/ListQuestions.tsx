//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { ColumnDef, createColumnHelper , SortingState} from '@tanstack/table-core';
import { QuizProps } from './types';
import { useRootUrl } from '../../contexts/root_url';

import { useSortable } from '@dnd-kit/sortable';

import GenericSortableTable from './GenericSortableTable';
import { genericItemType } from './ListQuizzes';
import NewQuestion from './NewQuestion';
import EditQuestion from './EditQuestion';
import { a, animate } from 'framer-motion/client';


interface ShortQuestionProps extends genericItemType{
  format: string
  content: string,
  video_segment_id?: string
  answer_key?: string
}

export interface CloseModalProps {
  action: "edit" | "new" | "cancel",
  video_segment_id?: string,
  itemId?: string,
  item_number?: string,
  format?: string,
  content?: string,
  answer_key?: string,
}

/*
  itemId: "new", // temporary id, will be replaced when the page is refreshed
          item_number: new_question_number,
          format: selectedFormat.current,
*/


const formatOptions = [
  { value: "1", label: "Cloze" },
  { value: "2", label: "Button Cloze Select" },
  { value: "3", label: "Button Select" },
  { value: "4", label: "Radio" },
  { value: "5", label: "Checkbox" },
  { value: "6", label: "Word Scramble" },
  { value: "7", label: "Speech Recognition" },
  { value: "8", label: "Word Select" },
  { value: "9", label: "Recording" },
  { value: "10", label: "Drop Down" },
  { value: "11", label: "Letter Cloze" },
];

export interface NewModalContentProps {
  quiz_has_video: boolean;
  format: string;
  quiz_id: string;
  question_number?: string;
}

export interface EditModalContentProps {
  quiz_has_video: boolean;
  question_id: string;
  format: string;
  question_number: string;
  video_segment_id?: string;
}

//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListQuestions(props:any) {
  //<a class="italic text-blue-300" href="/categories/4/sub_categories/9/list_quizzes/27/questions/135">Questions</a>
  const params = useParams<{ categoryId: string, sub_categoryId: string, unit_id: string, quiz_id: string}>();
  //console.log("***************** params = ", params)
  //const url = `units/${params.unit_id}`;
  
  const [questions, setQuestions] = useState<ShortQuestionProps[]>([])
  //const [selectedFormat, setSelectedFormat] = useState<string>("1"); // State for dropdown selection
  const selectedFormat = useRef<string>("1")
  
  const [isModalNewVisible, setIsModalNewVisible] = useState(false); // State for modal visibility
  const [isModalEditVisible, setIsModalEditVisible] = useState(false); // State for modal visibility
  //const [newModalContent, setNewModalContent] = useState<string | null>(null); // State for modal content
  const [newModalContent, setNewModalContent] = useState<NewModalContentProps | null>(null); // State for modal content

  const [editModalContent, setEditModalContent] = useState<EditModalContentProps | null>(null);

  const [isVideoQuiz, setIsVideoQuiz] = useState<boolean>(false);
  

  const formatConversion: { [key: string]: string } = {"1": 'Cloze', "2": "Button Cloze Select", "3": 'Button Select', 
    "4": "Radio ",  "5": "Checkbox", "6": "Word Scramble", "7": "Speech Recognition", "8": "Word Select",
    "9": "Recording", "10": "Drop Down", "11": "Letter Cloze",
}

const { rootUrl } = useRootUrl();

 const url = `/quizzes/${params.quiz_id}/get_questions`
 //const { data: quiz } = useAxiosFetch<QuizProps>({ url: url, method: 'get' })


  useEffect(() => {
    // fetch questions on component load using fetch utility
    fetch(`${rootUrl}/api/quizzes/${params.quiz_id}/get_questions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      //console.log("Fetched questions data = ", data)
      setIsVideoQuiz(!!(data.video_url && data.video_url.length > 0));
      const shortQuestions: ShortQuestionProps[] = data.questions.map(({ id, format, question_number, content, answer_key, videoSegmentId }: any) => {
        return {
          itemId: id,
          item_number: question_number.toString(),
          format: format.toString(),
          content: content || 'content....',
          answer_key: answer_key || '',
          video_segment_id: videoSegmentId?.toString(), // Optional chaining for cleaner code
        };
      });
      setQuestions(shortQuestions);
    })
    .catch(error => {
      console.error("Error fetching questions: ", error);
    });
  }, [params.quiz_id, rootUrl]);

 /*
  useEffect(() => {
      if (quiz && quiz.questions) {
        
        const shortQuestions: ShortQuestionProps[] = quiz.questions.map(({ id, format, question_number, videoSegmentId }) => {
          // Debugging: Log each parameter
          //console.log("Mapping question:", { id, format, question_number, videoSegmentId });
        
          return {
            itemId: id,
            item_number: question_number.toString(),
            format: format.toString(),
            content: "content....",
            video_segment_id: videoSegmentId?.toString(), // Optional chaining for cleaner code
          };
        });
        //console.log("UUUUUUU shortQuestions = ", shortQuestions)
        setQuestions(shortQuestions);
      }
    }, [quiz]);
    */

    const cloneQuestion = async (question_id: string, originals: any) => {
      //console.log("cloneQuestion called with question_id:", question_id);
      const response = await fetch(`${rootUrl}/api/questions/${question_id}/clone`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
       // Remove the deleted segment from local state
      //setQuestions(prev => prev.filter(vs => vs.itemId !== question_id));
      // update the local state with the new cloned question
      const data = await response.json();

      const new_question = data.new_question;
      // add data.new_question to the originals array after the original question
      // REMEMBER, have to use originals, not questions, to update the local state
      const index = originals.findIndex((q : ShortQuestionProps)=> q.itemId === question_id);
      if (index !== -1) {
        const updatedQuestions = [
          ...originals.slice(0, index + 1),
          {
            itemId: new_question.id,
            item_number: new_question.question_number.toString(),
            format: new_question.format.toString(),
            content: new_question.content || 'content....',
          },
          ...originals.slice(index + 1),
        ];
       
        setQuestions(updatedQuestions.map(q => ({
          ...q,
          content: q.content || 'content....', // Ensure content is always a string
        })));
      //
      }
      /*
      setQuestions(prev => [...prev, {
        itemId: data.new_question.id,
        item_number: data.new_question.question_number.toString(),
        format: data.new_question.format.toString(),
        content: data.new_question.content || 'content....',
      }]);
      */

      //return response.json();
    };

    const deleteQuestion = async (question_id: string,  originals: ShortQuestionProps[]) => {
      // for the use of originals, see cloneQuestion function
      //console.log("deleteQuiz called with quiz_id:", question_id);
      
    const response = await fetch(`${rootUrl}/api/questions/${question_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
     // console.log("Successfully deleted question with id:", question_id);
      // Update the local state to remove the deleted question
      const updatedQuestions = originals.filter(q => q.itemId !== question_id);
      setQuestions(updatedQuestions.map(q => ({
        ...q,
        content: q.content || 'content....', // Ensure content is always a string
      })));
    } else {
      console.error("Failed to delete question with id:", question_id);
    }
    return response.json();
    
      
    };

//const { data: unit, loading, error } = useAxiosFetch<UnitProps>({ url: url, method: 'get' })
//console.log("***** quizzes = ", unit?.quizzes)


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

const child_reset_item_numbers = (new_numbers: {itemId: string, item_number: string}[]) => {
  //console.log("test_function called value =", value)
  //console.log("child_reset_item_numbers called new_numbers =", new_numbers)
  // use fetch api to post new_numbers to backend /api/questions/renumber',
  const response = fetch(`${rootUrl}/api/questions/renumber`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_number_pairs: new_numbers }),
  })
  return response;

}
/*
 formatConversion[format]
*/

const columns = useMemo<ColumnDef<ShortQuestionProps>[]>(
  () => [
    {
      id: "drag-handle",
      header: "Move",
      cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
      size: 60,
    },
    {
      accessorKey: "itemId",
      header: "Question ID",
    },
    {
      accessorKey: "item_number",
      header: "Question Number",
      //enableSorting: true, // Enable sorting for this column
    },
    {
      accessorKey: "format",
      header: "Format",
      cell: (info) => (
        <span>{formatConversion[info.getValue() as string]}</span>
       
      ),
    },
    {
      accessorKey: "content",
      header: "Content",
    }, 
    {
      accessorKey: "answer_key",
      header: "Answer Key",
      cell: info => {
        return info.row.original.answer_key || ''
      },
    }, 
    {
      accessorKey: "video_segment_id",
      header: "Video Segment ID",
      cell: info => {
        return info.getValue()
      },
    }, 
    {
      id: "edit",
      header: "Edit",
      cell: (info) => (
        <>
       
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => {
              editQuestion(info.row.original.itemId, info.row.original.item_number)
            } 
            
          }
        >
          Edit
        </button>
        </>
      ),
    },
  
    {
      id: "delete",
      header: "Delete",
      cell: (info) => (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => { 
            const originals = info.table.getRowModel().rows.map((row: any) => row.original);
            //console.log("cloneQuestion originals =", originals);
            deleteQuestion( info.row.original.itemId, originals)
          }
        }
        >
          Delete
        </button>
      ),
    },
    {
      id: "clone",
      header: "Clone",
      cell: (info) => (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => {
            const originals = info.table.getRowModel().rows.map((row: any) => row.original);
            //console.log("cloneQuestion originals =", originals);
            cloneQuestion(info.row.original.itemId, originals)
          }
          }
        >
          Clone
        </button>
      ),
    },
    {
      id: "create",
      header: "Create",
      cell: (info) => (
        <>
       
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => {
              createQuestionFromRow(info.row.original.item_number)
            } 
            
          }
        >
          Create
        </button>
        </>
      ),
    },
  ],
  [] // No dependencies, so the columns are memoized once
);


  const deleteQuiz = async (quiz_id: string) => {
    //("deleteQuiz called with quiz_id:", quiz_id);
    const response = await fetch(`${rootUrl}/api/quizzes/${quiz_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  };

  const closeModal = (params: CloseModalProps) => {
    if (params.action === "cancel") {
      setIsModalEditVisible(false);
      setIsModalNewVisible(false);
      setEditModalContent(null);
      setNewModalContent(null);
      return;
    }

    /*
videoSegmentId?.toString(), content: questionContent, answer_key: answerKey});
    */

    if (isModalEditVisible) {
      //console.log(" closeModal params = ", params)
      setIsModalEditVisible(false);
      setEditModalContent(null);
      //update the questions table to reflect any changes made in the edit modal
      // first, look for the row that was edited
      
      const updatedQuestions = questions.map(q => 
        {
          //console.log("q.itemId =", q.itemId, " editModalContent?.question_id =", editModalContent?.question_id)
        if (q.itemId === editModalContent?.question_id) {
          return {
            ...q,
             video_segment_id: params.video_segment_id,
              content: params.content,
              answer_key: params.answer_key,
          };
        }
        return q;
      }); 
      
     // console.log("updatedQuestions =", updatedQuestions)
      //setQuestions(updatedQuestions);
      setQuestions(updatedQuestions.map(q => ({
        ...q,
        content: q.content || 'content....', // Ensure content is always a string
      })));
     
      return;
    }
    if (isModalNewVisible) {
      //console.log(" closeModalisModalNewVisible TRUE< params = ", params)
      setIsModalNewVisible(false);
      setNewModalContent(null);
      // add a new question to the questions table to reflect any changes made in the new modal
     // if (params.video_segment_id) {
        // only add if there is a video segment id
        //const new_question_number = (questions.length + 1).toString();
        const new_question: ShortQuestionProps = {
          itemId: params.itemId || "temporary_id", // temporary id, will be replaced when the page is refreshed
          item_number: params.item_number || "0", // Default to "0" if undefined
          format: params.format || "1", // Default to "1" if undefined
          content: "content....",
          video_segment_id: params.video_segment_id,
        };
        // use splice method to insert the new question after the position of the current row item number
        const index = questions.findIndex((q) => q.item_number === new_question.item_number);
        //console.log("Inserting new question at index:", index);
        if (index !== -1) {
          const updatedQuestions = [
            ...questions.slice(0, index),
            new_question,
            ...questions.slice(index),
          ];
          setQuestions(updatedQuestions);
        } else {
          setQuestions([...questions, new_question]);
        }
        //setQuestions([...questions, new_question]);
     // }
      setIsModalNewVisible(false);
      setNewModalContent(null);
      return;
    }

    /*
  // Update the local state to remove the deleted question
      const updatedQuestions = originals.filter(q => q.itemId !== question_id);
      setQuestions(updatedQuestions);
    */

 
  };

  //<Route path="sub_categories/:sub_categoryId/list_questions/:quiz_id/create_question/:format/:last_question_number" element={<QuestionCreator
  const createQuestionFromRow = (current_question_number: string) => {
    //console.log("createQuestion called with ^^^^^^^^^^^^^^ selectedFormat:", selectedFormat);

    setNewModalContent({ 
      question_number: (parseInt(current_question_number) + 1).toString(), 
      quiz_has_video: isVideoQuiz,
      format: selectedFormat.current, 
      quiz_id: params.quiz_id || ""});
    
      setIsModalNewVisible(true);
    
  };

  const editQuestion = (current_question_id: string, current_question_number: string) => {
    //console.log("createQuestion called with ^^^^^^^^^^^^^^ selectedFormat:", selectedFormat);

    setEditModalContent({question_id: current_question_id,
        format: selectedFormat.current, 
        question_number: current_question_number, 
        quiz_has_video: isVideoQuiz
      
      });
    setIsModalEditVisible(true);
  }
  /*
{
    "categoryId": "10",
    "sub_categoryId": "24",
    "unit_id": "71",
    "quiz_id": "310"
}
  */

/*
            categoryId: string, 
            sub_categoryId: string, 
            unit_id: string, 
            quiz_id: string, 
            format: string, 
            last_question_number: string
*/


  return (
    <>
   
    <div className='bg-bgColor1 text-textColor1'>Video Quiz? {isVideoQuiz.toString()}</div>
    <div className='bg-bgColor2 text-textColor1 p-2 flex flex-row justify-center text-xl mt-3 mb-3'>
    <select
        id="formatDropdown"
        className="bg-bgColor2 border border-gray-300 rounded p-2"
        //value={selectedFormat.current}
        //onChange={(e) => setSelectedFormat(e.target.value)} // Update state on selection
        onChange={(e) => selectedFormat.current = e.target.value} // Update state on selection
      >
        {formatOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    
      <GenericSortableTable 
        input_data={questions} 
        columns={columns} 
        parent_notify_reset_item_numbers={child_reset_item_numbers}
        />
      <div className='bg-bgColor2 text-textColor2 p-3'>

      {isModalNewVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <NewQuestion 
           modal_content={newModalContent!} onClose={closeModal} />
        </div>
      )}
     
          {isModalEditVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EditQuestion 
           modal_content={editModalContent!} onClose={closeModal} />
        </div>
      )}
      
      </div>
      <div className='bg-bgColor2 text-textColor2 px-5 pb-10 mb-5'>
        <button className='text-textColor1 bg-bgColor1 rounded-lg'
          onClick={() => 
          {
            setNewModalContent({ 
              question_number: (questions.length + 1).toString(),
              quiz_has_video: isVideoQuiz,
              format: selectedFormat.current, 
              quiz_id: params.quiz_id || ""});
            setIsModalNewVisible(true)
          }

          }
        >
          Create New Question
        </button>
        {isModalNewVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <NewQuestion
              modal_content={newModalContent!} onClose={closeModal} />
          </div>
        )}
      </div>
      <Outlet />
    </>
  )
      
}


