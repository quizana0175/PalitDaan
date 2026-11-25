import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginlogo from '../assets/loginlogo.png';
import logocit from '../assets/logocit.png';
import { loginUser } from '../utils/auth';

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        idNumber: '',
        password: '',
    });
    const [error, setError] = useState('');

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    }

    function handleSubmit(e) {
        e.preventDefault();
        const result = loginUser(form);

        if (!result.success) {
            setError(result.message);
            return;
        }

        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
    }

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div style={styles.logocitWrap}>
                    <img src={logocit} alt="CIT-U logocit" style={styles.logocit} />
                </div>
                <h1 style={styles.heading}>Login</h1>
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

                    <div style={styles.buttonRow}>
                        <button type="submit" style={styles.submitButton} aria-label="Log in">→</button>
                    </div>
                    <button
                        type="button"
                        style={styles.registerButton}
                        onClick={() => navigate('/signup')}
                    >
                        Create an account
                    </button>
                    <p style={styles.adminHint}>Admin demo: ID <strong>admin</strong> · Password <strong>admin123</strong></p>
                </form>

                <div style={styles.imageCard}>
                    <img src={loginlogo} alt="CIT-U canteen" style={styles.image} />
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#103B2A',
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
    content: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        alignItems: 'center', 
        flexWrap: 'wrap',
    },
    formCard: {
        backgroundColor: '#E8F1EB',
        borderRadius: '20px',
        padding: '26px 30px',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxSizing: 'border-box',
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
    registerButton: {
        backgroundColor: 'transparent',
        color: '#1A1A1A',
        border: 'none',
        padding: '4px',
        fontWeight: 700,
        fontSize: '13px',
        cursor: 'pointer',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
    },
    adminHint: {
        margin: '2px 0 0',
        color: '#315b43',
        fontSize: '11px',
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#174C35',
        color: '#FFFFFF',
        border: 'none',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        fontWeight: 700,
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
};