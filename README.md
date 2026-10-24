# 🚀 Didar CRM API — Developer Reference & Reverse-Engineered Documentation
### مستندات جامع، فنی و مهندسی معکوس‌شده وب‌سرویس و API نرم‌افزار مدیریت ارتباط با مشتریان «دیدار»

[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1.0-brightgreen.svg)](openapi.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/abolfazl-moeini/didar-api-doc/pulls)

این مخزن شامل **کامل‌ترین مرجع توسعه‌دهندگان برای اتصال به Didar CRM (دیدار)** است. این مستندات حاصل تجمیع مستندات رسمی، استخراج و مهندسی معکوس پکیج رسمی دیدار در رجیستری ان‌پی‌ام (`n8n-nodes-didar-crm` نسخه ۱.۱.۷)، کدهای افزونه‌های وردپرسی ووکامرس/گرویتی‌فرم و بررسی لایو باندل فرانت‌اند وب‌اپلیکیشن دیدار (`app.didar.me`) است.

---

## ⚡ Quick Start (شروع سریع در ۱۰ ثانیه)

همه درخواست‌ها به آدرس پایه ارسال می‌شوند و کلید API در پارامتر `apikey` در کوئری‌استرینگ قرار می‌گیرد:

```bash
# استعلام وجود مخاطب با شماره موبایل
curl -X POST "https://app.didar.me/api/contact/getbyphonenumber?apikey=YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"MobilePhone": "09123456789"}'
```

---

## 📚 فهرست سرفصل‌های تخصصی (Documentation Sections)

| فصل | عنوان مستند | موضوعات تحت پوشش |
| :---: | :--- | :--- |
| **01** | [**معماری و احراز هویت**](docs/01-architecture-and-auth.md) | آدرس‌های پایه، ارسال کلید `apikey`، کوکی نشست `LocoAuthCookie`، ساختار Envelope و فیلدهای سفارشی |
| **02** | [**مخاطبان: اشخاص و شرکت‌ها**](docs/02-contacts.md) | ثبت شخص/شرکت، جستجو، استعلام شماره، اطلاعات بانکی، نشانی‌ها و متدهای VIP و پین |
| **03** | [**معاملات و کاریزها (Deals)**](docs/03-deals.md) | چرخه فروش، ثبت معامله با اقلام (`DealItems`)، مراحل کاریز، پیش‌بینی و دلایل عدم موفقیت |
| **04** | [**محصولات و انبار (Products)**](docs/04-products.md) | ثبت محصول با تنوع‌ها (Variants)، واحدهای ارزی، دسته‌بندی و همگام‌سازی با سپیدار |
| **05** | [**فعالیت‌ها و یادداشت‌ها (Activities)**](docs/05-activities-and-notes.md) | تسک‌ها، جلسات، پیگیری‌ها و معماری پنهان ذخیره یادداشت‌ها در قالب فعالیت |
| **06** | [**پرونده‌ها و تیکت‌ها (Cases)**](docs/06-cases.md) | مدیریت تیکت‌های پشتیبانی و فرآیندهای پس از فروش در کاریزهای اختصاصی |
| **07** | [**تلفن گویا و کالرآیدی (VoIP)**](docs/07-telephony-and-calllog.md) | ارسال پاپ‌آپ آنی تماس به مرورگر اپراتور برای استریسک، ایزابل، سیسکو، سیموتل |
| **08** | [**وب‌هوک‌ها و عملیات تجمیعی (Batch)**](docs/08-webhooks-and-batch.md) | دریافت وب‌هوک‌های تغییر وضعیت دیدار و ثبت همزمان مخاطب، معامله و پرونده |
| **09** | [**تنظیمات سیستمی و ادمین (Internal)**](docs/09-admin-and-internal-apis.md) | مدیریت کاربران، برچسب‌ها، سگمنت‌ها، هزینه‌های بازاریابی (Attribution) و دیداریاب |

---

## 🗺️ ماتریس کامل Endpointهای استخراج‌شده

### ۱. مخاطبان (Contacts)
* `POST /api/contact/save`: ایجاد یا به‌روزرسانی شخص یا شرکت
* `POST /api/contact/getbyphonenumber`: جستجوی سریع شخص با شماره موبایل
* `POST /api/contact/PersonSearch`: جستجوی پیشرفته اشخاص با فیلترها و صفحه‌بندی
* `POST /api/contact/CompanySearch`: جستجوی پیشرفته شرکت‌ها
* `POST /api/contact/GetContactDetail`: دریافت مشخصات کامل کارت مخاطب
* `POST /api/contact/SetVIP`: نشانه‌گذاری مخاطب به عنوان VIP
* `POST /api/contact/SetPin`: پین کردن مخاطب در بالای لیست
* `POST /api/contact/SetCompanyPersonel`: متصل کردن شخص به شرکت با سمت شغلی
* `POST /api/contact/UnDelete`: بازگردانی مخاطب حذف‌شده

### ۲. معاملات و کاریزها (Deals & Pipelines)
* `POST /api/deal/save_v2`: ایجاد یا ویرایش معامله همراه با اقلام کالا (`DealItems`)
* `POST /api/deal/getdealdetail`: دریافت اطلاعات جامع معامله
* `POST /api/deal/search_v2`: جستجوی فیلترشده معاملات بر اساس مرحله، زمان و برچسب
* `POST /api/pipeline/list/0`: دریافت لیست کاریزها و مراحل معاملات
* `POST /api/Deal/GetLostReasons`: دریافت لیست دلایل باخت معامله
* `GET /api/Label/GetDealLabels`: دریافت برچسب‌های رنگی معامله
* `POST /api/deal/GetForecast`: محاسبه پیش‌بینی درآمد مبتنی بر شانس موفقیت مراحل

### ۳. محصولات و کاتالوگ (Products)
* `POST /api/product/save`: ثبت محصول جدید با تنوع‌ها و قیمت پایه
* `POST /api/product/search`: جستجوی محصولات
* `POST /api/product/getproductbycodes`: استعلام دسته‌ای مشخصات کالا با SKU یا کد محصول
* `POST /api/product/categories`: دریافت دسته‌بندی‌های محصول
* `POST /api/product/SaveCategory`: ایجاد یا ویرایش دسته‌بندی
* `POST /api/product/SearchForSepidyar`: جستجوی سازگار با نرم‌افزار مالی سپیدار

### ۴. فعالیت‌ها، وظایف و یادداشت‌ها (Activities & Notes)
* `POST /api/activity/save`: ایجاد یا ویرایش فعالیت، تسک یا یادداشت
* `POST /api/activity/search`: جستجوی وظایف و پیگیری‌ها
* `POST /api/activity/GetActivityType`: دریافت انواع فعالیت (تماس، جلسه، ایمیل و...)
* `POST /api/activity/DoneActivity`: علامت‌گذاری فعالیت به عنوان انجام‌شده
* `POST /api/activity/UndoneActivity`: بازگردانی فعالیت انجام‌شده
* `POST /api/activity/SetIsPinned`: سنجاق کردن یادداشت مهم در تایم‌لاین مخاطب
* `POST /api/activity/GetSummary`: آمار تجمیعی تسک‌های امروز، معوق و آتی کاربر

### ۵. پرونده‌ها (Cases)
* `POST /api/Case/Save`: ثبت یا به‌روزرسانی پرونده پشتیبانی / تیکت
* `POST /api/Case/search`: جستجوی پرونده‌ها
* `POST /api/pipeline/list/1`: دریافت کاریزها و مراحل پرونده‌ها
* `POST /api/case/GetCaseDetail`: دریافت اطلاعات کامل پرونده
* `GET /api/Label/GetCaseLabels`: برچسب‌های پرونده

### ۶. پاپ‌آپ آنی تلفن و کالرآیدی (Telephony / VoIP)
* `GET /api/calllog/insert?apikey={KEY}&number={NUM}&internalnumber={EXT}`: نمایش پنجره شناور اطلاعات تماس‌گیرنده روی مانیتور کارشناس متصل به شماره داخلی

### ۷. وب‌هوک و عملیات یکپارچه فرم‌ها (Webhooks & Batch)
* `POST /api/BatchOperations/GravityInsert`: ثبت همزمان مشتری، معامله و تیکت در یک درخواست
* `POST /api/BatchOperations/GetGravityFields`: خواندن ساختار فیلدهای گرویتی‌فرم
* ورودی وب‌هوک دیدار: ساختار استاندارد شامل فیلدهای `data`، `changes` و `meta`

### ۸. مدیریت سیستمی و ادمین (Admin & Internal)
* `POST /api/User/List`: فهرست اعضای تیم و کاربران پنل
* `POST /api/customfield/GetCustomfieldList`: دریافت تمام فیلدهای سفارشی تعریف‌شده
* `POST /api/Source/GetList`: دریافت منابع ورودی لیدها (گوگل، نمایشگاه، معرف و...)
* `POST /api/Tag/GetTagList`: لیست تگ‌های عمومی
* `POST /api/Segment/GetList`: سگمنت‌ها و بخش‌بندی‌های مشتریان
* `POST /api/search/search`: موتور جستجوی فراگیر سراسری (دیداریاب)

---

## 🛠️ کلاینت‌ها و SDKهای آماده (Ready-to-use SDKs)

برای شروع سریع، کلاینت‌های بدون وابستگی در زبان‌های مختلف آماده شده‌اند:

### ۱. جاوااسکریپت / تایپ‌اسکریپت (Native Fetch)
کد کامل در [`sdks/typescript/didar-client.ts`](sdks/typescript/didar-client.ts):
```typescript
import { DidarClient } from './sdks/typescript/didar-client';

const client = new DidarClient({ apiKey: 'YOUR_API_KEY' });

// جستجوی مخاطب با شماره موبایل
const contacts = await client.getContactByPhone('09123456789');

// ایجاد معامله جدید
await client.saveDeal({
  Title: 'سفارش آنلاین #1002',
  OwnerId: 'cbff524d-4536-4f42-b1ae-2643f6bb0aa3',
  PipelineId: '11111111-2222-3333-4444-555555555555',
  PipelineStageId: 'aaaa1111-bb22-cc33-dd44-ee5555555555',
  Status: 'Pending',
  Price: 5000000
});
```

### ۲. پی‌اچ‌پی و وردپرس (PHP 8.1+ / WordPress Compatible)
کد کامل در [`sdks/php/DidarClient.php`](sdks/php/DidarClient.php):
```php
use Didar\Sdk\DidarClient;

$client = new DidarClient('YOUR_API_KEY');

// استعلام محصول با کد SKU
$products = $client->getProductsByCodes(['SKU-101', 'SKU-102']);
```

### ۳. پایتون (Python 3.8+)
کد کامل در [`sdks/python/didar_client.py`](sdks/python/didar_client.py):
```python
from didar_client import DidarClient

client = DidarClient(api_key="YOUR_API_KEY")
client.popup_caller_id(phone_number="09123456789", agent_extension="102")
```

---

## 📥 وارد کردن در Postman / Insomnia

فایل استاندارد [**`openapi.yaml`**](openapi.yaml) در این مخزن قرار داده شده است. می‌توانید آن را مستقیماً در **Postman** (بخش Import) یا **Insomnia** و **Swagger Editor** باز کرده و تمام اندپوینت‌ها را با پارامترها و مستندات کامل تست کنید.

---

## 🤝 مشارکت و بهبود (Contributing)

دیدار مرتباً ویژگی‌های جدیدی به پنل و سیستم وب‌سرویس خود اضافه می‌کند. در صورت کشف اندپوینت‌ها یا پارامترهای جدید، از ارسال Pull Request یا Issue در گیتهاب صمیمانه استقبال می‌شود!

---

## 📄 لایسنس (License)

این پروژه تحت مجوز [MIT License](LICENSE) منتشر شده و استفاده از آن برای تمام مقاصد تجاری و متن‌باز آزاد است.
