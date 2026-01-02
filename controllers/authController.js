const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getLoginPage = (req, res) => {
    res.render('login', { title: 'Login - Antidrug Club' });
};

exports.getRegisterPage = (req, res) => {
    res.render('register', { title: 'Join Us - Antidrug Club' });
};

exports.registerUser = async (req, res) => {
    const { 
        full_name, university_id, college, department, year_of_study, 
        gender, phone_number, email, residence, dorm_block, 
        membership_type, committees, reason_for_joining, password, confirm_password 
    } = req.body;

    let errors = [];

    if (password !== confirm_password) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            title: 'Join Us - Antidrug Club',
            errors,
            full_name, university_id, email, phone_number // Keep data
        });
    } else {
        try {
            // Check if user exists
            const [existingUser] = await db.query('SELECT * FROM users WHERE email = ? OR university_id = ?', [email, university_id]);
            if (existingUser.length > 0) {
                errors.push({ msg: 'Email or University ID already registered' });
                return res.render('register', {
                    title: 'Join Us - Antidrug Club',
                    errors,
                    full_name, university_id, email
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert User
            await db.query(
                `INSERT INTO users (full_name, university_id, college, department, year_of_study, gender, phone_number, email, residence, dorm_block, membership_type, committees, reason_for_joining, password) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [full_name, university_id, college, department, year_of_study, gender, phone_number, email, residence, dorm_block || null, membership_type, committees || null, reason_for_joining || null, hashedPassword]
            );

            req.flash('success_msg', 'You are now registered and can log in after admin approval.');
            res.redirect('/auth/login');

        } catch (err) {
            console.error(err);
            errors.push({ msg: 'Server error during registration' });
            res.render('register', { title: 'Join Us - Antidrug Club', errors });
        }
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            req.flash('error_msg', 'Email not registered');
            return res.redirect('/auth/login');
        }

        const user = users[0];

        // Match password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Create session
            req.session.user = {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            };
            req.flash('success_msg', 'You are logged in');
            
            if (user.role === 'admin') {
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/');
            }
        } else {
            req.flash('error_msg', 'Password incorrect');
            res.redirect('/auth/login');
        }
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Login error');
        res.redirect('/auth/login');
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/auth/login');
    });
};
