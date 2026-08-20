const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Định nghĩa trực tiếp Model tại đây
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

// API Hello
app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend MERN đang hoạt động!" });
});

// GET: Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sinh viên", error: error.message });
  }
});

// POST: Thêm sinh viên
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    const student = await Student.create({ studentId, name, email });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm sinh viên", error: error.message });
  }
});

// PUT: Cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật sinh viên", error: error.message });
  }
});

// DELETE: Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa sinh viên thành công' });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi xóa sinh viên", error: error.message });
  }
});

// Kết nối MongoDB & Chạy Server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });