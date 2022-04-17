import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js'
import { isAuth } from '../middleware/auth.js';
import * as authController from '../controller/auth.controller.js';

const router = express.Router();

//로그인할때 
const validateCredential = [
	body('loginId')
		.trim()
		.notEmpty()
		.isLength({min:4})
		.withMessage('loginId should be at least 4 characters'),
	body('pw')
		.trim()
		.isLength({min:5})
		.withMessage('password should be at least 5 characters'),
	validate,
];

//회원가입 유효성 검사
const validateSignup= [
	...validateCredential,
	body('nickName')
		.notEmpty()
		.withMessage('nickName is missing'),
	body('email')
		.isEmail()
		.normalizeEmail()
		.withMessage('invalid email'),
	body('url')
		.isURL()//url 포맷이 맞는지
		.withMessage('invalid URL')
		.optional({nullable: true, checkFalsy: true}),//데이터가 없거나 텅텅빈 문자열이려도 허용,	
	validate,
];

//POST /signUp
router.post('/signup',validateSignup, authController.signUp);

//POST /login
router.post('/login', authController.login);

//GET /me
router.get('/me', isAuth,  authController.me);

export default router;