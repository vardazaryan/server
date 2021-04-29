const express = require('express');
const fs = require('fs');
const path = require('path');
const {body} = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/',

    body('email').exists().bail().isEmail(),
    body('password').exists().bail().isLength({min: 6}).custom(value => {
        return new RegExp("^[A-Z0-9.,/ $@()]+$").test(value);
    }),

    async (req, res) => {
        class Bcrypt {
            static async hash(password) {
                const salt = await bcrypt.genSalt(10);
                return bcrypt.hash(password, salt);
            };

            static async compare(password, hash){
                return bcrypt.compare(password, hash);
            }
        }
        const bcrypt=new Bcrypt;
        class UsersCtrl {
            async add(data) {
                if (await User.exists({username: data.username})) {
                    throw new Error('USER exists');
                } else {
                    const hash = await Bcrypt.hash(data.password);
                    const user = new User({
                        email: data.email,
                        password: hash
                    });
                    user.username = data.username;

                    return user.save();
                }
            }
        }
     const    userCtrl=new UsersCtrl;
        class AuthCtrl {
            async register(data) {

                const user = await  userCtrl.add(data);

                return user;
            };
        }
        const authCtrl=new AuthCtrl;
        try {
            let userdata = await authCtrl.register({
                email: req.body.email,
                password: req.body.password
            });
            userdata = userdata.toObject();
            delete userdata.password;
            res.onSuccess(userdata);
        } catch (e) {
            await fs.unlink(path.join(__homedir, req.file.path));
            res.onError(e);
        }
    }
);

module.exports = router;
