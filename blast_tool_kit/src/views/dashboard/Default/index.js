import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './SpendingCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './EarningCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';

import { createAxios } from '../../../axios/axiosInstance';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);

    const [spending, setSpending] = useState({});
    const [spendingMonth, setSpendingMonth] = useState({});
    const [earning, setEarning] = useState({});
    const [earningMonth, setEarningMonth] = useState({});

    const [selectDate, setSelectDate] = useState('');

    let user = JSON.parse(localStorage.getItem('blast-user'));
    let axiosJWT = createAxios(user);

    const getSpending = async () => {
        const rs = await axiosJWT.get(`${process.env.REACT_APP_SERVER_API}/token`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        setSpending(rs.data);
    };

    const getEarning = async () => {
        const rs = await axiosJWT.get(`${process.env.REACT_APP_SERVER_API}/user/calculate`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        setEarning(rs.data);
    };

    const handleSelectDate = async (e) => {
        const date = e.target.value.split('-');
        let year, month;
        if (date[0].length === 4) {
            year = date[0];
            month = Number(date[1]).toString();
        } else {
            year = date[1];
            month = Number(date[0]).toString();
        }
        setSelectDate(() => `${month}/${year}`);
    };

    const handleGetSpendingMonth = async () => {
        const rs1 = await axiosJWT.get(`${process.env.REACT_APP_SERVER_API}/token?date=${selectDate}`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        setSpendingMonth(rs1.data);
    };

    const handleGetEarningMonth = async () => {
        const rs2 = await axiosJWT.get(`${process.env.REACT_APP_SERVER_API}/user/calculate?date=${selectDate}`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        });
        setEarningMonth(rs2.data);
    };

    const handleGetSendpingEarningMonth = async () => {
        if (!selectDate) {
            return;
        }
        Promise.all([handleGetEarningMonth(), handleGetSpendingMonth()])
            .then((result) => {})
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        Promise.all([getSpending(), getEarning()])
            .then((result) => {
                setLoading(false);
            })
            .catch((err) => setLoading(true));
    }, []);

    useEffect(() => {
        handleGetSendpingEarningMonth();
    }, [selectDate]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <EarningCard spending={spending} isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard earning={earning} isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} mt={4}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={12} xs={12} md={12} lg={12}>
                                <input onChange={(e) => handleSelectDate(e)} type="month" />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={6}>
                                <TotalIncomeDarkCard spending={spendingMonth} isLoading={isLoading} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={6}>
                                <TotalIncomeLightCard earning={earningMonth} isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <TotalGrowthBarChart isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid> */}
        </Grid>
    );
};

export default Dashboard;
