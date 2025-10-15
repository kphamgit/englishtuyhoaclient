import React, { useEffect } from "react";

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


export interface genericItemType {
  itemId: string;
  item_number: number;
}

/*
generic type T can be any object type, e.g., ShortQuizProps, QuestionProps, UnitProps, etc.
*/

interface GenericTableProps<T extends { itemId: string }> {
    input_data: T[]; // Use the generic type for the data array
    columns: ColumnDef<T>[]; // Use the generic type for the column definitions
    parent_notify_reset_item_numbers?: (combined: genericItemType[]) => void; // Optional callback prop
  }

// Row Component
interface DraggableRowProps<T extends { itemId: string }> {
  row: Row<T>; // Use the generic type for the row
}

const DraggableRow = <T extends { itemId: string }>({ row }: DraggableRowProps<T>) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.itemId, // Use `as any` or ensure `T` has `itemId`
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform), // Let dnd-kit handle the transform
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell) => (
        <td className="bg-bgColor2 text-textColor2 px-2 text-lg" key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};



function GenericSortableTable<T extends genericItemType>({
  input_data,
  columns,
  parent_notify_reset_item_numbers,
}: GenericTableProps<T>) {
  useEffect(() => {
    setData(input_data);
  }, [input_data]);

  const [data, setData] = React.useState<T[]>([]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => (data ? data.map((row) => row.itemId) : []),
    [data]
  );

  const rerender = () => setData([...data]);

  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.itemId,
  
  });

/*
 const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        id: "delete_generic",
        header: "Delete",
        cell: (info) => (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
            onClick={() => console.log(info.row.original.itemId)}
          >
            Delete Generic
          </button>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.itemId,
  
  });
*/


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const reset_item_numbers = () => {
    const item_ids = getColumnValues("itemId") as string[];
    const sorted_numbers: number[] = getColumnValues("item_number") as number[];
    for (let i = 0; i < sorted_numbers.length; i++) {
      sorted_numbers[i] = (i + 1);
    }

    const combined = item_ids.map((id, index) => ({
      itemId: id,
      item_number: sorted_numbers[index],
    }));

    parent_notify_reset_item_numbers?.(combined);
    setData((prev) => {
      const updatedRows = prev.map((row, index) => ({
        ...row,
        item_number: sorted_numbers[index],
      }));
      return updatedRows;
    });
  };

  const getColumnValues = (columnId: string): unknown[] => {
    return table.getRowModel().rows.map((row) => row.getValue(columnId));
  };

  return (
    <div>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="bg-bgColor2 text-textColor2">
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
      <div className="bg-bgColor2 text-textColor2 p-3">
      <button
        className="text-textColor1 bg-bgColor4 rounded-lg px-5 pt-3 mt-2"
        onClick={reset_item_numbers}
      >
        Renumber Item
      </button>
      </div>
    </div>
  );
}
export default GenericSortableTable