import React from 'react'
import './index.css';
import Header from '../Shared/Header/Header';
import Footer from '../Shared/Footer/Footer';
import ImageHeading from '../../images/doc/doctor 5.jpg'
import no_doctor_image from '../../images/no_doctor_image.jpg'
import people1 from '../../images/people1.png'
import people2 from '../../images/people2.png'
import people3 from '../../images/people3.png'
import quote from '../../images/quote.svg'
import clock from '../../images/clock.svg'
import phone from '../../images/phone.svg'
import marker from '../../images/marker.svg'
import img from '../../images/logo.png'
import SubHeader from '../Shared/SubHeader';
import { useGetAllBlogsQuery } from '../../redux/api/blogApi';
import { Empty, message } from 'antd';
import { Link } from 'react-router-dom';
import { truncate } from '../../utils/truncate';
import { useGetDoctorsQuery } from '../../redux/api/doctorApi';

const About = () => {
    const { data, isError, isLoading } = useGetAllBlogsQuery({ limit: 4 });
    const { data: doctorData, isLoading: DoctorIsLoading, isError: doctorIsError } = useGetDoctorsQuery({ limit: 4 });

    const blogData = data?.blogs;
    const doctors = doctorData?.doctors;

        const testimonialData = [
            {
                id: 1, 
                name: 'Winson Herry',
                img: people1,
                review: 'It is a long established fact that by the readable content of a lot layout. The point of using Lorem a more-or-less normal distribu to using Content here, content',
                location: 'California'
            },
            {
                id: 2, 
                name: 'Winson Herry',
                img: people2,
                review: 'It is a long established fact that by the readable content of a lot layout. The point of using Lorem a more-or-less normal distribu to using Content here, content',
                location: 'California'
            },
            {
                id: 3, 
                name: 'Winson Herry',
                img: people3,
                review: 'It is a long established fact that by the readable content of a lot layout. The point of using Lorem a more-or-less normal distribu to using Content here, content',
                location: 'California'
            },
        ];

        const openingBoxData = [
            {
                id: 1,
                name: 'Opening Hours',
                description: 'Open 9.00 am to 5.00pm everyday',
                icon: clock,
                bgClass: 'opening-box-gradient'
            },
            {
                id: 2,
                name: 'Our Locations',
                description: 'Open 9.00 am to 5.00pm everyday',
                icon: marker,
                bgClass: 'opening-box-theme'
            },
            {
                id: 3,
                name: 'Contact Us',
                description: 'Open 9.00 am to 5.00pm everyday',
                icon: phone,
                bgClass: 'opening-box-gradient'
            },
        ];

        const Testimonial = ({ review }) => {
            const { name, img, review: userReview, location } = review;
            return (
                <div className='testimonial-card'>
                    <p className='testimonial-review'>{ userReview }</p>
                    <div className='testimonial-footer'>
                        <img className='testimonial-image' src={ img } alt={ name } />
                        <div>
                            <h3 className='testimonial-name'>{ name }</h3>
                            <p className='testimonial-location'>{ location }</p>
                        </div>
                    </div>
                </div>
            );
        };
    
        const OpeningBox = ({ card }) => {
            const { name, description, icon, bgClass } = card;
            return (
                <div className={`opening-box ${bgClass}`}>
                    <img src={icon} alt={name} />
                    <div>
                        <h2 className="opening-box-title">{ name }</h2>
                        <p>{ description }</p>
                    </div>
                </div>
            );
        };

    let doctorContent = null;
    if (!DoctorIsLoading && doctorIsError) doctorContent = <div>Something Went Wrong !</div>
    if (!DoctorIsLoading && !doctorIsError && doctors?.length === 0) doctorContent = <div><Empty /></div>
    if (!DoctorIsLoading && !doctorIsError && doctors?.length > 0) doctorContent =
        <>
            {doctors && doctors.map((item, id) => (
                <div className="col-lg-3 col-md-6 col-sm-6" key={id + item.id}>
                    <div className="card shadow border-0 mb-5 mb-lg-0">
                            {item?.img ? (
                                <img className="img-fluid" alt="" src={item.img} />
                            ) : (
                                <img className="img-fluid" alt="" src={no_doctor_image} /> // or any fallback UI
                            )}
                        <div className="p-2">
                            <h4 className="mt-4 mb-0" style={{ color: '#223a66' }}><a>{item?.firstName + ' ' + item?.lastName}</a></h4>
                            <p>{item?.designation}</p>
                        </div>
                    </div>
                </div>
            ))}
        </>

    let content = null;
    // if (!isLoading && isError) content = <div>{message.error('Something went Wrong!')}</div>
    if (!isLoading && !isError && blogData?.length === 0) content = <Empty />
    if (!isLoading && !isError && blogData?.length > 0) content =
        <>
            {
                blogData && blogData?.map((item, id) => (
                    <div className="col-lg-3 col-md-6" key={id + item.id}>
                        <div className="card shadow border-0 mb-5 mb-lg-0">
                       

                            <img src={item?.img} alt="blog Image" width={300} height={200} className="w-100  rounded-top image-hover" style={{ objectFit: 'contain' }} />

                            <div className='p-2'>
                                <Link to={`/blog/${item?.id}`}>
                                    <h6 className="text-start mb-1 text-capitalize" style={{ color: '#223a66' }}>{truncate(item?.title, 40)}</h6>
                                </Link>
                                <div className="px-2">
                                    <p className="form-text text-start text-capitalize">{truncate(item?.description, 80)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    return (
        <>
            <Header />
            <SubHeader title="about us"/>
            <div className="container" style={{ marginBottom: 100, marginTop: 100 }}>
                <div className="row p-5">
                    <div className="col-lg-4">
                        <div className='section-title text-center'>
                            <h2 className='text-uppercase'>Our Doctors Acheivement</h2>
                            {/* <p className='form-text m-0'>Lorem ipsum dolor sit amet.</p> */}
                        </div>
                        <p className='mt-3'>Our doctors are dedicated to excellence in patient care and have achieved remarkable milestones in their fields. With numerous awards and recognitions, they bring a wealth of experience and expertise to our practice. From pioneering research to community outreach initiatives, our medical team consistently strives to improve patient outcomes and enhance the overall healthcare experience. Their commitment to ongoing education and innovation ensures that our patients receive the highest standard of care.</p>
                    </div>

                    <div className="col-lg-8">

                        <img src={ImageHeading} alt="" className="img-fluid rounded shadow" />
                    </div>
                </div>
            </div>

            {/* <div className="container" style={{ marginBottom: 100, marginTop: 100 }}>
                <div className="row">
                    {content}
                </div>
            </div> */}

            <section className='opening-box-container'>
                <div className='opening-box-grid'>
                    {
                        openingBoxData.map(card => (
                            <OpeningBox key={ card.id } card={ card } />
                        ))
                    }
                </div>
            </section>

            <div className="container" style={{ marginBottom: 100, marginTop: 100 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className='mb-4 section-title text-center'>
                            <h2 className='text-uppercase'>Meet Our Specialist</h2>
                            <p className='form-text m-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, ipsum!</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {doctorContent}

                </div>
            </div>

            <section className='testimonials-container'>
                <div className='testimonials-header'>
                    <div>
                        <h4 className='appointment-title'>Appointment</h4>
                        <h2 className="testimonial-title">What Our Patients Says</h2>
                    </div>
                    <figure>
                        <img className='quote-image' src={quote} alt="Quote" />
                    </figure>
                </div>
                <div className='testimonials-grid'>
                    {
                        testimonialData.map(review => (
                            <Testimonial key={ review.id } review={ review } />
                        ))
                    }
                </div>
            </section>

            <div className="container say-about" style={{ marginBottom: 100, marginTop: 100 }}>
                <div className="row">
                    <div className="col-lg-6 offset-lg-6">
                        <div className='mb-4 section-title text-center'>
                            <h2 className='text-uppercase'>What Doctor's Say</h2>
                            <p className='form-text m-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, ipsum!</p>
                        </div>
                    </div>
                </div>

                <div className="row align-items-center">
                    <div className="col-lg-6 offset-lg-6">
                        <div className="my-2">
                            <h4 style={{ color: '#223a66' }} className='my-0'>Amazing service!</h4>
                            <span>John Partho</span>
                        </div>
                        <p className='form-text'>
                            They provide great service facilty consectetur adipisicing elit. Itaque rem, praesentium, iure, ipsum magnam deleniti a vel eos adipisci suscipit fugit placeat. Quibusdam laboriosam eveniet nostrum nemo commodi numquam quod.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default About