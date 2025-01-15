# customerandorder

## วิธีการรันโปรเจกต์

### Backend

1. **ติดตั้ง Dependencies**  
   ไปยังโฟลเดอร์ `customerdata` และติดตั้ง dependencies:  
   ```bash
   cd customerdata
   npm install
   ```

2. **ตั้งค่าไฟล์ .env**  
   สร้างไฟล์ `.env` ในโฟลเดอร์ `customerdata` โดยใช้ตัวอย่างในไฟล์ `.env.example` ที่แนบมาในโปรเจกต์  

3. **เริ่มต้นเซิร์ฟเวอร์ Backend**  
   - รันเซิร์ฟเวอร์สำหรับพัฒนา:  
     ```bash
     npm run start:dev
     ```  
   - หากต้องการใช้ฟังก์ชันการส่งอีเมล:  
     ```bash
     npm run build
     ```

---

### Frontend

1. **ติดตั้ง Dependencies**  
   ไปยังโฟลเดอร์ `orderform` และติดตั้ง dependencies:  
   ```bash
   cd orderform
   npm install
   ```

2. **เริ่มต้นเซิร์ฟเวอร์ Frontend**  
   รันเซิร์ฟเวอร์สำหรับพัฒนา:  
   ```bash
   npm run dev
   ```

3. **เข้าสู่ระบบ Frontend**  
   ใช้ข้อมูลต่อไปนี้เพื่อเข้าสู่ระบบ:  
   ```json
   {
     "username": "test",
     "password": "123456"
   }
   ```  
   (ข้อมูลนี้ถูกเตรียมไว้ในฐานข้อมูลตัวอย่าง) เมื่อเข้าสู่ระบบด้วย Postman แล้วจึงนำ JWT ไปสร้าง Customers ต่อนะครับ

---

### การเตรียมข้อมูลสำหรับการใช้งาน

1. **สร้างลูกค้า (Customer)**  
   เนื่องจากหน้าบ้าน (Frontend) ไม่มีหน้าให้สร้างลูกค้า (Customer) คุณจำเป็นต้องใช้เครื่องมืออย่าง Postman เพื่อสร้างลูกค้าโดยส่งคำขอแบบ POST ไปยัง Backend เหมือนตัวอย่างที่แนบไปครับ:  
   ```json
   {
     "_name": "ชื่อที่ต้องการ",
     "_phone": "0123456789",
     "email": "example@example.com"
   }
   ```  

2. **เริ่มต้นใช้งาน**  
   เมื่อลูกค้าถูกสร้างเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบ Frontend และทดสอบการสร้างคำสั่งซื้อ (Order) ได้ (หน้า Login ใช้รหัสเดียวกัน)

---

ในส่วนของ route ต่างๆ และ route พิเศษในข้อที่ 4 สามารถดูได้ผ่านทางโค้ดได้เลยครับ
หากมีข้อสงสัยเพิ่มเติมหรือพบปัญหาในการใช้งาน โปรดติดต่อได้เลยครับ 😊
