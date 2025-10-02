// https://tanstack.com/table/v8/docs/framework/react/examples/row-selection

import React from "react";
import { RowProps } from "./SortableTable";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./Table.module.css";

// Drag handle for rows
function DragHandle({ row }: { row:any }) {
  const { attributes, listeners } = useSortable({ id: row.original.id });

  return (
    <button
      {...attributes}
      {...listeners}
      className={styles.dragHandle}
      title="Drag to reorder"
    >
      🟰
    </button>
  );
}

// Row Component
function Row({ row }: { row: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: row.original.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.row}
    >
      {row.getVisibleCells().map((cell:any, index:any) => (
        <td key={cell.id} className={styles.cell}>
          {index === 0 ? <DragHandle row={row} /> : null}
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

// Table Component

function Table({ data, setData, columns }: { data: RowProps[]; setData: (data: RowProps[], active: any, over: any) => void; columns: ColumnDef<RowProps>[] }) {
  const tableColumns = React.useMemo(() => [...columns], [columns]);

  const my_react_table = useReactTable({
      data,
      columns: tableColumns,
      getCoreRowModel: getCoreRowModel(),
    });
  
    const handleDragEnd = (event:any) => {
      const { active, over } = event;
  
      if (!active?.id || !over?.id || active.id === over.id) {
        return;
      }
  
      setData(data, active, over);
    };
  
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={data.map((row:any) => row.id)}
        strategy={verticalListSortingStrategy}
      >
        <table className={styles.table}>
          <thead>
            {my_react_table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={styles.headerRow}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.headerCell}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {my_react_table.getRowModel().rows.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}

export default Table;