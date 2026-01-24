const express = require('express');
const fs = require('fs');
const router = express.Router();


PATH_ROUTES= __dirname


//esto sirve para remover extensiones 
const removeExtension = (filename) =>{
    return filename.split('.').shift();            
}

//y esto es para las rutas de forma dinamica
fs.readdirSync(PATH_ROUTES).filter((file)=>{
    const name = removeExtension(file)
    if(name !=='index'){
      router.use(`/${name}`, require(`./${file}`))
    }  
}) 




module.exports = router

