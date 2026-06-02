import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../services/authService";
import { loginUser } from "../../store/authSlice";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user was redirected due to expired token
    if (location.state?.expired) {
      setInfo("Your session has expired. Please log in again.");
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setInfo(null);

  try {
    // Call backend login API with the correct object
    const response = await login(form);
    console.log("LOGIN RESPONSE:", response);


    // Extract token and user directly (no .data)
    const { token, user } = response;

    // Pass ONE object to loginUser
    dispatch(loginUser({ token, user }));

    // Redirect to home page
    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <Container
      fluid
      className="auth-container d-flex align-items-center justify-content-center"
    >
      <Card className="auth-card shadow-lg border-0 rounded-4 p-4 p-md-5">
        <h2 className="auth-title">Login</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Floating className="mb-4">
            <Form.Control
              id="floatingEmail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              required
              className="auth-form-control"
            />
            <label htmlFor="floatingEmail" className="auth-form-label">
              Email
            </label>
          </Form.Floating>

          <Form.Floating className="mb-4">
            <Form.Control
              id="floatingPassword"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              required
              className="auth-form-control"
            />
            <label htmlFor="floatingPassword" className="auth-form-label">
              Password
            </label>
          </Form.Floating>

          {info && <div className="auth-info">{info}</div>}
          {error && <div className="auth-error">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" role="status" />
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>Login
              </>
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Login;
