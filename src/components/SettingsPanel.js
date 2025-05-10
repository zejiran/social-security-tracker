import React from 'react';
import { Card, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';

const SettingsPanel = ({
  recurringItems,
  onItemChange,
  onAddItem,
  onRemoveItem,
  costosPercent,
  setCostosPercent,
  includeSolidarity,
  setIncludeSolidarity
}) => {
  return (
    <Card>
      <Card.Body>
        <h4 className="mb-4">Settings</h4>
        
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Recurring Income Items</h5>
          </Card.Header>
          <Card.Body>
            <p className="text-muted mb-3">
              Configure the items that will appear in your monthly income form. These will be pre-filled each month.
            </p>
            <ListGroup className="mb-3">
              {recurringItems.map((item) => (
                <ListGroup.Item key={item.id}>
                  <div className="d-flex align-items-center justify-content-between">
                    <Form.Group className="mb-0 flex-grow-1 me-3">
                      <Form.Control
                        type="text"
                        value={item.name}
                        onChange={(e) => onItemChange(item.id, 'name', e.target.value)}
                        placeholder="Item name"
                      />
                    </Form.Group>
                    
                    <InputGroup style={{ width: '200px' }}>
                      <InputGroup.Text>USD</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={item.defaultUSD || ''}
                        onChange={(e) => onItemChange(item.id, 'defaultUSD', Number(e.target.value) || 0)}
                        placeholder="Default USD value"
                      />
                    </InputGroup>
                    
                    <Button 
                      variant="outline-danger" 
                      className="ms-3"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button variant="primary" onClick={onAddItem}>
              Add New Item
            </Button>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Header>
            <h5 className="mb-0">Calculation Settings</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Default Costos Percentage</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={costosPercent}
                  onChange={(e) => setCostosPercent(parseFloat(e.target.value) || 0)}
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
              <Form.Text className="text-muted">
                This percentage is used for the "Presumption of Costs" calculation method.
              </Form.Text>
            </Form.Group>
            
            <Form.Group>
              <Form.Check
                type="checkbox"
                id="default-solidarity"
                label="Include Solidarity Contribution (1%) by default"
                checked={includeSolidarity}
                onChange={(e) => setIncludeSolidarity(e.target.checked)}
              />
              <Form.Text className="text-muted">
                When checked, the 1% solidarity contribution will be included in calculations by default.
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default SettingsPanel;