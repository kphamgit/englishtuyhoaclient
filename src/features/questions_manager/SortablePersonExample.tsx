import React, { CSSProperties } from "react";
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

  
type Person = {
    userId: string
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status:  string,
    subRows?: Person[]
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
const DraggableRow = ({ row }: { row: Row<Person> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.userId,
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
        <td key={cell.id} style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

// Table Component
function SortablePersonExample() {
  
const columns = React.useMemo<ColumnDef<{ userId: string; firstName: string; lastName: string; age: number; visits: number; progress: number; status: string; }>[]>(
    () => [
      // Create a dedicated drag handle column. Alternatively, you could just set up dnd events on the rows themselves.
      {
        id: "drag-handle",
        header: "Move",
        cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
        size: 60,
      },
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorKey: "age",
        header: () => "Age",
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
      },
    ],
    []
  );

  const [data, setData] = React.useState([
    {
      userId: "9cb7ad58-6236-4476-8ddd-35fb55423ff9",
      firstName: "Francesco",
      lastName: "Emard",
      age: 39,
      visits: 288,
      progress: 80,
      status: "single",
    },
    {
      userId: "295b0312-6009-453d-bd7e-b77de9dbc230",
      firstName: "Evelyn",
      lastName: "McLaughlin",
      age: 21,
      visits: 711,
      progress: 91,
      status: "relationship",
    },
    {
      userId: "38ca1624-1cf5-4c69-adbc-bd34f6c28c81",
      firstName: "Jewel",
      lastName: "Halvorson",
      age: 0,
      visits: 497,
      progress: 38,
      status: "complicated",
    },
    {
      userId: "3b88887c-ec73-4f68-b2fa-9387cbdf3c7f",
      firstName: "Dedrick",
      lastName: "Ratke",
      age: 10,
      visits: 94,
      progress: 74,
      status: "complicated",
    },
  ]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ userId }) => userId),
    [data]
  );

  const rerender = () => setData([
    {
      userId: "9cb7ad58-6236-4476-8ddd-35fb55423ff9",
      firstName: "Francesco",
      lastName: "Emard",
      age: 39,
      visits: 288,
      progress: 80,
      status: "single",
    },
    {
      userId: "295b0312-6009-453d-bd7e-b77de9dbc230",
      firstName: "Evelyn",
      lastName: "McLaughlin",
      age: 21,
      visits: 711,
      progress: 91,
      status: "relationship",
    },
    {
      userId: "38ca1624-1cf5-4c69-adbc-bd34f6c28c81",
      firstName: "Jewel",
      lastName: "Halvorson",
      age: 0,
      visits: 497,
      progress: 38,
      status: "complicated",
    },
    {
      userId: "3b88887c-ec73-4f68-b2fa-9387cbdf3c7f",
      firstName: "Dedrick",
      lastName: "Ratke",
      age: 10,
      visits: 94,
      progress: 74,
      status: "complicated",
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.userId, //required because row indexes will change
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

  return (
    // NOTE: This provider creates div elements, so don't nest inside of <table> elements
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="p-2">
        <div className="h-4" />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => rerender()} className="border p-1">
            Regenerate
          </button>
        </div>
        <div className="h-4" />
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
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </DndContext>
  );


}

export default SortablePersonExample