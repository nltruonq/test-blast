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

const Mail = () => {
    const [mails, setMails] = useState([]);

    const [type, setType] = useState('contact');

    let user = JSON.parse(localStorage.getItem('blast-user'));
    let axiosJWT = createAxios(user);

    const columns = [
        { field: 'email', headerName: 'Email', width: 300 },
        // { field: 'id', headerName: 'NO', width: 50 },
        { field: 'subject', headerName: 'Subject', width: 200 },
        { field: 'content', headerName: 'Content', width: 350 },
        { field: 'sendingTime', headerName: 'Time', width: 200 },
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
                            await axiosJWT.delete(`${SERVER_API}/mail/${currentRow._id}`, {
                                headers: {
                                    Authorization: `Bearer ${user.accessToken}`
                                }
                            });
                            await Swal.fire('Deleted!', 'This mail has been deleted.', 'success');
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

    const getAllMails = async () => {
        const data = await axiosJWT.get(`${SERVER_API}/mail`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        data.data = data.data.map((e, i) => ({
            ...e,
            id: i + 1
        }));
        setMails(data.data);
    };

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    useEffect(() => {
        user = JSON.parse(localStorage.getItem('blast-user'));
        if (user) {
            getAllMails();
        }
    }, []);
    return (
        <>
            <Box sx={{ minWidth: 120, marginTop: 2 }}>
                <FormControl sx={{ minWidth: 200, marginLeft: 2 }}>
                    <InputLabel id="demo-simple-select-label-type">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label-type"
                        id="demo-simple-select-type"
                        value={type}
                        label="Type"
                        onChange={handleChangeType}
                    >
                        <MenuItem value="contact">Contact</MenuItem>
                        <MenuItem value="payment">Payment</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <div style={{ height: 500, width: '100%', marginTop: 10 }}>
                <DataGrid
                    rows={mails?.filter((e) => {
                        return e.type === type;
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

export default Mail;
