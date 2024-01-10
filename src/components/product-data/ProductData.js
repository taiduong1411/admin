import { Space, Table, Button, Avatar, Modal, message } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { ApiClient } from '../../interceptors/axios';
import AddForm from '../product-data/AddForm';
import { useForm } from 'react-hook-form';
import upload from '../../interceptors/upload';
const ProductData = () => {
    const columns = [
        {
            title: 'Title',
            // dataIndex: 'title',
            key: 'title',
            render: (record) => {
                return (
                    <div>
                        <Avatar src={record.cover} />
                        <span style={{ marginLeft: '10px' }}><strong>{record.title}</strong></span>
                    </div>
                );
            }
        },
        {
            title: 'Cat',
            dataIndex: 'cat',
            key: 'cat'
        },
        {
            title: 'desc',
            dataIndex: 'desc',
            key: 'desc'
        },
        {
            title: 'Feature',
            key: 'features',
            render: (record) => {
                return (
                    <div>
                        {
                            record.features.map((tag, index) => (
                                <div className="tag-item" key={index}>
                                    <span className="text">{tag}</span>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Owner',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record._id} data-title={record.title} onClick={showDelModal}>Delete</Button>
                    <Button type="primary" style={{ backgroundColor: 'green' }} onClick={showUpdateModal} data-id={record._id} >Update</Button>
                </Space>
            ),
        },
    ];
    // SET UP ALERT
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
    // Lay du lieu tu server sau do render ra table
    const [data, setData] = useState(null);
    useEffect(() => {
        getData();
    }, [])
    const getData = async () => {
        await ApiClient().get('admin/all-products').then(res => {
            if (res.status == 200) {
                setData(res.data.allData)
            } else {
                console.log('error');
            }
        })

    }
    // HANDLE ADD MODAL
    const [openAdd, setOpenAdd] = useState(false);
    const showAddModal = () => {
        setOpenAdd(true)
    }
    const addProps = (data) => {
        setOpenAdd(false);
        getData();
        return data.status == 200 ? success(data.msg) : error(data.msg);
    }
    // Handle Delete Modal
    const [openDel, setOpenDel] = useState(false);
    const [title, setTitle] = useState();
    const [_id, setID] = useState();
    const showDelModal = async (event) => {
        const title = event.currentTarget.dataset.title;
        const data_id = event.currentTarget.dataset.id;
        setTitle(title);
        setID(data_id);
        setOpenDel(true);
    }
    const delProduct = async (_id) => {
        await ApiClient().del(`admin/delete-product/${_id}`).then(res => {
            if (res.status == 200) {
                setOpenDel(false);
                getData();
                success(res.data.msg);
            } else {
                error(res.data.msg);
            }
        })
    }
    // Handle Update Modal
    const [openUpdate, setOpenUpdate] = useState(false);
    const [proData, setProData] = useState([]);
    const { register, handleSubmit } = useForm();
    const [singleFile, setSingleFile] = useState(undefined);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [urlCover, setUrlCover] = useState();
    const [urlImages, setUrlImages] = useState([]);
    const [pID, setPID] = useState();
    const inputRef = useRef(null);
    const [features, setFeatures] = useState([]);
    const [dataSellers, setDataSellers] = useState([]);
    const [dataCat, setDataCat] = useState();
    const [dataIdSeller, setDataIdSeller] = useState();
    const addFeature = (e) => {
        const value = inputRef.current.value;
        if (value.length < 1) return
        // Add the value to the tags array
        setFeatures([...features, value])
        // Clear the input
        inputRef.current.value = ''
    }
    const removeFeature = (index) => {
        setFeatures(features.filter((el, i) => i !== index))
    }
    const handleUpload = async () => {

        setUploading(true);
        try {
            const cover = await upload(singleFile);
            const images = await Promise.all(
                [...files].map(async (file) => {
                    const url = await upload(file);
                    return url;
                })
            );
            setUrlImages(images);
            setUrlCover(cover);
            setUploading(false);
        } catch (err) {
            console.log(err);
        }
    };
    const handleUpdateCancel = async () => {
        await setProData([]);
        setOpenUpdate(false);
    }
    const showUpdateModal = async (event) => {
        setOpenUpdate(true);
        const data_id = event.currentTarget.dataset.id;
        setPID(data_id);
        await ApiClient().get('admin/all-sellers').then(res => {
            // console.log(res.data.sellers);
            setDataSellers(res.data.sellers);
        })
        await ApiClient().get(`admin/product/${data_id}`).then(res => {
            if (res.status == 200) {
                setProData(res.data.data);
                setDataCat(res.data.data.cat);
                setDataIdSeller(res.data.data.userId);
            } else {
                error(res.data.msg);
            }
        })
    }
    const onUpdateSubmit = async (data) => {
        const allData = {
            title: data.title ? data.title : proData.title,
            shortTitle: data.shortTitle ? data.shortTitle : proData.shortTitle,
            shortDesc: data.shortDesc ? data.shortDesc : proData.shortDesc,
            cover: urlCover ? urlCover : proData.cover,
            images: urlImages ? urlImages : proData.images,
            price: data.price ? data.price : proData.price,
            deliveryTime: data.deliveryTime ? data.deliveryTime : proData.deliveryTime,
            revisionNumber: data.revisionNumber ? data.revisionNumber : proData.revisionNumber,
            cat: data.cat ? data.cat : proData.cat,
            desc: data.desc ? data.desc : proData.desc,
            features: data.features ? data.addFeature : features,
            sellerId: data.sellerId ? data.sellerId : proData.userId
        }
        await ApiClient().post(`admin/update-gig/${proData._id}`, allData).then(res => {
            if (res.status == 200) {
                success(res.data.msg)
                handleUpdateCancel();
                getData();
            } else {
                // updateProps({ status: res.status, msg: res.data.msg });
                error(res.data.msg)
            }
        })
    }
    return (
        <div>
            <div className="alert alert-info">
                {contextHolder}
            </div>
            <div style={{ margin: '20px 20px 20px 0', float: 'right' }}>
                <span style={{ marginRight: '1110px', fontSize: '40px', fontWeight: 'bold' }}>Sản phẩm</span>
                <Button
                    style={{ background: 'green', color: 'white' }}
                    onClick={showAddModal}
                >
                    Add New Product
                </Button>
            </div>
            <div>
                <Table columns={columns} dataSource={data} />
            </div>
            <Modal
                open={openAdd}
                okButtonProps={{ style: { display: 'none' } }}
                onCancel={() => setOpenAdd(false)}
                width={1200}
            >
                <AddForm addProps={addProps} />
            </Modal>
            <Modal
                title="Xoá Tài Khoản"
                open={openDel}
                onOk={handleOkDel => { setOpenDel(false); delProduct(_id) }}
                onCancel={handleCancelDel => setOpenDel(false)}
                okButtonProps={{ style: { backgroundColor: 'red' } }}
            >
                <p>Sản Phẩm <strong>{title}</strong> bị xoá vĩnh viễn.
                    <br />
                    Bạn có muốn tiếp tục ?</p>
            </Modal>
            <Modal
                open={openUpdate}
                okButtonProps={{ style: { display: 'none' } }}
                onCancel={handleUpdateCancel}
                width={1200}
            >
                <div>
                    <form onSubmit={handleSubmit(onUpdateSubmit)}>
                        <div>
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu Đề</label>
                            <input type="text" {...register('title')} defaultValue={proData.title} placeholder="Enter Title" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label htmlFor="shortTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu Đề Dịch Vụ</label>
                            <input type="text" {...register('shortTitle')} defaultValue={proData.shortTitle} placeholder="Enter Email" name="shortTitle" id="shortTitle" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label htmlFor="cat" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hạng Mục</label>
                            <select name="cat" {...register('cat')} id="cat" value={dataCat} onChange={(e) => setDataCat(e.target.value)}>
                                <option value="null">Hãy chọn một mục Category</option>
                                <option value="2dgraphic">Đồ họa 2D</option>
                                <option value="3dgraphic">Đồ họa 3D</option>
                                <option value="photography">Photography</option>
                                <option value="UXUI">UX/UI graphic</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="sellerID" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Seller So Huu</label>
                            <select name="cat" {...register('sellerId')} id="sellerId" value={dataIdSeller} onChange={(e) => setDataIdSeller(e.target.value)}>
                                <option value="null">Hãy chọn một mục</option>
                                {dataSellers.map((dataSeller) => (
                                    <option value={dataSeller._id}>{dataSeller.username}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô Tả</label>
                            <textarea
                                name="desc"
                                {...register('desc')}
                                id=""
                                cols="100"
                                rows="5"
                                defaultValue={proData.desc}
                                placeholder="Tôi sẽ làm điều gì đó thật tốt"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô Tả Rút Gọn</label>
                            <textarea
                                name="shortDesc"
                                {...register('shortDesc')}
                                id=""
                                cols="100"
                                rows="5"
                                defaultValue={proData.shortDesc}
                                placeholder="Một mô tả ngắn cho sản phẩm"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="deliveryTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thời Gian Giao Dịch</label>
                            <input type="number" {...register('deliveryTime')} defaultValue={proData.deliveryTime} placeholder="Enter DeliverTime" name="deliveryTime" id="deliveryTime" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label htmlFor="revisionNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Sửa Đổi</label>
                            <input type="number" {...register('revisionNumber')} defaultValue={proData.revisionNumber} placeholder="Enter Revision Number" name="revisionNumber" id="revisionNumber" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label htmlFor="feature" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Feature</label>
                            <input style={{ width: '90%' }} ref={inputRef} type="text" placeholder="Enter Feature" name="feature" id="feature" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            <span style={{ backgroundColor: 'green', color: 'white' }} onClick={addFeature}>Add</span>
                        </div>
                        {features.map((tag, index) => (
                            <div className="tag-item" key={index}>
                                <span className="text">{tag}</span>
                                <span className="close" onClick={() => removeFeature(index)}>&times;</span>
                            </div>
                        ))}
                        <div>
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giá Tiền</label>
                            <input type="number" {...register('price')} defaultValue={proData.price} placeholder="Enter price" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <div style={{ margin: '10px 0px 10px 0px' }}>
                                <label htmlFor="">Ảnh Bìa</label>
                                <br />
                                <input
                                    type="file"
                                    onChange={(e) => setSingleFile(e.target.files[0])}
                                />
                            </div>
                            <div style={{ margin: '10px 0px 10px 0px' }}>
                                <label htmlFor="">Ảnh Sản Phẩm</label>
                                <br />
                                <input
                                    type="file" multiple
                                    onChange={(e) => setFiles(e.target.files)}
                                />
                            </div>
                            <img style={{ margin: '10px 0px 10px 0px' }} src={proData.cover} alt="abc" width={100} height={100} />
                            <span
                                style={{ padding: '5px', border: '1px solid green', textAlign: 'center', backgroundColor: 'green', color: 'white', borderRadius: '7px' }}
                                onClick={handleUpload}
                            >
                                {uploading ? "Đang tải" : "Tải lên"}
                            </span>
                        </div>
                        <button type="submit" className={"w-full text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800"}>Submit</button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default ProductData;