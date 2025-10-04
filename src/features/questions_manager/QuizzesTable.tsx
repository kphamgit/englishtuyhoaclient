import React, { CSSProperties, useEffect } from "react";
import ReactDOM from "react-dom/client";

import "./testindex.css";

import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";


// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// needed for row & cell level scope DnD setup
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


export type ShortQuizProps = {
    quizId: string;
    name: string;
    quiz_number: string;
    video_url?: string;
  }

  interface QuizzesTableProps {
    quiz_data: ShortQuizProps[]; // Define the type of the data prop
  }

// Cell Component
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

// Row Component
const DraggableRow = ({ row }: { row: Row<ShortQuizProps> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.quizId,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };
  return (
    // connect row ref to dnd-kit, apply important styles
    <tr ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell) => (
        <td className="bg-bgColor2 text-textColor2 px-2 text-lg " key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

// Table Component
function QuizzesTable({ quiz_data }: QuizzesTableProps) {

  useEffect(() => {
    console.log("********************** quiz_data prop updated:", quiz_data);
    setData(quiz_data);
  }
  , [quiz_data]);

  const columns = React.useMemo<ColumnDef<{ quizId: string; name: string; quiz_number: string; video_url?: string }>[]>(
    () => [
      // Create a dedicated drag handle column. Alternatively, you could just set up dnd events on the rows themselves.
      {
        id: "drag-handle",
        header: "Move",
        cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
        size: 60,
      },
      {
        accessorKey: "name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "quiz_number",
        header: "Quiz Number",
      },
      {
        accessorKey: "video_url",
        header: "Video Url",
      },
    ],
    []
  );

  const [data, setData] = React.useState<ShortQuizProps[]>([]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => (data ? data.map(({ quizId }) => quizId) : []),
    [data]
  );

  const rerender = () => setData([...data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.quizId, //required because row indexes will change
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  console.log("table", table);
  // reorder rows after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const sort_table = () => {
         // save all segment numbers to segmentNumbers state
         const quiz_numbers: string[] = getColumnValues('quiz_number') as string[]; 
         //console.log(" segment_numbers length:", segment_numbers.length);
        // getColumnValues('segment_number').forEach((row, index) => {
         //  console.log(row);
        // })
        for (let i = 0; i < quiz_numbers.length; i++) {
         //console.log(`Segment number at index ${i}:`, segment_numbers[i]);
         quiz_numbers[i] = (i+1).toString();
        }
        console.log("New Quiz Ids:", quiz_numbers);
         //segment_numbers.sort((a:number, b: number) => a - b);
         //console.log("new Segment Numbers:", segment_numbers);
         
         setData(prev => {
           //console.log("Updating video segments with new segment numbers");
           const updatedRows = prev.map((row, index) => ({
             ...row,
             quiz_number: quiz_numbers[index],
           }));
           return updatedRows;
         });
         
       
  }

  const getColumnValues = (columnId: string): unknown[] => {
    return table.getRowModel().rows.map(row => row.getValue(columnId));
  };


  return (
    // NOTE: This provider creates div elements, so don't nest inside of <table> elements
    <div>
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="bg-bgColor2 text-textColor2">
        <div className="bg-bgColor2 text-textColor2" />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => rerender()} className="border p-1">
            Regenerate
          </button>
        </div>
        <div className="bg-bgColor2 text-textColor2" />
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </tbody>
        </table>
        
      </div>
    </DndContext>
                  <button className='text-textColor1 bg-bgColor1 rounded-lg p-2 m-2'
                  onClick={sort_table}
                  >
                    Renumber Quizzes
                 
    </button>
    </div>
  );


}
//<pre>{JSON.stringify(data, null, 2)}</pre>
export default QuizzesTable