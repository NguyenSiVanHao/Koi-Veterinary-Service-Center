import React, { useEffect, useState } from "react";
import "./FAQ.css";
import { fetchAllFAQAPI } from "../../apis";
import BannerTop from "../../components/BannerTop/BannerTop";

function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchAllFAQ = async () => {
      try {
        const response = await fetchAllFAQAPI()
        setFaqs(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllFAQ()
  }, [])
  
  return (
    <div>
      <BannerTop title="Frequently Asked Questions" subTitle="Home / FAQ" />
      <div className=" mb-5">
        

        <div className="row justify-content-center phancach">
          <div className="col-md-8">
            <div className="input-group mb-4">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="searchInput"
                placeholder="Tìm kiếm câu hỏi..."
                aria-label="Tìm kiếm câu hỏi"
              />
            </div>
            <div className="accordion" id="faqAccordion">
              <div className="accordion" id="faqAccordion">
                {faqs?.map((faq)=>{
                  
                  return (
                    <div className="accordion-item">
                    <h2 className="accordion-header" id={`heading${faq.faqId}`}>
                      <button
                        className="accordion-button collapsed fw-normal"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${faq.faqId}`}
                        aria-expanded="false"
                        aria-controls={`collapse${faq.faqId}`}
                        
                      >
                       <div dangerouslySetInnerHTML={{ __html: faq.question }}>
                        
                       </div>
                      </button>
                    </h2>
                    <div
                      id={`collapse${faq.faqId}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading${faq.faqId}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }}>
                        
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                })}
                {/* <!-- Accordion item 1 --> */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      1. Làm thế nào để kiểm tra các gói Mobile Internet dành
                      cho thuê bao của tôi? Và muốn đăng ký gói Mobile Internet
                      làm như thế nào?
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body text-start">
                      <div>
                        <p>Quý khách chọn 1 trong 4 cách sau:</p>

                        <ol>
                          <li>
                            <p>
                              <strong>Cách 1:</strong> Đăng nhập tài khoản đã
                              tạo trước đó vào ứng dụng My Viettel, chọn Tab GÓI
                              CƯỚC/ DATA sẽ hiển thị tên gói Mobile internet và
                              lưu lượng còn lại và ngày hết hạn gói data mà thuê
                              bao đã đăng ký. Quý khách click vào thông tin data
                              và thực hiện bấm Đổi gói, My Viettel hiển thị list
                              các gói cước data kèm với giá gói và lưu lượng đi
                              kèm. Quý khách xem ưu đãi gói cước nào phù hợp với
                              nhu cầu sử dụng thì chỉ cần tick chọn vào gói đó
                              và nhấn nút ĐĂNG KÝ.
                            </p>
                          </li>
                          <li>
                            <p>
                              <strong>Cách 2:</strong> Bấm *098# bấm phím gọi và
                              tiếp tục làm theo các hướng dẫn.
                            </p>
                          </li>
                          <li>
                            <p>
                              <strong>Cách 3:</strong> Vào trang web{" "}
                              <a href="https://vietteltelecom.vn">
                                https://vietteltelecom.vn
                              </a>{" "}
                              hoặc{" "}
                              <a href="https://viettel.vn">
                                https://viettel.vn
                              </a>{" "}
                              và đăng nhập tài khoản là số thuê bao Quý khách
                              muốn tra cứu, chọn mục MY VIETTEL/ QUẢN LÝ TÀI
                              KHOẢN/ THÔNG TIN THUÊ BAO. Trong mục THÔNG TIN TÀI
                              KHOẢN sẽ hiển thị tên gói Mobile internet và lưu
                              lượng còn lại và hạn sử dụng gói data. Để đăng ký
                              gói Mobile internet, Quý khách xem trong phần tiện
                              ích, webportal hiển thị list các gói data với
                              thông tin tên gói và ưu đãi đi kèm. Quý khách kiểm
                              tra gói cước nào phù hợp với nhu cầu sử dụng thì
                              chỉ cần nhấn nút ĐĂNG KÝ tại gói đó. Quý khách cần
                              đọc kỹ thông tin gói cước trước khi đăng ký để
                              tránh nhầm lẫn.
                            </p>
                          </li>
                          <li>
                            <p>
                              <strong>Cách 4:</strong> Để kiểm tra gói mobile
                              internet, Quý khách soạn tin nhắn KTMI gửi 191.
                              Thông tin phản hồi từ 191 hiển thị thông tin tên
                              gói data, lưu lượng data đi kèm, hạn sử dụng gói
                              data. Để đăng ký gói cước khác, quý khách soạn tin
                              TEN GOI CUOC gửi 191. Áp dụng khi Quý khách đã có
                              tên gói Mobile internet muốn đăng ký.
                            </p>
                          </li>
                        </ol>

                        <p>
                          Lưu ý: Với ứng dụng My Viettel và trang web{" "}
                          <a href="https://vietteltelecom.vn">
                            https://vietteltelecom.vn
                          </a>
                          , <a href="https://viettel.vn">https://viettel.vn</a>,
                          nếu chưa có tài khoản để đăng nhập, Quý khách cần tạo
                          tài khoản trước theo các bước trên ứng dụng/trang web
                          có hướng dẫn.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Accordion item 2 --> */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Câu hỏi 2: Làm sao để đặt lại mật khẩu?
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Để đặt lại mật khẩu, bạn cần truy cập trang quên mật
                        khẩu, nhập email đã đăng ký và làm theo hướng dẫn được
                        gửi đến email của bạn.
                      </div>
                    </div>
                  </div>
                  {/* <!-- Accordion item 3 --> */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Câu hỏi 3: Làm thế nào để liên hệ hỗ trợ?
                      </button>
                    </h2>
                    <div
                      id="collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Bạn có thể liên hệ hỗ trợ qua email support@example.com
                        hoặc gọi đến số hotline 1900 1234 trong giờ hành chính.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
