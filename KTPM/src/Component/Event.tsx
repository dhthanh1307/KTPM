import { useEffect, useState } from 'react'
import ActionBar from '../Nav/NavBar';
import { InputGroup, Form, Button, Modal, Dropdown, } from 'react-bootstrap';
import { FaEdit, FaCamera } from 'react-icons/fa';
import axios from 'axios';

const Event = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showQuizzesModal, setShowQuizzesModal] = useState(false);
  const [showLuckyDrawModal, setShowLuckyDrawModal] = useState(false);
  const [puzzleId, setPuzzleId] = useState<string>('');
  const [quizzId, setQuizzId] = useState<string>('');
  const accessToken = localStorage.getItem('accessToken');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  // Cấu hình headers
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleShowModal = () => {
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
  };

  const handleShowQuizzesModal = () => setShowQuizzesModal(true);
  const handleCloseQuizzesModal = () => setShowQuizzesModal(false);
  const handleShowLuckyDrawModal = () => setShowLuckyDrawModal(true);
  const handleCloseLuckyDrawModal = () => setShowLuckyDrawModal(false);
  type Question = {
    id: number;
    content: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    correct: string;
  };
  type TransformedQuestion = {
    id: number;
    content: string;
    options: {
      choice: string;
      content: string;
      isCorrect: boolean;
    }[];
  };

  const transformQuestions = (questions: Question[]): TransformedQuestion[] => {
    return questions.map((question) => {
      const transformedOptions = Object.entries(question.options).map(
        ([choice, content]) => ({
          choice,
          content,
          isCorrect: choice === question.correct,
        })
      );

      return {
        id: question.id,
        content: question.content,
        options: transformedOptions,
      };
    });
  };
  const [questions, setQuestions] = useState<Question[]>([]);
  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { id: prevQuestions.length + 1, content: '', options: { A: '', B: '', C: '', D: '' }, correct: '' },
    ]);
  };
  type Field = 'question' | 'A' | 'B' | 'C' | 'D' | 'correct';
  const handleQuestionChange = (index: number, field: Field, value: string) => {
    const updatedQuestions = [...questions];
    if (field === 'question') {
      updatedQuestions[index].content = value;
    } else if (field === 'correct') {
      updatedQuestions[index].correct = value;
    } else if (['A', 'B', 'C', 'D'].includes(field)) {
      updatedQuestions[index].options[field] = value;
    }
    setQuestions(updatedQuestions);
  };

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
  const [voucherList, setVoucherList] = useState<Promotion[]>([]);
  type TopReward = {
    id: number;
    topName: string;
    quantity: string;
    voucher: string;
    voucherId: number;
  };


  const [topRewards, setTopRewards] = useState<TopReward[]>([]);
  const [prizes, setPrizes] = useState<TopReward[]>(
    [{ id: 1, topName: '', quantity: '', voucher: '', voucherId: 0 }]);
  const handleAddTopReward = () => {
    setTopRewards((prevTopRewards) => [
      ...prevTopRewards,
      { id: prevTopRewards.length + 1, topName: '', quantity: '', voucher: voucherList[0].name, voucherId: voucherList[0].id },
    ]);
  };
  const handleTopRewardChange = (index: number, field: string, value: string) => {
    const updatedTopRewards = [...topRewards];
    if (field === 'topName') {
      updatedTopRewards[index].topName = value;
    } else if (field === 'quantity') {
      updatedTopRewards[index].quantity = value;
    } else {
      const selectedVoucher = voucherList.find((voucher) => voucher.name === value);
      if (selectedVoucher) {
        updatedTopRewards[index].voucher = selectedVoucher.name;
        updatedTopRewards[index].voucherId = selectedVoucher.id;
      }
    }
    setTopRewards(updatedTopRewards);
  };
  const transformToQuizThresholds = (topRewards: TopReward[]) => {
    return topRewards.map((reward) => ({
      threshold: parseInt(reward.topName.replace(/\D/g, "")) || 0,
      metric: "Top",
      prizes: [
        {
          promotionId: reward.voucherId.toString(),
          amount: parseInt(reward.quantity),
        },
      ],
    }));
  };

  const handlePrizeChange = (index: number, field: string, value: string) => {
    const updated = [...prizes];
    if (field === 'topName') {
      updated[index].topName = value;
    } else if (field === 'quantity') {
      updated[index].quantity = value;
    } else {
      const selectedVoucher = voucherList.find((voucher) => voucher.name === value);
      if (selectedVoucher) {
        updated[index].voucher = selectedVoucher.name;
        updated[index].voucherId = selectedVoucher.id;
      }
    }
    setPrizes(updated);
  };
  type Puzzle = {
    name: string;
    description: string;
    image: string;
  }
  const [formPuzzle, setFormPuzzle] = useState<Puzzle>({
    name: "",
    description: "",
    image: "",
  });
  type Quizz = {
    name: string;
    description: string;
    image: string;
    startTime: string;
    secondPerQuestion: number;
  }
  const [formQuizz, setFormQuizz] = useState<Quizz>({
    name: "",
    description: "",
    image: "",
    startTime: "",
    secondPerQuestion: 0
  });
  const [percentages, setPercentages] = useState<number[]>([]);

  const handlePercentageChange = (index: number, value: string) => {
    const updatedPercentages = [...percentages];
    updatedPercentages[index] = Number(value);
    setPercentages(updatedPercentages);
  };
  const transformPercentages = () => {
    return percentages.map((rate, index) => ({
      order: index,
      rate,
    }));
  };
  const [x, setX] = useState<number>(1);
  const [y, setY] = useState<number>(1);
  type Event = {
    name: string,
    description: string,
    image: string,
    startDate: string,
    endDate: string,
    turnsPerDay: number,
    id: string,
    eventStatus: string,
  }
  const [table, setTable] = useState<Event[]>([]);
  const [originalTable, setOriginalTable] = useState<Event[]>([]);
  useEffect(() => {
    const partnerId = localStorage.getItem('userId');

    if (!partnerId) {
      console.error('No userID found in localStorage');
      return;
    }
    const fetchEvent = async () => {
      try {
        console.log(partnerId);

        const response = await fetch(`http://localhost:1001/event-unauth/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTable(data); // Assuming the API returns an array of promotions.
        setOriginalTable(data);
      } catch (err) {
        console.log('Error fetching promotions:', err);
      }
      try {
        const response = await axios.get('http://localhost:1001/game-unauth/all');
        console.log('ID game:', response.data)
        setPuzzleId(response.data[0].id);
        setQuizzId(response.data[1].id);
      } catch (error) {
        console.log(error)
      }
    };
    const fetchPromotions = async () => {
      try {
        console.log(partnerId);

        const response = await axios.get(`http://localhost:1001/promotion-user/type/list/${partnerId}`, config);

        const data = await response.data;
        console.log("voucher", data);
        setVoucherList(data);
      } catch (err) {
        console.log('Error fetching promotions:', err);
      }
    };

    fetchPromotions();
    fetchEvent();

  }, []);


  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    startDate: '',
    endDate: '',
    turnsPerDay: 0,
    partnerId: localStorage.getItem('userId'),
    id: '',
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "turnsPerDay" || name === "partnerId" ? parseInt(value, 10) : value,
    }));
  };
  const fetchCreateEvent = async () => {
    try {
      const response = await axios.post(`http://localhost:1001/event-partner/create`, {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        turnsPerDay: formData.turnsPerDay,
        partnerId: formData.partnerId,
        image: formData.image
      }, config);
      console.log(response.data);
      const result = await response.data;

      return result;
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  };
  const handleEditClick = (event: Event) => {
    setIsEditMode(true);
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      image: event.image,
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
      turnsPerDay: event.turnsPerDay,
      partnerId: localStorage.getItem('userId'),
      id: event.id
    });
    setShowModal(true);
  };
  const handleUpdateEvent = async () => {
    const partnerId = localStorage.getItem('userId');
    if (!partnerId || !selectedEvent) {
      console.error('No userID found or no selected event');
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
        `http://localhost:1001/event-partner/update`,
        {
          name: formData.name,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          turnsPerDay: formData.turnsPerDay,
          partnerId: formData.partnerId,
          image: formData.image,
          id:selectedEvent.id
        },
        config
      );
      if (response.status === 201) {
        console.log('Cập nhật sự kiện thành công:', response.data);
        alert('Cập nhật sự kiện thành công!');
        // Bạn có thể gọi lại hàm setTable hoặc update UI nếu cần
      } else {
        console.log('Cập nhật sự kiện không thành công:', response);
        alert('Cập nhật sự kiện không thành công!');
      }
      const updatedEvent =  {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        turnsPerDay: formData.turnsPerDay,
        eventStatus: selectedEvent.eventStatus,
        image: formData.image,
        id:selectedEvent.id
      };
      setTable(table.map((table)=>(table.id===updatedEvent.id?updatedEvent:table)));
      // setPromotions(promotions.map((promotion) => (promotion.id === updatedPromotion.id ? updatedPromotion : promotion)));
      setTable((prevTable) => {
        return prevTable.map((event) =>
          event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
        );
      });
      setFormData({
        name: '',
        description: '',
        image: '',
        startDate: '',
        endDate: '',
        turnsPerDay: 0,
        partnerId: localStorage.getItem('userId'),
        id: ''
      });

      setShowModal(false);
    } catch (error) {
      console.log('Error updating event:', error);
    }
  };
  const handleSubmit = async () => {
    try {
      const eventResult = await fetchCreateEvent();
      if (!eventResult || !eventResult.id) {
        alert("Lỗi khi tạo sự kiện!");
        return;
      }
      const eventId = eventResult.id;
      const body: any[] = [];
      alert(puzzleId);
      if (formQuizz.name.trim() && formQuizz.description.trim()) {
        body.push({
          eventId,
          gameId: quizzId,
          name: formQuizz.name,
          description: formQuizz.description,
          guide: "Người chơi sẽ vào vai một người quản lý chịu trách nhiệm tổ chức các sự kiện mừng Đảng mừng Xuân ở một địa phương. Người chơi cần phải lên kế hoạch các hoạt động, quản lý nguồn lực (tiền bạc, nhân lực), và đảm bảo sự kiện diễn ra thành công tốt đẹp.",
          image: formQuizz.image,
        });
      }
      if (formPuzzle.name.trim() && formPuzzle.description.trim()) {
        body.push({
          eventId,
          gameId: puzzleId,
          name: formPuzzle.name,
          description: formPuzzle.description,
          guide: "Người chơi sẽ vào vai một người quản lý chịu trách nhiệm tổ chức các sự kiện mừng Đảng mừng Xuân ở một địa phương. Người chơi cần phải lên kế hoạch các hoạt động, quản lý nguồn lực (tiền bạc, nhân lực), và đảm bảo sự kiện diễn ra thành công tốt đẹp.",
          image: formPuzzle.image,
        });
      }
      if (body.length === 0) {
        alert("Vui lòng nhập thông tin cho ít nhất một game!");
        return;
      }
      const responseGame = await axios.post(`http://localhost:1001/game-event-partner/createmany`, body, config);

      if (!responseGame || !responseGame.data) {
        alert("Lỗi khi tạo games!");
        return;
      }
      console.log("Game of event", responseGame.data);//.data.ids[]
      if (responseGame.data.ids.length == 1 && formQuizz.name.trim() && formQuizz.description.trim()) {
        await axios.post(`http://localhost:1001/quiz-game-partner/create`, {
          gameOfEventId: responseGame.data.ids[0],
          secondPerQuestion: formQuizz.secondPerQuestion,
          startTime: new Date(formQuizz.startTime),
          questions: transformQuestions(questions),
          quizThresholds: transformToQuizThresholds(topRewards)
        }, config);

      } else if (responseGame.data.ids.length == 1 && formPuzzle.name.trim() && formPuzzle.description.trim()) {
        await axios.post(`http://localhost:1001/puzzle-game-partner/create`, {
          gameOfEventId: responseGame.data.ids[0],
          sizeX: x,
          sizeY: y,
          puzzleImage: formPuzzle.image,
          allowTrade: true,
          puzzles: transformPercentages(),
          prizes: [{
            promotionId: prizes[0].voucherId.toString(),
            amount: parseInt(prizes[0].quantity)
          }]
        }, config);


      } else {

        await axios.post(`http://localhost:1001/quiz-game-partner/create`, {
          gameOfEventId: responseGame.data.ids[0],
          secondPerQuestion: formQuizz.secondPerQuestion,
          startTime: new Date(formQuizz.startTime),
          questions: transformQuestions(questions),
          quizThresholds: transformToQuizThresholds(topRewards)
        }, config);

        await axios.post(`http://localhost:1001/puzzle-game-partner/create`, {
          gameOfEventId: responseGame.data.ids[1],
          sizeX: x,
          sizeY: y,
          puzzleImage: formPuzzle.image,
          allowTrade: true,
          puzzles: transformPercentages(),
          prizes: [{
            promotionId: prizes[0].voucherId.toString(),
            amount: parseInt(prizes[0].quantity)
          }]
        }, config);

      }
      alert("Sự kiện và các game đã được tạo thành công!");
      handleCloseModal();
    } catch (error) {
      console.error("Error during event and game creation:", error);
      alert("Lỗi khi tạo sự kiện hoặc game!");
    }
  };
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = () => {
    
    const filtered= originalTable.filter((promotion) =>
      promotion.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setTable(filtered);
  };
  
  return (

    <div>
      <ActionBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={isSidebarOpen ? 'containerfluid action-bar-open' : 'containerfluid'}>
        <h1>Event</h1>
        <div className="d-flex gap-3 pb-4">
          <InputGroup  >
            <Form.Control
              placeholder="Nhập từ khóa tìm kiếm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button variant="primary"  onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </InputGroup>

          <Button variant="primary" onClick={handleShowModal} className="">
            Thêm
          </Button>
        </div>

        <table className="table table-bordered p-4">
          <thead className="table-dark ">
            <tr>
              <th style={{ width: "10%" }}>Tên sự kiện</th>
              <th style={{ width: "20%" }}>Mô tả</th>
              <th style={{ width: "5%" }}>Số lượt mỗi ngày</th>
              <th style={{ width: "20%" }}>Hình ảnh</th>
              <th style={{ width: "8%" }}>Ngày bắt đầu</th>
              <th style={{ width: "8%" }}>Ngày kết thúc</th>
              <th style={{ width: "8%" }}>Trạng thái</th>
              <th style={{ width: "5%" }}>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {table.length > 0 ? (
              table.map((event) => (
                <tr key={event.id}>

                  <td>{event.name}</td>
                  <td>{event.description}</td>

                  <td>{event.turnsPerDay}</td>
                  <td>
                    <img
                      src={event.image}
                      alt={event.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </td>
                  <td>{new Date(event.startDate).toLocaleDateString()}</td>
                  <td>{new Date(event.endDate).toLocaleDateString()}</td>
                  <td>{event.eventStatus}</td>
                  <td>
                    <FaEdit
                      className="m-2 text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEditClick(event)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
                  Không có sự kiện nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Modal thêm sự kiện */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Body>
            <Form onSubmit={isEditMode ? handleUpdateEvent : handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên sự kiện</Form.Label>
                <Form.Control type="text" placeholder="Nhập tên sự kiện" name="name" value={formData.name} onChange={handleInputChange} required  />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả sự kiện"required
                />
              </Form.Group>
              <div className="d-flex gap-5">
                <Form.Group className="mb-3">
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <Form.Control type="date" name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}  disabled={isEditMode} required/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <Form.Control type="date" name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}  disabled={isEditMode} required/>
                </Form.Group>
              </div>


              <Form.Group className="mb-3">
                <Form.Label>Hình ảnh</Form.Label>
                <div
                  className="image-preview rounded d-flex justify-content-center align-items-center mb-3"
                  style={{
                    width: '100%',
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

              <Form.Group className="mb-3">
                <Form.Label>Số lượt mỗi ngày</Form.Label>
                <Form.Control
                  type="number"
                  name="turnsPerDay"
                  value={formData.turnsPerDay}
                  onChange={handleInputChange} required
                  placeholder="Nhập số lượt"
                />
              </Form.Group>

              <Button variant="outline-primary" className="mb-3 me-5" onClick={handleShowLuckyDrawModal}>
                Lắc xì
              </Button>
              <Button variant="outline-primary" className="mb-3 ms-5" onClick={handleShowQuizzesModal}>
                Quizzes
              </Button>
              <Button variant="primary" className="w-100 bg-info" type="submit">
                {isEditMode ? 'Cập nhật sự kiện' : 'Thêm sự kiện'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>



        {/* Modal Quizzes */}
        <Modal show={showQuizzesModal} onHide={handleCloseQuizzesModal} centered>
          <Modal.Body>
            <h5>Thông tin Quizzes</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label >Tên quiz</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên quiz"
                  value={formQuizz.name}
                  onChange={(e) => setFormQuizz({ ...formQuizz, name: e.target.value })} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label >Ngày bắt đầu</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Nhập ngày"
                  value={formQuizz.startTime}
                  onChange={(e) => setFormQuizz({ ...formQuizz, startTime: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label >Thời gian mỗi câu hỏi</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Nhập thời gian"
                  value={formQuizz.secondPerQuestion}
                  onChange={(e) => setFormQuizz({ ...formQuizz, secondPerQuestion: Number(e.target.value) })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả quiz</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập mô tả quiz"
                  value={formQuizz.description}
                  onChange={(e) => setFormQuizz({ ...formQuizz, description: e.target.value })}
                />
              </Form.Group>
              {topRewards.map((top, index) => (
                <div key={top.id} className="mb-4 border p-3 rounded">
                  {/* Nhập tên top */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Nhập top nhận thưởng"
                      value={top.topName}
                      onChange={(e) => handleTopRewardChange(index, 'topName', e.target.value)}
                    />
                  </Form.Group>

                  {/* Nhập số lượng */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Nhập số lượng"
                      value={top.quantity}
                      onChange={(e) => handleTopRewardChange(index, 'quantity', e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Chọn loại voucher</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id={`dropdown-voucher-${index}`}>
                        {top.voucher || "Chọn loại voucher"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {voucherList.map((voucher, idx) => (
                          <Dropdown.Item
                            key={idx}
                            onClick={() => handleTopRewardChange(index, 'voucher', voucher.name)}
                          >
                            {voucher.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>

                </div>
              ))}
              <Button variant="primary" className="w-100 bg-info mb-5" onClick={handleAddTopReward}>
                + Thêm voucher
              </Button>
              <Form.Group className="mb-3">
                <Form.Label>Hình ảnh</Form.Label>
                <div
                  className="image-preview rounded d-flex justify-content-center align-items-center mb-3"
                  style={{
                    width: '100%',
                    height: '250px',
                    borderStyle: "dashed",
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  {formQuizz?.image ? (
                    <img
                      src={formQuizz.image}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  ) : (
                    <span>
                      <FaCamera className="m-2" /> Chọn ảnh qua URL
                    </span>
                  )}
                </div>

                {/* Input để nhập URL ảnh */}
                <Form.Control
                  type="text"
                  placeholder="Nhập URL ảnh"
                  value={formQuizz?.image || ''}
                  onChange={(e) => setFormQuizz({ ...formQuizz, image: e.target.value })}
                />
              </Form.Group>

              {questions.map((item, index) => (
                <div key={item.id} className="mb-4 border p-3 rounded">
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Nhập câu hỏi"
                      value={item.content}
                      onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    />
                  </Form.Group>

                  {Object.keys(item.options).map((optionKey) => (
                    <Form.Group key={optionKey} className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder={`Nhập đáp án ${optionKey}`}
                        value={item.options[optionKey as keyof typeof item.options]}
                        onChange={(e) =>
                          handleQuestionChange(index, optionKey as Field, e.target.value)
                        }
                      />
                    </Form.Group>
                  ))}

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Nhập đáp án đúng (A/B/C/D)"
                      value={item.correct}
                      onChange={(e) => handleQuestionChange(index, 'correct', e.target.value)}
                    />
                  </Form.Group>
                </div>
              ))}
              <Button variant="primary" className="w-100 bg-info mb-5" onClick={handleAddQuestion}>
                + Thêm câu hỏi
              </Button>
              <Button variant="primary" className="w-100 bg-info" onClick={handleCloseQuizzesModal}>
                Lưu
              </Button>
            </Form>
          </Modal.Body>
        </Modal>



        {/* Modal Lắc Xì */}
        <Modal show={showLuckyDrawModal} onHide={handleCloseLuckyDrawModal} centered>
          <Modal.Body>
            <h5>Thông tin Lắc Xì</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Hình ảnh</Form.Label>
                <div
                  className="image-preview rounded d-flex justify-content-center align-items-center mb-3"
                  style={{
                    width: '100%',
                    height: '250px',
                    borderStyle: "dashed",
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  {formPuzzle?.image ? (
                    <img
                      src={formPuzzle.image}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  ) : (
                    <span>
                      <FaCamera className="m-2" /> Chọn ảnh qua URL
                    </span>
                  )}
                </div>

                {/* Input để nhập URL ảnh */}
                <Form.Control
                  type="text"
                  placeholder="Nhập URL ảnh"
                  value={formPuzzle?.image || ''}
                  onChange={(e) => setFormPuzzle({ ...formPuzzle, image: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Nhập tên"
                  value={formPuzzle.name}
                  onChange={(e) => setFormPuzzle({ ...formPuzzle, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Nhập mô tả"
                  value={formPuzzle.description}
                  onChange={(e) => setFormPuzzle({ ...formPuzzle, description: e.target.value })}
                />
              </Form.Group>
              {prizes.map((top, index) => (
                <div key={top.id} className="mb-4 border p-3 rounded">
                  {/* Nhập số lượng */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Nhập số lượng"
                      value={top.quantity}
                      onChange={(e) => handlePrizeChange(index, 'quantity', e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Chọn loại voucher</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id={`dropdown-voucher-${index}`}>
                        {top.voucher || "Chọn loại voucher"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {voucherList.map((voucher, idx) => (
                          <Dropdown.Item
                            key={idx}
                            onClick={() => handlePrizeChange(index, 'voucher', voucher.name)}
                          >
                            {voucher.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>

                </div>
              ))}
              <div className="d-flex gap-5">
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng chia ngang (X)</Form.Label>
                  <Form.Control
                    type="number"
                    value={x}
                    onChange={(e) => setX(Number(e.target.value))}
                    placeholder="Nhập số lượng chia ngang"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số lượng chia dọc (Y)</Form.Label>
                  <Form.Control
                    type="number"
                    value={y}
                    onChange={(e) => setY(Number(e.target.value))}
                    placeholder="Nhập số lượng chia dọc"
                  />
                </Form.Group>
              </div>


              {/* Hiển thị các ô nhập phần trăm (X * Y) */}
              <div className="percentage-inputs">
                <div className="row">
                  {Array.from({ length: x * y }).map((_, index) => (
                    <div className="col-4 mb-2" key={index}>
                      <Form.Group>
                        <Form.Label>Mảnh {index + 1}</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Nhập %"
                          value={percentages[index] || ''}
                          onChange={(e) => handlePercentageChange(index, e.target.value)}
                        />
                      </Form.Group>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="primary" className="w-100 bg-info" onClick={handleCloseLuckyDrawModal}>
                Thêm game lắc xì
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Event;
