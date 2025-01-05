# .NET 8 Mini Course App | MiniUdemy

![Screenshot 2025-01-05 at 19 56 41](https://github.com/user-attachments/assets/54759b41-a0f1-47dc-ada3-316710e3afcf)

## 📋 İçindekiler
- [Proje Açıklaması](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Mimari](#-mimari)
- [Kurulum](#-kurulum)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Frontend Ekran Görüntüleri](#-frontend-ekran-görüntüleri)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
  
## 📝 Proje Hakkında
Mini Udemy Uygulaması, kimlik doğrulama ve yetkilendirme için JWT (JSON Web Token) kullanan .NET Core tabanlı RESTful API'dir. Proje CRUD (Create, Read, Update, Delete) mimarisiyle kullanılmıştır. MsSQL veritabanı ve Redis ile entegre edilmiştir. Redis ve Veritabanı Docker ile yapılandırılmıştır.

## 🚀 Özellikler

### Kimlik Doğrulama ve Yetkilendirme 🔐
- JWT tabanlı kimlik doğrulama
- Rol bazlı yetkilendirme (Admin/User)
- Email ile şifre sıfırlama
- Refresh token mekanizması

![Screenshot 2025-01-05 at 20 49 34](https://github.com/user-attachments/assets/019cdf9e-5005-4362-8c98-5dacd99dbdd4)

![Screenshot 2025-01-05 at 20 49 40](https://github.com/user-attachments/assets/be045fed-73b7-468d-a525-c158b1c66295)

![Screenshot 2025-01-05 at 20 49 53](https://github.com/user-attachments/assets/3b4cb0b7-5552-4497-852e-4aa5ccaf0b94)

![Screenshot 2025-01-05 at 21 03 14](https://github.com/user-attachments/assets/e57fc223-e303-431f-9823-bb6685f223bb)

### Kurs Yönetimi 📚
- Kurs listeleme ve filtreleme
- Detaylı kurs görüntüleme
- Kurs içeriği erişimi
  
![Screenshot 2025-01-05 at 20 52 48](https://github.com/user-attachments/assets/d48e151f-ffa3-4335-add8-84722b053b3b)

### Alışveriş Sistemi 🛒
- Redis tabanlı sepet yönetimi
- Misafir kullanıcılar için local sepet
- Güvenli ödeme işlemi
- Satın alınan kurslar listesi
  
![Screenshot 2025-01-05 at 20 56 50](https://github.com/user-attachments/assets/a5703a04-b75f-4f82-9e35-3cbbc3ac7ab6)

### Admin Paneli ⚙️
- Kurs CRUD işlemleri
- Kullanıcı yönetimi
- Kategori yönetimi
  
![Screenshot 2025-01-05 at 20 57 57](https://github.com/user-attachments/assets/f39163e7-519d-419d-83ac-612a673ccad2)
![Screenshot 2025-01-05 at 20 58 05](https://github.com/user-attachments/assets/47ccd24c-b1d4-4d9d-924b-a7ee5b5fd0dc)



## ⚡ Teknolojiler

### Backend 🔧
- **.NET 8**
- **Entity Framework Core**
- **Identity Framework**
- **JWT Authentication**
- **Redis**
- **MSSQL**
- **Docker**
- **MailKit**

### Frontend 🎨
- **React.js**
- **Context API**
- **React Router**
- **Axios**
- **Bootstrap**
- **AlertifyJS**

## 🏗 Mimari
![Screenshot 2025-01-05 at 21 20 04](https://github.com/user-attachments/assets/4185c231-ff73-4a59-94a2-30608f1511a2)

Proje, Clean Architecture prensiplerine uygun olarak geliştirilmiştir:
- **API Layer**: Controller'lar ve middleware'ler
- **Service Layer**: İş mantığı ve servis implementasyonları
- **Repository Layer**: Veri erişim katmanı ve Entityler

## 🛠 Kurulum

### Gereksinimler
- .NET 8 SDK
- Node.js
- Docker Desktop
- MSSQL Server
- Redis

### Database Başlatma

```bash
 docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=BEB-Lti123.' -p 1433:1433 --name ECommerceApp -d mcr.microsoft.com/mssql/server
```

### Backend Başlatma

```bash
cd backend/App.API
dotnet watch run
```

### Frontend Başlatma

```bash
cd frontend
npm install
npm start
```

## Frontend

![Screenshot 2025-01-05 at 21 05 28](https://github.com/user-attachments/assets/ea11835c-c799-462a-91c1-07c485f2de03)
![Screenshot 2025-01-05 at 21 05 33](https://github.com/user-attachments/assets/64a19a6c-617d-4370-8523-8cab81b15f0f)
![Screenshot 2025-01-05 at 21 05 41](https://github.com/user-attachments/assets/5c5d2f7d-dfc4-4810-9e21-363b83840f45)
![Screenshot 2025-01-05 at 21 06 13](https://github.com/user-attachments/assets/0096bbe3-edfb-4406-9869-ca0a17b9c389)

## Postman
![Screenshot 2025-01-05 at 21 41 05](https://github.com/user-attachments/assets/037a4887-b18d-4d98-84ce-23ba1dbebd86)
![Screenshot 2025-01-05 at 21 41 59](https://github.com/user-attachments/assets/f21bbc87-f5e3-46b1-b328-8447c900d5ee)

![Screenshot 2025-01-05 at 21 43 36](https://github.com/user-attachments/assets/bca92bba-b5eb-4af4-a20d-89a2d3c92bd3)
![Screenshot 2025-01-05 at 21 44 04](https://github.com/user-attachments/assets/4475f400-8fbd-4d09-a6d1-9304245a4087)
