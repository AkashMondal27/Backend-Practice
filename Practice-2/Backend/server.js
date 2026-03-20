import express from 'express';

const app = express();


// get a list f five jockws

app.get('/api/jockes', (req, res) => {
    const jockes = [
        {
            id: 1,
            title: '1st jock',
            content: ' hellow '
        },
        {
            id: 2,
            title: '2nd jock',
            content: ' world'
        },
        {
            id: 3,
            title: '3rd jock',
            content: ' how '
        },
        {
            id: 4,
            title: '4th jock',
            content: ' are '
        },
        {
            id: 5,
            title: '5th jock',
            content: ' you '
        },
    ];

    res.send(jockes)
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`example at port ${port} `)
});