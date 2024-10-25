import React, { useEffect, useState } from "react";
import "./FAQ.css";
import { fetchAllFAQAPI } from "../../apis";
import BannerTop from "../../components/BannerTop/BannerTop";

function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [search, setSearch] = useState("")
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="accordion" id="faqAccordion">
              <div className="accordion" id="faqAccordion">
                {faqs?.filter((faq) => faq.question.toLowerCase().includes(search.toLowerCase())).map((faq) => {

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

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
