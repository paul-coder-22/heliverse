import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';

function AutohideExample() {
    const [show, setShow] = useState(false);

    return (
        <Row>
            <Col xs={6}>
                <Toast show={show} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Bootstrap</strong>
                        <small>11 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
                </Toast>
            </Col>
        </Row>
    );
}

export default AutohideExample;