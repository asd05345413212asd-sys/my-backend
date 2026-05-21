const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// بيانات التطبيقات
const appsData = [
  {
    id: "1",
    title: "WhatsApp Messenger",
    package_name: "com.whatsapp",
    version_name: "2.26.5",
    version_code: 45,
    icon_url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    apk_url: "https://www.whatsapp.com/android/current/WhatsApp.apk", 
    file_size: "50 MB",
    category: "Communication",
    description: "تطبيق الواتساب الرسمي والمباشر، يعمل بدون حاجة لـ VPN للتحميل."
  },
  {
    id: "2",
    title: "Facebook Lite",
    package_name: "com.facebook.lite",
    version_name: "410.0.0",
    version_code: 102,
    icon_url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
    apk_url:https://my-backend-drab-five.vercel.app/api/apps
    file_size: "3.5 MB",
    category: "Social",
    description: "نسخة فيسبوك الخفيفة والمناسبة لسرعات الإنترنت الضعيفة."
  }
];

// 1. جلب كل التطبيقات
app.get('/api/apps', (req, res) => {
  res.json(appsData);
});

// 2. جلب تفاصيل تطبيق معين
app.get('/api/apps/:id', (req, res) => {
  const appItem = appsData.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ message: "التطبيق غير موجود" });
  res.json(appItem);
});

// 3. تحميل الملفات مع دعم استئناف التحميل (Resumable Download)
app.get('/api/apps/download/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, 'apks', fileName); 

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "الملف غير موجود على السيرفر" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range; 

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'application/vnd.android.package-archive',
    };
    
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'application/vnd.android.package-archive',
      'Accept-Ranges': 'bytes' 
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
