// material-ui

import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';

import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// project imports
import axios from 'axios';
import Swal from 'sweetalert2';

import { SERVER_API, AUTHEN } from '../../host/index';

const User = () => {
    const [users, setUsers] = useState([]);
    const [packages, setPackages] = useState([]);

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
                        const pur_date = new Date(Date.now()).toLocaleDateString();
                        let exp_date = new Date(Date.now());
                        exp_date = new Date(exp_date.setDate(exp_date.getDate() + parseInt(aPackge.time))).toLocaleDateString();
                        await axios.patch(
                            `${SERVER_API}/user/add_package`,
                            {
                                username: currentRow.username,
                                package: {
                                    packageName: aPackge.name,
                                    packageId: aPackge._id,
                                    purchase_date: pur_date,
                                    expiration_date: exp_date
                                }
                            },
                            {
                                headers: {
                                    Authorization: AUTHEN
                                }
                            }
                        );
                        await Swal.fire('Success!', '', 'success');
                        window.location.reload(false);
                    }
                };

                const handleEdit = async (e) => {
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
                        const rs = await axios.patch(
                            `${SERVER_API}/user/${currentRow._id}`,
                            {
                                username: formValues[0],
                                email: formValues[1],
                                expiration_date: new Date(formValues[2]).toLocaleDateString()
                            },
                            {
                                headers: {
                                    Authorization: AUTHEN
                                }
                            }
                        );
                        await Swal.fire('Success!', '', 'success');
                        window.location.reload(false);
                    }
                };

                const handleDelete = (e) => {
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
                            await axios.delete(`${SERVER_API}/user/${currentRow._id}`, {
                                headers: {
                                    Authorization: AUTHEN
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

    const getAllPackage = async () => {
        const data = await axios.get(`${SERVER_API}/package/all`, {
            headers: {
                Authorization: AUTHEN
            }
        });
        setPackages(data.data);
    };

    const getAllUser = async () => {
        const data = await axios.get(`${SERVER_API}/user/all`, {
            headers: {
                Authorization: AUTHEN
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

    useEffect(() => {
        getAllUser();
        getAllPackage();
    }, []);
    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={users}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 }
                    }
                }}
                pageSizeOptions={[5, 10]}
            />
        </div>
    );
};

export default User;
