const express = require('express');
const hbs = require('hbs');
const path = require('path');
const app = express();

const getWeather = require('./utils/weatherData');

//!handlebars /hbs
const publicStaticDirPath = path.join(__dirname,'./public'); //* main folder with client side css and js
const viewsPath = path.join(__dirname,'./templates/views'); //*html files as hbs
const partialsPath = path.join(__dirname,'./templates/partials'); //*partials partialsPath

app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));

app.get('/',(req,res)=>{
    res.render('index',{
        title: "WEATHERCAST" 
    });
});

app.get('/weather',async(req,res)=>{
    getWeather(req,(result => {
        if(result.error){
            console.log('error sent');
            res.send(result);
        }else{
            res.send(result);
        }
        
    }));
});



app.get('*',(req,res)=>{
    res.render(('404'),{
       title: "page not found" 
    });

});
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log('On port:', port);
});