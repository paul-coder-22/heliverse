import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-bootstrap';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';

function UserForm({ addUser, updateUser, currentUser }) {
    const [newUser, setNewUser] = useState({
        first_name: '',
        last_name: '',
        domain: '',
        gender: '',
        available: '',
    });

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setNewUser({
                first_name: currentUser.first_name,
                last_name: currentUser.last_name,
                domain: currentUser.domain,
                gender: currentUser.gender,
                available: currentUser.available,
                ...currentUser,
            });
        }
    }, [currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !newUser.first_name ||
            !newUser.last_name ||
            !newUser.domain ||
            !newUser.gender ||
            !String(newUser.available)
        ) {
            alert('Please fill in all fields.');
            return;
        }

        if (currentUser) {
            updateUser({
                ...newUser,
            });
        } else {
            addUser(newUser);
        }

        setNewUser({
            first_name: '',
            last_name: '',
            domain: '',
            gender: '',
            available: '',
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="filterbox">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            value={newUser.first_name}
                            placeholder="Enter first name"
                            onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            value={newUser.last_name}
                            placeholder="Enter last name"
                            onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="domain">Domain:</label>
                        <select
                            className="form-control"
                            id="domain"
                            value={newUser.domain}
                            onChange={(e) => setNewUser({ ...newUser, domain: e.target.value })}
                        >
                            <option value="">Select Domain</option>
                            <option value="Finance">Finance</option>
                            <option value="IT">IT</option>
                            <option value="Marketing">Marketing</option>
                            <option value="UI Designing">UI Designing</option>
                            <option value="Business Development">Business Development</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender:</label>
                        <select
                            className="form-control"
                            id="gender"
                            value={newUser.gender}
                            onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="available">Available:</label>
                        <select
                            className="form-control"
                            id="available"
                            value={newUser.available}
                            onChange={(e) => setNewUser({ ...newUser, available: e.target.value })}
                        >
                            <option value="">Select Availability</option>
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                    </div>
                </div>

                <div className="d-grid gap-2 col-3 mx-auto">
                    <button type="submit" onClick={() => setShow(true)} className={`btn ${currentUser?.id ? 'btn-warning' : 'btn-success'}`}>
                        {currentUser?.id ? 'Update' : 'Add'}
                    </button>
                </div>
            </form>

            <ToastContainer
                className="p-3"
                position={'top-end'}
                style={{ zIndex: 1 }}
            >
                <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide >
                    <Toast.Header>
                        <strong className="me-auto">{currentUser?.id ? 'User Updated' : 'User Added'}</strong>
                    </Toast.Header>
                </Toast>
            </ToastContainer>
        </>
    );
}

export default UserForm;
