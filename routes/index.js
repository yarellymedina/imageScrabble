var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ImageScrabble' });
});

router.get('/about',function(req,res,next){
    res.render('about',{"msg":"Hola Mundo!!!"})
});

router.get('/contact',function(req,res,next){
    res.render('contact',{"contacto1":"Astrid Medina"})
});


router.get('/signup', function(req,res,next){
  res.render('register',{"txtEmail":"","msg":""});
});

var usersRegistered = [];

router.post('/signup',function(req,res,next){
  console.log(req.body);
    usersRegistered.push(req.body.txtEmail);
    // Para que conozcan map funcion de un arreglo
    //var msgs = usersRegistered.map(function(item,i){return item}).join("|");
    //var msgs = usersRegistered.join("|");
    var msgs = usersRegistered;
    var rtObject = {};//{"txtEmail": req.body.txtEmail, "msg":msgs};
      rtObject.txtEmail=req.body.txtEmail;
      rtObject.msg=msgs;
 
  res.render('register', rtObject);
  
});

//Interfaz que devuelve datos JSON
router.get('/api/usuarios',function(req,res,next){
  var usuarios=[
    {"user":"admin","rol":["admin","public"]},
    {"user":"any","rol":["public"]}
  ];
  res.json(usuarios);
});

/*REST API: Las operaciones más importantes relacionadas con los datos en cualquier sistema REST 
y la especificación HTTP son cuatro: POST (insert), GET (select), PUT (update) y DELETE (eliminar).
Se manipulan a través de la URL, puede utilizarse sin estado, no requiere de un mecanismo para 
interpretar un http lo que lo hace mas seguro.
*/

/*IMAGE SCARBBLE ADMINISTRATION:
	Diccionario:	Palabras-->Ponderación.
*/

//NIVELES
var Diccionario = {
                    "rookie":["a","b","c"],
                    "junior":["d","e","f"],
                    "senior":["g","h","i"],
                    "master":["j","k","l"],
                    "deity":["m","n","o"]
                  };

//Dentro de los niveles van las palabras:
var palabraTemplate = {
                        "word":"",
                        "word_length":0,
                        "weight":1,
                        "context":""
                      };


//req=Peticion, params=Objeto, dictionaryKey:Valor que viene de la URL
router.get('/api/dictionary/dictionaryKey',function(req,res,next){
  var _dictionaryKey = req.params.dictionaryKey;
  res.json(Diccionario[_dictionaryKey]);
});

//Metodo post: Los dos puntos indican una variacion, que algo puede cambiar y no sabe que es lo que viene
router.post('/api/dictionary/:dictionaryKey/new',function(req,res,next){
  //Asumimos que el body contiene cada variable igual al del objeto plantilla

  
 var newWord = Object.assign({},palabraTemplate,req.body);
 /* var newOldWay = {};
  newOldWay.word= req.body.word;
  newOldWay.weight= req.body.weight;
  newOldWay.context= req.body.context;
  newOldWay.word_length= newOldWay.word.word_length;*/
  //ESPECIFICACION HTTP EL ENCABEZADO DE HTTP DEVUELVE UN NUMERO QUE IDENTIFICA EL RESULTADO DE UNA POSICION
  //SI ES 200 ES EXELENTE Y TODO ESTA BIEN SI ES 300 NO HA CAMBIADO NADA Y SE SACA DEL CACHE
  // 400 SIGNIFICA QUE LO QUE SE ESTA BUSCANDO NO SE ENCUENTRA
  // 500 ES UN ERROR QUE SE MANDA AL USUARIO
  newWord.word_length=newWord.word.word_length;
  Diccionario[req.params.dictionaryKey].push(newWord);
  res.status(200).json()

});


module.exports = router;
