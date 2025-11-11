import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// --- FUNÇÃO DE VERIFICAÇÃO COM "ESPIÕES" ---
function checkFileType(file, cb) {
  // 1. Imprime no terminal o que estamos a receber
  console.log('--- A VERIFICAR O TIPO DE FICHEIRO ---');
  console.log('Nome Original:', file.originalname);
  console.log('Mimetype:', file.mimetype);

  // 2. Define os tipos permitidos
  const filetypes = /jpeg|jpg|png/;
  const mimetypes = /image\/jpeg|image\/png/;

  // 3. Testa a extensão
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase().substring(1)
  );

  // 4. Testa o mimetype
  const mimetype = mimetypes.test(file.mimetype);

  // 5. Imprime os resultados dos testes
  console.log('Extensão é válida?', extname);
  console.log('Mimetype é válido?', mimetype);
  console.log('---------------------------------');

  if (extname && mimetype) {
    // Se ambos forem verdadeiros, aceita o ficheiro
    return cb(null, true);
  } else {
    // Se um deles for falso, rejeita
    cb(new Error('Apenas imagens (jpg, jpeg, png) são permitidas!'));
  }
}
// --- FIM DA FUNÇÃO DE VERIFICAÇÃO ---

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Nenhum ficheiro enviado.');
  }
  
  console.log('Upload bem-sucedido. Ficheiro guardado:', req.file.path);
  
  res.send({
    message: 'Imagem carregada com sucesso',
    imagePath: `/${req.file.path.replace(/\\/g, '/')}`,
  });
});

export default router;