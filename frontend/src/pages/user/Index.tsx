import {useNavbar} from "../../context/NavbarContext.tsx";
import {Col, Container, Dropdown, DropdownButton, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {EllipsisVertical, Plus} from "lucide-react";
import {UserResponse} from "../../model/user-model.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import {apiService} from "../../utils/api-service.ts";

import "../../assets/css/dropdown-none.css"
import Swal from "sweetalert2";
import {HttpStatusCode} from "axios";

const UserPage = () => {
    const {setKey} = useNavbar()
    const {token} = useAuth()
    const [data, setData] = useState<UserResponse[]>([])

    const refreshData = () => {
        apiService.get<UserResponse[]>("User", token)
            .then((res) => {
                setData(res.data)
            })
    }

    useEffect(() => {
        setKey("user")

        refreshData()
    }, []);

    return <Container className="mt-4" style={{margin: "0 0 0 290px"}}>
        <div className="w-100 d-flex justify-content-between">
            <h1>User</h1>
            <Link to="/User/Create"
                  className="btn btn-outline-primary d-flex justify-content-center align-items-center me-5">
                <Plus/>
            </Link>
        </div>

        <Row>
            <Col>
                <Table>
                    <thead>
                    <tr>
                        <th className="text-center" style={{width: "50px"}}>#</th>
                        <th style={{width: "200px"}}>Code</th>
                        <th>Last Name</th>
                        <th>Last Name</th>
                        <th style={{width: "100px"}}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (<tr key={item.id}>
                        <td className="text-center">{index + 1}</td>
                        <td>{item.code}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td><DropdownButton className="custom-dropdown-button" title={<EllipsisVertical size={20}/>}>
                            <Dropdown.Item href={"/User/"+item.id}>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                Swal.fire({
                                    title: `Are you sure delete ${item.firstName}?`,
                                    showCancelButton: true,
                                    confirmButtonText: "Yes",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        apiService.delete<unknown>("/User/" + item.id, token)
                                            .then((res) => {
                                                if (res.status == HttpStatusCode.Ok) {
                                                    Swal.fire({
                                                        icon: "success",
                                                        title: "succes delete"
                                                    })
                                                    refreshData()
                                                }
                                            })
                                            .catch(()=>{
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Erorr delete"
                                                })
                                            })
                                    }
                                })
                            }}>Delete</Dropdown.Item>
                        </DropdownButton></td>
                    </tr>))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    </Container>
}
export default UserPage;