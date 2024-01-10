import { useEffect, useState } from 'react';
import { ApiClient } from '../../interceptors/axios';
import { Space, Table, Tag, Avatar, Button, Badge, Modal, message } from 'antd';
const Order = () => {

    const columns = [
        {
            title: 'Title',
            // dataIndex: 'title',
            key: 'title',
            render: (record) => {
                return (
                    <div>
                        <Avatar src={record.img} />
                        <span style={{ marginLeft: '10px' }}><strong>{record.title}</strong></span>
                    </div>
                );
            }
        },
        {
            title: 'BuyerID',
            dataIndex: 'buyerId',
            key: 'buyerId'
        },
        {
            title: 'Time',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Status',
            key: 'isCompleted',
            render: (record) => {
                if (record.isCompleted == true) {
                    return (
                        <div>
                            <Button>
                                <Badge status="success" text='Đã Xác Nhận' style={{ width: '100px' }} />
                            </Button>
                            <Button type="primary" style={{ backgroundColor: 'red', marginLeft: '10px', width: '100px' }} data-id={record._id} onClick={showReject}>Huỷ Đơn</Button>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <Button>
                                <Badge status="error" text='Chưa Xác Nhận' style={{ width: '100px' }} />
                            </Button>
                            <Button type="primary" style={{ backgroundColor: 'green', marginLeft: '10px', width: '100px' }} data-id={record._id} onClick={showConfirm}>Xác Nhận</Button>
                        </div>
                    )
                }
            }
        }
    ];

    const [data, setData] = useState();
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        await ApiClient().get('admin/orders').then(res => {
            if (res.status == 200) {
                setData(res.data.orders)
            }
        })
    }
    // set up alert
    const [messageApi, contextHolder] = message.useMessage();
    const success = (data) => {
        messageApi.open({
            type: 'success',
            content: data,
        });
    }
    const error = (data) => {
        messageApi.open({
            type: 'error',
            content: data,
        });
    }
    // set up modal
    const [openConfirm, setOpenConfirm] = useState();
    const [openReject, setOpenReject] = useState();

    // Handle Reject
    const [rID, setRID] = useState();
    const [cID, setCID] = useState();
    const showReject = (event) => {
        const data_rid = event.currentTarget.dataset.id;
        setRID(data_rid);
        setOpenReject(true);
    }
    const handleReject = async () => {
        await ApiClient().post(`admin/update-order/${rID}`, { isCompleted: false }).then(res => {
            if (res.status == 200) {
                setOpenReject(false);
                getData();
                success(res.data.msg)
            } else {
                error(res.data.msg)
            }
        })
    }
    // Handle Confirm
    const showConfirm = (event) => {
        const data_cid = event.currentTarget.dataset.id;
        setCID(data_cid)
        setOpenConfirm(true);
    }
    const handleConfirm = async () => {
        await ApiClient().post(`admin/update-order/${cID}`, { isCompleted: true }).then(res => {
            if (res.status == 200) {
                setOpenConfirm(false);
                getData();
                success(res.data.msg)
            } else {
                error(res.data.msg)
            }
        })
    }


    return (
        <div>
            <div className="alert alert-info">
                {contextHolder}
            </div>
            <Table columns={columns} dataSource={data} />
            <Modal
                title="Xác Nhận Đơn Hàng"
                open={openConfirm}
                onOk={handleConfirm}
                onCancel={handleCancelDel => setOpenConfirm(false)}
                okButtonProps={{ style: { backgroundColor: 'green' } }}
            >
                <p>Đơn hàng sẽ được xác nhận.
                    <br />
                    Bạn có muốn tiếp tục ?</p>
            </Modal>
            <Modal
                title="Huỷ Đơn Hàng"
                open={openReject}
                onOk={handleReject}
                onCancel={handleCancelDel => setOpenReject(false)}
                okButtonProps={{ style: { backgroundColor: 'red' } }}
            >
                <p>Đơn hàng sẽ bị <strong>HUỶ</strong>. Vui lòng kiểm tra kỹ
                    <br />
                    Bạn có muốn tiếp tục ?</p>
            </Modal>
        </div>
    );
}

export default Order;