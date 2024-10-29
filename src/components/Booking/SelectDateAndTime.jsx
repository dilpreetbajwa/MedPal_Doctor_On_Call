import moment from 'moment'
import { DatePicker } from 'antd';
import select_date_first from '../../images/select_date_first.jpg'

const SelectDateAndTime = ({ content, handleDateChange, disabledDateTime, selectedDate, dContent, selectTime }) => {
    return (
        <div style={{ marginTop: '5rem'}}>
            <div>
                <h5 className='text-title'>Selected Doctor</h5>
                {content}
            </div>

            <dir className="row">
                <div className="col-md-5 col-sm-12 mt-3">
                    <h5 className='text-title mb-3'>Please Select Date</h5>
                    <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={disabledDateTime}
                        onChange={handleDateChange}
                        style={{
                            height: "auto",
                            width: "300px",
                            cursor: "pointer",
                            fontSize: "17px",
                            margin: "10px",
                            padding: "10px",
                            borderBlockColor:'blue',
                          }}
                    />
                </div>

                <div className="col-md-7 col-sm-12 mt-3">
                    {selectedDate && <h5 className='text-title mb-3'>Selected Date: {selectedDate && moment(selectedDate).format('LL')}
                        {selectTime && 'Time :' + selectTime} </h5> 
                    }
                    {
                        !selectedDate ? (
                            <>
                                <div className="row text-center mt-3">
                                    <h5 className='text-title d-flex justify-content-center align-items-center mt-5'>
                                        Please Select A Date First
                                    </h5>
                                    <img src={select_date_first} alt=""/>
                                </div>
                            </>
                        ) : (
                            
                            <div className="date-card rounded">
                                <div className="row text-center mt-3">
                                    {dContent}
                                </div>
                            </div>
                        )
                    }
                </div>
            </dir>
        </div>
    )
}

export default SelectDateAndTime;