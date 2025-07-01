const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../../fs-connection')

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('avatar'), async (req, res) => {
  const file = req.file;

  try {
    if (!file) return res.status(400).json({ message: 'Не передан файл' });

    // Генерируем уникальное имя файла
    const fileName = `avatars/${Date.now()}`;

    // Загружаем на FS
    const { error } = await supabase.storage
      .from('rurouni-fs')
      .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false })
    ;

    if(error) console.log(error)

    if (error) return res.status(500).json({ message: `Ошибка загрузки файла: ${error.message}`  });

    // Получаем публичную ссылку
    const { data: { publicUrl } } = supabase.storage
      .from('rurouni-fs')
      .getPublicUrl(fileName)
    ;

    res.json({ 
      success:  true,
      url:      publicUrl 
    });

  } catch (error) {
    throw error
  }
});


module.exports = router;