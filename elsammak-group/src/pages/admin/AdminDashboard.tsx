import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users, Search, Eye } from 'lucide-react';
import { fetchUsers } from '../../api/users';
import type { UserData } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-[var(--color-primary)]" />
              {isRTL ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isRTL ? 'إدارة جميع المستخدمين المسجلين في المنصة' : 'Manage all registered platform users'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm w-full md:w-80">
            <Search className="w-5 h-5 text-gray-400 mx-2" />
            <input 
              type="text" 
              placeholder={isRTL ? 'بحث بالاسم، الإيميل...' : 'Search users...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-none outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#003B5C] text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider rtl:text-right">
                    {t('auth.fullName', 'Full Name')}
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider rtl:text-right">
                    {t('contact.email', 'Email')}
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider rtl:text-right">
                    {isRTL ? 'رقم الهاتف' : 'Phone'}
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                    {isRTL ? 'إجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#003B5C]"></div>
                        {isRTL ? 'جاري التحميل...' : 'Loading users...'}
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {isRTL ? 'لا يوجد مستخدمين' : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#f0f4f8] text-[#003B5C] rounded-full flex items-center justify-center font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4 rtl:mr-4 rtl:ml-0">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <Link to={`/admin/users/${user.id}`}>
                          <button className="text-[#003B5C] hover:text-[#c5a059] transition-colors p-2 rounded-full hover:bg-gray-100 flex items-center justify-center mx-auto gap-2">
                            <Eye className="w-5 h-5" />
                            <span className="text-xs">{isRTL ? 'عرض التفاصيل' : 'View'}</span>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
