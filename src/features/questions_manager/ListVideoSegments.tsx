//import { useAxiosFetch } from '../components/services/useAxiosFetch';

//import { QuestionProps } from '../components/Question';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ColumnDef, createColumnHelper, getCoreRowModel, getSortedRowModel , SortingState} from '@tanstack/table-core';
import { flexRender, useReactTable } from '@tanstack/react-table';

import { useRootUrl } from '../../contexts/root_url';
//import { VideoSegmentProps } from './types';
import { useSortable } from '@dnd-kit/sortable';
import { ShortQuizProps } from './ListQuizzes';
import GenericSortableTable, { genericItemType } from './GenericSortableTable';
import YoutubeVideoPlayer, { YouTubePlayerRef } from '../components/YoutubeVideoPlayer';
import NewVideoSegment, { NewSegmentModalContentProps, SegmentCloseModalProps } from './NewVideoSegment';
import { ConsoleLoggingListener } from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.browser/ConsoleLoggingListener';
import { createVideoSegment } from '../services/list';
import { useAxiosFetch } from '../../hooks';
import { video } from 'framer-motion/client';


export interface VideoSegmentProps extends genericItemType {
  start_time: string,
  end_time?: string,
  question_numbers?: string,
}

 interface VideoSegmentRowProps extends genericItemType {
  start_time: string,
  end_time?: string,
  question_numbers?: string,
}

interface ListVideoSegmentsProps {
    //videoSegments: VideoSegmentProps[] | undefined
    quiz_id: string | undefined
}
 
/*
   id?: number,
    duration: number,
    segment_number: number,
    question_numbers: string,
    start_time: string,
    end_time: string,
    quizId: number
*/


export default function ListVideoSegments({ quiz_id, videoUrl}: {  quiz_id?: string | undefined, videoUrl?: string | undefined}) {

 const [videoSegmentRows, setVideoSegmentRows] = useState<VideoSegmentRowProps[]>(

 );
const { rootUrl } = useRootUrl();

const [selectedRows, setSelectedRows] = useState<string[]>([]);

 const [newModalContent, setNewModalContent] = useState<NewSegmentModalContentProps | null>(null);

//const [videoUrl, setVideoUrl] = useState<string | undefined>('')

//a field within a row that on onblur event was triggered
const updatedField = useRef<{id: string, row_index: number, column_id: string, value: string} | null>(null);

const youTubeVideoRef  = useRef<YouTubePlayerRef>(null);

const [isModalNewVisible, setIsModalNewVisible] = useState(false); // State for modal visibility

  const url = `/video_segments/get_from_quiz/${quiz_id}`

      const { data: video_segments, loading, error } =
          useAxiosFetch<any>({ url: url, method: 'get' })
 
    useEffect(() => {
        if (video_segments) {
          //console.log("ListVideoSegments:  my_video_segments return =", video_segments.data);
          setVideoSegmentRows(video_segments.data.map((vs: any) => ({
            itemId: vs.id ? vs.id.toString() : '',
            item_number: vs.segment_number,
            start_time: vs.start_time,
            end_time: vs.end_time || '',
            question_numbers:  vs.question_numbers.join(',') || '',
          })))
       }
    },[video_segments])

const handleRowSelect = (id: string) => {
  //console.log("handleRowSelect called with id =", id);

  setSelectedRows((prev) => {
    const updatedSelectedRows = prev.includes(id)
      ? prev.filter((rowId) => rowId !== id) // Remove the row if already selected
      : [...prev, id]; // Add the row if not already selected

   //console.log("Updated selectedRows:", updatedSelectedRows); // Log the updated state
    return updatedSelectedRows;
  });
};

/*
{
    "id": 46,
    "duration": 0,
    "segment_number": 0,
    "start_time": "00:00",
    "end_time": "00:15",
    "question_numbers": [
        1
    ],
    "question_ids": [
        6288
    ],
    "quizId": 310

}
  */

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

const updateRow = async (row: VideoSegmentProps) => {
  //console.log("updateVideoSegment called with videoSegment:", question_row);
  const {itemId, item_number, ...rest } = row;
 
  const body = { ...rest };
  //console.log(" ***** body =", body)
  //console.log(" Stringified body =", JSON.stringify(body))
  /*
{
"itemId": 6210,
"item_number": "1",
"format": "1",
"content": "How [are] you?",
"answer_key": "are",
"video_segment_id": "3"
}
  */


  const method = 'PUT';
  const url = `${rootUrl}/api/video_segments/${row.itemId}`
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body), // exclude itemId , item_number, and format from the body
  });
  const data = await response.json();
  //alert("Successfully updated question row id " + question_row.itemId);
  
  const updateButton = document.getElementById(`update_button_${row.itemId}`);

  if (updateButton) {
    // rgb 59, 30, 246
    updateButton.style.backgroundColor = '#3b82f6'; // Change color to original blue
    // of the update_row button
  }
 

} // end updateRow

const cloneRow = async (id: string, originals: any) => {
  //console.log("cloneQuestion called with question_id:", question_id);
  const response = await fetch(`${rootUrl}/api/video_segments/${id}/clone`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
   // Remove the deleted segment from local state
  //setQuestions(prev => prev.filter(vs => vs.itemId !== question_id));
  // update the local state with the new cloned question
  const data = await response.json();

  console.log(" cloneRow: response from server after cloning =", data);
  const new_segment = data.new_segment;
  
  // add data.new_question to the originals array after the original question
  // REMEMBER, have to use originals, not questions, to update the local state
  const index = originals.findIndex((q : VideoSegmentProps)=> q.itemId === id);
  if (index !== -1) {
    const updatedVideoSegments = [
      ...originals.slice(0, index + 1),
      {
        itemId: new_segment.id,
        item_number: new_segment.segment_number,
        start_time: new_segment.start_time,
        end_time: new_segment.end_time || '',
        question_numbers: new_segment.question_numbers || '',
      },
      ...originals.slice(index + 1),
    ];
   
    console.log(" cloneRow: updatedVideoSegments =", updatedVideoSegments);
    //setVideoSegments(updatedVideoSegments);

    //setVideoSegments(updatedVideoSegments.map(q => ({
     // ...q,
    //  content: q.content || 'content....', // Ensure content is always a string
   // })));
  //
  }
  

};  //end clone

const columns = useMemo<ColumnDef<VideoSegmentProps>[]>(
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
      header: "Segment Number",
    },
    {
      accessorKey: "start_time",
      header: "Start Time",
      cell: info => {
        const initialValue = info.getValue();
        const rowIndex = info.row.index; // Get the row index
        const [value, setValue] = useState(initialValue);
        const inputRef = useRef<HTMLInputElement>(null);
        const onBlur = () => {
          updatedField.current = {id: info.row.original.itemId, row_index: rowIndex,  column_id: info.column.id, value: value as string};
      
          setVideoSegmentRows(prev => {
            const updatedQuestions = [...(prev || [])];
            updatedQuestions[rowIndex] = {
              ...updatedQuestions[rowIndex],
              start_time: value as string, // Update the segment_number
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
      accessorKey: "end_time",
      header: "End Time",
      cell: info => {
        const initialValue = info.getValue();
        const rowIndex = info.row.index; // Get the row index
        const [value, setValue] = useState(initialValue);
        const inputRef = useRef<HTMLInputElement>(null);
        const onBlur = () => {
          updatedField.current = {id: info.row.original.itemId, row_index: rowIndex,  column_id: info.column.id, value: value as string};
      
          setVideoSegmentRows(prev => {
            const updatedQuestions = [...(prev || [])];
            updatedQuestions[rowIndex] = {
              ...updatedQuestions[rowIndex],
              end_time: value as string, // Update the segment_number
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
      id: "play",
      header: "Play",
      cell: (info) => (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => {
           
            //console.log("cloneQuestion originals =", originals);
            if (youTubeVideoRef.current) {
              youTubeVideoRef.current.playSegment(info.row.original.start_time || '', info.row.original.end_time || '');
            }
          }
          }
        >
          Play
        </button>
      ),
    },
    {
      id: "update_row",
      header: "Update",
      cell: ({ row }) => (
        <button
        id = {`update_button_${row.original.itemId}`}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        onClick={(e) => {
          // ****** IMPORTANT kpham: when you click the UPDATE button, and previously an input field was focused,
          // then an onBlur event will be triggered first, before the onClick event of this button is fired.
          /*
{
    "id": 6210,
    "row_index": 0,
    "column_id": "video_segment_id",
    "value": "11"
}
          */

         // since onBlur gets fired when user click anywhere outside the input field,
         // we have to make sure that the user has clicked on the Update button of the same row
               if (updatedField.current) {
            updateRow({...row.original, [updatedField.current.column_id]: updatedField.current.value as string});
          } else {
            console.error("updatedField.current is null");
          }
          // if you click this button (or any other field) while an input field is focused, the onBlur event for that input field will be triggered first
          // this is why you don't need an onClick event 
        }}
      >
        Update
      </button>
      ), // end cell info
    },
    {
      accessorKey: "question_numbers",
      header: "Question Numbers",
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
            cloneRow(info.row.original.itemId, originals)
          }
          }
        >
          Clone
        </button>
      ),
    },
    {
      id: "select",
      header: "Select",
      cell: (info) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(String(info.row.original.itemId))}
          onChange={() => handleRowSelect(info.row.original.itemId)}
        />
      ),
    },
 
  ],
  [selectedRows] // Add selectedRows as a dependency to update when it changes
      // otherwise, the checkbox state do not reflect the actual updated selectedRows state
      // KPHAM Oct 16, 2025
);

const rowDeleted = async (id: string) => {
  // for the use of originals, see cloneQuestion function
  //console.log("deleteQuiz called with quiz_id:", question_id);
  //setVideoSegments(prev => prev.filter(vs => vs.itemId !== id));
};

const closeModal = (params: SegmentCloseModalProps | null) => {
  setIsModalNewVisible(false);
}

const create_video_segment = async () => {
    const my_params = {
        segment_number: 0,
        video_url: videoUrl || '',
        quizId: quiz_id || '',
    }
   
    /*
   duration: req.body.duration,
      segment_number: req.body.segment_number,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      question_numbers: req.body.question_numbers,
      quizId: req.body.quizId.toString(),
    */

    const response = await createVideoSegment(rootUrl, my_params )
                   if (response) {
                    console.log(" NewVideoSegment: created, response data = ", response.data)
                      // console.log("button cloze question created ok")
                      /*
                          onClose({ action: 'new',
                            id: response.data.id.toString(),
                            name: name,
                            quiz_number: quizNumber || '',
                            video_url: videoUrl || '',
                            unitId: unitId
                          })
                        */  
                   }
  
  // const body = {
}


return (
  <div>
    in ListVideoSegments: quiz_id = {quiz_id}
    <div>
        <YoutubeVideoPlayer 
        video_url={videoUrl || ''} 
        ref={youTubeVideoRef}
        />
    </div>
    <GenericSortableTable 
        input_data={videoSegmentRows || []} 
        columns={columns} 
        data_type='video_segments'
        parent_notify_delete_row={rowDeleted}
        />

<button className='bg-bgColor4 text-textColor4 bg-2 rounded-lg w-40 p-2 m-2'
          onClick={() => 
          {
            create_video_segment();
          }

          }
        >
          Create New Video Segment
        </button>

      {isModalNewVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <NewVideoSegment
              modal_content={newModalContent!} onClose={closeModal} />
          </div>
        )}
  </div>
)

}

/*
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
          //console.log(" ON BLUR updatedField current after updated =", updatedField.current)
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

*/
