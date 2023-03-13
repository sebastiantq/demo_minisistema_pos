const path = require('path')
const { v4: uuidv4 } = require('uuid');

const loadFile = ( files, allowedExtensions = ['png','jpg','jpeg','gif','jfif'], carpeta = ''  ) => {

    return new Promise((resolve, reject) => {

        const { file } = files;

        const cutName = file.name.split('.');
        const extension = cutName[ cutName.length - 1]
        
        // Validar la extensión del file
        if ( !allowedExtensions.includes( extension )){
            return reject(`La extension ${ extension } no es permitada - ${ allowedExtensions }`)
        }
    
        const tempNameFile = uuidv4() + '.' + extension;
        uploadPath = path.join(__dirname, '../uploads/', carpeta, tempNameFile);
      
        file.mv(uploadPath, (err) => {
            if (err) {
              reject(err)
            }
        
            resolve( tempNameFile );
          }); 

    })

}

module.exports = {
    loadFile
}