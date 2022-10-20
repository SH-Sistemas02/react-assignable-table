import { Column, IdType, Row, usePagination, useTable } from "react-table";
import BTable from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import { useEffect } from "react";

export interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  controlledPaging?: boolean;
  pageCount?: number;
  skipPageReset?: boolean;
  fetchData?: {
    (table: { page: number; pageSize: number }): void;
  };

  getRowId?: {
    (row: T, relativeIndex: number, parent?: Row<T> | undefined): string;
  };

  updateData?: {
    (rowIndex: number, columnId: keyof T, value: any): void;
  };
}

export default function Table<T extends object = any>(props: TableProps<T>) {
  const {
    columns,
    data,
    controlledPaging,
    fetchData,
    pageCount: controlledPageCount,
    skipPageReset,
    getRowId,
    updateData
  } = props;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      manualPagination: controlledPaging,
      pageCount: controlledPageCount,
      autoResetPage: !skipPageReset,
      getRowId,
      updateData
    },
    usePagination
  );

  useEffect(() => {
    if (!controlledPaging) {
      return;
    }

    fetchData?.({
      page: pageIndex,
      pageSize
    });
  }, [controlledPaging, fetchData, pageIndex, pageSize]);

  return (
    <>
      <BTable {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>

      <Pagination>
        <Pagination.First
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        />
        <Pagination.Prev onClick={previousPage} disabled={!canPreviousPage} />
        <Pagination.Next onClick={nextPage} disabled={!canNextPage} />
        <Pagination.Last
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        />
      </Pagination>
    </>
  );
}
