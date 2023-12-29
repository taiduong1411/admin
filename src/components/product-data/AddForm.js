import { useForm } from 'react-hook-form';
import { ApiClient } from '../../interceptors/axios';
// import DataAlert from '../alert/DataAlert';
import { useState, useRef } from 'react';
import upload from '../../interceptors/upload';
const AddForm = ({ addProps }) => {
    const { register, handleSubmit } = useForm();
    const [singleFile, setSingleFile] = useState(undefined);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    // const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
    const [urlCover, setUrlCover] = useState();
    const [urlImages, setUrlImages] = useState();
    const inputRef = useRef(null);
    const [features, setFeatures] = useState([]);
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
    const onAddSubmit = async (data) => {
        const allData = {
            ...data,
            cover: urlCover,
            images: urlImages,
            features: features
        }

        await ApiClient().post('admin/create-gig', allData).then(res => {
            if (res.status == 200) {
                addProps({ status: res.status, msg: res.data.msg });
            } else {
                addProps({ status: res.status, msg: res.data.msg });
            }
        })
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
    return (
        <div>
            <form onSubmit={handleSubmit(onAddSubmit)}>
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu Đề</label>
                    <input type="text" {...register('title')} placeholder="Enter Title" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                <div>
                    <label htmlFor="shortTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu Đề Dịch Vụ</label>
                    <input type="text" {...register('shortTitle')} placeholder="Enter Email" name="shortTitle" id="shortTitle" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                <div>
                    <label htmlFor="cat" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hạng Mục</label>
                    <select name="cat" {...register('cat')} id="cat">
                        <option value="null">Hãy chọn một mục Category</option>
                        <option value="2dgraphic">Đồ họa 2D</option>
                        <option value="3dgraphic">Đồ họa 3D</option>
                        <option value="photography">Photography</option>
                        <option value="UXUI">UX/UI graphic</option>
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
                        placeholder="Một mô tả ngắn cho sản phẩm"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="deliveryTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Thời Gian Giao Dịch</label>
                    <input type="number" {...register('deliveryTime')} placeholder="Enter DeliverTime" name="deliveryTime" id="deliveryTime" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                <div>
                    <label htmlFor="revisionNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Sửa Đổi</label>
                    <input type="number" {...register('revisionNumber')} placeholder="Enter Revision Number" name="revisionNumber" id="revisionNumber" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
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
                    <input type="number" {...register('price')} placeholder="Enter price" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
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
                    <span
                        style={{ border: '1px solid green', padding: '5px 5px 5px 5px', textAlign: 'center', backgroundColor: 'green', color: 'white', borderRadius: '7px' }}
                        onClick={handleUpload}

                    >
                        {uploading ? "Đang tải" : "Tải lên"}
                    </span>
                </div>
                <button type="submit" className={"w-full text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800"}>Submit</button>
            </form>

        </div>
    )
}
export default AddForm;