import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginlogo from '../assets/loginlogo.png';
import logocit from '../assets/logocit.png';
import { registerUser } from '../utils/auth';

export default function SignUp() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        idNumber: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    }

    function handleSubmit(e) {
        e.preventDefault();
        const result = registerUser(form);

        if (!result.success) {
            setError(result.message);
            return;
        }

        navigate('/login');
    }

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                    <img src={logocit} alt="CIT-U logocit" style={styles.logocit} />
                <h1 style={styles.heading}>Sign up</h1>  
                <div style={styles.headerSpacer} />
            </div>

            <div style={styles.content}>
                <form onSubmit={handleSubmit} style={styles.formCard}>
                    {error && <p style={styles.error}>{error}</p>}
                    <label style={styles.label}>
                        ID Number
                        <input
                            name="idNumber"
                            value={form.idNumber}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter your ID number"
                            required
                        />
                    </label>

                    <label style={styles.label}>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter email address"
                            required
                        />
                    </label>

                    <label style={styles.label}>
                        First Name
                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter your first name"
                            required
                        />
                    </label>

                    <label style={styles.label}>
                        Last Name
                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter your last name"
                            required
                        />
                    </label>

                    <label style={styles.label}>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter your password"
                            required
                        />
                    </label>

                    <label style={styles.label}>
                        Confirm Password
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Confirm your password"
                            required
                        />
                    </label>

                    <div style={styles.buttonRow}>
                        <button type="submit" style={styles.submitButton}>Sign up</button>
                    </div>
                    <p style={styles.loginPrompt}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.loginLink}>Back to login</Link>
                    </p>
                </form>

                <div style={styles.imageCard}>
                    <img src={loginlogo} alt="CIT-U canteen" style={styles.image} />
                    <p style={styles.imagePlaceholder}></p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#000000',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: '30px 50px',
        boxSizing: 'border-box',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '30px',
    },
    heading: {
        margin: 0,
        fontSize: '36px',
        fontWeight: 900,
        color: '#ffffff',
        textAlign: 'center',
    },
    logocitWrap: {
        display: 'flex',
        justifyContent: 'center',
    },
    logocit: {
        width: '242px',
        height: '171px',
    },
    logocitPlaceholder: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '9px',
        fontWeight: 700,
        color: '#999',
    },
    headerSpacer: {
        width: '64px',
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        alignItems: 'stretch',
        flexWrap: 'wrap',
    },
    error: {
        margin: 0,
        padding: '8px 10px',
        borderRadius: '8px',
        backgroundColor: '#FBE0E4',
        color: '#A51D35',
        fontSize: '12px',
        fontWeight: 700,
    },
    formCard: {
        backgroundColor: '#E8F1EB',
        borderRadius: '20px',
        padding: '26px 30px',
        width: '300px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxSizing: 'border-box',
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        fontSize: '14px',
        fontWeight: 700,
        color: '#1A1A1A',
    },
    input: {
        border: 'none',
        borderBottom: '1px solid rgba(0,0,0,0.45)',
        backgroundColor: 'transparent',
        padding: '4px 2px',
        fontSize: '13px',
        outline: 'none',
        fontWeight: 400,
        color: '#333',
    },
    buttonRow: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '6px',
    },
    submitButton: {
        backgroundColor: '#174C35',
        color: '#FFFFFF',
        border: 'none',
        padding: '10px 28px',
        borderRadius: '999px',
        fontWeight: 700,
        fontSize: '14px',
        cursor: 'pointer',
    },
    loginPrompt: {
        margin: '6px 0 0',
        textAlign: 'center',
        fontSize: '12px',
        color: '#1A1A1A',
    },
    loginLink: {
        color: '#174C35',
        fontWeight: 700,
    },
    imageCard: {
        width: '300px',
        minWidth: '260px',
        minHeight: '400px',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '12px',
    },
    imagePlaceholder: {
        color: '#AAAAAA',
        fontSize: '13px',
        textAlign: 'center',
        margin: 0,
    },
};