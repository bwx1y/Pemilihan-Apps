import {useAuth} from "../../context/AuthContext.tsx";
import {useEffect, useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import {Button, Card, Col, Container, FloatingLabel, Form, Row, Spinner} from "react-bootstrap";
import {Formik} from "formik";
import {UserRequest, UserResponse} from "../../model/user-model.ts";
import {apiService} from "../../utils/api-service.ts";
import {HttpStatusCode} from "axios";
import Swal from "sweetalert2";

const EditUserPage = () => {
    const {id} = useParams()
    const {token} = useAuth()
    const [backToHome, setBackToHome] = useState<boolean>(false)
    const [first, setFirst] = useState<UserResponse>({code: "", firstName: "", lastName: "", id: ""})

    useEffect(() => {
        apiService.get<UserResponse>("/User/"+id, token)
            .then((res) => {
                setFirst(res.data)
            })
    }, []);

    if (backToHome) return <Navigate to={"/User"}/>

    return <Container>
        <Row className="mt-5 justify-content-center">
            <Col md={8}>
                <Card>
                    <Card.Header>
                        <Card.Title className="text-center">Update User</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Formik<UserRequest> initialValues={first} enableReinitialize={true}
                                             onSubmit={(values, {setSubmitting}) => {
                                                 apiService.put("/User/"+id, values, token)
                                                     .then((res) => {
                                                         if (res.status == HttpStatusCode.Ok || res.status == HttpStatusCode.Created) {
                                                             Swal.fire({
                                                                 icon: "success",
                                                                 title: "success create user"
                                                             })
                                                             setBackToHome(true)
                                                         }
                                                     })
                                                     .catch(() => {
                                                         Swal.fire({
                                                             icon: "error",
                                                             title: "errored create"
                                                         })
                                                     })
                                                     .finally(()=> {
                                                         setSubmitting(false)
                                                     })
                                             }}>
                            {({values, handleChange, handleSubmit, isSubmitting}) => (<Form onSubmit={handleSubmit}>
                                <FloatingLabel label={"Code"} controlId={"code"} className={"mb-3"}>
                                    <Form.Control type="text" name="code" onChange={handleChange}
                                                  value={values.code} placeholder={"xxxx"} required/>
                                </FloatingLabel>
                                <FloatingLabel label={"First Name"} controlId={"firstName"} className={"mb-3"}>
                                    <Form.Control type="text" name="firstName" onChange={handleChange}
                                                  value={values.firstName} placeholder={"xxxx"} required/>
                                </FloatingLabel>
                                <FloatingLabel label={"Last Name"} controlId={"lastName"} className={"mb-3"}>
                                    <Form.Control type="text" name="lastName" onChange={handleChange}
                                                  value={values.lastName} placeholder={"xxxx"} required/>
                                </FloatingLabel>
                                <div className="w-100 d-flex justify-content-end">
                                    {isSubmitting ? (<Button variant="primary" disabled>
                                        <Spinner as={"span"} animation={"border"} size={"sm"} role={"status"}
                                                 aria-hidden={true}/> Loading...
                                    </Button>) : (<>
                                        <Button type={"submit"}>Submit</Button>
                                        <Link to={"/User"} className="btn btn-outline-primary ms-2">Back</Link></>)}
                                </div>
                            </Form>)}
                        </Formik>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}

export default EditUserPage