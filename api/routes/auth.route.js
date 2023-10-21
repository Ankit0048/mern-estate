import express from 'express';
import {signup}  from '../contorllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);

export default router;