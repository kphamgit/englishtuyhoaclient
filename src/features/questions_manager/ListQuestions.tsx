//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { ColumnDef} from '@tanstack/table-core';

import { useRootUrl } from '../../contexts/root_url';

import { useSortable } from '@dnd-kit/sortable';

import GenericSortableTable, { genericItemType } from './GenericSortableTable';

import NewQuestion from './NewQuestion';
import EditQuestion from './EditQuestion';
import { YouTubePlayerRef } from '../components/YoutubeVideoPlayer';
import { u, video } from 'framer-motion/client';
import { stringify } from 'querystring';

interface ShortQuestionProps extends genericItemType {
  format: string
  content: string,
  videoSegmentId?: string
  video_segment_number?: number
  answer_key?: string
}

export interface CloseModalProps {
  action: "edit" | "new" | "cancel",
  video_segment_id?: string,
  itemId?: string,
  item_number?: number,
  format?: string,
  content?: string,
  answer_key?: string,
}

type VideoSegmentQuestionNumbers = {
  [videoSegmentId: string]: string[]; // Key is a string, value is an array of numbers
};

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
  question_number?: number;
  
}

export interface EditModalContentProps {
  quiz_has_video: boolean;
  question_id: string;
  format: string;
  question_number: number;
  video_segment_id?: string;
}

//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListQuestions(props:any) {
  //<a class="italic text-blue-300" href="/categories/4/sub_categories/9/list_quizzes/27/questions/135">Questions</a>
  const params = useParams<{ categoryId: string, sub_categoryId: string, unitId: string, quizId: string}>();
  //console.log(" ListQuestions ***************** params = ", params)
  //const url = `units/${params.unit_id}`;
  /*
{
    "categoryId": "1",
    "sub_categoryId": "6",
    "unitId": "65",
    "quizId": "231"
}
  */


const youTubeVideoRef  = useRef<YouTubePlayerRef>(null);
  
  const [questions, setQuestions] = useState<ShortQuestionProps[]>([])
  //const [selectedFormat, setSelectedFormat] = useState<string>("1"); // State for dropdown selection
  const selectedFormat = useRef<string>("1")
  
  const [isModalNewVisible, setIsModalNewVisible] = useState(false); // State for modal visibility
  const [isModalEditVisible, setIsModalEditVisible] = useState(false); // State for modal visibility
  //const [newModalContent, setNewModalContent] = useState<string | null>(null); // State for modal content
  const [newModalContent, setNewModalContent] = useState<NewModalContentProps | null>(null); // State for modal content

  const [editModalContent, setEditModalContent] = useState<EditModalContentProps | null>(null);

  const [isVideoQuiz, setIsVideoQuiz] = useState<boolean>(false);
  
  //a field within a row that on onblur event was triggered.
  // this field is updated via the onBlur event
  // and is used in the Update button onClick event to notify server using api calls
  const updatedField = useRef<{id: string, row_index: number, column_id: string, value: string, video_segment_id?: string} | null>(null);

   const [quizLink, setQuizLink] = useState<string>('');

   const [unitLink, setUnitLink] = useState<string>('');

   const [subCategoryLink, setSubCategoryLink] = useState<string>('');

   const [quizName, setQuizName] = useState<string>('');
   const [quizNumber, setQuizNumber] = useState<string>('');

   const [videoUrl, setVideoUrl] = useState<string | null>('');

   // for video quizzes
   const [videoSegments, setVideoSegments] = useState<{id: string, segment_number: number, start_time: number, end_time: number}[]>([]);

  const formatConversion: { [key: string]: string } = {"1": 'Cloze', "2": "Button Cloze Select", "3": 'Button Select', 
    "4": "Radio ",  "5": "Checkbox", "6": "Word Scramble", "7": "Speech Recognition", "8": "Word Select",
    "9": "Recording", "10": "Drop Down", "11": "Letter Cloze",
}

const { rootUrl } = useRootUrl();

 const location = useLocation(); // Get the location object
     const queryParams = new URLSearchParams(location.search); // Pars

     const categoryFilter = queryParams.get('category');
     //console.log("ListQuestions:  categoryFilter=", categoryFilter);
    
     const subCategoryFilter = queryParams.get('sub_category');
      //console.log("ListQuestions:  subCategoryFilter=", subCategoryFilter);

      const unitFilter = queryParams.get('unit');
      //console.log("ListQuestions:  unitFilter=", unitFilter);


  useEffect(() => {
    // fetch questions on component load using fetch utility
    fetch(`${rootUrl}/api/quizzes/${params.quizId}/get_questions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      //console.log("Fetched questions data = ", data)

      setQuizName(data.name || '');
      setQuizNumber(data.quiz_number ? data.quiz_number.toString() : '');
      setQuizLink(`/${params.categoryId}/list_sub_categories/${params.sub_categoryId}/list_units/${params.unitId}/list_quizzes?category=${categoryFilter}&sub_category=${subCategoryFilter}&unit=${unitFilter}`);
      setUnitLink(`/${params.categoryId}/list_sub_categories/${params.sub_categoryId}/list_units?category=${categoryFilter}&sub_category=${subCategoryFilter}`);
      setSubCategoryLink(`/${params.categoryId}/list_sub_categories?category=${categoryFilter}`);
      setIsVideoQuiz(!!(data.video_url && data.video_url.length > 0));
      setVideoUrl(data.video_url || null);
      //console.log(" SETTING video segments =", data.video_segments)
      setVideoSegments(data.video_segments ? data.video_segments.map((vs: any) => ({
        id: vs.id.toString(),
        segment_number: vs.segment_number,
        start_time: vs.start_time,
        end_time: vs.end_time,
      })) : []);

      const shortQuestions: ShortQuestionProps[] = data.questions.map(({ id, format, question_number, content, answer_key, videoSegmentId }: any) => {
        return {
          itemId: id,
          item_number: question_number,
          format: format.toString(),
          content: content || 'content....',
          answer_key: answer_key || '',
          videoSegmentId: videoSegmentId?.toString(), // Optional chaining for cleaner code
          video_segment_number: videoSegmentId ? data.video_segments.find((vs: any) => vs.id === videoSegmentId)?.segment_number : undefined,
        };
      });
      setQuestions(shortQuestions);
    })
    .catch(error => {
      console.error("Error fetching questions: ", error);
    });
  }, [params.quizId, rootUrl]);

    const cloneQuestion = async (question_id: string, originals: any) => {
      //console.log("cloneQuestion called with question_id:", question_id);
      const response = await fetch(`${rootUrl}/api/questions/${question_id}/clone`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
       // Remove the deleted segment from local state
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
            answer_key: new_question.answer_key || '',
            video_segment_id: new_question.videoSegmentId ? new_question.videoSegmentId.toString() : undefined,
            video_segment_number: new_question.videoSegmentId ? videoSegments.find(vs => vs.id === new_question.videoSegmentId.toString())?.segment_number : undefined,
          },
          ...originals.slice(index + 1),
        ];
        setQuestions(updatedQuestions);
      }
   
    };  //end cloneQuestion

    const rowDeleted = async (question_id: string) => {
      // for the use of originals, see cloneQuestion function
      //console.log("deleteQuiz called with quiz_id:", question_id);
      setQuestions(prev => prev.filter(vs => vs.itemId !== question_id));
    };

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
      header: "Id",
    },
    {
      accessorKey: "item_number",
      header: "Qu. Number",
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
      cell: info => {
        const initialValue = info.getValue();
        const rowIndex = info.row.index; // Get the row index
        const [value, setValue] = useState(initialValue);
        const inputRef = useRef<HTMLInputElement>(null);
         // onBlur event causes the input field to be refreshed 
         // ( onBlur works differently from onChange event where the input field is refreshed as you type)
      // when using onBlur, you need to click outside the input field for the change to be registered
      // in the table
        const onBlur = () => {
          updatedField.current = {id: info.row.original.itemId, row_index: rowIndex,  column_id: info.column.id, value: value as string};
      
          setQuestions(prev => {
            const updatedQuestions = [...prev];
            updatedQuestions[rowIndex] = {
              ...updatedQuestions[rowIndex],
              content: value as string, // Update the segment_number
            };
           //console.log(" ON BLUR updatedQuestions =", updatedQuestions)
            return updatedQuestions;
          });
        // console.log(" onBlur, row original =", info.row.original)
          //
        };
  
        return (
          <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-96 mx-1'
          ref={inputRef} // Attach the ref to the input field
            value={value as string}
            onChange={e => {
              // use document.getElementById to get the update_row button on the same row
              const updateButton = document.getElementById(`update_button_${info.row.original.itemId}`);

              if (updateButton) {
                updateButton.style.backgroundColor = 'red'; // Change color to red
              }
              //console.log(" onChange , row original =",info.row.original)

              setValue(e.target.value)
            } }
            onBlur={onBlur}
          />

        );
      }, // end cell info

    }, 
    {
      accessorKey: "answer_key",
      header: "Answer Key",
      cell: info => {
        const initialValue = info.getValue() || ""; // Fallback to an empty string if undefined
        const rowIndex = info.row.index; // Get the row index
        const [value, setValue] = useState(initialValue);
        const inputRef = useRef<HTMLInputElement>(null);
         // onBlur event causes the input field to be refreshed 
         // ( onBlur works differently from onChange event where the input field is refreshed as you type)
      // when using onBlur, you need to click outside the input field for the change to be registered
      // in the table
        const onBlur = () => {
          updatedField.current = {id: info.row.original.itemId, row_index: rowIndex,  column_id: info.column.id, value: value as string};
      
          setQuestions(prev => {
            const updatedQuestions = [...prev];
            updatedQuestions[rowIndex] = {
              ...updatedQuestions[rowIndex],
              answer_key: value as string, // Update the segment_number
            };
           //console.log(" ON BLUR updatedQuestions =", updatedQuestions)
            return updatedQuestions;
          });
        // console.log(" onBlur, row original =", info.row.original)
          //
        };
  
        return (
          <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-48 mx-1'
          ref={inputRef} // Attach the ref to the input field
            value={value as string}
            onChange={e => {
              // use document.getElementById to get the update_row button on the same row
              const updateButton = document.getElementById(`update_button_${info.row.original.itemId}`);

              if (updateButton) {
                updateButton.style.backgroundColor = 'red'; // Change color to red
              }
              //console.log(" onChange , row original =",info.row.original)

              setValue(e.target.value)
            } }
            onBlur={onBlur}
          />
        );
      }, // end cell info

    }, 
    {
      accessorKey: "videoSegmentId",
      header: "Segment ID",
      cell: info => {
        const initialValue = info.getValue();
        const rowIndex = info.row.index; // Get the row index
        const [value, setValue] = useState(initialValue);
        const inputRef = useRef<HTMLInputElement>(null);
         // onBlur event causes the input field to be refreshed 
         // ( onBlur works differently from onChange event where the input field is refreshed as you type)
      // when using onBlur, you need to click outside the input field for the change to be registered
      // in the table
        const onBlur = () => {
          updatedField.current = {id: info.row.original.itemId, row_index: rowIndex,  column_id: info.column.id, value: value as string};
       
          setQuestions(prev => {
            const updatedQuestions = [...prev];
            updatedQuestions[rowIndex] = {
              ...updatedQuestions[rowIndex],
              videoSegmentId: value as string, // Update the segment_number
            };
           //console.log(" ON BLUR updatedQuestions =", updatedQuestions)
            return updatedQuestions;
          });
        // console.log(" onBlur, row original =", info.row.original)
          //
        };
  
        return (
          <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-12 mx-1'
          ref={inputRef} // Attach the ref to the input field
            value={value as string}
            onChange={e => {
              // use document.getElementById to get the update_row button on the same row
              const updateButton = document.getElementById(`update_button_${info.row.original.itemId}`);

              if (updateButton) {
                updateButton.style.backgroundColor = 'red'; // Change color to red
              }
              //console.log(" onChange , row original =",info.row.original)

              setValue(e.target.value)
            } }
            onBlur={onBlur}
          />
        );
      }, // end cell info


    }, 
    {
      accessorKey: "video_segment_number",
      header: "Segment Number",
      cell: info => {
        //const initialValue = info.getValue();
        const initialValue = info.getValue(); // Fallback to an 
        const [value, setValue] = useState<string>(initialValue as string);
        const rowIndex = info.row.index; // Get the row index
        //const [value, setValue] = useState(initialValue);
        const inputRef = useRef<HTMLInputElement>(null);
         // onBlur event causes the input field to be refreshed 
         // ( onBlur works differently from onChange event where the input field is refreshed as you type)
      // when using onBlur, you need to click outside the input field for the change to be registered
      // in the table
        const onBlur = (e: any) => {
          /*
          const clickedElement = (e as FocusEvent).relatedTarget; // The element that was clicked
  console.log("Element that triggered onBlur:", clickedElement);

  if (clickedElement) {
     console.log("Clicked element ID:", (clickedElement as HTMLButtonElement).id );
     //update_button_6288
    //console.log("Clicked element class:", clickedElement.className);
  } else {
    console.log("No related target (e.g., clicked outside the document)");
  }
          */

  updatedField.current = {
    id: info.row.original.itemId,
    row_index: rowIndex,
    column_id: info.column.id,
    value: value as string,
  };

          //updatedField.current = {id: info.row.original.itemId, row_index: rowIndex,  column_id: info.column.id, value: value as string};
       
          setQuestions(prev => {
            const updatedQuestions = [...prev];
              // search videoSegments to find the video_segment_id that matches value (as segment_number)
            const matchingSegment = videoSegments.find(vs => vs.segment_number === parseInt(value as string));
           // console.log(" onBlur: matchingSegment =", matchingSegment)
            const video_segment_id = matchingSegment ? matchingSegment.id : undefined;
            console.log(" onBlur: matching , video_segment_id for segment number value: ", value, " is", video_segment_id)
           
            if (video_segment_id && updatedField.current) {
              updatedField.current.video_segment_id = video_segment_id;
              // this will be used in Update onclick event
            }
            updatedQuestions[rowIndex] = {
              ...updatedQuestions[rowIndex],
              videoSegmentId: video_segment_id, // Update the segment_number
            };
            console.log(" ON BLUR updatedQuestions =", updatedQuestions)
            return updatedQuestions;
          });
        };  // end onBlur
  
        return (
          <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-12 mx-1'
          ref={inputRef} // Attach the ref to the input field
            value={value as string}
            onChange={e => {
              // use document.getElementById to get the update_row button on the same row
              const updateButton = document.getElementById(`update_button_${info.row.original.itemId}`);
              if (updateButton) {
                updateButton.style.backgroundColor = 'red'; // Change color to red
              }
              //console.log(" onChange , row original =",info.row.original)
              setValue(e.target.value)
            } }
            onBlur={onBlur}
          />
        );
      }, // end cell info


    }, 
    {
      id: "update_row",
      header: "Update",
      cell: ({ row }) => (
        <button
        id = {`update_button_${row.original.itemId}`}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        onClick={async (e) => {
          // ****** IMPORTANT kpham: when you click the UPDATE button, and previously an input field was focused (value change),
          // then an onBlur event will be triggered first, before the onClick event of this button is fired.
         // since onBlur gets fired when user click anywhere outside the input field,
         // we have to make sure that the user has clicked on the Update button of the same row
        //console.log(" Update column id ", updatedField.current?.column_id, " for row index ", updatedField.current?.row_index)
          if (updatedField.current) {
            const updated_column_id = updatedField.current?.column_id;  
            const body = {
              format: row.original.format, // Include `format`
              ...(updated_column_id && {
                [updated_column_id]: updatedField.current.value, //
              }),
            };
            const method = 'PUT';
            const url = `${rootUrl}/api/questions/${row.original.itemId}`
            const response = await fetch(url, {
              method: method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body), // exclude itemId , item_number, and format from the body
            });
            const data = await response.json();
            
            console.log("Successfully updated question data return  " + data);
            // if updated_column_id is videoSegmentId, then we need to update the video_segment_number in the questions state
            // first search videoSegments to find the segment_number that matches updatedField.current.value
            /*
            if (updated_column_id === 'videoSegmentId') {
              const matchingSegment = videoSegments.find(vs => vs.id === updatedField.current?.value);
              const corresponding_segment_number = matchingSegment ? matchingSegment.segment_number : undefined;
              console.log(" Update onClick: matching segment number for NEW videoSegmentId value: ", updatedField.current?.value, " is", corresponding_segment_number)
              // now update the questions state
              
              setQuestions(prev => {
                const updatedQuestions = [...prev];
                const rowIndex = updatedField.current ? updatedField.current.row_index : -1;
                if (rowIndex !== -1) {
                  updatedQuestions[rowIndex] = {
                    ...updatedQuestions[rowIndex],
                    video_segment_number: corresponding_segment_number,
                  };
                }
                //console.log("^^^^^^^^^^^^^ onClick Update button: updatedQuestions =", updatedQuestions)
                return updatedQuestions;
              });
            }
            */
            const updateButton = document.getElementById(`update_button_${row.original.itemId}`);
            if (updateButton) {
              // rgb 59, 30, 246
              updateButton.style.backgroundColor = '#3b82f6'; // Change color to original blue
              // of the update_row button
            }


          }  // end if updatedField.current
         /*  note: row original has stale data if user has changed any input field but not yet clicked Update button
         */
          // if you click this button (or any other field) while an input field is focused, the onBlur event for that input field will be triggered first
          // this is why you don't need an onClick event 
        }}
      >
        Update
      </button>
      ), // end cell info
    },

    {
      id: "edit",
      header: "Edit",
      cell: (info) => (
        <>
       
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => {
              editQuestion(info.row.original.format, info.row.original.itemId, info.row.original.item_number)
            } 
            
          }
        >
          Edit
        </button>
        </>
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
  [videoSegments] // Recompute columns if videoSegments change
);


  const closeModal = (params: CloseModalProps) => {
    if (params.action === "cancel") {
      setIsModalEditVisible(false);
      setIsModalNewVisible(false);
      setEditModalContent(null);
      setNewModalContent(null);
      return;
    }

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
             videoSegmentId: params.video_segment_id,
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
        content: q.content || 'content....', 
        answer_key: q.answer_key, // Ensure content is always a string
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
          //item_number: parseInt(params.item_number || "0"), // Default to "0" if undefined
          item_number: params.item_number ?? 0, // Default to 0 if undefined
          format: params.format || "1", // Default to "1" if undefined
          content: params.content || 'content....', 
          answer_key: params.answer_key || '',

        };

        console.log(" ********* New question to be added to the table =", new_question)
        // use splice method to insert the new question after the position of the current row item number
        
        // print out all the item numbers in the questions array for debugging
        //console.log(" All existing question item numbers:");
        //questions.forEach(q => console.log("Existing question item number =", q.item_number, " type of item number =", typeof q.item_number));

        //console.log("Type of new_question.item_number:", typeof new_question.item_number);
        //console.log("Type of questions[0].item_number:", typeof questions[0]?.item_number);

        const index = questions.findIndex((q) => q.item_number === new_question.item_number);
        //console.log("Found index for this question number:", index);
        if (index !== -1) {
          //console.log("Inserting new question at index:", index);
          const updatedQuestions = [
            ...questions.slice(0, index+1),
            new_question,
            ...questions.slice(index+1),
          ];
          //console.log("Updated questions after insertion:", updatedQuestions);
          setQuestions(updatedQuestions);
        } else {
          //console.log("Could not find index for question number" ,new_question.item_number, "Appending new question at the end.");
          setQuestions([...questions, new_question]);
        }
  
      setIsModalNewVisible(false);
      setNewModalContent(null);
      return;
    }
 
  };

  //<Route path="sub_categories/:sub_categoryId/list_questions/:quiz_id/create_question/:format/:last_question_number" element={<QuestionCreator
  const createQuestionFromRow = (current_question_number: number) => {
    //console.log("createQuestion called with ^^^^^^^^^^^^^^ selectedFormat:", selectedFormat);

    setNewModalContent({ 
      question_number: current_question_number,
      quiz_has_video: isVideoQuiz,
      format: selectedFormat.current, 
      quiz_id: params.quizId || ""
    });
    
      setIsModalNewVisible(true);
    
  };

  const editQuestion = (format: string, current_question_id: string, current_question_number: number) => {
    //console.log("createQuestion called with ^^^^^^^^^^^^^^ selectedFormat:", selectedFormat);

    setEditModalContent({question_id: current_question_id,
        format: format, 
        question_number: current_question_number,
        quiz_has_video: isVideoQuiz
      
      });
    setIsModalEditVisible(true);
  }

  return (
    <>
     <div className='flex justify-between items-center mb-4'>
      <Link to="/" className='bg-bgColor2 text-textColor2 text-2xl italic'>Home</Link>
      </div>
    <div className='bg-bgColor2 text-textColor2 text-xl flex flex-row justify-start items-center mb-4'>
        <div>
          <Link className='bg-bgColor2 italic underline text-textColor2 text-xl my-4 mx-1' to={subCategoryLink}>
            {` ${categoryFilter}`}
          </Link> {'->'}
        </div>
        <div>
          <Link className='bg-bgColor2 italic underline text-textColor2 text-xl my-4 mx-1' to={unitLink}>
            {` ${subCategoryFilter}`}
          </Link> {'->'}
        </div>
        
        <div>
          <Link className='bg-bgColor2 italic underline text-textColor2 text-xl my-4 mx-1' to={quizLink}>
            {` ${unitFilter}`}
          </Link> {'->'}
        </div>
        <div className='bg-bgColor2 italic text-textColor2 text-xl p-3'>Quiz {quizNumber}: {quizName}</div>
      </div>

      <div className='bg-bgColor1 text-textColor1'>Video Quiz? {isVideoQuiz.toString()}</div>
      { videoUrl &&
       <div>
     
        {videoSegments.length > 0 &&
          videoSegments.map((segment) => (
            <button key={segment.id} className='bg-bgColor2 text-textColor1 m-2 p-2 rounded-lg'
              onClick={() => {
                if (youTubeVideoRef.current) {
                  youTubeVideoRef.current.playSegment(segment.start_time.toString(), segment.end_time.toString());
                }
              }}
            >
              Play Segment {segment.segment_number} id: {segment.id}, ( {segment.start_time} - {segment.end_time} )
            </button>
          ))
        }
        </div>
      }
  
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
        data_type='questions'
        parent_notify_delete_row={rowDeleted}
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
      <div className='flex flex-row gap-3 bg-bgColor1 text-textColor1 px-5 pb-10 mb-5'>
        <button className='text-textColor1 bg-bgColor1 rounded-lg'
          onClick={() => 
          {
            setNewModalContent({ 
              question_number: questions.length + 1,
              quiz_has_video: isVideoQuiz,
              format: selectedFormat.current, 
              quiz_id: params.quizId || ""
            });
            setIsModalNewVisible(true)
          }

          }
        >
          Create New Question
        </button>
        <button className='text-textColor4 bg-bgColor4 rounded-lg p-3'
          onClick={() => 
          {
            console.log(" All questions and their video segment ids:", questions);
            const obj: VideoSegmentQuestionNumbers = {};
             questions.forEach((question, index) => {
              //console.log(" Question id =", question.itemId);
              //console.log(" Video Segment Id =", question.videoSegmentId);
              // seatch videoSegments to find the video segment id that matches the video_segment_number
              const videoSegment = videoSegments.find(vs => vs.segment_number.toString() === question.videoSegmentId);
              //console.log(" Matching video segment id =", videoSegment?.id);
              if (videoSegment) {
                if (!obj[videoSegment.id]) {
                  obj[videoSegment.id] = [];
                }
                obj[videoSegment.id].push(question.itemId);
              }
             })
             //console.log(" video segments: ", videoSegments)
              // use video_segment_number as key to group question ids
          }

          }
        >
           Set Question numbers for Video Segments
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

/*
   <YoutubeVideoPlayer
          ref={youTubeVideoRef} 
          video_url={videoUrl} 
        />
*/