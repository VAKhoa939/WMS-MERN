import "../../css/Table.css";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { FaSort, FaSortDown, FaSortUp, FaPlus, FaSearch } from "react-icons/fa";
import { FilterSidebar } from "./FilterSideBar";
import { Link, useNavigate } from "react-router-dom";
import { Column } from "../utils/tableColumns";
import NavLookup from "../utils/navigateLookup";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: Column[];
  baseURL: string;
}

const Table = ({ data, columns, baseURL }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: pagination,
      sorting: sorting,
      globalFilter: filtering,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="relative">
      <FilterSidebar table={table} columns={columns} />
      <div className="table-background">
        <div className="table-buttons">
          <div className="search-bar">
            <input
              type="text"
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              placeholder="Tìm kiếm tất cả cột..."
            />
            <div className="search-icon">
              <FaSearch size={22} />
            </div>
          </div>
          {baseURL !== NavLookup.USER_BASE_PATH && (
            <div
              onClick={() => navigate(`${baseURL}/create`)}
              className="create-btn"
            >
              <FaPlus size={22} className="icon" />
              <label>Tạo mới</label>
            </div>
          )}
        </div>
        <div className="table-container">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {
                            <span className="inline-block w-4">
                              {header.column.getCanSort()
                                ? {
                                    asc: <FaSortUp className="icon" />,
                                    desc: <FaSortDown className="icon" />,
                                    false: <FaSort className="icon" />, // Default state
                                  }[
                                    (header.column.getIsSorted() as string) ??
                                      "false"
                                  ]
                                : null}
                            </span>
                          }
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, index) => {
                    if (index === 0)
                      return (
                        <td key={cell.id}>
                          <Link to={`${baseURL}/${data[rowIndex]._id}`}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Link>
                        </td>
                      );
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot />
          </table>
        </div>

        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="pagination-btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          {Array.from({ length: table.getPageCount() }, (_, index) => (
            <button
              key={index}
              className={`pagination-btn index-btn`}
              onClick={() => table.setPageIndex(index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="pagination-btn"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
          <span className="page-number">
            <div>Trang</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} trên{" "}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Table;
