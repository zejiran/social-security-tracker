import React from 'react';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

const IncomeTable = ({
  entries,
  currentMonth,
  onMonthChange,
  onEntryChange,
  onTRMFetch,
  onExport,
  totalCOP
}) => {
  // Generate Month options for the last 12 months
  const getMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      options.push(date);
    }
    
    return options;
  };

  return (
    <Card>
      <Card.Body>
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Month:</Form.Label>
              <DatePicker
                selected={currentMonth}
                onChange={onMonthChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="form-control"
              />
            </Form.Group>
          </Col>
          <Col md={6} className="text-end">
            <Button variant="success" onClick={onExport}>
              Export to Excel
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Description</th>
              <th>USD Amount</th>
              <th>Date</th>
              <th>TRM</th>
              <th>COP Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    type="text"
                    value={entry.name}
                    onChange={(e) => onEntryChange(index, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={entry.usd || ''}
                    onChange={(e) => onEntryChange(index, 'usd', Number(e.target.value))}
                    className="currency-field"
                  />
                </td>
                <td>
                  <DatePicker
                    selected={entry.date instanceof Date ? entry.date : new Date(entry.date)}
                    onChange={(date) => {
                      onEntryChange(index, 'date', date);
                      onTRMFetch(index, date);
                    }}
                    className="form-control date-field"
                    dateFormat="yyyy-MM-dd"
                  />
                </td>
                <td className="text-center">
                  {entry.trm ? entry.trm.toFixed(2) : (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onTRMFetch(index, entry.date)}
                    >
                      Fetch TRM
                    </Button>
                  )}
                </td>
                <td className="text-end">
                  {entry.cop ? entry.cop.toLocaleString('es-CO') : '-'}
                </td>
                <td className="text-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onEntryChange(index, 'usd', 0)}
                  >
                    Clear
                  </Button>
                </td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={4} className="text-end">
                <strong>Total:</strong>
              </td>
              <td className="text-end">
                <strong>{totalCOP.toLocaleString('es-CO')}</strong>
              </td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default IncomeTable;