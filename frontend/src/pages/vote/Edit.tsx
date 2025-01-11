import {useAuth} from "../../context/AuthContext.tsx";
import {useEffect, useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import {Button, Card, Col, Container, FloatingLabel, Form, Row, Spinner, Table} from "react-bootstrap";
import {FieldArray, Formik, FormikProps} from "formik";
import {CandidateEditRequest, VoteEditRequest} from "../../model/vote-model.ts";
import {apiService} from "../../utils/api-service.ts";
import {Plus, Trash2} from "lucide-react";
import {CandidatePhotoRequest, CandidatePhotoResponse} from "../../model/candidate-model.ts";
import {AxiosError, HttpStatusCode} from "axios";
import Swal from "sweetalert2";


const EditVotePage = () => {
    const {id} = useParams()
    const {token} = useAuth()
    const [backToHome, setBackToHome] = useState<boolean>(false);
    const [fisrt, setFisrt] = useState<VoteEditRequest>({
        title: "",
        candidate: []
    })

    useEffect(() => {
        apiService.get<VoteEditRequest>("/Vote/" + id, token).then((res) => {
            setFisrt(res.data)
        })
    }, []);

    if (backToHome) return <Navigate to={'/~'}/>

    return <Container>
        <Row className="mt-5 justify-content-center">
            <Col>
                <Card>
                    <Card.Header>
                        <Card.Title className="text-center">Update Vote</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Formik<VoteEditRequest> initialValues={fisrt} enableReinitialize={true} onSubmit={(values, {setSubmitting}) => {
                            const data: VoteEditRequest = {
                                title: values.title,
                                candidate: []
                            }

                            const uploadPromis = values.candidate
                                .map((item): CandidateEditRequest | Promise<CandidateEditRequest> => (item.id != null) ? {
                                    name: item.name,
                                    fisi: item.fisi,
                                    misi: item.misi,
                                    descripction: item.descripction,
                                    id: item.id,
                                    fileName: "Random",
                                    file: null
                                } : apiService.form<CandidatePhotoRequest, CandidatePhotoResponse>("Candidate/Photo", {file: item.file!})
                                    .then((res): CandidateEditRequest => ({
                                        name: item.name,
                                        fisi: item.fisi,
                                        misi: item.misi,
                                        descripction: item.descripction,
                                        fileName: res.data.fileName,
                                        id: null,
                                        file: null
                                    })).catch((err) => {
                                        console.log(err.message);
                                        throw err;
                                    }))

                            Promise.all(uploadPromis).then((result)=>{
                                data.candidate = result
                                console.log(data)
                                return apiService.put<VoteEditRequest, unknown>("/Vote/"+id, data,  token)
                            }).then((res) => {
                                if (res.status == HttpStatusCode.Ok) {
                                    Swal.fire({
                                        icon: "success",
                                        title: "succes update"
                                    })
                                    setBackToHome(true)
                                }
                            }).catch((err: AxiosError<{message: string}>) => {
                                Swal.fire({
                                    icon: "error",
                                    title: err.response?.data.message
                                })
                            }).finally(()=> {
                                setSubmitting(false)
                            })
                        }}>
                            {({
                                  values,
                                  handleChange,
                                  handleSubmit,
                                  setFieldValue,
                                  isSubmitting
                              }: FormikProps<VoteEditRequest>) => (
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
                                                                          disabled={values.candidate[index].id != null}
                                                                          name={`candidate[${index}].name`}
                                                                          onChange={handleChange}
                                                                          value={values.candidate[index].name}
                                                                          required/></td>
                                                        <td><Form.Control type="text" placeholder="Fisi"
                                                                          disabled={values.candidate[index].id != null}
                                                                          name={`candidate[${index}].fisi`}
                                                                          onChange={handleChange}
                                                                          value={values.candidate[index].fisi}
                                                                          required/></td>
                                                        <td><Form.Control type="text" placeholder="Misi"
                                                                          disabled={values.candidate[index].id != null}
                                                                          name={`candidate[${index}].misi`}
                                                                          onChange={handleChange}
                                                                          value={values.candidate[index].misi}
                                                                          required/></td>
                                                        <td><Form.Control type="text" placeholder="Description"
                                                                          disabled={values.candidate[index].id != null}
                                                                          name={`candidate[${index}].descripction`}
                                                                          onChange={handleChange}
                                                                          value={values.candidate[index].descripction}
                                                                          required/></td>
                                                        <td>{values.candidate[index].id == null && (
                                                            <Form.Control type="file" placeholder="Photo"
                                                                          onChange={(event) => {
                                                                              const fileList = (event.currentTarget as HTMLInputElement).files
                                                                              const file = fileList ? fileList[0] : null
                                                                              setFieldValue(`candidate[${index}].file`, file)
                                                                          }} required/>)}</td>
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

export default EditVotePage