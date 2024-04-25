import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('<h1>Express App</h1>');
});

export default router;
