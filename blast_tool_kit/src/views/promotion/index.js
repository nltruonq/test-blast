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

const Promotion = () => {
    const [users, setUsers] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [packages, setPackages] = useState([]);

    let user = JSON.parse(localStorage.getItem('blast-user'));
    let axiosJWT = createAxios(user);

    const columns = [
        { field: 'id', headerName: 'NO', width: 20 },
        { field: 'name', headerName: 'Name', width: 160 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'time', headerName: 'Days Usage', width: 130 },
        { field: 'packageName', headerName: 'For Package', width: 130 },
        { field: 'numberSubmitFeedback', headerName: 'Number of Feedback', width: 150 },
        { field: 'numberSubmitRefine', headerName: 'Number of Refine', width: 150 },
        {
            field: 'action',
            headerName: 'Actions',
            width: 260,
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
                        title: 'Select package of this promotion',
                        input: 'select',
                        inputOptions: packages.reduce((acc, cur) => {
                            return { ...acc, [cur.name]: cur.name };
                        }, {}),
                        inputPlaceholder: 'Select a package',
                        showCancelButton: true
                    });

                    if (pkg) {
                        const aPackge = packages.filter((e) => e.name === pkg)[0];
                        await axiosJWT.patch(
                            `${SERVER_API}/promotion/${currentRow._id}`,
                            {
                                packageId: aPackge._id,
                                packageName: aPackge.name
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
                    const currentRow = params.row;
                    const { value: formValues } = await Swal.fire({
                        title: 'Creating a prompt',
                        html:
                            `<label>Name</label><input value=${JSON.stringify(currentRow.name)} id="swal-input1" class="swal2-input">` +
                            `<div class="group-textarea"><label>Description</label><textarea id="swal-input2" class="swal2-input">${currentRow.description}</textarea></div>` +
                            `<label>Days usage</label><input value=${JSON.stringify(
                                currentRow.time
                            )} type="Number" id="swal-input3" class="swal2-input">` +
                            `<label>nFeedback</label><input value=${JSON.stringify(
                                currentRow.numberSubmitFeedback
                            )} type="Number" id="swal-input5" class="swal2-input">` +
                            `<label>nRefine</label><input value=${JSON.stringify(
                                currentRow.numberSubmitRefine
                            )} type="Number" id="swal-input6" class="swal2-input">`,

                        focusConfirm: false,
                        preConfirm: () => {
                            return [
                                document.getElementById('swal-input1').value,
                                document.getElementById('swal-input2').value,
                                parseInt(document.getElementById('swal-input3').value),
                                // parseInt(document.getElementById('swal-input4').value),
                                parseInt(document.getElementById('swal-input5').value),
                                parseInt(document.getElementById('swal-input6').value)
                            ];
                        }
                    });

                    if (formValues) {
                        const rs = await axiosJWT.patch(
                            `${SERVER_API}/promotion/${currentRow._id}`,
                            {
                                name: formValues[0],
                                description: formValues[1],
                                time: formValues[2],
                                // price: formValues[2],
                                numberSubmitFeedback: formValues[3],
                                numberSubmitRefine: formValues[4]
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
                            await axiosJWT.delete(`${SERVER_API}/promotion/${currentRow._id}`, {
                                headers: {
                                    Authorization: `Bearer ${user.accessToken}`
                                }
                            });
                            await Swal.fire('Deleted!', 'This promotion has been deleted.', 'success');
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

    const getAllPromotions = async () => {
        const data = await axiosJWT.get(`${SERVER_API}/promotion/all`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        data.data = data.data.map((e, i) => ({
            ...e,
            id: i + 1
        }));
        setPromotions(data.data);
    };

    const getAllPackages = async () => {
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
            title: 'Creating a promotion',
            html:
                '<label>Name</label><input id="swal-input1" class="swal2-input">' +
                '<div class="group-textarea"><label class="label-textarea">Description</label><textarea id="swal-input2" class="swal2-input"></textarea></div>' +
                '<label>Days usage</label><input type="Number" id="swal-input3" class="swal2-input">' +
                // '<label>Price</label><input type="Number" id="swal-input4" class="swal2-input">' +
                '<label>nFeedback</label><input type="Number" id="swal-input5" class="swal2-input">' +
                '<label>nRefine</label><input type="Number" id="swal-input6" class="swal2-input">',
            focusConfirm: false,
            preConfirm: async () => {
                if (
                    document.getElementById('swal-input1').value === '' ||
                    document.getElementById('swal-input2').value === '' ||
                    isNaN(parseInt(document.getElementById('swal-input3').value)) ||
                    // isNaN(parseInt(document.getElementById('swal-input4').value)) ||
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
                    // parseInt(document.getElementById('swal-input4').value),
                    parseInt(document.getElementById('swal-input5').value),
                    parseInt(document.getElementById('swal-input6').value)
                ];
            }
        });

        if (formValues) {
            const rs = await axiosJWT.post(
                `${SERVER_API}/promotion`,
                {
                    name: formValues[0],
                    description: formValues[1],
                    time: formValues[2],
                    // price: formValues[2],
                    numberSubmitFeedback: formValues[3],
                    numberSubmitRefine: formValues[4]
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
            getAllPromotions();
            getAllPackages();
        }
    }, []);
    return (
        <>
            <Button onClick={handleCreate} variant="contained" color="primary" size="large">
                Create
            </Button>
            <div style={{ height: 600, width: '100%', marginTop: 20 }}>
                <DataGrid
                    rows={promotions}
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

export default Promotion;
