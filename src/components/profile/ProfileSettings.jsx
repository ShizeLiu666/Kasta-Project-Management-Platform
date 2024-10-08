import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col,
} from 'reactstrap';
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
// import LockIcon from '@mui/icons-material/Lock'; // 导入锁定图标
// 导入 countryOptions
import { countryOptions } from '../auth/CountryCodeSelect';

const ProfileSettings = ({ userDetails }) => {
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alert, setAlert] = useState({
        severity: "",
        message: "",
        open: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userDetails) {
            setUsername(userDetails.username || "");
            setNickname(userDetails.nickName || "");
            setEmail(userDetails.email || "");
            setCountryCode(userDetails.countryCode ? { code: userDetails.countryCode } : null);
        }
    }, [userDetails]);

    const showAlert = (severity, message) => {
        setAlert({ severity, message, open: true });
        setTimeout(() => {
            setAlert({ ...alert, open: false });
        }, 3000);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 这里您可以添加密码验证逻辑
        if (password !== confirmPassword) {
            showAlert("error", "Passwords do not match!");
            setLoading(false);
            return;
        }

        // Here you would typically make an API call to update the user's profile
        // For now, we'll just simulate it with a timeout
        setTimeout(() => {
            setLoading(false);
            showAlert("success", "Profile updated successfully!");
        }, 2000);
    };

    const readOnlyStyle = {
        backgroundColor: '#f8f9fa',
        cursor: 'not-allowed',
        // borderColor: '#ced4da',
    };

    return (
        <Card className="h-100">
            <CardBody>
                <CardTitle tag="h4" className="mb-4">User Profile Settings</CardTitle>
                {alert.open && (
                    <Alert
                        severity={alert.severity}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 9999,
                        }}
                    >
                        {alert.message}
                    </Alert>
                )}
                <Form onSubmit={handleUpdateProfile}>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                    </div>
                                    <Input
                                        type="text"
                                        id="username"
                                        value={username}
                                        readOnly
                                        style={readOnlyStyle}
                                    />
                                </div>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="nickname">Nickname</Label>
                                <Input
                                    type="text"
                                    id="nickname"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                            </div>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                readOnly
                                style={readOnlyStyle}
                            />
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label for="countryCode">Country Code</Label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                            </div>
                            <Input 
                                // type="select" 
                                type="text" 
                                id="countryCode"
                                value={countryCode ? countryCode.code : ''}
                                onChange={(e) => {
                                    const selectedCountry = countryOptions.find(country => country.code === e.target.value);
                                    setCountryCode(selectedCountry);
                                }}
                                readOnly
                                style={readOnlyStyle}
                            >
                                {/* <option value="">Select a country</option>
                                {countryOptions.map((country, index) => (
                                    <option key={`${country.code}-${index}`} value={country.code}>
                                        {country.en} (+{country.code})
                                    </option>
                                ))} */}
                            </Input>
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="confirmPassword">Confirm Password</Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </FormGroup>
                    <div className="d-flex justify-content-end">
                        {loading ? (
                            <Box sx={{ display: "flex" }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Button
                                color="primary"
                                type="submit"
                                style={{
                                    backgroundColor: "#fbcd0b",
                                    borderColor: "#fbcd0b",
                                    fontWeight: "bold",
                                }}
                            >
                                Update Profile
                            </Button>
                        )}
                    </div>
                </Form>
            </CardBody>
        </Card>
    );
};

export default ProfileSettings;