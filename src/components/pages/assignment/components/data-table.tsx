import React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import Cookies from "js-cookie";
import { error } from "console";
import { useNavigate } from "react-router-dom";

export function DataTable({ data, columns, onUpdateRow }) {
    const navigate = useNavigate();
  const user = JSON.parse(Cookies.get("user") || "{}"); // Retrieve user data from cookies
  const accessToken = Cookies.get("access_token"); // Retrieve access token from cookies
  // Table state
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Form state
  const [selectedRowData, setSelectedRowData] = React.useState<TData | null>(
    null
  );
  const [editedData, setEditedData] = React.useState<Partial<TData> | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Handle row selection
  const handleRowSelect = (rowData: TData) => {
    setSelectedRowData(rowData);
    setEditedData({
      id: rowData.id,
      title: rowData.title,
      status: rowData.status,
      priority: rowData.priority,
    });
  };

  // Handle form field changes
  const handleFieldChange = (field: string, value: string) => {
    setEditedData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  // Handle status change
  const handleStatusChange = (status: string) => {
    handleFieldChange("status", status);
  };

  // Handle priority change
  const handlePriorityChange = (priority: string) => {
    handleFieldChange("priority", priority);
  };

  // Handle save
  const handleSave = async () => {
    if (!editedData || !selectedRowData) return;

    try {

      // Call the update callback
      setIsSubmitting(true);

      // Check if there are actual changes
      const hasChanges = Object.keys(editedData).some(
        (key) => editedData[key] !== selectedRowData[key]
      );

      if (!hasChanges) {
        console.log("No changes to save");
        return;
      }

      // Prepare the request
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);

      // Prepare the body data
      const raw = JSON.stringify({
        title: editedData.id,
        description: editedData.title,
        status: editedData.status?.toLowerCase() || "todo",
        priority: editedData.priority?.toLowerCase(),
        label: editedData.label || 1,
      });
      console.log(raw);
      let id = -1;
      for (let i = 0; i < onUpdateRow.length; i++) {
        console.log(onUpdateRow[i]);
        console.log(onUpdateRow[i]["title"],selectedRowData.id,onUpdateRow[i]["description"],selectedRowData.title);
        if(onUpdateRow[i]["title"]===selectedRowData.id&&onUpdateRow[i]["description"]===selectedRowData.title){
            id = onUpdateRow[i]["id"];
            break;
        }
    }

    if (id === -1) {
        throw new Error("No such Note exist");
    }
    
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
      };

      // Make the API call
      const response = await fetch(
        `http://127.0.0.1:8000/assignment/assignments/${id}/`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Update successful:", result);

      // Reset form state
      setSelectedRowData(null);
      setEditedData(null);

      // Reset form state
      setSelectedRowData(null);
      setEditedData(null);
      // i want to refresh the page if the code get here for ChatGpt
      window.location.reload();
    } catch (error) {
      console.error("Failed to save changes:", error);
      // Here you might want to show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Sheet key={row.id}>
                  <SheetTrigger asChild>
                    <TableRow
                      onClick={() => handleRowSelect(row.original)}
                      data-state={row.getIsSelected() && "selected"}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit Row {editedData?.id}</SheetTitle>
                      <SheetDescription>
                        <div className="flex-none h-1/3 flex flex-col items-start pl-4 pt-4">
                          <div className="w-full mb-2">
                            <label className="block text-sm font-medium mb-1">
                              Title
                            </label>
                            <textarea
                              value={editedData?.title || ""}
                              onChange={(e) =>
                                handleFieldChange("title", e.target.value)
                              }
                              className="mt-1 p-2 border rounded-md w-full h-20 resize-none"
                            />
                          </div>
                          <div className="w-full mb-2">
                            <label className="block text-sm font-medium mb-1">
                              Description
                            </label>
                            <textarea
                              value={editedData?.description || ""}
                              onChange={(e) =>
                                handleFieldChange("description", e.target.value)
                              }
                              className="mt-1 p-2 border rounded-md w-full h-20 resize-none"
                            />
                          </div>
                          <div className="w-full mt-2">
                            <label className="block text-sm font-medium mb-1">
                              Status
                            </label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                  {editedData?.status || "Select Status"}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {["Present", "Absent", "No Class"].map(
                                  (status) => (
                                    <DropdownMenuItem
                                      key={status}
                                      onSelect={() =>
                                        handleStatusChange(status)
                                      }
                                    >
                                      {editedData?.status}
                                    </DropdownMenuItem>
                                  )
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="w-full mt-2">
                            <label className="block text-sm font-medium mb-1">
                              Priority
                            </label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                  {editedData?.priority || "Select Priority"}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {["High", "Medium", "Low"].map((priority) => (
                                  <DropdownMenuItem
                                    key={priority}
                                    onSelect={() =>
                                      handlePriorityChange(
                                        priority.toLowerCase()
                                      )
                                    }
                                  >
                                    {priority}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="mt-4 space-x-2">
                            <Button
                              onClick={handleSave}
                              disabled={isSubmitting || !editedData}
                            >
                              {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </div>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export default DataTable;
