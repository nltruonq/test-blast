// material-ui

import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// project imports
import axios from 'axios';
import Swal from 'sweetalert2';

import { SERVER_API, AUTHEN } from '../../host/index';

const Prompt = () => {
    const [prompts, setPrompts] = useState([]);
    const [menu, setMenu] = useState({});

    const columns = [
        { field: 'id', headerName: 'NO', width: 50 },
        { field: 'feature', headerName: 'Feature', width: 150 },
        { field: 'band', headerName: 'Band', width: 60 },
        { field: 'content', headerName: 'Content', width: 360 },
        { field: 'fullType', headerName: 'Type', width: 240 },
        { field: 'orderBy', headerName: 'Order', width: 100 },
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

                const handleEdit = async (e) => {
                    const currentRow = params.row;
                    const { value: formValues } = await Swal.fire({
                        title: 'Creating a prompt',
                        html:
                            `<label>Feature</label><select id="swal-input1" class="swal2-input">${menu?.feature?.map(
                                (e, i) =>
                                    `<option ${e.split(' ').join('') === currentRow.feature ? 'selected' : ''} value=${JSON.stringify(
                                        e
                                    )}>${e}</option>`
                            )}</select>` +
                            `<label>Band</label><select id="swal-input2" class="swal2-input">${menu?.band?.map(
                                (e, i) =>
                                    `<option ${e.split(' ').join('') === currentRow.band ? 'selected' : ''} value=${JSON.stringify(
                                        e
                                    )}>${e}</option>`
                            )}</select>` +
                            `<label>Content</label><input value=${JSON.stringify(
                                currentRow.content
                            )} id="swal-input3" class="swal2-input">` +
                            `<label>Type</label><select id="swal-input4" class="swal2-input">${menu?.type?.map(
                                (e, i) =>
                                    `<option ${e.split(' ').join('') === currentRow.type ? 'selected' : ''} value=${JSON.stringify(
                                        e
                                    )}>${e}</option>`
                            )}</select>` +
                            `<label>Order</label><input value=${currentRow.orderBy} type="Number" id="swal-input5" class="swal2-input">`,
                        focusConfirm: false,
                        preConfirm: () => {
                            return [
                                document.getElementById('swal-input1').value,
                                document.getElementById('swal-input2').value,
                                document.getElementById('swal-input3').value,
                                document.getElementById('swal-input4').value,
                                parseInt(document.getElementById('swal-input5').value)
                            ];
                        }
                    });

                    if (formValues) {
                        console.log(currentRow._id);
                        const rs = await axios.patch(
                            `${SERVER_API}/prompt/${currentRow._id}`,
                            {
                                feature: formValues[0],
                                band: formValues[1],
                                content: formValues[2],
                                type:
                                    formValues[3] === 'Task Achievement'
                                        ? 'ta'
                                        : formValues[3] === 'Coherence and Cohesion'
                                        ? 'cc'
                                        : formValues[3] === 'Lexical Resource'
                                        ? 'lr'
                                        : 'gra',
                                fullType: formValues[3],
                                orderBy: formValues[4]
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
                            await axios.delete(`${SERVER_API}/prompt/${currentRow._id}`, {
                                headers: {
                                    Authorization: AUTHEN
                                }
                            });
                            await Swal.fire('Deleted!', 'This prompt has been deleted.', 'success');
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

    const getAllPrompts = async () => {
        const data = await axios.get(`${SERVER_API}/prompt`, {
            headers: {
                Authorization: AUTHEN
            }
        });
        data.data = data.data.map((e, i) => ({
            ...e,
            id: i + 1
        }));
        setPrompts(data.data);
    };

    const getMenu = async () => {
        const data = await axios.get(`${SERVER_API}/menu`, {
            headers: {
                Authorization: AUTHEN
            }
        });
        setMenu(data.data);
    };

    const handleCreate = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Creating a prompt',
            html:
                `<label>Feature</label><select id="swal-input1" class="swal2-input">${menu?.feature?.map(
                    (e, i) => `<option value=${JSON.stringify(e)}>${e}</option>`
                )}</select>` +
                `<label>Band</label><select id="swal-input2" class="swal2-input">${menu?.band?.map(
                    (e, i) => `<option value=${JSON.stringify(e)}>${e}</option>`
                )}</select>` +
                '<label>Content</label><input id="swal-input3" class="swal2-input">' +
                `<label>Type</label><select id="swal-input4" class="swal2-input">${menu?.type?.map(
                    (e, i) => `<option value=${JSON.stringify(e)}>${e}</option>`
                )}</select>` +
                '<label>Order</label><input type="Number" id="swal-input5" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value,
                    document.getElementById('swal-input4').value,
                    parseInt(document.getElementById('swal-input5').value)
                ];
            }
        });

        if (formValues) {
            const rs = await axios.post(
                `${SERVER_API}/prompt`,
                {
                    feature: formValues[0],
                    band: formValues[1],
                    content: formValues[2],
                    fullType: formValues[3],
                    orderBy: formValues[4]
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
        getAllPrompts();
        getMenu();
    }, []);
    return (
        <>
            <Button onClick={handleCreate} variant="contained" color="primary" size="large">
                Create
            </Button>
            <div style={{ height: 600, width: '100%', marginTop: 20 }}>
                <DataGrid
                    rows={prompts}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 40 }
                        }
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </div>
        </>
    );
};

export default Prompt;
