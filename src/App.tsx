import { useCallback, useEffect, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import { Button, Container, Modal } from "react-bootstrap";
import ReubicacionTable from "./ReubicacionTable";

import "bootstrap/dist/css/bootstrap.min.css";

const ButtonCell = <T extends object>(
  props: CellProps<T> & {
    updateData?: (rowIndex: number, columnId: string, value: any) => void;
    reallocate?: (id: string) => void;
  }
) => {
  const { column, row, value, updateData, reallocate } = props;
  const handleClick = () => {
    reallocate?.(row.id);
  };

  return (
    <Button size="sm" onClick={handleClick}>
      Assign
    </Button>
  );
};

export default function App() {
  const [reallocating, setReallocating] = useState<string | number | null>(
    null
  );
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

  const getRowId = useCallback((row: any) => {
    return row.id;
  }, []);

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

  const reallocate = (id: string) => {
    setReallocating(id);
  };

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
        <ReubicacionTable
          columns={columns}
          data={data}
          getRowId={getRowId}
          updateData={updateData}
          reallocate={reallocate}
          skipPageReset={skipPageReset}
        />

        <Modal
          size="sm"
          show={!!reallocating}
          onHide={() => setReallocating(null)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{reallocating}'s data</Modal.Title>
          </Modal.Header>

          <Modal.Body>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}
