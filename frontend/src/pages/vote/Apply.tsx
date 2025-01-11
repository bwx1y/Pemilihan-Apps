import {Button, Card, Col, Container, Nav, Navbar, NavItem, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {apiService} from "../../utils/api-service.ts";
import {VoteUserByIdResponse} from "../../model/vote-model.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import {Navigate, useParams} from "react-router-dom";
import {HttpStatusCode} from "axios";
import Swal from "sweetalert2";

const ApplyVotePage = () => {
    const {id} = useParams()
    const {token} = useAuth()
    const [data, setData] = useState<VoteUserByIdResponse>({id: id!, title: "", candidate: []})
    const [isUpload, setIsUpload] = useState<boolean>(false);
    const [backHome, setBackHome] = useState<boolean>(false);

    useEffect(() => {
        apiService.get<VoteUserByIdResponse>("/Vote/" + id, token)
            .then((res) => {
                setData(res.data)
                console.log(res.data)
            })
    }, []);

    if (backHome) return <Navigate to={'/~'}/>

    return <>
        <Navbar variant="dark" bg="primary" expand="md">
            <Container>
                <Navbar.Brand className="fw-bold">{data.title}</Navbar.Brand>
                <Nav>
                    <NavItem>
                        <Nav.Link active href="/~">Back</Nav.Link>
                    </NavItem>
                </Nav>
            </Container>
        </Navbar>
        <Container className="mt-4">
            <h1>Candidate</h1>
            <Row className="justify-content-center">
                {data.candidate.map((item) => (
                    <Col key={item.id} md={4}>
                        <Card>
                            <Card.Header className="fw-bold text-center">{item.name}</Card.Header>
                            <Card.Img src={"/image/" + item.id} title={item.name} width={300}
                                      height={300} style={{objectFit: "scale-down"}}/>
                            <Card.Body>
                                <p>
                                    Fisi: {item.fisi}
                                </p>
                                <p>
                                    Misi: {item.misi}
                                </p>
                                <p className="mb-0">
                                    Description: {item.descripction}
                                </p>
                            </Card.Body>
                            <Card.Footer>
                                {isUpload ? (<Button className="w-100" variant="primary" disabled>
                                    <Spinner as={"span"} animation={"border"} size={"sm"} role={"status"}
                                             aria-hidden={true}/> Loading...
                                </Button>) : (
                                    <Button onClick={() => {
                                        setIsUpload(true)
                                        apiService.post<null, unknown>("/Candidate/"+ item.id+"/Apply", null, token)
                                            .then((res) => {
                                                if (res.status == HttpStatusCode.Ok) {
                                                    Swal.fire({
                                                        icon: "success",
                                                        title: "Success Select candidate"
                                                    })
                                                    setBackHome(true)
                                                }
                                            }).finally(() => {
                                                setIsUpload(false)
                                        })
                                    }} className="w-100">Select this Candidate</Button>)}
                            </Card.Footer>
                        </Card>
                    </Col>))}
            </Row>
        </Container>
    </>
}

export default ApplyVotePage