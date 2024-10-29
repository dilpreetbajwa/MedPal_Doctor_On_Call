import React, { useEffect } from 'react';
import moment from 'moment';
import img from '../../../images/avatar.jpg';
import { Link } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './BookingCheckout.css';

const CheckoutPage = ({ handleChange, selectValue, isCheck, setIsChecked, data, selectedDate, selectTime , onPaymentSuccess}) => {
    const { nameOnCard } = selectValue;
    const stripe = useStripe();
    const elements = useElements();

    const handleCheck = async () => {
        setIsChecked(!isCheck);

        // If the checkbox is being checked
        if (!isCheck) {
            await handlePayment();
        }
    };

    let price = data?.price ? data.price : 60;
    let doctorImg = data?.img ? data?.img : img;

    const vat = (15 / 100) * Number(price);
    const totalAmount = Number(price) + 10 + vat;

    const handlePayment = async () => {
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error);
            // Handle error (e.g., show error message to the user)
        } else {
            // Send paymentMethod.id and any additional info to your server for processing
            console.log('Payment Method:', paymentMethod);
            // Call your server to process the payment with the paymentMethod.id
            onPaymentSuccess({
                paymentMethodId: paymentMethod.id, // Include additional payment info if needed
                paymentTypedata:paymentMethod.type,
                expiredMonthdata:paymentMethod.card.exp_month,
                cardExpiredYeardata:paymentMethod.card.exp_year,

            });
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-7">
                    <div className="rounded p-3" style={{ background: "#f8f9fa" }}>
                        <form>
                            <div className='row'>
                                <div className="col-md-6 mb-2">
                                </div>
                                <div className="col-md-6 mb-2">
                                    {/* Additional payment method selection could go here */}
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group card-label mb-3">
                                        <label htmlFor="card_name">Name on Card</label>
                                        <input className="form-control" id="card_name" value={nameOnCard} type="text" onChange={(e) => handleChange(e)} name='nameOnCard' />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group card-label mb-3">
                                        <label htmlFor="card_number">Card Number</label>
                                        <CardElement className="form-control" />
                                    </div>
                                </div>
                                {/* Terms acceptance */}
                                <div className="terms-accept">
                                    <div className="custom-checkbox">
                                        <input
                                            type="checkbox"
                                            id="terms_accept"
                                            className='me-2'
                                            checked={isCheck}
                                            onChange={handleCheck} />
                                        <label htmlFor="terms_accept">
                                            I have read and accept <a className='text-primary' style={{ cursor: 'pointer', textDecoration: 'none' }}>Terms &amp; Conditions</a>
                                        </label>
                                    </div>
                                </div>
                                {/* Remove the Pay Now button */}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-5 col-sm-12">
                    <div className="rounded p-3" style={{ background: "#f8f9fa" }}>
                        {data && <Link to={`/doctors/profile/${data?.id}`} className="booking-doc-img d-flex justify-content-center mb-2">
                            <img src={doctorImg} alt="" />
                        </Link>}
                        {data && <div className='doc-title-info mt-3 mb-3'>
                            <h5 className='mt-3 text-center' style={{
                                fontSize: "22px", fontWeight: 700,
                            }}>Dr. {data?.firstName + ' ' + data?.lastName}</h5>
                            <div className='text-center'>
                                <p className='form-text mb-0'>{data?.designation}</p>
                                <p className='form-text mb-0'>{data?.clinicAddress}</p>
                            </div>
                        </div>}

                        <div className="booking-item-wrap">
                            <ul className="booking-date">
                                <li>Date <span>{moment(selectedDate).format('LL')}</span></li>
                                <li>Time <span>{selectTime}</span></li>
                            </ul>
                            <ul className="booking-fee">
                                <li>Consulting Fee <span>${price}</span></li>
                                <li>Booking Fee <span>$10</span></li>
                                <li>Vat (Including 15%) <span>${vat.toFixed(2)}</span></li>
                            </ul>

                            <ul className="booking-total">
                                <li className='d-flex justify-content-between'>
                                    <span className='fw-bold'>Total</span>
                                    <span className="total-cost" style={{ color: '#1977cc' }}>${totalAmount.toFixed(2)}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;