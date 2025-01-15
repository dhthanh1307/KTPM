import { useEffect, useState } from 'react'
import ActionBar from '../Nav/NavBar';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, LineChart, Line } from 'recharts';
import axios from 'axios';
const Report = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statType, setStatType] = useState<string>('joinCount');
  const [option, setOption] = useState<string>('Date');
  const [top, setTop] = useState<any[]>([]);
  const [eventStats, setEventStats] = useState<any[]>([{
    "id": "c234f569-8ca3-4d5b-b231-0923913ff3a3",
    "name": "Stiedemann - Hoeger",
    "eventStatus": "PENDING",
    "startDate": "2025-02-03T00:00:00.000Z",
    "endDate": "2025-02-07T00:00:00.000Z",
    "createdAt": "2025-01-13T17:10:22.280Z",
    "joinCount": 10,
    "likeCount": 20
  },
  {
    "id": "a87b121f-121a-46db-9e6f-56f1d82f4951",
    "name": "Tech Conference 2025",
    "eventStatus": "APPROVED",
    "startDate": "2025-01-10T00:00:00.000Z",
    "endDate": "2025-01-15T00:00:00.000Z",
    "createdAt": "2025-01-05T14:00:00.000Z",
    "joinCount": 120,
    "likeCount": 45
  },
  {
    "id": "b8db1c12-221a-48d3-9bda-3f619a8a4b56",
    "name": "Summer Music Festival",
    "eventStatus": "REJECTED",
    "startDate": "2025-06-01T00:00:00.000Z",
    "endDate": "2025-06-05T00:00:00.000Z",
    "createdAt": "2025-05-01T08:30:00.000Z",
    "joinCount": 30,
    "likeCount": 150
  },
  {
    "id": "fa21a123-e776-45c5-913f-d5f1e540e39b",
    "name": "AI and Future Technologies",
    "eventStatus": "PENDING",
    "startDate": "2025-03-10T00:00:00.000Z",
    "endDate": "2025-03-12T00:00:00.000Z",
    "createdAt": "2025-01-20T10:45:00.000Z",
    "joinCount": 75,
    "likeCount": 30
  },
  {
    "id": "11b8a092-d3e6-4137-a385-9e6efc38862d",
    "name": "Digital Marketing Summit",
    "eventStatus": "APPROVED",
    "startDate": "2025-04-01T00:00:00.000Z",
    "endDate": "2025-04-03T00:00:00.000Z",
    "createdAt": "2025-03-15T11:00:00.000Z",
    "joinCount": 200,
    "likeCount": 75
  }]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleDropdownChange = (selectedValue: string) => {
    setStatType(selectedValue);
    setTop(getTop3Events(eventStats, statType));
  };
  const handleDropdown = (selectedValue: string) => {
    setOption(selectedValue);

  };
  const getTop3Events = (data: any[], stat: string) => {
    return data
      .sort((a, b) => b[stat] - a[stat])
      .slice(0, 3);
  };
  const [promotions, setPromotions] = useState<any[]>([])
  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/unauth-event/stats/event-aggregate-stats');
        setEventStats(response.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error('Error fetching event stats:', error);
      }
    };

    fetchEventStats();
    setTop(getTop3Events(eventStats, statType));

    const partnerId = localStorage.getItem('userId');
    if (!partnerId) {
      console.error('No userID found in localStorage');
      return;
    }
    const getPromotions = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        };
        const response = await fetch(`http://localhost:1001/promotion-user/type/list/${partnerId}`, config);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const promotionsData = await response.json();
        const updatedPromotions = await Promise.all(promotionsData.map(async (promotion: any) => {
          const promotionId = promotion.id;
          const usedResponse = await axios.post(`http://localhost:1001/promotion-unauth/statistic/getUsedPromotions/${promotionId}`, {
            year: 2025
          }, config);

          const usedData = await usedResponse.data;
          // alert(promotionId)
          return {
            ...promotion,
            usedCount: usedData.count || 0, // Giả sử API trả về { usedCount }
          };
        }));
        setPromotions(updatedPromotions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getPromotions();
  }, []);
  const [eventCount, setEventCount] = useState({ create: 0, start: 0, end: 0 });
  const calculateEventStats = (data: any[], option: string) => {
    const now = new Date();

    // Helper function to match based on option
    const isMatching = (date: Date) => {
      if (option === 'Date') {
        return date.toDateString() === now.toDateString();
      }
      if (option === 'Month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      if (option === 'Year') {
        return date.getFullYear() === now.getFullYear();
      }
      return false;
    };

    const create = data.filter(event => isMatching(new Date(event.createdAt))).length;
    const start = data.filter(event => isMatching(new Date(event.startDate))).length;
    const end = data.filter(event => isMatching(new Date(event.endDate))).length;

    return { create, start, end };
  };
  useEffect(() => {
    const count = calculateEventStats(eventStats, option);
    setEventCount(count);
  }, [option]);
  return (
    <div>
      <ActionBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={isSidebarOpen ? 'containerfluid action-bar-open' : 'containerfluid'}>
        <h1>Report</h1>
        <div className="pb-3 shadow rounded pt-2 ps-2 mb-4">
          <Row className="d-flex">
            <Col sm={10}>
              <h3> Thống kê sự kiện chung</h3>
            </Col>
            <Col sm={1}>
              <Dropdown >
                <Dropdown.Toggle >
                  {option === 'Date' ? 'Ngày' : option === 'Month' ? 'Tháng' : 'Năm'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Date" onClick={() => handleDropdown("Date")}>Ngày</Dropdown.Item>
                  <Dropdown.Item eventKey="Month" onClick={() => handleDropdown("Month")}>Tháng</Dropdown.Item>
                  <Dropdown.Item eventKey="Year" onClick={() => handleDropdown("Year")}>Năm</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>

          </Row>

          <Row className="pt-5">
            <Col sm={3} className="pb-3 mx-auto shadow rounded pt-2 ps-2 mb-4">
              <Row>
                <Col>
                  <h4>Được tạo</h4>
                  <h2>{eventCount.create}</h2>
                  <span>Cơ hội để kết nối và khám phá!</span>
                </Col>
                <Col>
                  <img
                    src="https://cdn.dribbble.com/userupload/13943904/file/still-374f09b0f354cd4c8ac4f6c3263ad17e.png?format=webp&resize=400x300&vertical=center"
                    alt="Login"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Col>

              </Row>
            </Col>
            <Col sm={3} className="pb-3 mx-auto shadow rounded pt-2 ps-2 mb-4">
              <Row>
                <Col>
                  <h4>Bắt đầu</h4>
                  <h2>{eventCount.start}</h2>
                  <span>Đừng bỏ lỡ sự kiện đang chờ bạn tham gia!</span>
                </Col>
                <Col>
                  <img
                    src="https://cdn.dribbble.com/userupload/13943904/file/still-374f09b0f354cd4c8ac4f6c3263ad17e.png?format=webp&resize=400x300&vertical=center"
                    alt="Login"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Col>

              </Row>
            </Col>
            <Col sm={3} className="pb-3 mx-auto shadow rounded pt-2 ps-2 mb-4">
              <Row>
                <Col>
                  <h4>Kết thúc</h4>
                  <h2>{eventCount.end}</h2>
                  <span>Ghi dấu từ những khoảnh khắc đáng nhớ!</span>
                </Col>
                <Col>
                  <img
                    src="https://cdn.dribbble.com/userupload/13943904/file/still-374f09b0f354cd4c8ac4f6c3263ad17e.png?format=webp&resize=400x300&vertical=center"
                    alt="Login"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Col>

              </Row>
            </Col>

          </Row>


        </div>
        {/* <div className="w-25 pb-3 shadow rounded p-5 pt-5 pb-5 mb-4">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={eventStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="joinCount" fill="#8884d8" name="Lượt tham gia" />
            </BarChart>
          </ResponsiveContainer>
          <h5 style={{ textAlign: 'center', marginTop: '20px', width: "100%" }}>Thống kê lượt tham gia game quizz và puzzle</h5>
        </div> */}
        <div className="d-flex shadow custom-border-black rounded p-5 pt-4 mt-4 mb-5"  >

          <div className="w-50">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={eventStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="joinCount" fill="#8884d8" name="Lượt tham gia" barSize={20} />
                <Bar dataKey="likeCount" fill="#82ca9d" name="Lượt yêu thích " barSize={20} />
              </BarChart>
            </ResponsiveContainer>
            <h3 style={{ textAlign: 'center', marginTop: '20px' }}>Biểu đồ thống kê lượt tham gia và yêu thích</h3>
          </div>


          <div className="w-50">
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic" >
                {statType === 'joinCount' ? 'Lượt tham gia' : 'Lượt thích'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="joinCount" onClick={() => handleDropdownChange("joinCount")}>Lượt tham gia</Dropdown.Item>
                <Dropdown.Item eventKey="likeCount" onClick={() => handleDropdownChange("likeCount")}>Lượt thích</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie data={top} dataKey={statType} nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#B39DDB" label />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <h3 style={{ textAlign: 'center', marginTop: '20px' }}>
              Top các sự kiện {statType === 'joinCount' ? 'thu hút người tham gia' : 'được yêu thích'}
            </h3>
          </div>
        </div>
        <div className=" shadow custom-border-black rounded p-5 pt-4 mt-4"  >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={promotions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="usedCount" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
          <h3 style={{ textAlign: 'center', marginTop: '20px' }}>Biểu đồ thống kê số lượng voucher đã được sử dụng</h3>
        </div>

      </div>
    </div>
  );
};

export default Report;
