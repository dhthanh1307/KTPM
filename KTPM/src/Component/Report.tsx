import { useEffect, useState } from 'react'
import ActionBar from '../Nav/NavBar';
import { Dropdown } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';
import axios from 'axios';
const Report = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statType, setStatType] = useState<string>('joinCount');

  const [top, setTop] = useState<any[]>([]);
  const [eventStats, setEventStats] = useState<any[]>([{
    id: "c234f569-8ca3-4d5b-b231-0923913ff3a3",
    name: "Stiedemann - Hoeger",
    eventStatus: "PENDING",
    startDate: "2025-02-03T00:00:00.000Z",
    endDate: "2025-02-07T00:00:00.000Z",
    createdAt: "2025-01-13T17:10:22.280Z",
    joinCount: 10,
    likeCount: 20
  },
  {
    id: "a87b121f-121a-46db-9e6f-56f1d82f4951",
    name: "Test Event 2",
    eventStatus: "APPROVED",
    startDate: "2025-01-10T00:00:00.000Z",
    endDate: "2025-01-15T00:00:00.000Z",
    createdAt: "2025-01-05T14:00:00.000Z",
    joinCount: 20,
    likeCount: 15
  },
  {
    id: "e23bdf31-2b6f-46d3-906b-65f53f69ff30",
    name: "Test Event 3",
    eventStatus: "REJECTED",
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-01-05T00:00:00.000Z",
    createdAt: "2024-12-28T11:00:00.000Z",
    joinCount: 50,
    likeCount: 25
  }]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleDropdownChange = (selectedValue: string) => {
    setStatType(selectedValue); 
    setTop(getTop3Events(eventStats, statType));
  };
  const getTop3Events = (data: any[], stat: string) => {
    return data
      .sort((a, b) => b[stat] - a[stat]) 
      .slice(0, 3); 
  };
  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/unauth-event/stats/event-aggregate-stats');
        setEventStats(response.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error('Error fetching event stats:', error);
      }
    };
    setTop(getTop3Events(eventStats, statType));

    fetchEventStats();
  }, []);
  return (
    <div>
      <ActionBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={isSidebarOpen ? 'containerfluid action-bar-open' : 'containerfluid'}>
        <h1>Report</h1>
        <div>
          Thống kê chung
        </div>
        <div className="w-25 pb-3 shadow rounded p-5 pt-5 pb-5 mb-4">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={eventStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45}/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="joinCount" fill="#8884d8" name="Lượt tham gia" />
            </BarChart>
          </ResponsiveContainer>
          <h5 style={{ textAlign: 'center', marginTop: '20px', width: "100%" }}>Thống kê lượt tham gia game quizz và puzzle</h5>
        </div>
        <div className="d-flex shadow custom-border-black rounded p-5 pt-4 mt-4"  >

          <div className="w-50">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={eventStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="joinCount" fill="#8884d8" name="Lượt tham gia" barSize={20}/>
                <Bar dataKey="likeCount" fill="#82ca9d" name="Lượt yêu thích " barSize={20}/>
              </BarChart>
            </ResponsiveContainer>
            <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Biểu đồ thống kê lượt tham gia và yêu thích</h2>
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
            <h2 style={{ textAlign: 'center', marginTop: '20px' }}>
              Top các sự kiện {statType === 'joinCount' ? 'thu hút người tham gia' : 'được yêu thích'}
            </h2>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Report;
