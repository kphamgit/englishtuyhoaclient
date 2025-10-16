//import { useAxiosFetch } from '../components/services/useAxiosFetch';

//import { QuestionProps } from '../components/Question';
import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { createColumnHelper, getCoreRowModel, getSortedRowModel , SortingState} from '@tanstack/table-core';
import { flexRender, useReactTable } from '@tanstack/react-table';

import { useRootUrl } from '../../contexts/root_url';
import { VideoSegmentProps } from './types';




interface ListVideoSegmentsProps {
    videoSegments: VideoSegmentProps[] | undefined
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


export default function ListVideoSegmentsSave({ videoSegments, quiz_id }: { videoSegments: VideoSegmentProps[] | undefined , quiz_id?: string | undefined}) {

  const [video_segments, setVideoSegments] = useState<VideoSegmentProps[]>(
    videoSegments || []
  );
const { rootUrl } = useRootUrl();

useEffect(() => {
  setVideoSegments(videoSegments || []);
}, [videoSegments]);

const [createNewVideoSegment, setCreateNewVideoSegment] = useState(false)

const [sorting, setSorting] = useState<SortingState>([]);

 const columnHelper = createColumnHelper<any>();


const columns = [
  columnHelper.accessor('id', {
    header: () => <span className='flex items-center'>Id</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('duration', {
    header: () => <span className='flex items-center'>Duration</span>,
  
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('segment_number', {
    header: () => <span className='flex items-start'>Segment Number</span>,
    cell: info => {
      const initialValue = info.getValue();
      const rowIndex = info.row.index; // Get the row index
      const [value, setValue] = useState(initialValue);
      const inputRef = useRef<HTMLInputElement>(null);
       // onBlur event causes the input field to be refreshed ( onBlur works differently
    // for onChange event where the input field is refreshed as you type)
    // when using onBlur, you need to click outside the input field for the change to be registered
    // in the table
      const onBlur = () => {
        console.log(`onBlur triggered for row ${rowIndex}, column ${info.column.id} with value: ${value}`);
        // value is the segment_number entered in the input field
        setVideoSegments(prev => {
          const updatedSegments = [...prev];
          updatedSegments[rowIndex] = {
            ...updatedSegments[rowIndex],
            segment_number: value, // Update the segment_number
          };
          //console.log("Updated row:", updatedSegments[rowIndex]);
          return updatedSegments;
        });
        updateVideoSegment({...info.row.original, segment_number: value});

      };

      return (
        <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-12 mx-1'
        ref={inputRef} // Attach the ref to the input field
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
        />
      );
    },
  }),
  columnHelper.accessor('question_numbers', {
    header: () => <div className='flex flex-row items-center px-1'>
      Question Numbers
    </div>,
    cell: info => {
      const initialValue = info.getValue();
      const rowIndex = info.row.index; // Get the row index
      const [value, setValue] = useState(initialValue);
      const inputRef = useRef<HTMLInputElement>(null);
      const onBlur = () => {
        //console.log(`Updated cell value for ${info.column.id} in row ${info.row.index}: ${value}`);
      setVideoSegments(prev => {
      const updatedSegments = [...prev];
      updatedSegments[rowIndex] = {
        ...updatedSegments[rowIndex],
        question_numbers: value, // Update the segment_number
      };
      //console.log("Updated row:", updatedSegments[rowIndex]);
      return updatedSegments;
    });

      };
      return (
        <div className='flex items-center'>
        <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-16 mx-1'
        ref={inputRef} // Attach the ref to the input field
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
        />
        </div>
      );
    },
  }),
  columnHelper.accessor('start_time', {
    header: () => <span className='flex items-center'>Start Time</span>,
    cell: info => {
      const initialValue = info.getValue();
      const rowIndex = info.row.index; // Get the row index
      const [value, setValue] = useState(initialValue);
      const inputRef = useRef<HTMLInputElement>(null);
      const onBlur = () => {
        //console.log(`Updated cell value for ${info.column.id} in row ${info.row.index}: ${value}`);
        setVideoSegments(prev => {
          const updatedSegments = [...prev];
          updatedSegments[rowIndex] = {
            ...updatedSegments[rowIndex],
            start_time: value, // Update the segment_number
          };
          //console.log("Updated row:", updatedSegments[rowIndex]);
          return updatedSegments;
        });
        updateVideoSegment({...info.row.original, start_time: value});

      };
      return (
        <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-16 mx-1'
        ref={inputRef} // Attach the ref to the input field
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
        />
      );
    },
  }),
  columnHelper.accessor('end_time', {
    header: () => <span className='flex items-center'>End Time</span>,
    cell: info => {
      const initialValue = info.getValue();
      const rowIndex = info.row.index; // Get the row index
      const [value, setValue] = useState(initialValue);
      const inputRef = useRef<HTMLInputElement>(null);
      const onBlur = () => {
       // console.log(`Updated cell value for ${info.column.id} in row ${info.row.index}: ${value}`);
       setVideoSegments(prev => {
        const updatedSegments = [...prev];
        updatedSegments[rowIndex] = {
          ...updatedSegments[rowIndex],
          end_time: value, // Update the segment_number
        };
        //console.log("Updated row:", updatedSegments[rowIndex]);
        return updatedSegments;
      });
      updateVideoSegment({...info.row.original, end_time: value});

      };
      return (
        <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-16 mx-1'
        ref={inputRef} // Attach the ref to the input field
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
        />
      );
    },
  }), 
  columnHelper.accessor('update_row', {
    header: () => <span className='flex items-center'></span>,
    cell: ({ row }) => (
      <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
      onClick={(e) => {
        console.log("Update button clicked for row:", row.original)
        // if you click the button while an input field is focused, the onBlur event for that input field will be triggered first
        // this is how onblur works,
        // So when u click on the Update button, the onBlur event for the input field that has recently been changed will be triggered
      }}
    >
      { row.original.id ? 'Update' : 'Save' }
    </button>
    ),
  }),
  columnHelper.accessor('delete', {
    header: () => <span className='flex items-center'></span>,
    cell: info => (
      <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
      onClick={() => deleteVideoSegment(info.row.original.id ? info.row.original.id.toString() : '')}
    >
      Delete
    </button>
    )
  }),
  
 
]

const updateVideoSegment = async (videoSegment: VideoSegmentProps) => {
    console.log("updateVideoSegment called with videoSegment:", videoSegment);
    //const htmlEl = e.target as HTMLElement;
    //console.log(" event target", htmlEl.innerText)
    const method = videoSegment.id ? 'PUT' : 'POST';
    const url = videoSegment.id ? `${rootUrl}/api/video_segments/${videoSegment.id}` : `${rootUrl}/api/video_segments`;
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoSegment),
    });
    const data = await response.json();
    //console.log("Successfully updated/created video segment:", data);
    if (!videoSegment.id) {
      // If it was a new segment, update the local state with the new ID from the server
      setVideoSegments(prev => prev.map(vs => vs === videoSegment ? data : vs));
    }
    // If the button text is 'Save', change it to 'Update' after successful creation
    //if (htmlEl.innerText === 'Save') {
     // htmlEl.innerText = 'Update';
    //}
}

const deleteVideoSegment = async (id: string) => {
  //console.log("deleteVideoSegment called with id:", id);
  const url = `${rootUrl}/api/video_segments/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  //console.log("Successfully remove video segment:", data);
  // Remove the deleted segment from local state
  setVideoSegments(prev => prev.filter(vs => vs.id !== parseInt(id)));
}
/*
{
    "id": 16,
    "duration": 15000,
    "segment_number": "2",
    "question_numbers": "2,3,4",
    "start_time": "0:15",
    "end_time": "0:25",
    "quizId": 310
}
*/



  const table = useReactTable({
      data: video_segments ? video_segments : [],
      columns: columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      state: {
        sorting: sorting,
      },
      onSortingChange: setSorting,
     })

     //console.log("****** table header Groups = ", table.getHeaderGroups())
  const getColumnValues = (columnId: string): unknown[] => {
    return table.getRowModel().rows.map(row => row.getValue(columnId));
  };

  

                     useEffect(() => {
                      // Retrieve all rows from the table
                      const rows = table.getRowModel().rows;
                  
                      // Extract the values of the "id" column
                      const idColumnValues = rows.map((row) => row.original.id);
                  
                      //console.log("Values of the 'id' column:", idColumnValues);
                      // sent to server to update ids of quizzes in this unit
                    }, [table, sorting]);

    const saveVideoSegmentTable = () => {
        const rows : VideoSegmentProps[] = []
        table.getRowModel().rows.forEach((row, index) => {
          rows.push(row.original)
        })
        // for testing only, print all rows in the table
        //console.log(`Row ${index}:`, row.original);
        // use fetch to save one row at a time to the server
        //const rows = table.getRowModel().rows;
        
        const update_url = `${rootUrl}/api/video_segments/batch_update`;
        fetch(update_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({video_segments: rows}),
        }).then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        }
        ).then(data => {
          console.log("Successfully updated video segment:", data);
        }
        ).catch(error => {
          console.log("Error updating video segment:", error);  
        
      }
      )
      
    }
  //}
    
      const add_segment = async () => {
        // first, add to frontend
           //console.log("add video segment quizID ", quiz?.id)
          if (!videoSegments) {
              setVideoSegments([{
                  duration: 0,
                  segment_number: 0,
                  question_numbers: '1',
                  start_time: '0:00',
                  end_time: '0:10',
                  quizId: quiz_id ? Number(quiz_id) : 0
              }]);
              
          }
          else { // create and add a new segment to an existing list
            const newSegment: any = {
              duration: 0,
              segment_number: 0,
              question_numbers: '1',
              start_time: '0:00',
              end_time: '0:10',
              quizId: quiz_id ? Number(quiz_id) : 0
          };
          setVideoSegments([...videoSegments, newSegment]);
          }
        }
   
    return (
      <div>
          <div className='text-textColor1 p-2 flex flex-col justify-center mt-3 mb-3'>
            <div className='mb-3'>Video Segments for Quiz ID: {quiz_id} </div>
            <table className="bg-bgColor2 text-textColor2 table-auto border-collapse border border-gray-300">
                  <thead className='bg-bgColor3 text-textColor1'>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            className="border border-slate-300 p-2"
                          >
                            <div>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getIsSorted() ? { asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as "asc" | "desc"] : null}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                   <tbody className='bg-bgColor2 text-textColor2'>
                       {table.getRowModel().rows.map(row => (
                         <tr key={row.id}>
                           {row.getVisibleCells().map(cell => (
                             <td key={cell.id} className='bg-bgColor2 border border-slate-300 p-2'>
                               {flexRender(cell.column.columnDef.cell, cell.getContext())}
                             </td>
                           ))}
                         </tr>
                       ))}
                   </tbody>
                 </table>


                 <div className='bg-bgColor2 text-textColor2 p-3'>
               
                  <button className='text-textColor1 bg-bgColor1 rounded-lg p-2 m-2'
                  onClick={() => {
                    // save all segment numbers to segmentNumbers state
                    const segment_numbers: number[] = getColumnValues('segment_number') as number[]; 
                    //console.log(" segment_numbers length:", segment_numbers.length);
                   // getColumnValues('segment_number').forEach((row, index) => {
                    //  console.log(row);
                   // })
                   for (let i = 0; i < segment_numbers.length; i++) {
                    //console.log(`Segment number at index ${i}:`, segment_numbers[i]);
                      segment_numbers[i] = i
                   }
                    //segment_numbers.sort((a:number, b: number) => a - b);
                    //console.log("new Segment Numbers:", segment_numbers);
                    setVideoSegments(prev => {
                      //console.log("Updating video segments with new segment numbers");
                      const updatedSegments = prev.map((segment, index) => ({
                        ...segment,
                        segment_number: segment_numbers[index],
                      }));
                      return updatedSegments;
                    });
                  
                    // for testing only, print all rows in the table
                  
                   
                  }}
                  >
                    Sort Segment Numbers
                  </button>
                  <button className='text-textColor1 bg-bgColor1 rounded-lg p-2 m-2'
                  onClick={saveVideoSegmentTable}
                  >
                    Save All Changes
                  </button>
                  <button className='text-textColor1 bg-bgColor1 rounded-lg p-2 m-2'
                  onClick={add_segment}
                  >
                    Add Segment
                  </button>
                 
                    </div>
            </div>
            <Outlet />
            </div>
    )
      
}

//
// <DataTable columns={columns} data={data} />
