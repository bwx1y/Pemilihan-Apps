import {Button, Card, Col, Container, FloatingLabel, Form, Row, Spinner, Table} from "react-bootstrap";
import {FieldArray, Formik, FormikProps} from "formik";
import {CandidateRequest, VotePreRequest, VoteRequest} from "../../model/vote-model.ts";
import {Plus, Trash2} from "lucide-react";
import {Link, Navigate} from "react-router-dom";
import {apiService} from "../../utils/api-service.ts";
import {CandidatePhotoRequest, CandidatePhotoResponse} from "../../model/candidate-model.ts";
import {AxiosError, HttpStatusCode} from "axios";
import {useAuth} from "../../context/AuthContext.tsx";
import Swal from "sweetalert2";
import {useState} from "react";

const CreatVotePage = () => {
    const {token} = useAuth()
    const [backToHome, setBackToHome] = useState<boolean>(false);

    if (backToHome) return <Navigate to={'/~'}/>

    return <Container>
        <Row className="mt-5 justify-content-center">
            <Col>
                <Card>
                    <Card.Header>
                        <Card.Title className="text-center">Create Vote</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Formik<VotePreRequest> initialValues={{
                            title: "",
                            candidate: [{name: "", fisi: "", misi: "", file: null, description: ""}]
                        }} onSubmit={(values, {setSubmitting}) => {
                            const data: VoteRequest = {
                                title: values.title,
                                candidate: []
                            }

                            const uploadPromise = values.candidate
                                .filter(f => f.file != null)
                                .map((candidate) =>
                                    apiService.form<CandidatePhotoRequest, CandidatePhotoResponse>("Candidate/Photo", {file: candidate.file!})
                                        .then((res) => ({
                                            name: candidate.name,
                                            fisi: candidate.fisi,
                                            misi: candidate.misi,
                                            description: candidate.description,
                                            fileName: res.data.fileName
                                        }))
                                        .catch((err: AxiosError) => {
                                            console.log(err.message);
                                            throw err;
                                        })
                                );

                            Promise.all(uploadPromise).then((res) => {
                                data.candidate = res.map((response): CandidateRequest=> ({ name: response.name, fisi: response.fisi, misi: response.misi, descripction: response.description, fileName: response.fileName }))

                                return apiService.post<VoteRequest, unknown>("Vote", data, token)
                            }).then((res) => {
                                if (res.status == HttpStatusCode.Ok || res.status == HttpStatusCode.Created) {
                                    Swal.fire({
                                        icon: "success",
                                        title: "Success create Vote"
                                    })
                                    setBackToHome(true)
                                }
                            }).catch((res) => {
                                Swal.fire({
                                    icon: "error",
                                    title: res.message
                                })
                            }).finally(() => {
                                setSubmitting(false)
                            })
                        }}>
                            {({
                                  values,
                                  handleChange,
                                  handleSubmit,
                                  setFieldValue,
                                  isSubmitting
                              }: FormikProps<VotePreRequest>) => (
                                <Form onSubmit={handleSubmit}>
                                    <FloatingLabel label={"Title"} controlId={"title"} className={"mb-3"}>
                                        <Form.Control type="text" name="title" onChange={handleChange}
                                                      value={values.title} placeholder={"xxxx"} required/>
                                    </FloatingLabel>
                                    <p className="border-bottom mb-0">Candidate:</p>
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th className="text-center" style={{width: "50px"}}>#</th>
                                            <th>Name</th>
                                            <th>Fisi</th>
                                            <th>Misi</th>
                                            <th>Description</th>
                                            <th className="text-center" style={{width: "150px"}}>Photo</th>
                                            <th className="text-center" style={{width: "100px"}}>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <FieldArray name="candidate">
                                            {({push, remove}) => (<>
                                                {values.candidate.map((_, index) => (
                                                    <tr key={index.toString()}>
                                                        <td>{index + 1}</td>
                                                        <td><Form.Control type="text" placeholder="Name"
                                                                          name={`candidate[${index}].name`}
                                                                          onChange={handleChange} required/></td>
                                                        <td><Form.Control type="text" placeholder="Fisi"
                                                                          name={`candidate[${index}].fisi`}
                                                                          onChange={handleChange} required/></td>
                                                        <td><Form.Control type="text" placeholder="Misi"
                                                                          name={`candidate[${index}].misi`}
                                                                          onChange={handleChange} required/></td>
                                                        <td><Form.Control type="text" placeholder="Description"
                                                                          name={`candidate[${index}].description`}
                                                                          onChange={handleChange} required/></td>
                                                        <td><Form.Control type="file" placeholder="Photo"
                                                                          onChange={(event) => {
                                                                              const fileList = (event.currentTarget as HTMLInputElement).files
                                                                              const file = fileList ? fileList[0] : null
                                                                              setFieldValue(`candidate[${index}].file`, file)
                                                                          }} required/></td>
                                                        <td>
                                                            <div
                                                                className="w-100 h-100 d-flex justify-content-center align-items-center">
                                                                <Button type={"button"}
                                                                        className="d-flex justify-content-center align-items-center"
                                                                        onClick={() => {
                                                                            remove(index)
                                                                        }}>
                                                                    <Trash2 size={15}/>
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td colSpan={7}>
                                                        <div className="w-100 d-flex justify-content-end"><Button
                                                            className="d-flex justify-content-center align-items-center me-3"
                                                            onClick={() => {
                                                                push({
                                                                    name: "",
                                                                    fisi: "",
                                                                    misi: "",
                                                                    fileName: null,
                                                                    description: ""
                                                                })
                                                            }}><Plus size={15}/></Button></div>
                                                    </td>
                                                </tr>
                                            </>)}
                                        </FieldArray>
                                        </tbody>
                                    </Table>
                                    <div className="w-100 d-flex justify-content-end">
                                        {isSubmitting ? (<Button variant="primary" disabled>
                                            <Spinner as={"span"} animation={"border"} size={"sm"} role={"status"}
                                                     aria-hidden={true}/> Loading...
                                        </Button>) : (<>
                                            <Button type={"submit"}>Submit</Button>
                                            <Link to={"/~"} className="btn btn-outline-primary ms-2">Back</Link></>)}
                                    </div>
                                </Form>)}
                        </Formik>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}

export default CreatVotePage