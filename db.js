const { Client } = require('pg');
const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'projects',
        password: '1234',
        port: 5432,
    });


client.connect((err)=>{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("db connect");
    }

})

module.exports=client;