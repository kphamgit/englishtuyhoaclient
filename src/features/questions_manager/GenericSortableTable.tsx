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
import { ShortQuizProps } from "./ListQuizzes";



  interface GenericTableProps {
    input_data: ShortQuizProps[]; // Define the type of the data prop
    columns: ColumnDef<ShortQuizProps>[]; // Dynamic column definitions
  }

// Row Component
const DraggableRow = ({ row }: { row: Row<ShortQuizProps> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.itemId,
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
function GenericSortableTable({ input_data, columns }: GenericTableProps) {

  useEffect(() => {
    //console.log("********************** quiz_data prop updated:", table_data);
    setData(input_data);
  }
  , [input_data]);

  const [data, setData] = React.useState<ShortQuizProps[]>([]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => (data ? data.map(({ itemId}) => itemId) : []),
    [data]
  );

  const rerender = () => setData([...data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.itemId, //required because row indexes will change
   
  });

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

  const reset_item_numbers = () => {
    // sort all item numbers in the specified column to be sequential starting from 1
    // item can be : quiz, question, unit....
    // corresponding item numbers: quiz_number, question_number, unit_number
   // console.log("Renumbering column id:", );
    const sorted_numbers: string[] = getColumnValues('item_number') as string[];
    for (let i = 0; i < sorted_numbers.length; i++) {
      sorted_numbers[i] = (i + 1).toString();
    }
    console.log("sorted item numbers:", sorted_numbers);
 
    setData(prev => {
      const updatedRows = prev.map((row, index) => ({
        ...row,
        item_number: sorted_numbers[index],
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
                  onClick={reset_item_numbers}
                  >
                    Renumber Quizzes
                 
    </button>
    </div>
  );


}
//<pre>{JSON.stringify(data, null, 2)}</pre>
export default GenericSortableTable