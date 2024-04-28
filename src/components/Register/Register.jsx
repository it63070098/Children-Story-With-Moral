import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";
import { useUserAuth } from "../../context/UserAuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Register/Register.css';

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
        await signUp(email, password);
        navigate("/");
    } catch(err) {
        setError(err.message);
        console.log(err);
    }
  };

  return (
    <div className="register">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="" to={'/sign-in'}>
            <img className='nav-img' src="https://firebasestorage.googleapis.com/v0/b/senior-project-children-story.appspot.com/o/web%2Flogo%20web.png?alt=media&token=d17659af-cdc4-43f2-a925-a8cd578c0f78"alt="Logo" />
            </Link>
          </div>
        </nav>
      <div className="auth-wrapper">
          <div className="auth-inner">
          <h2 className="mb-3 text-center">สร้างบัญชีผู้ใช้</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
          <label>อีเมล</label>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="กรอกอีเมล"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <label>รหัสผ่าน</label>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="กรอกรหัสผ่าน"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-center align-items-center">
              <Button className="btn-register"variant="primary" type="submit">
              สร้างบัญชีผู้ใช้
              </Button>
            </div>
          </Form>
          <div className="p-1 box mt-1 text-center">
            มีบัญชีแล้วใช่ไหม? <Link className="link-to-register" to="/login">เข้าสู่ระบบ</Link>
          </div>
      </div>
      </div>
    </div>
  );
}

export default Register;