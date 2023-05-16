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
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'time', headerName: 'Days Usage', width: 130 },
        { field: 'price', headerName: 'Price', width: 150 },
        { field: 'numberPrompt', headerName: 'Number of Prompts', width: 150 },
        { field: 'numberWord', headerName: 'Number of Words', width: 150 },
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
                        {/* <Button variant="contained" color="warning" size="small" onClick={handleEdit}>
                            Edit
                        </Button> */}
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
                '<label>Description</label><input id="swal-input2" class="swal2-input">' +
                '<label>Days usage</label><input type="Number" id="swal-input3" class="swal2-input">' +
                '<label>Price</label><input type="Number" id="swal-input4" class="swal2-input">' +
                '<label>nPrompt</label><input type="Number" id="swal-input5" class="swal2-input">' +
                '<label>nWord</label><input type="Number" id="swal-input6" class="swal2-input">',
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
            const rs = await axios.post(
                `${SERVER_API}/package`,
                {
                    name: formValues[0],
                    description: formValues[1],
                    time: formValues[2],
                    price: formValues[3],
                    numberPrompt: formValues[4],
                    numberWord: formValues[5]
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
