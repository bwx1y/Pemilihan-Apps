import {Button, Card, Col, Container, FloatingLabel, Form, Row} from "react-bootstrap";
import {Formik} from "formik";
import ballot from "../assets/images/ballot.png"
import {Link, Navigate} from "react-router-dom";
import {useState} from "react";
import {apiService} from "../utils/api-service.ts";
import {LoginAdminRequest, LoginErorr, LoginResponse, LoginUserRequest} from "../model/login-model.ts";
import {AxiosError, HttpStatusCode} from "axios";
import Swal from "sweetalert2";
import {useAuth} from "../context/AuthContext.tsx";

const HomePage = () => {
    const [isLoginAdmin, setIsLoginAdmin] = useState<boolean>(false);
    const {isLogin, login} = useAuth()

    if (isLogin) return <Navigate to={'/~'}/>

    return <Container>
        <Row className="d-flex vh-100 justify-content-center align-items-center">
            <Col md={5}>
                <Card>
                    <Card.Img src={ballot} variant="top" height="200px" style={{objectFit: "scale-down"}}/>
                    <Card.Body>
                        <Card.Title className="text-center">Please sign in</Card.Title>
                        {!isLoginAdmin ? (
                            <Formik initialValues={{code: ""}} onSubmit={(values, {setSubmitting}) => {
                                apiService.post<LoginUserRequest, LoginResponse>("Auth/Login-User", {code: values.code}).then((res) => {
                                    if (res.status == HttpStatusCode.Ok) {
                                        Swal.fire({
                                            icon: "success",
                                            title: "Successes login"
                                        })

                                        login(res.data.token)
                                    }
                                }).catch((err: AxiosError<LoginErorr>) => {
                                    console.log(err.response)
                                    Swal.fire({
                                        icon: "error",
                                        title: err.response?.data.message
                                    })
                                }).finally(() => {
                                    setSubmitting(false)
                                })
                            }}>
                                {({values, handleSubmit, handleChange, isSubmitting}) => <form onSubmit={handleSubmit}>
                                    <FloatingLabel label="Code" controlId="code" className="mt-4">
                                        <Form.Control type="text" maxLength={100} name="code" placeholder="****"
                                                      onChange={handleChange} value={values.code} required/>
                                    </FloatingLabel>

                                    <Button disabled={isSubmitting} type="submit" className="w-100 mt-4">
                                        Sign In
                                    </Button>
                                    <p className="mt-2 text-end">
                                        <Link onClick={() => {
                                            setIsLoginAdmin(true)
                                        }} to={""}> Admin Account</Link></p>
                                </form>}
                            </Formik>) : (<Formik
                            initialValues={{username: "", password: ""}}
                            onSubmit={(values, {setSubmitting}) => {
                                apiService.post<LoginAdminRequest, LoginResponse>("Auth/Login", {
                                    username: values.username,
                                    password: values.password
                                }).then((res) => {
                                    if (res.status == HttpStatusCode.Ok) {
                                        Swal.fire({
                                            icon: "success",
                                            title: "Success Login"
                                        })
                                        login(res.data.token)
                                    }
                                }).catch((err: AxiosError<LoginErorr>) => {
                                    Swal.fire({
                                        icon: "error",
                                        title: err.response?.data.message
                                    })
                                }).finally(() => {
                                    setSubmitting(false)
                                })
                            }}>
                            {({values, handleSubmit, handleChange, isSubmitting}) => (<Form onSubmit={handleSubmit}>
                                <FloatingLabel label="Username" controlId="username" className="mt-4">
                                    <Form.Control type="username" maxLength={100} name="username" placeholder="****"
                                                  onChange={handleChange} value={values.username}/>
                                </FloatingLabel>
                                <FloatingLabel label="Password" controlId="password" className="mt-4">
                                    <Form.Control type="password" maxLength={100} name="password" placeholder="****"
                                                  onChange={handleChange} value={values.password}/>
                                </FloatingLabel>

                                <Button disabled={isSubmitting} type="submit" className="mt-4 w-100">Sign In</Button>
                                <p className="text-center mt-2">Or</p>
                                <Link to={"/register"} className="btn btn-primary w-100">Sign Up</Link>
                                <p className="mt-2 text-end">
                                    <Link onClick={() => {
                                        setIsLoginAdmin(false)
                                    }} to={""}>User Account</Link></p>
                            </Form>)}
                        </Formik>)}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}

export {HomePage}