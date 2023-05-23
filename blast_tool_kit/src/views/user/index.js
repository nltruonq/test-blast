// material-ui

import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';

import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Modal from 'react-modal';

// project imports
import axios from 'axios';
import Swal from 'sweetalert2';

import { SERVER_API } from '../../host/index';
import { SET_MENU } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '../../axios/axiosInstance';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const User = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [packages, setPackages] = useState([]);

    const [infoUser, setInfoUser] = useState({});

    let user = JSON.parse(localStorage.getItem('blast-user'));

    let axiosJWT = createAxios(user);

    const dispatch = useDispatch();
    const leftDrawerOpened = useSelector((state) => state.customization.opened);
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: leftDrawerOpened === true ? !leftDrawerOpened : leftDrawerOpened });
    };

    const columns = [
        { field: 'id', headerName: 'NO', width: 20 },
        { field: 'username', headerName: 'Username', width: 160 },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'package_name', headerName: 'Package name', width: 130 },
        { field: 'purchase_date', headerName: 'Purchase date', width: 120 },
        { field: 'expiration_date', headerName: 'Expiration date', width: 120 },
        { field: 'numberAffiliate', headerName: 'Affiliate', width: 100 },
        { field: 'status', headerName: 'Status', width: 90 },
        {
            field: 'action',
            headerName: 'Actions',
            width: 250,
            disableClickEventBubbling: true,

            renderCell: (params) => {
                const onClick = (e) => {
                    const currentRow = params.row;
                    return alert(JSON.stringify(currentRow, null, 4));
                };

                const handleSelect = async (e) => {
                    e.stopPropagation();
                    const currentRow = params.row;
                    const { value: pkg } = await Swal.fire({
                        title: 'Select package',
                        input: 'select',
                        inputOptions: packages.reduce((acc, cur) => {
                            return { ...acc, [cur.name]: cur.name };
                        }, {}),
                        inputPlaceholder: 'Select a package',
                        showCancelButton: true
                    });

                    if (pkg) {
                        const aPackge = packages.filter((e) => e.name === pkg)[0];
                        const pur_date = new Date(Date.now());
                        let exp_date = new Date(Date.now());
                        exp_date = new Date(exp_date.setDate(exp_date.getDate() + parseInt(aPackge.time)));
                        await axiosJWT.patch(
                            `${SERVER_API}/user/add_package`,
                            {
                                username: currentRow.username,
                                package: {
                                    packageName: aPackge.name,
                                    packageId: aPackge._id,
                                    numberSubmitFeedback: aPackge.numberSubmitFeedback,
                                    numberSubmitRefine: aPackge.numberSubmitRefine,
                                    amountTokenUsedFeedback: 0,
                                    amountTokenUsedRefine: 0,
                                    purchase_date: `${pur_date.getDate()}/${pur_date.getMonth() + 1}/${pur_date.getFullYear()}`,
                                    expiration_date: `${exp_date.getDate()}/${exp_date.getMonth() + 1}/${exp_date.getFullYear()}`
                                }
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${user.accessToken}`
                                }
                            }
                        );
                        await Swal.fire('Success!', '', 'success');
                        window.location.reload(false);
                    }
                };

                const handleEdit = async (e) => {
                    e.stopPropagation();
                    const currentRow = params.row;
                    let exp;
                    if (currentRow.expiration_date) {
                        exp = currentRow.expiration_date.split('/');
                    }
                    const { value: formValues } = await Swal.fire({
                        title: 'Edit user',
                        html:
                            `<label for="swal-input1">Username</label><input id="swal-input1" value=${JSON.stringify(
                                currentRow.username
                            )} class="swal2-input">` +
                            `<label for="swal-input2">Email</label><input id="swal-input2" value=${JSON.stringify(
                                currentRow.email
                            )} class="swal2-input">` +
                            `${
                                currentRow.expiration_date
                                    ? `<label for="swal-input3">Expiration</label><input id="swal-input3" type="date" value=${
                                          JSON.stringify(
                                              new Date(currentRow.expiration_date && `${exp[2]}, ${exp[1]}, ${exp[0]}`).toLocaleDateString(
                                                  'fr-CA',
                                                  {
                                                      year: 'numeric',
                                                      month: '2-digit',
                                                      day: '2-digit'
                                                  }
                                              )
                                          ) || null
                                      } class="swal2-input">`
                                    : ''
                            }`,
                        focusConfirm: false,
                        preConfirm: () => {
                            return [
                                document.getElementById('swal-input1').value,
                                document.getElementById('swal-input2').value,
                                document?.getElementById('swal-input3')?.value || null
                            ];
                        }
                    });

                    if (formValues) {
                        const rs = await axiosJWT.patch(
                            `${SERVER_API}/user/${currentRow._id}`,
                            {
                                username: formValues[0],
                                email: formValues[1],
                                expiration_date: new Date(formValues[2]).toLocaleDateString()
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${user.accessToken}`
                                }
                            }
                        );
                        await Swal.fire('Success!', '', 'success');
                        window.location.reload(false);
                    }
                };

                const handleDelete = (e) => {
                    e.stopPropagation();
                    const currentRow = params.row;
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            await axiosJWT.delete(`${SERVER_API}/user/${currentRow._id}`, {
                                headers: {
                                    Authorization: `Bearer ${user.accessToken}`
                                },
                                data: {
                                    userId: currentRow._id
                                }
                            });
                            await Swal.fire('Deleted!', 'This user has been deleted.', 'success');
                            window.location.reload(false);
                        }
                    });
                };

                return (
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" size="small" onClick={handleSelect}>
                            Select
                        </Button>
                        <Button variant="contained" color="warning" size="small" onClick={handleEdit}>
                            Edit
                        </Button>
                        <Button variant="contained" color="error" size="small" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Stack>
                );
            }
        }
    ];

    const columnsInfoUser = [
        { field: 'id', headerName: 'NO', width: 20 },
        { field: 'packageName', headerName: 'Package name', width: 130 },
        { field: 'numberSubmitFeedback', headerName: 'Remaining submit feedback', width: 200 },
        { field: 'numberSubmitRefine', headerName: 'Remaining submit refine', width: 170 },
        { field: 'amountTokenUsedFeedback', headerName: 'Token used of feedback', width: 160 },
        { field: 'amountTokenUsedRefine', headerName: 'Token used of refine', width: 150 },
        { field: 'purchase_date', headerName: 'Purchase date', width: 120 },
        { field: 'expiration_date', headerName: 'Expiration date', width: 120 }
    ];

    const getAllPackage = async () => {
        const data = await axiosJWT.get(`${SERVER_API}/package/all`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        setPackages(data.data);
    };

    const getAllUser = async () => {
        const data = await axiosJWT.get(`${SERVER_API}/user/all`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        data.data = data.data.map((e, i) => ({
            ...e,
            id: i + 1,
            package_name: e.packages[e.packages.length - 1]?.packageName,
            purchase_date: e.packages[e.packages.length - 1]?.purchase_date,
            expiration_date: e.packages[e.packages.length - 1]?.expiration_date,
            numberAffiliate: e.affiliate.length,
            status: 'Active'
        }));
        setUsers(data.data);
    };

    const handleCreate = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Creating a prompt',
            html:
                `<label>Username</label><input id="swal-input1" class="swal2-input">` +
                `<label>Password</label><input id="swal-input2" class="swal2-input">` +
                '<label>Email</label><input id="swal-input3" class="swal2-input">',
            focusConfirm: false,
            preConfirm: async () => {
                if (
                    document.getElementById('swal-input1').value === '' ||
                    document.getElementById('swal-input2').value === '' ||
                    document.getElementById('swal-input3').value === ''
                ) {
                    await Swal.showValidationMessage('Empty field exists!', '', 'error');
                    return;
                }
                if (
                    document.getElementById('swal-input1').value.length < 6 ||
                    document.getElementById('swal-input2').value.length < 6 ||
                    document.getElementById('swal-input3').value.length < 6
                ) {
                    await Swal.showValidationMessage('Fields with at least 6 characters!', '', 'error');
                    return;
                }
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value
                ];
            }
        });

        if (formValues) {
            const rs = await axiosJWT.post(
                `${SERVER_API}/auth/register`,
                {
                    username: formValues[0],
                    password: formValues[1],
                    email: formValues[2]
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                }
            );
            if (rs) {
                await Swal.fire('Success!', '', 'success');
                window.location.reload(false);
            }
        }
    };

    const openModal = async (e) => {
        handleLeftDrawerToggle();
        const getUser = await axiosJWT.get(`${SERVER_API}/user/${e.row._id}`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        getUser.data.packages = getUser.data.packages.map((e, i) => ({ ...e, id: i + 1 }));
        setInfoUser(getUser.data);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        user = JSON.parse(localStorage.getItem('blast-user'));
        if (user) {
            getAllUser();
            getAllPackage();
        }
    }, []);
    return (
        <>
            <Button onClick={handleCreate} variant="contained" color="primary" size="large">
                Create
            </Button>
            <div style={{ height: 600, width: '100%', marginTop: 20 }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 }
                        }
                    }}
                    pageSizeOptions={[5, 10]}
                    onRowClick={(e) => openModal(e)}
                    // onCellClick={(params, event) => event.stopPropagation()}
                    sx={{
                        // disable cell selection style
                        '.MuiDataGrid-cell:focus': {
                            outline: 'none'
                        },
                        // pointer cursor on ALL rows
                        '& .MuiDataGrid-row:hover': {
                            cursor: 'pointer'
                        }
                    }}
                />
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} ariaHideApp={false}>
                <DataGrid
                    rows={infoUser.packages}
                    columns={columnsInfoUser}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 }
                        }
                    }}
                    pageSizeOptions={[5, 10]}
                    sx={{
                        '.MuiDataGrid-cell:focus': {
                            outline: 'none'
                        }
                    }}
                />
            </Modal>
        </>
    );
};

export default User;
