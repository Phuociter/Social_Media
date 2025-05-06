# Social\_Media

Dự án Social\_Media là một nền tảng mạng xã hội đơn giản, cho phép người dùng đăng ký, đăng nhập, đăng bài viết, bình luận và tương tác với nhau. Dự án sử dụng Node.js (Express), MySQL và React cho frontend.

## Tính năng chính

* Đăng ký / Đăng nhập
* Quản lý bài viết (tạo, sửa, xóa)
* Tương tác bài viết (like, comment)
* Giao diện người dùng UI/UX cơ bản

## Cài đặt

### Yêu cầu:

* Node.js >= 16
* MySQL server đang chạy local hoặc từ xa
* Git

### 1. Clone repo:

```bash
git clone https://github.com/Phuociter/Social_Media.git
cd Social_Media
```

### 2. Cài đặt backend:

```bash
cd backend
npm install
```

### 3. Cài đặt frontend:

```bash
cd ../frontend
npm install
```

### 4. Cấu hình backend:

Thông tin cấu hình cơ sở dữ liệu và cổng chạy server được thiết lập trong file `application.properties` trong thư mục `backend`. Dưới đây là cấu hình đầy đủ:

```properties
# backend/application.properties
spring.application.name=social_media
spring.datasource.url=jdbc:mysql://localhost:3306/{your_DB}?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update

server.port=8080

# File upload
file.upload-dir=uploads
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```



### 5. Khởi tạo cơ sở dữ liệu:
Tạo cơ sở dữ liệu MySQL với tên `socialmedia` và chạy các lệnh SQL khởi tạo bảng theo cấu trúc dự án (tham khảo file `schema.sql` nếu có).

### 6. Chạy backend:
```bash
cd backend
npm start
````

### 7. Chạy frontend:

```bash
cd ../frontend
npm start
```

Frontend sẽ chạy tại `http://localhost:3000` và backend tại `http://localhost:5000`

## Cấu trúc dự án

```
Social_Media/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
```

## Góp ý

Mọi đóng góp, pull request hoặc issue đều được hoan nghênh!

---

Created by [Phuociter](https://github.com/Phuociter)
