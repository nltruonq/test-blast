// material-ui

import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// project imports
import axios from 'axios';
import Swal from 'sweetalert2';
import { createAxios } from '../../axios/axiosInstance';

import { SERVER_API } from '../../host/index';

const Prompt = () => {
    const [prompts, setPrompts] = useState([]);
    const [menu, setMenu] = useState({});

    const [feature, setFeature] = useState('');
    const [band, setBand] = useState('');
    const [type, setType] = useState('');

    let user = JSON.parse(localStorage.getItem('blast-user'));
    let axiosJWT = createAxios(user);

    const columns = [
        { field: 'orderBy', headerName: 'Order', width: 60 },
        // { field: 'id', headerName: 'NO', width: 50 },
        { field: 'feature', headerName: 'Feature', width: 150 },
        { field: 'band', headerName: 'Band', width: 60 },
        { field: 'content', headerName: 'Content', width: 450 },
        { field: 'fullType', headerName: 'Type', width: 240 },
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
                            `<div class="group-textarea"><label>Content</label><textarea id="swal-input3" class="swal2-input">${currentRow.content}</textarea></div>` +
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
                        const rs = await axiosJWT.patch(
                            `${SERVER_API}/prompt/${currentRow._id}`,
                            {
                                feature: formValues[0].split(' ').join(''),
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
                            await axiosJWT.delete(`${SERVER_API}/prompt/${currentRow._id}`, {
                                headers: {
                                    Authorization: `Bearer ${user.accessToken}`
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
        const data = await axiosJWT.get(`${SERVER_API}/prompt`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        data.data = data.data.map((e, i) => ({
            ...e,
            id: i + 1
        }));
        setPrompts(data.data);
    };

    const getMenu = async () => {
        const data = await axiosJWT.get(`${SERVER_API}/menu`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        setMenu(data.data);
        setFeature(data.data.feature[0]);
        setBand(data.data.band[0]);
        setType(data.data.type[0]);
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
                '<div class="group-textarea"><label>Content</label><textarea id="swal-input3" class="swal2-input"></textarea></div>' +
                `<label>Type</label><select id="swal-input4" class="swal2-input">${menu?.type?.map(
                    (e, i) => `<option value=${JSON.stringify(e)}>${e}</option>`
                )}</select>` +
                '<label>Order</label><input type="Number" id="swal-input5" class="swal2-input">',
            focusConfirm: false,
            preConfirm: async () => {
                if (
                    document.getElementById('swal-input1').value === '' ||
                    document.getElementById('swal-input2').value === '' ||
                    document.getElementById('swal-input3').value === '' ||
                    document.getElementById('swal-input4').value === '' ||
                    isNaN(parseInt(document.getElementById('swal-input5').value))
                ) {
                    await Swal.showValidationMessage('Empty field exists!', '', 'error');
                    return;
                }
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
            const rs = await axiosJWT.post(
                `${SERVER_API}/prompt`,
                {
                    feature: formValues[0].split(' ').join(''),
                    band: formValues[1],
                    content: formValues[2],
                    fullType: formValues[3],
                    orderBy: formValues[4]
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

    const handleChangeFeature = (event) => {
        setFeature(event.target.value);
    };
    const handleChangeBand = (event) => {
        setBand(event.target.value);
    };
    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    useEffect(() => {
        user = JSON.parse(localStorage.getItem('blast-user'));
        if (user) {
            getAllPrompts();
            getMenu();
        }
    }, []);
    return (
        <>
            <Button onClick={handleCreate} variant="contained" color="primary" size="large">
                Create
            </Button>
            <Box sx={{ minWidth: 120, marginTop: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-label-feature">Feature</InputLabel>
                    <Select
                        labelId="demo-simple-select-label-feature"
                        id="demo-simple-select-feature"
                        value={feature}
                        label="Feature"
                        onChange={handleChangeFeature}
                    >
                        {menu?.feature?.map((e, i) => (
                            <MenuItem key={i} value={e}>
                                {e}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200, marginLeft: 2 }}>
                    <InputLabel id="demo-simple-select-label-band">Band</InputLabel>
                    <Select
                        labelId="demo-simple-select-label-band"
                        id="demo-simple-select-band"
                        value={band}
                        label="Band"
                        onChange={handleChangeBand}
                    >
                        {menu?.band?.map((e, i) => (
                            <MenuItem key={i} value={e}>
                                {e}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200, marginLeft: 2 }}>
                    <InputLabel id="demo-simple-select-label-type">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label-type"
                        id="demo-simple-select-type"
                        value={type}
                        label="Type"
                        onChange={handleChangeType}
                    >
                        {menu?.type?.map((e, i) => (
                            <MenuItem key={i} value={e}>
                                {e}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <div style={{ height: 500, width: '100%', marginTop: 10 }}>
                <DataGrid
                    rows={prompts?.filter((e) => {
                        if (feature.split(' ').join('') !== 'refine')
                            return e.feature === feature.split(' ').join('') && e.band === band && e.fullType === type;
                        return e.feature === feature.split(' ').join('');
                    })}
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
