import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editId, setEditId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch('https://silver-space-carnival-6vr69rw55p5wc5pw6-5000.app.github.dev/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi kết nối API:", err);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId 
      ? `https://silver-space-carnival-6vr69rw55p5wc5pw6-5000.app.github.dev/api/students/${editId}` 
      : 'https://silver-space-carnival-6vr69rw55p5wc5pw6-5000.app.github.dev/api/students';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setForm({ studentId: '', name: '', email: '' });
    setEditId(null);
    fetchStudents();
  };

  const handleEdit = (s) => {
    setEditId(s._id);
    setForm({ studentId: s.studentId, name: s.name, email: s.email });
  };

  const handleDelete = async (id) => {
    await fetch(`https://silver-space-carnival-6vr69rw55p5wc5pw6-5000.app.github.dev/api/students/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Ứng Dụng Quản Lý Sinh Viên - MERN Stack</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="MSSV" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} required />
        <input placeholder="Họ và tên" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <button type="submit">{editId ? 'Cập nhật' : 'Thêm mới'}</button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th>MSSV</th><th>Họ tên</th><th>Email</th><th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Sửa</button>{' '}
                <button onClick={() => handleDelete(s._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;