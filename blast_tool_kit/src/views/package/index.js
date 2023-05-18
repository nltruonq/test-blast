// material-ui

import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';

import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// project imports
import axios from 'axios';
import Swal from 'sweetalert2';

import { SERVER_API, AUTHEN } from '../../host/index';

const Package = () => {
    const [users, setUsers] = useState([]);
    const [packages, setPackages] = useState([]);

    const columns = [
        { field: 'id', headerName: 'NO', width: 20 },
        { field: 'name', headerName: 'Name', width: 160 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'time', headerName: 'Days Usage', width: 130 },
        { field: 'price', headerName: 'Price', width: 150 },
        { field: 'numberSubmitFeedback', headerName: 'Number of Feedback', width: 150 },
        { field: 'numberSubmitRefine', headerName: 'Number of Refine', width: 150 },
        {
            field: 'action',
            headerName: 'Actions',
            width: 200,
            disableClickEventBubbling: true,

            renderCell: (params) => {
                const onClick = (e) => {
                    const currentRow = params.row;
                    return alert(JSON.stringify(currentRow, null, 4));
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
                            `<label>Price</label><input value=${JSON.stringify(
                                currentRow.price
                            )} type="Number" id="swal-input4" class="swal2-input">` +
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
                                parseInt(document.getElementById('swal-input4').value),
                                parseInt(document.getElementById('swal-input5').value),
                                parseInt(document.getElementById('swal-input6').value)
                            ];
                        }
                    });

                    if (formValues) {
                        const rs = await axios.patch(
                            `${SERVER_API}/package/${currentRow._id}`,
                            {
                                name: formValues[0],
                                description: formValues[1],
                                time: formValues[2],
                                price: formValues[3],
                                numberSubmitFeedback: formValues[4],
                                numberSubmitRefine: formValues[5]
                            },
                            {
                                headers: {
                                    Authorization: AUTHEN
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
                            await axios.delete(`${SERVER_API}/package/${currentRow._id}`, {
                                headers: {
                                    Authorization: AUTHEN
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
        const data = await axios.get(`${SERVER_API}/package/all`, {
            headers: {
                Authorization: AUTHEN
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
            html:
                '<label>Name</label><input id="swal-input1" class="swal2-input">' +
                '<div class="group-textarea"><label class="label-textarea">Description</label><textarea id="swal-input2" class="swal2-input"></textarea></div>' +
                '<label>Days usage</label><input type="Number" id="swal-input3" class="swal2-input">' +
                '<label>Price</label><input type="Number" id="swal-input4" class="swal2-input">' +
                '<label>nFeedback</label><input type="Number" id="swal-input5" class="swal2-input">' +
                '<label>nRefine</label><input type="Number" id="swal-input6" class="swal2-input">',
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
            if (
                formValues[0] === '' ||
                formValues[1] === '' ||
                isNaN(formValues[2]) ||
                isNaN(formValues[3]) ||
                isNaN(formValues[4]) ||
                isNaN(formValues[5])
            ) {
                await Swal.fire('Empty field exists!', '', 'error');
                return;
            }
            if (formValues[0].length < 6) {
                await Swal.fire('Name of package at least 6 characters!', '', 'error');
                return;
            }
            const rs = await axios.post(
                `${SERVER_API}/package`,
                {
                    name: formValues[0],
                    description: formValues[1],
                    time: formValues[2],
                    price: formValues[3],
                    numberSubmitFeedback: formValues[4],
                    numberSubmitRefine: formValues[5]
                },
                {
                    headers: {
                        Authorization: AUTHEN
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
        getAllPackage();
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
                            paginationModel: { page: 0, pageSize: 5 }
                        }
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </div>
        </>
    );
};

export default Package;
