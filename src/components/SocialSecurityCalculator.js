import React from 'react';
import { Card, Form, Row, Col, Table } from 'react-bootstrap';
import { format } from 'date-fns';

const SocialSecurityCalculator = ({
  totalIncome,
  costosPercent,
  setCostosPercent,
  includeSolidarity,
  setIncludeSolidarity,
  currentMonth
}) => {
  // Calculate bases
  const directBase = totalIncome * 0.4;
  const presuncionBase = totalIncome * (1 - costosPercent) * 0.4;
  
  // Health calculation (12.5%)
  const directHealth = directBase * 0.125;
  const presuncionHealth = presuncionBase * 0.125;
  
  // Pension calculation (16%)
  const directPension = directBase * 0.16;
  const presuncionPension = presuncionBase * 0.16;
  
  // Solidarity calculation (1% - optional)
  const directSolidarity = includeSolidarity ? directBase * 0.01 : 0;
  const presuncionSolidarity = includeSolidarity ? presuncionBase * 0.01 : 0;
  
  // Totals
  const directTotal = directHealth + directPension + directSolidarity;
  const presuncionTotal = presuncionHealth + presuncionPension + presuncionSolidarity;
  
  // Rounded totals (to nearest 100)
  const roundedDirectTotal = Math.ceil(directTotal / 100) * 100;
  const roundedPresuncionTotal = Math.ceil(presuncionTotal / 100) * 100;
  
  // Format as Colombian Pesos
  const formatCOP = (value) => {
    return value.toLocaleString('es-CO');
  };
  
  return (
    <Card>
      <Card.Body>
        <h4 className="mb-3">Social Security Calculator for {format(currentMonth, 'MMMM yyyy')}</h4>
        
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Total Income (COP): {formatCOP(totalIncome)}</Form.Label>
              <Form.Control readOnly value={formatCOP(totalIncome)} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Costos Percent (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={costosPercent}
                onChange={(e) => setCostosPercent(parseFloat(e.target.value) || 0)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Check
              type="checkbox"
              id="include-solidarity"
              className="mt-4"
              label="Include Solidarity (1%)"
              checked={includeSolidarity}
              onChange={(e) => setIncludeSolidarity(e.target.checked)}
            />
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Card className="calculation-method">
              <Card.Header>
                <h5 className="mb-0">Direct Method</h5>
              </Card.Header>
              <Card.Body>
                <div className="calculation-detail">
                  <span>Base (40% of Income):</span>
                  <span>{formatCOP(directBase)}</span>
                </div>
                <div className="calculation-detail">
                  <span>Health (12.5%):</span>
                  <span>{formatCOP(directHealth)}</span>
                </div>
                <div className="calculation-detail">
                  <span>Pension (16%):</span>
                  <span>{formatCOP(directPension)}</span>
                </div>
                {includeSolidarity && (
                  <div className="calculation-detail">
                    <span>Solidarity (1%):</span>
                    <span>{formatCOP(directSolidarity)}</span>
                  </div>
                )}
                <div className="calculation-total">
                  <span>Total to Pay:</span>
                  <span>{formatCOP(roundedDirectTotal)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="calculation-method">
              <Card.Header>
                <h5 className="mb-0">Presumption of Costs Method</h5>
              </Card.Header>
              <Card.Body>
                <div className="calculation-detail">
                  <span>Base (40% of Income after {costosPercent * 100}% costs):</span>
                  <span>{formatCOP(presuncionBase)}</span>
                </div>
                <div className="calculation-detail">
                  <span>Health (12.5%):</span>
                  <span>{formatCOP(presuncionHealth)}</span>
                </div>
                <div className="calculation-detail">
                  <span>Pension (16%):</span>
                  <span>{formatCOP(presuncionPension)}</span>
                </div>
                {includeSolidarity && (
                  <div className="calculation-detail">
                    <span>Solidarity (1%):</span>
                    <span>{formatCOP(presuncionSolidarity)}</span>
                  </div>
                )}
                <div className="calculation-total">
                  <span>Total to Pay:</span>
                  <span>{formatCOP(roundedPresuncionTotal)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <div className="mt-4 p-3 bg-light rounded">
          <h6>Formula Explained:</h6>
          <ul>
            <li>Direct Method: <code>40% of Total Income</code> as the base</li>
            <li>Presumption of Costs: <code>40% of (Total Income * (1 - Costs%))</code> as the base</li>
            <li>Then for each base, calculate:
              <ul>
                <li>Health: <code>Base * 12.5%</code></li>
                <li>Pension: <code>Base * 16%</code></li>
                <li>Solidarity (optional): <code>Base * 1%</code></li>
              </ul>
            </li>
            <li>Total is rounded up to the nearest 100 COP</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SocialSecurityCalculator;