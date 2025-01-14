import { useEffect, useState } from 'react';
import ActionBar from '../Nav/NavBar';
import { Button, Card, Col, Form, Image, CardBody, Row } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
const Register = () => {
  const [profileData, setProfileData] = useState({
    email: '',
    address: '',
    avatar:
      '',
    status: '',
    field: '',
    gpsLat: 21.0285,
    gpsLong: 105.8542,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  // Set mặc định vị trí ban đầu của bản đồ (nếu có)
  const defaultPosition: [number, number] = latitude && longitude ? [latitude, longitude] : [21.0285, 105.8542];

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:1001/authen/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data.partner)
        setProfileData(response.data.partner);
        setLatitude(response.data.partner.gpsLat);
        setLongitude(response.data.partner.gpsLong);
      } catch (err) {
        console.log('Error fetching partner data.', err);
      }
    };
    const userName = localStorage.getItem('username')
    if (userName) {
      setUsername(userName.toString())
    } else {
      console.log('No username found in localStorage');
    }



    fetchPartnerData();
  }, []);
  const updateAccount = async () => {
    try {
      // Lấy token từ localStorage
      const accessToken = localStorage.getItem('accessToken');

      // Cấu hình headers
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };
      let body;
      if (!password) {
        // Gửi request PUT để cập nhật thông tin tài khoản
        body = {
          email: profileData.email,
          address: profileData.address,
          avatar: profileData.avatar,
          status: profileData.status,
          field: profileData.field,
          gpsLat: latitude,
          gpsLong: longitude,
        }
      } else {
        // Gửi request PUT để cập nhật thông tin tài khoản
        body = {
          email: profileData.email,
          address: profileData.address,
          password: password,
          avatar: profileData.avatar,
          status: profileData.status,
          field: profileData.field,
          gpsLat: latitude,
          gpsLong: longitude,
        };
      }

      const response = await axios.post('http://localhost:1001/authen/update/partner', body, config);

      // Kiểm tra phản hồi từ server
      if (response.status === 201) {

        alert('Thông tin tài khoản đã được cập nhật thành công!');
        window.location.reload();
        console.log(response.data);
      } else {
        console.log('Đã xảy ra lỗi khi cập nhật tài khoản:', response.data);
        alert('Cập nhật tài khoản không thành công.');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật tài khoản:', err);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };
  const handleSubmit = async () => {
    await updateAccount();
  };
  const handleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
  };
  return (
    <div>
      <ActionBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`${isSidebarOpen ? 'containerfluid action-bar-open' : 'containerfluid'} flex`}>
        <Row sm={10} className="justify-content-center">
          <Col sm={5} className="gap-3 p-3 relative ">

            <Card className="mb-3 bg-light">
              <div
                className="card-image"
                style={{
                  backgroundImage:
                    "url('https://png.pngtree.com/background/20231016/original/pngtree-3d-rendered-background-of-colorful-abstract-cube-formation-picture-image_5576716.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '350px',
                  borderRadius: '10px 10px 0 0',
                }}
              ></div>
              <CardBody>
                <div className="text-left">
                  <Image
                    src={profileData.avatar||`https://i.pinimg.com/736x/0b/8e/41/0b8e410aa05816bfda615c2a6717ed9f.jpg`}
                    roundedCircle
                    width={250}
                    height={250}
                    className="mb-2"
                    style={{
                      position: 'absolute',
                      top: '60%',
                      left: '  200px',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                  <Form className="pt-5">
                    <Form.Group>

                      <Form.Control
                        className="mt-3"
                        type="text"
                        name="avatar"
                        placeholder="Nhập URL ảnh"
                        value={profileData.avatar}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </CardBody>
            </Card>
          </Col><Col sm={5} className=" gap-3 p-3 relative ">
            <Card className="bg-light">
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control type="text" name="fullName" value={username} onChange={handleChange} disabled={false} />
                  </Form.Group>



                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control as="textarea" rows={3} name="address" value={profileData.address} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Lĩnh vực</Form.Label>
                    <Form.Control type="text" name="field" value={profileData.field} onChange={handleChange} />
                  </Form.Group>



                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control type="password" name="password" value={password} onChange={handleChangePass} />
                  </Form.Group>
                  <div className='d-flex justify-content-between gap-3'>
                    <Form.Group className="mb-3 w-50">
                      <Form.Label>Vĩ độ</Form.Label>
                      <Form.Control
                        type="text"
                        name="latitude"
                        value={latitude}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 w-50">
                      <Form.Label>Kinh độ</Form.Label>
                      <Form.Control
                        type="text"
                        name="longitude"
                        value={longitude}

                      />
                    </Form.Group>
                  </div>
                  <MapContainer center={defaultPosition} zoom={13} style={{ height: '300px', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    <LocationMarker setLatitude={setLatitude} setLongitude={setLongitude} />
                  </MapContainer>
                  <Button variant="primary" onClick={handleSubmit} className="w-100">
                    Lưu thay đổi
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div >
  );
};

export default Register;

function LocationMarker({
  setLatitude,
  setLongitude,
}: {
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      setPosition([lat, lng]);
      setLatitude(lat); // Cập nhật vĩ độ
      setLongitude(lng); // Cập nhật kinh độ
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Vị trí đã chọn: {position[0]}, {position[1]}</Popup>
    </Marker>
  );
}
