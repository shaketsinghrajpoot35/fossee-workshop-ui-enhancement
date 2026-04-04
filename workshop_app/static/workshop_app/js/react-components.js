/**
 * FOSSEE Workshop Booking — React UI Components
 * ==============================================
 * Lightweight React components loaded via CDN
 * to enhance the existing Django templates.
 * 
 * These components are mounted into Django templates
 * using ReactDOM.render() on specific mount points.
 * No bundler required — works with CDN-loaded React.
 */

'use strict';

const { useState, useEffect, useRef } = React;

/* ==========================================
   1. AnimatedCounter — Counting animation
   ========================================== */
function AnimatedCounter({ end, duration = 1500, label, icon, color = '#4f46e5' }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration]);

    return React.createElement('div', {
        className: 'text-center p-3',
        style: { animation: 'scaleIn 400ms ease-out' }
    },
        React.createElement('span', {
            className: 'material-icons mb-2',
            style: { fontSize: '2rem', color }
        }, icon),
        React.createElement('h3', {
            className: 'font-weight-bold mb-0',
            style: { color }
        }, count),
        React.createElement('small', {
            className: 'text-muted font-weight-bold',
            style: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }
        }, label)
    );
}

/* ==========================================
   2. PasswordStrength — Real-time indicator
   ========================================== */
function PasswordStrength({ inputSelector }) {
    const [strength, setStrength] = useState(0);
    const [label, setLabel] = useState('');

    useEffect(() => {
        const input = document.querySelector(inputSelector);
        if (!input) return;

        const handleInput = () => {
            const val = input.value;
            let score = 0;
            if (val.length >= 6) score++;
            if (val.length >= 10) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            setStrength(score);
            const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
            setLabel(labels[score] || '');
        };

        input.addEventListener('input', handleInput);
        return () => input.removeEventListener('input', handleInput);
    }, [inputSelector]);

    if (strength === 0) return null;

    const colors = ['', '#f43f5e', '#f59e0b', '#eab308', '#10b981', '#059669'];
    const widths = ['', '20%', '40%', '60%', '80%', '100%'];

    return React.createElement('div', { className: 'mt-2', style: { animation: 'fadeIn 200ms ease-out' } },
        React.createElement('div', {
            style: {
                height: '3px',
                borderRadius: '3px',
                background: '#e2e8f0',
                overflow: 'hidden'
            }
        },
            React.createElement('div', {
                style: {
                    height: '100%',
                    width: widths[strength],
                    background: colors[strength],
                    borderRadius: '3px',
                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }
            })
        ),
        React.createElement('small', {
            style: {
                color: colors[strength],
                fontWeight: 600,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
            }
        }, label)
    );
}

/* ==========================================
   3. CharacterCount — Textarea character count
   ========================================== */
function CharacterCount({ inputSelector, maxChars = 500 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const input = document.querySelector(inputSelector);
        if (!input) return;

        const handleInput = () => setCount(input.value.length);
        input.addEventListener('input', handleInput);
        handleInput(); // initial
        return () => input.removeEventListener('input', handleInput);
    }, [inputSelector]);

    const percentage = Math.min((count / maxChars) * 100, 100);
    const isNearLimit = percentage > 80;

    return React.createElement('div', {
        className: 'd-flex justify-content-between align-items-center mt-1',
        style: { fontSize: '0.7rem' }
    },
        React.createElement('div', {
            style: {
                flex: 1,
                height: '2px',
                background: '#e2e8f0',
                borderRadius: '2px',
                marginRight: '8px',
                overflow: 'hidden'
            }
        },
            React.createElement('div', {
                style: {
                    height: '100%',
                    width: percentage + '%',
                    background: isNearLimit ? '#f59e0b' : '#4f46e5',
                    borderRadius: '2px',
                    transition: 'all 200ms ease'
                }
            })
        ),
        React.createElement('span', {
            style: {
                color: isNearLimit ? '#f59e0b' : '#94a3b8',
                fontWeight: 600,
                whiteSpace: 'nowrap'
            }
        }, count + ' chars')
    );
}

/* ==========================================
   4. TimeAgo — Relative time display
   ========================================== */
function TimeAgo({ dateString }) {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) setTimeAgo('Just now');
            else if (minutes < 60) setTimeAgo(`${minutes}m ago`);
            else if (hours < 24) setTimeAgo(`${hours}h ago`);
            else if (days < 7) setTimeAgo(`${days}d ago`);
            else setTimeAgo(date.toLocaleDateString());
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [dateString]);

    return React.createElement('span', {
        className: 'text-muted',
        style: { fontSize: '0.7rem' },
        title: dateString
    }, timeAgo);
}

/* ==========================================
   5. SearchFilter — Real-time table search
   ========================================== */
function SearchFilter({ tableSelector, placeholder = 'Search...' }) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const table = document.querySelector(tableSelector);
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }, [query, tableSelector]);

    return React.createElement('div', { className: 'mb-3', style: { maxWidth: '320px' } },
        React.createElement('div', {
            className: 'd-flex align-items-center',
            style: {
                background: 'white',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0 12px',
                transition: 'all 150ms ease'
            }
        },
            React.createElement('span', {
                className: 'material-icons',
                style: { color: '#94a3b8', fontSize: '1.2rem', marginRight: '8px' }
            }, 'search'),
            React.createElement('input', {
                type: 'text',
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: placeholder,
                style: {
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    padding: '10px 0',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    width: '100%',
                    color: '#1e293b'
                }
            })
        )
    );
}

/* ==========================================
   6. MobileNav — Bottom navigation for mobile
   ========================================== */
function MobileBottomNav({ links }) {
    return React.createElement('nav', {
        className: 'd-md-none',
        style: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '6px 0 env(safe-area-inset-bottom, 8px)',
            zIndex: 1050,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
        },
        role: 'navigation',
        'aria-label': 'Mobile navigation'
    },
        links.map((link, i) => React.createElement('a', {
            key: i,
            href: link.href,
            style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: link.active ? '#4f46e5' : '#94a3b8',
                fontSize: '0.6rem',
                fontWeight: 600,
                padding: '4px 12px',
                transition: 'color 150ms ease'
            }
        },
            React.createElement('span', {
                className: 'material-icons',
                style: { fontSize: '1.3rem', marginBottom: '2px' }
            }, link.icon),
            link.label
        ))
    );
}

/* ==========================================
   7. FormValidator — Inline validation
   ========================================== */
function FormValidator({ formSelector }) {
    useEffect(() => {
        const form = document.querySelector(formSelector);
        if (!form) return;

        const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.required && !this.value.trim()) {
                    this.style.borderColor = '#f43f5e';
                    this.style.boxShadow = '0 0 0 3px rgba(244, 63, 94, 0.1)';
                } else {
                    this.style.borderColor = '#10b981';
                    this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }
            });

            input.addEventListener('focus', function() {
                this.style.borderColor = '#4f46e5';
                this.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.15)';
            });
        });
    }, [formSelector]);

    return null;
}

/* ==========================================
   8. ScrollToTop — Scroll button
   ========================================== */
function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!visible) return null;

    return React.createElement('button', {
        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        'aria-label': 'Scroll to top',
        style: {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            transition: 'all 200ms ease',
            zIndex: 1040,
            animation: 'scaleIn 300ms ease-out'
        }
    },
        React.createElement('span', { className: 'material-icons' }, 'arrow_upward')
    );
}

/* ==========================================
   GLOBAL INITIALIZATION
   ========================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Mount ScrollToTop globally
    const scrollMount = document.createElement('div');
    scrollMount.id = 'react-scroll-top';
    document.body.appendChild(scrollMount);
    ReactDOM.render(React.createElement(ScrollToTop), scrollMount);

    // Mount Password Strength on register page
    const pwdField = document.getElementById('id_password');
    if (pwdField && document.getElementById('register-form')) {
        const pwdMount = document.createElement('div');
        pwdField.parentNode.insertBefore(pwdMount, pwdField.nextSibling);
        ReactDOM.render(
            React.createElement(PasswordStrength, { inputSelector: '#id_password' }),
            pwdMount
        );
    }

    // Mount FormValidator on login form
    if (document.getElementById('login-form')) {
        const validatorMount = document.createElement('div');
        document.body.appendChild(validatorMount);
        ReactDOM.render(
            React.createElement(FormValidator, { formSelector: '#login-form' }),
            validatorMount
        );
    }

    // Mount FormValidator on register form
    if (document.getElementById('register-form')) {
        const validatorMount = document.createElement('div');
        document.body.appendChild(validatorMount);
        ReactDOM.render(
            React.createElement(FormValidator, { formSelector: '#register-form' }),
            validatorMount
        );
    }

    // Mount search filter on workshop types page
    const typeTable = document.querySelector('.table');
    if (typeTable && document.querySelector('[href*="workshop_type_details"]')) {
        const searchMount = document.createElement('div');
        typeTable.parentNode.insertBefore(searchMount, typeTable);
        ReactDOM.render(
            React.createElement(SearchFilter, { 
                tableSelector: '.table',
                placeholder: 'Search workshops...'
            }),
            searchMount
        );
    }

    // Mount mobile bottom nav (for authenticated users)
    const navLinks = document.querySelectorAll('.navbar-nav a[href*="workshop"]');
    if (navLinks.length > 0 && window.innerWidth < 768) {
        const mobileMount = document.createElement('div');
        document.body.appendChild(mobileMount);
        
        const links = [
            { icon: 'home', label: 'Home', href: '/', active: false },
            { icon: 'dashboard', label: 'Dashboard', href: '/workshop/status', active: false },
            { icon: 'category', label: 'Types', href: '/workshop/types/', active: false },
            { icon: 'person', label: 'Profile', href: '/workshop/view_profile/', active: false }
        ];
        
        ReactDOM.render(React.createElement(MobileBottomNav, { links }), mobileMount);
    }
});
