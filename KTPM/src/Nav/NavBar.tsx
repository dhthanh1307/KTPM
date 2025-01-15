import React, { useEffect, useState } from 'react';
import { FaTachometerAlt, FaTags, FaChartLine, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Dropdown, Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';
// import { initWebSocket, closeWebSocket } from '../Service/socketService';


interface ActionBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate(); // Hook để điều hướng người dùng
  const [showNotifications, setShowNotifications] = useState(false);
  const toggleNotification = () => {
    setShowNotifications(!showNotifications);
  };
  const [notifications, setNotifications] = useState<any[]>([]); // State để lưu trữ thông báo
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  // Hàm đăng xuất

  const handleLogout = () => {
    // Xóa thông tin đăng nhập khỏi localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    const accessToken = localStorage.getItem('accessToken'); // Lấy token từ localStorage
    const ws = new WebSocket(`ws://localhost:3005?token=${accessToken}`);
    ws.close();
    // Chuyển hướng về trang login
    navigate('/');
  };

  useEffect(() => {
    // Kết nối WebSocket

    const accessToken = localStorage.getItem('accessToken'); // Lấy token từ localStorage
    const ws = new WebSocket(`ws://localhost:3005?token=${accessToken}`);
    ws.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });

    // Lắng nghe thông báo từ server
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      const newNotify = [message, ...notifications]
      console.log('message:', message);
      console.log('notify:', notifications);
      console.log('new:', newNotify);
      setNotifications(prevNotifications => [message, ...prevNotifications]); // Thêm thông báo mới vào danh sách
    });

    // Lắng nghe lỗi trong kết nối WebSocket
    ws.addEventListener('error', (error) => {
      console.log('WebSocket error:', error);
    });
    // Lắng nghe sự kiện khi WebSocket kết nối thành công

    // setSocket(ws);
    // Đảm bảo đóng WebSocket khi component unmount
    // return () => {
    //   if (ws) {
    //     ws.close();
    //   }
    // };
    // if(accessToken){
    //   initWebSocket(accessToken);

    // }
  }, []);
  return (
    <div className="action-bar-container ">
      <div className="header " >

        <img className="logo-img"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          src="https://static.vecteezy.com/system/resources/previews/007/725/030/non_2x/menu-icon-ui-icon-vector.jpg"
          alt="Toggle Sidebar"


        />
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/10628/10628792.png"
            alt="Login" onClick={toggleNotification}
            style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
          <img
            src="https://i.pinimg.com/736x/0b/8e/41/0b8e410aa05816bfda615c2a6717ed9f.jpg"
            alt="Login"
            style={{ width: '100px', height: '50px', objectFit: 'cover' }} />

        </div>


      </div>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <Nav className="flex-column ">
          <NavLink to="/event" className="nav-link" style={{ color: 'black' }}>
            <FaTachometerAlt /> Quản lí sự kiện
          </NavLink>
          <NavLink to="/promotion" className="nav-link" style={{ color: 'black' }}>
            <FaTags /> Quản lí khuyến mãi
          </NavLink>
          <NavLink to="/report" className="nav-link" style={{ color: 'black' }}>
            <FaChartLine /> Báo cáo thống kê
          </NavLink>
          <NavLink to="/account" className="nav-link" style={{ color: 'black' }}>
            <FaUser /> Đăng kí thông tin
          </NavLink>
          <div onClick={handleLogout} className="nav-link" style={{ color: 'black' }}>
            <FaSignOutAlt /> Đăng xuất
          </div>
        </Nav>
      </div>
      <Dropdown align="end" show={showNotifications} onToggle={toggleNotification}>


        {/* Thông báo dropdown */}
        <Dropdown.Menu className="notification-dropdown ">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Dropdown.Item
                as="li"
                key={index}
                className={`notification-item notification-${notification.type}`}
              >
                <div className="notification-header">
                  <strong>{notification.title}</strong>
                </div>
                <div className="notification-content">
                  <p>{notification.content}</p>
                </div>
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item as="li" className="text-center">
              No notifications
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ActionBar;
