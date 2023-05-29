// material-ui

import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';

import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// project imports
import axios from 'axios';
import Swal from 'sweetalert2';
import { createAxios } from '../../axios/axiosInstance';

import { SERVER_API } from '../../host/index';

const Package = () => {
    const [users, setUsers] = useState([]);
    const [packages, setPackages] = useState([]);

    let user = JSON.parse(localStorage.getItem('blast-user'));
    let axiosJWT = createAxios(user);

    const columns = [
        { field: 'id', headerName: 'NO', width: 20 },
        { field: 'name', headerName: 'Name', width: 160 },
        { field: 'description', headerName: 'Description', width: 240 },
        { field: 'price', headerName: 'Price', width: 150 },
        { field: 'discount', headerName: 'Discount (%)', width: 120 },
        { field: 'numberSubmitFeedback', headerName: 'Number of Feedback', width: 150 },
        { field: 'numberSubmitRefine', headerName: 'Number of Refine', width: 150 },
        {
            field: 'action',
            headerName: 'Actions',
            width: 160,
            disableClickEventBubbling: true,

            renderCell: (params) => {
                const onClick = (e) => {
                    const currentRow = params.row;
                    return alert(JSON.stringify(currentRow, null, 4));
                };

                const handleEdit = async (e) => {
                    const currentRow = params.row;
                    const { value: formValues } = await Swal.fire({
                        title: 'Edit a package',
                        width: '40em',
                        html:
                            `<div class="description-package"><label>Name</label><input value=${JSON.stringify(
                                currentRow.name
                            )} id="swal-input1" class="swal2-input">` +
                            `<div class="group-textarea"><label>Description</label><textarea id="swal-input2" class="swal2-input">${currentRow.description}</textarea></div>` +
                            `<label>Discount</label><input value=${JSON.stringify(
                                currentRow.discount
                            )} type="Number" id="swal-input3" class="swal2-input">` +
                            `<label>Price</label><input value=${JSON.stringify(
                                currentRow.price
                            )} type="Number" id="swal-input4" class="swal2-input">` +
                            `<label>nFeedback</label><input value=${JSON.stringify(
                                currentRow.numberSubmitFeedback
                            )} type="Number" id="swal-input5" class="swal2-input">` +
                            `<label>nRefine</label><input value=${JSON.stringify(
                                currentRow.numberSubmitRefine
                            )} type="Number" id="swal-input6" class="swal2-input"></div>`,

                        focusConfirm: false,
                        preConfirm: () => {
                            return [
                                document.getElementById('swal-input1').value,
                                document.getElementById('swal-input2').value,
                                parseInt(document.getElementById('swal-input3').value),
                                parseInt(document.getElementById('swal-input4').value),
                                parseInt(document.getElementById('swal-input5').value),
                                parseInt(document.getElementById('swal-input6').value)
                            ];
                        }
                    });

                    if (formValues) {
                        const rs = await axiosJWT.patch(
                            `${SERVER_API}/package/${currentRow._id}`,
                            {
                                name: formValues[0],
                                description: formValues[1],
                                discount: formValues[2],
                                price: formValues[3],
                                numberSubmitFeedback: formValues[4],
                                numberSubmitRefine: formValues[5]
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
                            await axiosJWT.delete(`${SERVER_API}/package/${currentRow._id}`, {
                                headers: {
                                    Authorization: `Bearer ${user.accessToken}`
                                }
                            });
                            await Swal.fire('Deleted!', 'This package has been deleted.', 'success');
                            window.location.reload(false);
                        }
                    });
                };

                return (
                    <Stack direction="row" spacing={2}>
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
        const data = await axiosJWT.get(`${SERVER_API}/package/all`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        data.data = data.data.map((e, i) => ({
            ...e,
            id: i + 1
        }));
        setPackages(data.data);
    };

    const handleCreate = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Creating a package',
            width: '40em',
            html:
                '<div class="description-package"><label>Name</label><input id="swal-input1" class="swal2-input">' +
                '<div class="group-textarea"><label class="label-textarea">Description</label><textarea id="swal-input2" class="swal2-input"></textarea></div>' +
                '<label>Discount</label><input type="Number" id="swal-input3" class="swal2-input">' +
                '<label>Price</label><input type="Number" id="swal-input4" class="swal2-input">' +
                '<label>nFeedback</label><input type="Number" id="swal-input5" class="swal2-input">' +
                '<label>nRefine</label><input type="Number" id="swal-input6" class="swal2-input"></div>',
            focusConfirm: false,
            preConfirm: async () => {
                if (
                    document.getElementById('swal-input1').value === '' ||
                    document.getElementById('swal-input2').value === '' ||
                    isNaN(parseInt(document.getElementById('swal-input3').value)) ||
                    isNaN(parseInt(document.getElementById('swal-input4').value)) ||
                    isNaN(parseInt(document.getElementById('swal-input5').value)) ||
                    isNaN(parseInt(document.getElementById('swal-input6').value))
                ) {
                    await Swal.showValidationMessage('Empty field exists!', '', 'error');
                    return;
                }
                if (document.getElementById('swal-input1').value.length < 4) {
                    await Swal.showValidationMessage('Name of package at least 4 characters!', '', 'error');
                    return;
                }
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    parseInt(document.getElementById('swal-input3').value),
                    parseInt(document.getElementById('swal-input4').value),
                    parseInt(document.getElementById('swal-input5').value),
                    parseInt(document.getElementById('swal-input6').value)
                ];
            }
        });

        if (formValues) {
            const rs = await axiosJWT.post(
                `${SERVER_API}/package`,
                {
                    name: formValues[0],
                    description: formValues[1],
                    discount: formValues[2],
                    price: formValues[3],
                    numberSubmitFeedback: formValues[4],
                    numberSubmitRefine: formValues[5]
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

    useEffect(() => {
        user = JSON.parse(localStorage.getItem('blast-user'));
        if (user) {
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
                    rows={packages}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 }
                        }
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </div>
        </>
    );
};

export default Package;
