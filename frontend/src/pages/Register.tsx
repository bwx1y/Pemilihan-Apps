import {Button, Card, Col, Container, FloatingLabel, Form, Row} from "react-bootstrap";
import ballot from "../assets/images/ballot.png";
import {Formik} from "formik";
import {apiService} from "../utils/api-service.ts";
import {LoginErorr, RegisterRequest} from "../model/login-model.ts";
import {AxiosError, HttpStatusCode} from "axios";
import {Link, Navigate} from "react-router-dom";
import {useState} from "react";
import Swal from "sweetalert2";

const RegisterPage = () => {
    const [isRegister, setRegister] = useState<boolean>(false);

    if (isRegister) return <Navigate to={'/'}/>

    return (<Container>
        <Row className="d-flex vh-100 justify-content-center align-items-center">
            <Col md={5}>
                <Card>
                    <Card.Img src={ballot} variant="top" height="200px" style={{objectFit: "scale-down"}}/>
                    <Card.Body>
                        <Card.Title className="text-center">Please sign up</Card.Title>
                        <Formik initialValues={{
                            firstName: "",
                            lastName: "",
                            username: "",
                            password: "",
                        }} onSubmit={(values, {setSubmitting}) => {
                            apiService.post<RegisterRequest, unknown>("Auth/Register", values)
                                .then((res) => {
                                    if (res.status == HttpStatusCode.Ok) {
                                        setRegister(true)
                                    }
                                })
                                .catch((err: AxiosError<LoginErorr>) => {
                                    Swal.fire({
                                        icon: "error",
                                        title: err.response?.data.message
                                    })
                                })
                                .finally(() => {
                                    setSubmitting(false)
                                })
                        }}>
                            {({values, handleSubmit, handleChange, isSubmitting}) => (<Form onSubmit={handleSubmit}>
                                <div className="d-flex gap-2">
                                    <FloatingLabel label="First Name" controlId="firstName" className="mt-4 w-50">
                                        <Form.Control type="text" maxLength={100} name="firstName" placeholder="****"
                                                      onChange={handleChange} value={values.firstName}/>
                                    </FloatingLabel>
                                    <FloatingLabel label="Last Name" controlId="lastName" className="mt-4 w-50">
                                        <Form.Control type="text" maxLength={100} name="lastName" placeholder="****"
                                                      onChange={handleChange} value={values.lastName}/>
                                    </FloatingLabel>

                                </div>
                                <FloatingLabel label="Username" controlId="username" className="mt-4">
                                    <Form.Control type="username" maxLength={100} name="username" placeholder="****"
                                                  onChange={handleChange} value={values.username}/>
                                </FloatingLabel>
                                <FloatingLabel label="Password" controlId="password" className="mt-4">
                                    <Form.Control type="password" maxLength={100} name="password" placeholder="****"
                                                  onChange={handleChange} value={values.password}/>
                                </FloatingLabel>

                                <Button disabled={isSubmitting} type="submit" className="mt-4 w-100">Sign Up</Button>
                                <p className="text-center mt-2">Or</p>
                                <Link to={"/register"} className="btn btn-primary w-100">Sign In</Link>
                                <p className="mt-2 text-end">
                                    <Link to={"/"}>User Account</Link></p>
                            </Form>)}
                        </Formik>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>)
}

export default RegisterPage