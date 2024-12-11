import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const DoctorFormModal = ({ showForm, setShowForm, doctorSignUp }) => {
  const [user, setUser] = useState({
    biography: "",
    designation: "",
    price: "",
    gender: "",
    specialization: "",
    clinicName: "",
    clinicAddress: "",
  });

  const handleMoreDetails = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Details: ", user);
    doctorSignUp(user); // Pass the user data to the sign-up function
    setShowForm(false); // Close the modal after submission
  };

  return (
    <Modal show={showForm} onHide={() => setShowForm(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>We would like to know more!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>About you</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="biography"
              maxLength={200}
              value={user.biography}
              onChange={handleMoreDetails}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              type="text"
              name="designation"
              value={user.designation}
              onChange={handleMoreDetails}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Pricing</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={user.price}
              onChange={handleMoreDetails}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={user.gender}
              onChange={handleMoreDetails}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Specialization</Form.Label>
            <Form.Control
              type="text"
              name="specialization"
              value={user.specialization}
              onChange={handleMoreDetails}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Clinic Name</Form.Label>
            <Form.Control
              type="text"
              name="clinicName"
              value={user.clinicName}
              onChange={handleMoreDetails}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Clinic Address</Form.Label>
            <Form.Control
              type="text"
              name="clinicAddress"
              value={user.clinicAddress}
              onChange={handleMoreDetails}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="ms-2">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DoctorFormModal;
