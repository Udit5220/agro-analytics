// GenericTable.jsx
import React, { useState } from "react";

const GenericTable = ({
  columns,
  data,
  onRowClick,
  rowClassName,
  actions,
  itemsPerPage = 10,
  showSearch = true,
  showSort = true,
  searchPlaceholder = "Search...",
  emptyMessage = "No data found",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  const filteredData = data.filter((row) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return columns.some((col) => {
      const value = row[col.accessor];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(query);
    });
  });

  // Sort data
  const sortedData = [...filteredData];
  if (sortColumn) {
    sortedData.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];
      if (aVal === undefined) aVal = "";
      if (bVal === undefined) bVal = "";
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (accessor) => {
    if (sortColumn === accessor) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(accessor);
      setSortDirection("asc");
    }
  };

  return (
    <div className="w-full">
      {/* Search and Sort Bar */}
      {(showSearch || showSort) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          {showSearch && (
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 pl-9 focus:outline-none focus:border-brand-medium focus:ring-1 focus:ring-[#28a745]/30"
              />
              <svg
                className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
          {showSort && sortColumn && (
            <div className="text-[10px] text-gray-400">
              Sorting by:{" "}
              <span className="font-semibold text-brand-dark">
                {columns.find((c) => c.accessor === sortColumn)?.header}
              </span>{" "}
              ({sortDirection === "asc" ? "Ascending" : "Descending"})
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`text-left py-3 px-4 ${
                    col.sortable !== false
                      ? "cursor-pointer hover:text-brand-dark"
                      : ""
                  } ${col.className || ""}`}
                  onClick={() =>
                    col.sortable !== false && handleSort(col.accessor)
                  }
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      {col.header}
                    </span>
                    {col.sortable !== false && sortColumn === col.accessor && (
                      <span className="text-[10px] text-brand-dark">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="text-left py-3 px-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={(columns.length || 0) + (actions ? 1 : 0)}
                  className="text-center py-8 text-gray-400 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-gray-100 transition cursor-pointer ${
                    rowClassName ? rowClassName(row) : "hover:bg-gray-50/50"
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-3 px-4 text-xs text-gray-700 ${col.cellClassName || ""}`}
                    >
                      {col.cell
                        ? col.cell(row[col.accessor], row)
                        : row[col.accessor]}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {actions.map((action, actionIdx) => (
                          <button
                            key={actionIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            className={`text-xs font-medium ${action.className || "text-brand-dark hover:underline"}`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-2">
          <div className="text-[10px] text-gray-400">
            Showing {Math.min(1, sortedData.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-55 transition text-xs"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-xs text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-55 transition text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericTable;
