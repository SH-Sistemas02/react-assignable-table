import { useEffect, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import { Button, Container } from "react-bootstrap";
import Table from "./Table";

import "bootstrap/dist/css/bootstrap.min.css";

const ButtonCell = <T extends object>(props: CellProps<T> & {
  updateData?: (rowIndex: number, columnId: string, value: any) => void
}) => {
  const { column, row, value, updateData } = props;

  return (
    <Button
      size="sm"
      onClick={() => {
        updateData?.(row.index, "assigned", Math.ceil(Math.random() * 10));
        updateData?.(row.index, "generated", "Ok");
      }}
    >
      Assign
    </Button>
  );
};

export default function App() {
  const columns: Column<any>[] = useMemo(
    () => [
      {
        accessor: "name",
        Header: "Color",
      },
      {
        accessor: "year",
        Header: "Year",
      },
      {
        accessor: "color",
        Header: "Code",
      },
      {
        accessor: "pantone_value",
        Header: "Pantone",
      },
      {
        accessor: "id",
        Cell: ButtonCell,
      },
      {
        accessor: "assigned",
        Header: "Assigned",
      },
      {
        accessor: "generated",
        Header: "Generated",
      },
    ],
    []
  );

  const [data, setData] = useState<any[]>([]);
  const [skipPageReset, setSkipPageReset] = useState(false);

  useEffect(() => {
    fetch(`https://reqres.in/api/unknown`)
      .then((response) => response.json())
      .then((body: { data: any[]; support: any }) => {
        console.log(body.support);
        setData(
          body.data.map((item, i) => {
            return {
              ...item,
              assigned: null,
              generated: null,
            };
          })
        );
      });
  }, []);

  const updateData = (rowIndex: number, columnId: any, value: any) => {
    setSkipPageReset(true);
    setData((oldState) => {
      return oldState.map((row, index) => {
        if (index !== rowIndex) {
          return row;
        }

        return {
          ...row,
          [columnId]: value,
        };
      });
    });
  };

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  return (
    <div className="App">
      <Container>
        <Table
          columns={columns}
          data={data}
          updateData={updateData}
          skipPageReset={skipPageReset}
        />
      </Container>
    </div>
  );
}
