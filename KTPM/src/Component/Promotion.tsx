import { useEffect, useState } from 'react'
import ActionBar from '../Nav/NavBar';
import { InputGroup, Form, Button, Modal } from 'react-bootstrap';
import { FaCamera, FaEdit } from 'react-icons/fa';
import axios from 'axios';

const Promotion = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [originalPromotions, setOriginalPromotions] = useState<Promotion[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    discountValue: '',
    shortDescription: '',
    description: '',
    expiresAt: '',
    image: '',
  });
  type Promotion = {
    name: string;
    discountValue: number;
    description: string;
    image: string;
    shortDescription: string;
    expiresAt: string;
    updatedAt: string;
    id: number;
  };
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  useEffect(() => {
    const partnerId = localStorage.getItem('userId');

    if (!partnerId) {
      console.error('No userID found in localStorage');
      return;
    }
    const fetchPromotions = async () => {
      try {
        console.log(partnerId);
        const accessToken = localStorage.getItem('accessToken');
        // alert(partnerId)

        // Cấu hình headers
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
        const data = await response.json();
        setPromotions(data); // Assuming the API returns an array of promotions.
        setOriginalPromotions(data);
      } catch (err) {
        console.log('Error fetching promotions:', err);
      }
    };

    fetchPromotions();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setIsEditMode(false);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
  };
  // const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleAddPromotion = async () => {
    const partnerId = localStorage.getItem('userId');

    if (!partnerId) {
      console.error('No userID found in localStorage');
      return;
    }
    const accessToken = localStorage.getItem('accessToken');

    // Cấu hình headers
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(`http://localhost:1001/promotion-partner/type/create`, {
        ...formData,
        discountValue: Number(formData.discountValue),
        partnerId: partnerId,
        discountType: "PERCENTAGE"
      }, config);
      console.log(response);


      const createdPromotion = await response.data;
      setPromotions([...promotions, createdPromotion]);
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        image: '',
        discountValue: '',
        expiresAt: '',
      });
      setShowModal(false);
    } catch (error) {
      console.log('Error creating promotion:', error);
    }
  };

  const handleEditClick = (promotion: any) => {
    setIsEditMode(true);
    setSelectedPromotion(promotion);
    setFormData({
      name: promotion.name,
      discountValue: promotion.discountValue.toString(),
      shortDescription: promotion.shortDescription,
      description: promotion.description,
      expiresAt: promotion.expiresAt.split('T')[0], // Convert to 'YYYY-MM-DD' format
      image: promotion.image,
    });
    setShowModal(true);
  };
  const handleUpdatePromotion = async () => {
    const partnerId = localStorage.getItem('userId');
    if (!partnerId || !selectedPromotion) {
      console.error('No userID found or no selected promotion');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        `http://localhost:1001/promotion-partner/type/update/${selectedPromotion.id}`,
        {
          ...formData,
          discountValue: Number(formData.discountValue),
          // partnerId: partnerId,
          discountType: 'PERCENTAGE',
        },
        config
      );

      const updatedPromotion = response.data;
      setPromotions(promotions.map((promotion) => (promotion.id === updatedPromotion.id ? updatedPromotion : promotion)));
      setFormData({
        name: '',
        discountValue: '',
        shortDescription: '',
        description: '',
        expiresAt: '',
        image: '',
      });
      setShowModal(false);
    } catch (error) {
      console.log('Error updating promotion:', error);
    }
  };
  const handleSearch = () => {
    
    const filteredPromotions = originalPromotions.filter((promotion) =>
      promotion.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      promotion.shortDescription.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setPromotions(filteredPromotions);
  };

  return (
    <div>
      <ActionBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={isSidebarOpen ? 'containerfluid action-bar-open' : 'containerfluid'}>
        <h1>Promotion</h1>
        <div className="d-flex gap-3 pb-4">
          <InputGroup  >
            <Form.Control
              placeholder="Nhập từ khóa tìm kiếm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button variant="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </InputGroup>

          <Button variant="primary" className="flex-shrink-0" onClick={handleShowModal}>
            Thêm voucher
          </Button>
        </div>
        <div className="row p-4">
          {promotions.map((promotion) => (
            <div className="col-md-3 col-sm-6 mb-4" key={promotion.id}>
              <div className="card">
                <img
                  src={promotion.image}
                  alt={promotion.name}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title fs-1">{promotion.name}</h5>
                  <div className="d-flex flex-column">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="card-text">
                        <strong style={{ fontSize: '1.2rem' }}>Giảm giá: </strong>
                        <span style={{ fontSize: '1.2rem' }}>{promotion.discountValue}%</span>
                      </span>
                      <button className="btn btn-info" onClick={() => handleEditClick(promotion)} >
                        <FaEdit /> Chỉnh sửa
                      </button>
                    </div>

                    <div className="d-flex flex-column mb-3">
                      <span className="card-text">
                        <strong>Mô tả:</strong> {promotion.shortDescription}
                      </span>
                      <div className="d-flex justify-content-between">
                        <span className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                          <strong>Ngày hết hạn:</strong> {new Date(promotion.expiresAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                          <strong>Cập nhật lần cuối:</strong> {new Date(promotion.updatedAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Body>
            <Form onSubmit={isEditMode ? handleUpdatePromotion : handleAddPromotion} >
              <Form.Group className="mb-3">
                <Form.Label>Mã voucher</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá trị %</Form.Label>
                <Form.Control type="text" name="discountValue" value={formData.discountValue} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả ngắn</Form.Label>
                <Form.Control type="text" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control as="textarea" name="description" rows={3} value={formData.description} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ngày hết hạn</Form.Label>
                <Form.Control type="date" name="expiresAt" value={formData.expiresAt} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hình ảnh</Form.Label>
                <div
                  className="image-preview rounded d-flex justify-content-center align-items-center mb-3"
                  style={{
                    width: '350px',
                    height: '250px',
                    borderStyle: "dashed",
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <span>
                      <FaCamera className="m-2" /> Chọn ảnh qua URL
                    </span>
                  )}
                </div>

                <Form.Control
                  className="mt-3"
                  type="text"
                  name="image"
                  placeholder="Nhập URL ảnh"
                  value={formData.image}
                  onChange={handleInputChange} required
                />
              </Form.Group>

              <Button variant="primary" className="w-100 bg-info" type="submit">
                {isEditMode ? 'Cập nhật voucher' : 'Thêm voucher'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Promotion;
