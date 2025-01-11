import {Role, useAuth,} from "../context/AuthContext.tsx";
import {Button, Container, Dropdown, DropdownButton, Form, Nav, Navbar, NavItem, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {VoteAdminResponse, VoteUserResponse} from "../model/vote-model.ts";
import {apiService} from "../utils/api-service.ts";
import {Link} from "react-router-dom";
import {ChevronRight, EllipsisVertical, Plus} from "lucide-react";
import {SidebarComponent} from "../components/SidebarComponent.tsx";

import "../assets/css/dropdown-none.css"
import {AxiosError, HttpStatusCode} from "axios";
import Swal from "sweetalert2";

export const DashboardUser = () => {
    const [data, setData] = useState<VoteUserResponse[]>([])
    const {token, logout} = useAuth()

    useEffect(() => {
        apiService.get<VoteUserResponse[]>("Vote", token)
            .then((res) => {
                setData(res.data)
                console.log(res.data)
            })
    }, []);

    return (<>
        <Navbar variant="dark" bg="primary" expand="md">
            <Container>
                <Navbar.Brand href="/~">Pooling Apps</Navbar.Brand>
                <Nav>
                    <NavItem>
                        <Button onClick={() => {
                            logout()
                        }}>Log out</Button>
                    </NavItem>
                </Nav>
            </Container>
        </Navbar>
        <Container as={"main"} className="mt-2">

            <Row className="my-3 p-3 bg-body rounded shadow-sm">
                <h6 className="border-bottom pb-2 mb-0">Available Pooling</h6>
                {data.filter(f => !f.status).length == 0 &&
                    <div className="text-body-secondary pt-3 pb-2 border-bottom">
                        <h5 className="text-center">Not Found</h5>
                    </div>}
                {data.filter(f => !f.status).map((item, index) => (
                    <div className="d-flex justify-content-between text-body-secondary pt-3 pb-2 border-bottom"
                         key={item.id + index.toString()}>
                        <div className="d-flex">
                            <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32"
                                 xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32"
                                 preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title>
                                <rect width="100%" height="100%" fill="#6f42c1"></rect>
                                <text x="50%" y="50%" fill="#6f42c1" dy=".3em">32x32</text>
                            </svg>
                            <div className="w-100 mb-0 small lh-sm">
                                <Link to={"/Vote/" + item.id}
                                      className="d-block text-black link-underline link-underline-opacity-0 ">
                                    <h6>{item.title}</h6></Link>
                            </div>
                        </div>
                        <Link to={"/Vote/" + item.id}>Goto <ChevronRight/></Link>
                    </div>))}
            </Row>
            <Row className="my-3 p-3 bg-body rounded shadow-sm mt-5">
                <h6 className="border-bottom pb-2 mb-0">History Pooling</h6>
                {data.filter(f => f.status).map((item, index) => (
                    <div className="d-flex justify-content-between text-body-secondary pt-3 pb-2 border-bottom"
                         key={item.id + index.toString()}>
                        <div className="d-flex">
                            <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32"
                                 xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32"
                                 preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title>
                                <rect width="100%" height="100%" fill="#6f42c1"></rect>
                                <text x="50%" y="50%" fill="#6f42c1" dy=".3em">32x32</text>
                            </svg>
                            <div className="w-100 mb-0 small lh-sm">
                                <h6>{item.title}</h6>
                            </div>
                        </div>
                        <p>{item.followDate}</p>
                    </div>))}
            </Row>
        </Container>
    </>)
}

export const DashboardAdmin = () => {
    const [data, setData] = useState<VoteAdminResponse[]>([])
    const {token} = useAuth()

    const refreshData = () => {
        apiService.get<VoteAdminResponse[]>("Vote", token).then((res) => {
            setData(res.data)
        })
    }

    useEffect(() => {
        refreshData()
    }, []);

    return (<SidebarComponent>
        <Container as={"main"} style={{margin: "0 0 0 290px"}}>
            <div className="d-flex justify-content-between mt-3">
                <h1>Vote</h1>
                <Link to={"/Vote/Create"}
                      className="btn btn-outline-primary d-flex justify-content-center align-items-center me-4"><Plus/></Link>
            </div>
            <Table className="mt-3">
                <thead>
                <tr>
                    <td className="text-center" style={{width: "100px"}}>#</td>
                    <td>Title</td>
                    <td className="text-center" style={{width: "150px"}}>Follower Count</td>
                    <td className="text-center" style={{width: "150px"}}>Status</td>
                    <td className="text-center" style={{width: "100px"}}>Action</td>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={item.id}>
                        <td className="text-center" style={{width: "100px"}}>{index + 1}</td>
                        <td>{item.title}</td>
                        <td className="text-center" style={{width: "150px"}}>{item.followerCount}</td>
                        <td className="text-center" style={{width: "150px"}}>
                            <Form.Check type="switch" checked={item.status} onClick={() => {
                                Swal.fire({
                                    title: `Are you sure update Status for ${item.title}?`,
                                    showCancelButton: true,
                                    confirmButtonText: "Yes",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        apiService.put<{
                                            status: boolean
                                        }, unknown>(`/Vote/${item.id}/Status`, {status: !item.status}, token)
                                            .then((res) => {
                                                if (res.status == HttpStatusCode.Ok) {
                                                    Swal.fire({
                                                        icon: "success",
                                                        title: "suuces update status"
                                                    })
                                                }
                                            })
                                            .finally(() => {
                                                refreshData()
                                            })
                                    }
                                })
                            }}/>
                        </td>
                        <td className="text-center" style={{width: "100px"}}>
                            <DropdownButton className="custom-dropdown-button" title={<EllipsisVertical size={20}/>}>
                                <Dropdown.Item href={"/Vote/" + item.id}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    Swal.fire({
                                        title: `Are you sure delete ${item.title}?`,
                                        showCancelButton: true,
                                        confirmButtonText: "Yes",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            apiService.delete<unknown>("/Vote/" + item.id, token)
                                                .then((res) => {
                                                    if (res.status == HttpStatusCode.Ok) {
                                                        Swal.fire({
                                                            icon: "success",
                                                            title: "Succes delete"
                                                        })
                                                        refreshData()
                                                    }
                                                })
                                                .catch((err: AxiosError<{ message: string }>) => {
                                                    Swal.fire({
                                                        icon: "error",
                                                        title: err.response?.data.message
                                                    })
                                                })
                                        }
                                    });
                                }}>Delete</Dropdown.Item>
                            </DropdownButton>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    </SidebarComponent>)
}

const DashboardPage = () => {
    const {isRole} = useAuth()

    if (isRole == Role.Admin) return <DashboardAdmin/>
    return <DashboardUser/>
}

export default DashboardPage