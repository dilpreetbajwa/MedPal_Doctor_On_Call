import DashboardLayout from "../DashboardLayout/DashboardLayout";
import React, { useEffect, useState } from "react";
import { Space, Tag, Button, Empty, message } from "antd";
import {
  useCreateTimeSlotMutation,
  useGetDoctorTimeSlotQuery,
  useUpdateTimeSlotMutation,
} from "../../../redux/api/timeSlotApi";
import { FaWindowClose, FaPlus } from "react-icons/fa";
import UseModal from "../../UI/UseModal";
import TimePicer from "../../UI/form/TimePicer";
import TabForm from "../../UI/form/TabForm";

const Schedule = () => {
  const [key, setKey] = useState("sunday");
  const [timeSlot, setTimeSlot] = useState([]);
  const [editTimeSlot, setEditTimeSlot] = useState([]);
  const [addTimeSlot, setAddTimeSlot] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [
    UpdateTimeSlot,
    {
      isError: uIsError,
      error: uError,
      isLoading: UIsLoading,
      isSuccess: uIsSuccess,
    },
  ] = useUpdateTimeSlotMutation();
  const { data, refetch, isLoading, isError } = useGetDoctorTimeSlotQuery({
    day: key,
  });

  const [
    createTimeSlot,
    { isError: AIsError, error, isLoading: AIsLoading, isSuccess },
  ] = useCreateTimeSlotMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOnSelect = (value) => {
    setKey(value);
    refetch();
  };

  //  edit tikme slot helper functions
  const showEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
    setEditTimeSlot(timeSlot);
  };

  const handleEditOk = () => {
    const timeSlot = editTimeSlot?.map((item) => {
      const { id, ...rest } = item;
      return rest;
    });

    const data = {
      id: currentId,
      day: key,
      timeSlot: timeSlot,
    };
    setEditTimeSlot([]);
    UpdateTimeSlot({ data });
    setIsEditModalOpen(UIsLoading ? true : false);
  };

  useEffect(() => {
    if (!UIsLoading && uIsError) {
      message.error(uError?.data?.message);
    }
    if (uIsSuccess) {
      message.success("Successfully Slot Updated");
    }
  }, [uIsSuccess, uIsError, UIsLoading, uError?.data?.message]);

  const handleEditCancel = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleEditStartTime = (id, time, timeString) => {
    setEditTimeSlot((prev) =>
      prev.map((item) => {
        return item._id === id ? { ...item, startTime: timeString } : item;
      })
    );
  };

  const handleEditEndTime = (id, time, timeString) => {
    setEditTimeSlot((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, endTime: timeString } : item
      )
    );
  };

  //  add new slot helper function

  const showModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOk = () => {
    const timeSlot = addTimeSlot?.map((item) => {
      const { id, ...rest } = item;
      return rest;
    });
    const data = {
      day: key,
      timeSlot: timeSlot,
    };
    createTimeSlot({ data });
    setIsModalOpen(AIsLoading ? true : false);
  };
  useEffect(() => {
    if (!AIsLoading && AIsError) {
      message.error(error?.data?.message);
    }
    if (isSuccess) {
      message.success("Successfully Add Time Slots");
    }
  }, [isSuccess, AIsError, error?.data?.message, AIsLoading, data]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleStartTime = (id, time, timeString) => {
    setAddTimeSlot((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, startTime: timeString } : item
      )
    );
  };

  const handleEndTime = (id, time, timeString) => {
    setAddTimeSlot((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, endTime: timeString } : item
      )
    );
  };

  useEffect(() => {
    if (data && data[0]?._id) {
      setTimeSlot(data[0].timeSlot);
      setCurrentId(data[0]?._id);
    }
  }, [data]);

  const remove = (id) => {
    setEditTimeSlot(editTimeSlot.filter((item) => item._id !== id));
  };
  const addField = (e) => {
    const newId = timeSlot.length + 1;
    setTimeSlot([...timeSlot, { _id: newId }]);
    setEditTimeSlot([...editTimeSlot, { _id: newId }]);
    e.preventDefault();
  };

  const removeFromAddTimeSlot = (id) => {
    setAddTimeSlot(addTimeSlot.filter((item) => item.id !== id));
  };
  const addInAddTimeSlot = (e) => {
    const newId = addTimeSlot.length + 1;
    setAddTimeSlot([...addTimeSlot, { id: newId }]);
    e.preventDefault();
  };

  let content = null;
  if (!isLoading && isError) content = <div>Something Went Wrong !</div>;
  if (!isLoading && !isError && data?.length === 0) content = <Empty />;
  if (!isLoading && !isError && data?.length > 0)
    content = (
      <>
        {data &&
          data.map((item, index) => (
            <div key={item.id + index}>
              <div>
                {item?.maximumPatient && (
                  <h6>Maximum Patient Limit : {item?.maximumPatient}</h6>
                )}
              </div>
              <Space size={[0, "small"]} wrap>
                {item?.timeSlot &&
                  item?.timeSlot.map((time, index) => (
                    <Tag
                      bordered={false}
                      closable
                      color="processing"
                      key={index + 2}
                    >
                      {time?.startTime} - {time?.endTime}
                    </Tag>
                  ))}
              </Space>
            </div>
          ))}
      </>
    );
  return (
    <>
      <DashboardLayout>
        <div
          className="w-100 mb-3 rounded p-3"
          style={{ background: "#f8f9fa", height: "90vh" }}
        >
          <h5 className="text-title">Schedule Timings</h5>
          <TabForm
            content={content}
            data={data}
            handleOnSelect={handleOnSelect}
            showEditModal={showEditModal}
            showModal={showModal}
          />
        </div>
      </DashboardLayout>

      {/* Edit time slot modal */}
      <UseModal
        title="Edit Time Slots"
        isModaOpen={isEditModalOpen}
        handleOk={handleEditOk}
        handleCancel={handleEditCancel}
        // timeSlot={timeSlot}
      >
        <form>
          <div className="hours-info">
            <div className="row form-row hours-cont">
              {editTimeSlot &&
                editTimeSlot?.map((item, index) => (
                  <div
                    className="col-12 col-md-10 d-flex align-items-center justify-content-between"
                    key={index + item._id}
                  >
                    <div className="row form-row">
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label>Start Time</label>
                          <TimePicer
                            handleFunction={handleEditStartTime}
                            time={item.startTime}
                            id={item._id}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label>End Time</label>
                          <TimePicer
                            handleFunction={handleEditEndTime}
                            time={item.endTime}
                            id={item._id}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      htmlType="submit"
                      onClick={() => remove(item?._id)}
                      block
                      icon={<FaWindowClose />}
                    ></Button>
                  </div>
                ))}
            </div>
          </div>

          <div className=" my-2 w-25">
            <Button
              type="primary"
              size="small"
              htmlType="submit"
              onClick={(e) => addField(e)}
              block
              icon={<FaPlus />}
            >
              Add More
            </Button>
          </div>
        </form>
      </UseModal>

      {/* Add time slot */}
      <UseModal
        title="Add Time Slots"
        isModaOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      >
        <form>
          <div className="hours-info">
            <div className="row form-row hours-cont">
              {addTimeSlot &&
                addTimeSlot?.map((item, index) => (
                  <div
                    className="col-12 col-md-10 d-flex align-items-center justify-content-between"
                    key={index + 100}
                  >
                    <div className="row form-row">
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label>Start Time</label>
                          <TimePicer
                            handleFunction={handleStartTime}
                            time={item.startTime}
                            id={item.id}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label>End Time</label>
                          <TimePicer
                            handleFunction={handleEndTime}
                            time={item.endTime}
                            id={item.id}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      htmlType="submit"
                      onClick={() => removeFromAddTimeSlot(item?.id)}
                      block
                      icon={<FaWindowClose />}
                    ></Button>
                  </div>
                ))}
            </div>
          </div>

          <div className=" my-2 w-25">
            <Button
              type="primary"
              size="small"
              htmlType="submit"
              onClick={(e) => addInAddTimeSlot(e)}
              block
              icon={<FaPlus />}
            >
              Add More
            </Button>
          </div>
        </form>
      </UseModal>
    </>
  );
};
export default Schedule;
