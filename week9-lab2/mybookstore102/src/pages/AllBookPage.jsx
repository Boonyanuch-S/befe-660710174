import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpenIcon,
  LogoutIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/outline';

const AllBookPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    // ตรวจสอบสิทธิ์ admin ก่อนเข้า
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/v1/books/');
        if (!response.ok) {
          throw new Error('ไม่สามารถโหลดข้อมูลหนังสือได้');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  const handleEdit = (id) => {
    navigate(`/edit-book/${id}`);
  };

  const handleDelete = async (id, title) => {
    const ok = window.confirm(`ยืนยันการลบหนังสือ:\n"${title}" ?`);
    if (!ok) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/v1/books/${id}`, { method: 'DELETE' });

      // บาง backend อาจคืน 204 No Content หรือ 200
      if (!res.ok && res.status !== 204) {
        throw new Error('ลบไม่สำเร็จ');
      }

      // เอาออกจาก state
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(`เกิดข้อผิดพลาดในการลบ: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <BookOpenIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold">BookStore - BackOffice</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30
                rounded-lg transition-colors"
            >
              <LogoutIcon className="h-5 w-5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">รายการหนังสือทั้งหมด</h2>
          <button
            onClick={() => navigate('/store-manager/add-book')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>เพิ่มหนังสือใหม่</span>
          </button>
        </div>

        {loading && <p className="text-gray-600">กำลังโหลดข้อมูล...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && books.length === 0 && (
          <p className="text-gray-500">ยังไม่มีหนังสือในระบบ</p>
        )}

        {!loading && books.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-sm font-semibold text-gray-700">
              <div className="col-span-1">#</div>
              <div className="col-span-3">ชื่อหนังสือ</div>
              <div className="col-span-3">ผู้แต่ง</div>
              <div className="col-span-2">ISBN</div>
              <div className="col-span-1">ปี</div>
              <div className="col-span-2 text-right">ราคา</div>
            </div>

            {/* Rows */}
            <ul className="divide-y divide-gray-100">
              {books.map((book, idx) => (
                <li
                  key={book.id}
                  className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50"
                >
                  <div className="col-span-1 text-gray-600">{idx + 1}</div>

                  <div className="col-span-3">
                    <p className="font-medium text-gray-900">{book.title}</p>
                  </div>

                  <div className="col-span-3 text-gray-700">{book.author}</div>

                  <div className="col-span-2 text-gray-700">{book.isbn}</div>

                  <div className="col-span-1 text-gray-700">{book.year}</div>

                  <div className="col-span-2">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-gray-900 font-semibold">
                        {Number(book.price).toLocaleString('th-TH', {
                          style: 'currency',
                          currency: 'THB',
                        })}
                      </span>

                      {/* Actions */}
                      <button
                        onClick={() => handleEdit(book.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">แก้ไข</span>
                      </button>
                      <button
                        onClick={() => handleDelete(book.id, book.title)}
                        disabled={deletingId === book.id}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-white
                          ${deletingId === book.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'}`}
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {deletingId === book.id ? 'กำลังลบ...' : 'ลบ'}
                        </span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBookPage;
