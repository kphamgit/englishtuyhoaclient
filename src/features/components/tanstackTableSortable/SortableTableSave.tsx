import Table from "./Table.tsx"; // Adjust the path as necessary
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";

export interface RowProps {
  id: string;
  fileName: string;
  duration: string;
}

export interface ColumnProps {
    accessorKey: string;
    header: string;
}

export default function SortableTableSave() {
  const [testData, setTestData] = useState<RowProps[]>([
    { id: "a1", fileName: "Test Audio 1", duration: "2:30" },
    { id: "a2", fileName: "Test Audio 2", duration: "3:45" },
    { id: "a3", fileName: "Test Audio 3", duration: "4:15" },
  ]);

  const testColumns : ColumnProps[] = [
    { accessorKey: "draggable", header: "Drag" },
    { accessorKey: "fileName", header: "File Name" },
    { accessorKey: "duration", header: "Duration" },
  ];

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Table
        data={testData}
        setData={(oldData:any, active:any, over:any) => {
          const oldIndex = oldData.findIndex((row:any) => row.id === active.id);
          const newIndex = oldData.findIndex((row:any) => row.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            const newData:any = arrayMove(oldData, oldIndex, newIndex);
            setTestData(newData);
          }
        }}
        columns={testColumns}
      />
    </div>
  );
}
