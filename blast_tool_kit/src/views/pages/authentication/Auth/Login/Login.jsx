import '../Auth.scss';
import iconStar from 'assets/images/icons/star.svg';
import iconArrow from 'assets/images/icons/arrow.svg';
import { Button, Form, FormGroup, Input, Label, NavLink } from 'reactstrap';
import { useState } from 'react';
import logo from 'assets/logo/logo-1.svg';
import { Link, useNavigate } from 'react-router-dom';

import bgOne from 'assets/images/bgs/login-1.svg';
import bgTwo from 'assets/images/bgs/login-2.svg';
import axios from 'axios';
import { SERVER_API } from 'host';
import Swal from 'sweetalert2';

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleChangleUserName = (e) => {
        setUserName(e.target.value);
    };
    const handlechanglePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleLoginAdmin = async () => {
        try {
            const rs = await axios.post(
                `${SERVER_API}/auth/loginadmin`,
                {
                    username: userName,
                    password: password
                },
                {
                    withCredentials: true
                }
            );
            if (rs) {
                localStorage.setItem('blast-user', JSON.stringify(rs.data));
                navigate('/');
            }
        } catch (err) {
            await Swal.fire(`Username or password incorrect`, ``, 'error');
        }
    };
    return (
        <div
            className="bg"
            style={{
                backgroundImage: `url(${bgOne}),url(${bgTwo})`,
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center',
                backgroundRepeat: 'no-repeat, no-repeat'
            }}
        >
            <div className="box-container">
                <div className="box-content">
                    <div className="img-logo">
                        <img src={logo} alt="logo" />
                    </div>
                    <div className="form-content">
                        <Form>
                            <FormGroup>
                                <Label for="userName">UserName</Label>
                                <Input
                                    id="userName"
                                    placeholder="Username or email address"
                                    value={userName}
                                    className="format-input"
                                    type="text"
                                    onChange={handleChangleUserName}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input
                                    id="password"
                                    placeholder="Enter your password"
                                    type="password"
                                    className="format-input"
                                    value={password}
                                    onChange={handlechanglePassword}
                                />
                            </FormGroup>
                            <FormGroup className="suggest-form">
                                <a href="#">Forgot Password</a>
                            </FormGroup>
                            <FormGroup className=" container-btn">
                                <Button className="format-btn btn-back">
                                    <NavLink>Back</NavLink>
                                </Button>
                                <Button onClick={handleLoginAdmin} className="format-btn btn-submit">
                                    Sign in
                                </Button>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
                <div className="tool">
                    <Link to="#" className="btn-login btn-active">
                        <span>Login</span>
                        <img src={iconStar} alt="star icon" />
                    </Link>
                    <Link to="/register" className="btn-register">
                        <img src={iconArrow} alt="arrow icon" />
                        <span>Register</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
