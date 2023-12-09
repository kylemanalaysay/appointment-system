import React from 'react'
import '../styles/home.css'
import { Container, Row, Col } from 'reactstrap'
import heroImg1 from '../assets/images/hero-img1.jpg'
import heroImg2 from '../assets/images/hero-img2.jpg'
import heroVid from '../assets/images/hero-video1.mp4'
import smallImg3 from '../assets/images/img3.png'
import Subtitle from './../shared/Subtitle'
import ServiceList from '../services/ServiceList'

const Home = () => {
  return (
    <>
      {/* ================= hero section start ================= */}
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={"Good Hair Days"} />
                  <img src={smallImg3} alt="" />
                </div>
                <h1>
                  {" "}<span className="highlight">Book</span> your Glam Session Now & Elevate your look
                </h1>
              </div>
            </Col>

            <Col lg='2'>
              <div className="hero__img-box ">
                <img src={heroImg1} alt="" />
              </div>
            </Col>
            <Col lg='2'>
              <div className="hero__img-box mt-4">
                <video src={heroVid} alt="" controls/>
              </div>
            </Col>
            <Col lg='2'>
              <div className="hero__img-box mt-5">
                <img src={heroImg2} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ================= img section end ================= */}
      <section>
        <Container>
          <Row>
            <Col lg='3'>
              <h5 className="services__subtitle">What we serve</h5>
              <h2 className="services__title">We offer our best services</h2>  
            </Col>
            <ServiceList/>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home
