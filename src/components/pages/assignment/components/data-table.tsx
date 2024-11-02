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
import { priorities, statuses } from "../data/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Toast } from "@/components/ui/toast";

export function DataTable({ data, columns, onUpdateRow, onDataChange }) {
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
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

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

  // New delete handler
  const handleDelete = async () => {
    if (!selectedRowData) return;
    // console.log("delete",)

    try {
      setIsSubmitting(true);

      let id = -1;
      for (let i = 0; i < onUpdateRow.length; i++) {
        console.log(onUpdateRow[i]);
        console.log(
          onUpdateRow[i]["title"],
          selectedRowData.id,
          onUpdateRow[i]["description"],
          selectedRowData.title,
          onUpdateRow[i]["created_at"],
          selectedRowData.created_at
        );
        if (
          onUpdateRow[i]["title"] === selectedRowData.id &&
          onUpdateRow[i]["description"] === selectedRowData.title &&
          onUpdateRow[i]["created_at"] === selectedRowData.created_at
        ) {
          id = onUpdateRow[i]["id"];
          break;
        }
      }

      if (id === -1) {
        throw new Error("No such Note exists");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/assignment/assignments/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the UI by removing the deleted item
      if (onDataChange) {
        onDataChange((prevData) =>
          prevData.filter(
            (item) =>
              !(
                item.id === id
              )
          )
        );
      }

      // Reset states and close dialogs
      setSelectedRowData(null);
      setEditedData(null);
      setShowDeleteDialog(false);

    } finally {
      setIsSubmitting(false);
    }
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
        console.log(
          onUpdateRow[i]["title"],
          selectedRowData.id,
          onUpdateRow[i]["description"],
          selectedRowData.title,
          onUpdateRow[i]["created_at"],
          selectedRowData.created_at
        );
        if (
          onUpdateRow[i]["title"] === selectedRowData.id &&
          onUpdateRow[i]["description"] === selectedRowData.title &&
          onUpdateRow[i]["created_at"] === selectedRowData.created_at
        ) {
          id = onUpdateRow[i]["id"];
          break;
        }
      }

      console.log("raw", raw);

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
  // Handle save

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
                        <>
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        </>
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
                              value={editedData?.id || ""}
                              onChange={(e) =>
                                handleFieldChange("id", e.target.value)
                              }
                              className="mt-1 p-2 border rounded-md w-full h-20 resize-none"
                            />
                          </div>
                          <div className="w-full mb-2">
                            <label className="block text-sm font-medium mb-1">
                              Description
                            </label>
                            <textarea
                              value={editedData?.title || ""}
                              onChange={(e) =>
                                handleFieldChange("title", e.target.value)
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
                                <Button
                                  variant="ghost"
                                  className="h-8 flex items-center gap-2"
                                >
                                  {/* Extract the current status */}
                                  {statuses.find(
                                    (status) =>
                                      status.value === editedData?.status
                                  ) ? (
                                    <>
                                      {React.createElement(
                                        statuses.find(
                                          (status) =>
                                            status.value === editedData?.status
                                        )?.icon,
                                        {
                                          className:
                                            "h-4 w-4 text-muted-foreground",
                                        }
                                      )}
                                      <span>
                                        {
                                          statuses.find(
                                            (status) =>
                                              status.value ===
                                              editedData?.status
                                          )?.label
                                        }
                                      </span>
                                    </>
                                  ) : (
                                    <span>Select Status</span> // Fallback if status is not found
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  Set Status
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {statuses.map((statusOption) => (
                                  <DropdownMenuItem
                                    key={statusOption.value}
                                    onClick={() =>
                                      handleStatusChange(statusOption.value)
                                    }
                                  >
                                    <div className="flex items-center gap-2">
                                      {statusOption.icon && (
                                        <statusOption.icon className="h-4 w-4 text-muted-foreground" />
                                      )}
                                      <span>{statusOption.label}</span>
                                    </div>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="w-full mt-2">
                            <label className="block text-sm font-medium mb-1">
                              Priority
                            </label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 flex items-center gap-2"
                                >
                                  {/* Extract the current status */}
                                  {statuses.find(
                                    (status) =>
                                      status.value === editedData?.status
                                  ) ? (
                                    <>
                                      {React.createElement(
                                        priorities.find(
                                          (status) =>
                                            status.value ===
                                            editedData?.priority
                                        )?.icon,
                                        {
                                          className:
                                            "h-4 w-4 text-muted-foreground",
                                        }
                                      )}
                                      <span>
                                        {
                                          priorities.find(
                                            (status) =>
                                              status.value ===
                                              editedData?.priority
                                          )?.label
                                        }
                                      </span>
                                    </>
                                  ) : (
                                    <span>Select Priority</span> // Fallback if status is not found
                                  )}
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
                          <div className="w-full flex justify-around mt-4 space-x-2">
                            <Button
                              onClick={handleSave}
                              disabled={isSubmitting || !editedData}
                            >
                              {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                              disabled={isSubmitting || !editedData}
                            >
                              Delete
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

      {/* Delete Confirmation Dialog
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              assignment and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
}

export default DataTable;
