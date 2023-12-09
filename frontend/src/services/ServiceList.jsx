import React from 'react';
import ServiceCard from './ServiceCard';
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './ServiceList.css';

const servicesData = [
    {
        title: 'Hair Services',
        desc: 'Our hair services include cutting, styling, and coloring.',
        subServices: [
            'Hair Cut – Php 100',
            'Hair Spa – Php 200',
            'Hair Iron – Php 200',
            'Perma Gloss – Php 300',
            'Pro Vitamins – Php 300',
            'Basic Color – Php 390',
            'Premium Color – Php 690',
            'Premium Bleaching – Php 500',
            'Cellophane – Php 400',
            'Washable Color Cello – Php 500',
            'Ionic Keratin – Php 700',
            'Perma Color Cello – Php 790',
            'Basic Hair & Make Up – Php 800',
        ],
    },
    {
        title: 'Hand & Foot Care',
        desc: 'Pamper your hands and feet with our specialized treatments.',
        subServices: [
            'Manicure – Php 75',
            'Pedicure – Php 75',
            'Imported Polish – Php 50',
            'Nail Art – Php 100',
            'Eyebrow Threading – Php 100',
            'Foot Massage w/ Pedicure – Php 225',
            'Foot spa w/ Milk Scrub – Php 250',
            'Footspa Magic – Php 250',
            'Regular Foot spa (with Basic Mani & Ped) – Php 300',
            'Gel Manicure – Php 350',
            'Gel Pedicure – Php 350',
            'Polygel Extension – Php 899',
        ],
    },
    {
        title: 'Major Treatment',
        desc: 'Receive major treatments for various health and beauty needs.',
        subServices: [
            'Absolute Rebond with Hair Spa & Pro-Vitamins – Php 1,000',
            'Rebond with Clear Cello & Pro-Vitamins – Php 1,300',
            'Absolute Rebond - Complete Treatment – Php 1,500',
            'Absolute Brazilian Keratin – Php 1,500',
            'Hair Botox – Php 1,500',
            'High lights (Full coverage) – Php 1,500',
            'Balayage with Brazilian Keratin (Basic) – Php 2,500',
            'Balayage with Brazilian Keratin (Premium) – Php 3,000',
            'Ombré with Brazilian Keratin – Php 2,500',
            'Absolute Rebond Perma – Color 2,000',
            'Absolute Rebond & Absolute Brazilian – Php 3,000',
            'Digital Perming – Php 2,500',
            'Hair Extensions (25 strands) / Php 2,500',
        ],
    },
];

const ServiceList = () => {
    const renderTooltip = (item, index) => (
        <Tooltip id={`tooltip-${index}`}>
            <div className="sub-services">
                {item.subServices.map((subService, subIndex) => (
                    <div key={subIndex}>{subService}</div>
                ))}
            </div>
        </Tooltip>
    );


    return (
        <>
            {servicesData.map((item, index) => (
                <Col lg="3" key={index}>
                    <OverlayTrigger
                        placement="top"
                        overlay={renderTooltip(item, index)}
                    >
                        <div className="service">
                            <ServiceCard item={item} />
                        </div>
                    </OverlayTrigger>
                </Col>
            ))}
        </>
    );
};

export default ServiceList;










