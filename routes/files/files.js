const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../../fs-connection')
const sharp = require('sharp')

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('avatar'), async (req, res) => {
  const file = req.file;

  try {
    if (!file) return res.status(400).json({ message: 'Не передан файл' });

    // Оптимизируем изображение с помощью sharp
    const optimizedImage = await sharp(file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true})
      .jpeg({ quality: 80, progressive: true })
      .toBuffer()
    ;

    // Генерируем уникальное имя файла (например, userID + timestamp)
    const fileName = `avatars/${Date.now()}.jpg`;

    // Загружаем на FS
    const { error } = await supabase.storage
      .from('rurouni-fs')
      .upload(fileName, optimizedImage, { contentType: 'image/jpeg', upsert: true})
    ;

    if (error) return res.status(500).json({ message: 'Ошибка загрузки файла' });

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