import '../Auth.scss';
import './Register.scss';
import iconStar from 'assets/images/icons/star.svg';
import iconArrow from 'assets/images/icons/arrow.svg';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { useState } from 'react';
import logo from 'assets/logo/logo-1.svg';
import { Link } from 'react-router-dom';
import bgOne from 'assets/images/bgs/login-1.svg';
import bgTwo from 'assets/images/bgs/login-2.svg';

function Register() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setComfirmPassword] = useState('');

    const handleChangleUserName = (e) => {
        setUserName(e.target.value);
    };
    const handleChanglePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleChangleComfirmPassword = (e) => {
        setComfirmPassword(e.target.value);
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
                                    onChange={handleChanglePassword}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Comfirm Password</Label>
                                <Input
                                    id="confirm"
                                    placeholder="Enter your password"
                                    type="password"
                                    className="format-input"
                                    value={confirmPassword}
                                    onChange={handleChangleComfirmPassword}
                                />
                            </FormGroup>
                            <FormGroup className=" container-btn">
                                <Button className="format-btn color-btn-register btn-submit w-100">Register</Button>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
                <div className="tool">
                    <Link to="/login" className="btn-login_register">
                        <span>Login</span>
                        <img src={iconArrow} alt="arrow icon" />
                    </Link>
                    <Link to="#" className="btn-register_register btn-active">
                        <span>Register</span>
                        <img src={iconStar} alt="star icon" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
