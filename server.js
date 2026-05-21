const express = require('express');
const app = express();

// بيانات التطبيقات
const appsData = [
  {
    id: "2",
    title: "Facebook Lite",
    package_name: "com.facebook.lite",
    version_name: "410.0.0",
    version_code: 102,
    icon_url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
    apk_url: "https://my-backend-drab-five.vercel.app/api/apps/download/facebook-lite",
    file_size: "3.5 MB",
    category: "Social",
    description: "نسخة فيسبوك الخفيفة والمناسبة لسرعات الإنترنت الضعيفة"
  }
];

// 1. جلب كل التطبيقات
app.get('/api/apps', (req, res) => {
  res.json(appsData);
});

// 2. مسار تحميل التطبيق
app.get('/api/apps/download/facebook-lite', (req, res) => {
  // هنا يمكنك إضافة رابط التحميل المباشر للملف إذا كان مرفوعاً على مكان آخر
  res.send("جاري توجيهك لتحميل Facebook Lite...");
});

// تصدير التطبيق ليعمل على Vercel (لا تحذف هذا السطر)
module.exports = app;
