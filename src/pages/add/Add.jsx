import React, { useReducer, useState } from 'react'
import "./Add.scss"
import { INITIAL_STATE, gigReducer } from '../../reducers/gigReducer'
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const add = () => { 
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) =>{
    dispatch({
      type:"CHANGE_INPUT", 
      payload:{name: e.target.name, value: e.target.value},
    });
  };
  const handleFeature = (e) =>{
    e.preventDefault(); //ngăn ko cho refresh lại page
    dispatch({
      type:"ADD_FEATURE", 
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

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
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["myGigs"])
    }
  });

  const handleSubmit = (e)=>{ //để khi bấm vào thêm sản phẩm thì các data sẽ bắn lên trên database
    e.preventDefault();
    mutation.mutate(state);
    navigate("/mygigs") //sau khi thêm sẽ điều hướng về trang sản phẩm của tôi
  }

  return (
    <div className='add'>
      <div className="container">
        <h1>THÊM SẢN PHẨM MỚI</h1>
        <div className="sections">
          <div className="left">
            <label htmlFor="">Tiêu đề</label>
            <input 
              type="text" 
              name="title"
              placeholder="Tôi sẽ làm điều gì đó thật tốt" 
              onChange={handleChange}
            /> 
            <label htmlFor="">Hạng mục</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="null">Hãy chọn một mục Category</option>
              <option value="2dgraphic">Đồ họa 2D</option>
              <option value="3dgraphic">Đồ họa 3D</option> 
              <option value="photography">Photography</option> 
              <option value="UXUI">UX/UI graphic</option>
            </select> 

            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Hình bìa</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Thêm ảnh chi tiết</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "Đang tải" : "Tải lên"}
              </button>
            </div>

            <label htmlFor="">Mô tả</label>
            <textarea 
              name="desc" 
              id="" 
              cols="30" 
              rows="16" 
              placeholder="Tôi sẽ làm điều gì đó thật tốt"
              onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>TẠO</button>
          </div>
          <div className="right">
            <label htmlFor="">Tiêu đề dịch vụ</label>
            <input type="text" name="shortTitle" placeholder="Ví dụ: Một sản phẩm đồ họa" onChange={handleChange} />
            <label htmlFor="">Mô tả rút gọn</label>
            <textarea 
              name="shortDesc" 
              onChange={handleChange}
              id="" 
              cols="30" 
              rows="10" 
              placeholder="Một mô tả ngắn cho sản phẩm"
            ></textarea>
            <label htmlFor="">Thời gian giao dịch (e.g 3 ngày)</label>
            <input type="number" name="deliverTime" onChange={handleChange} />
            <label htmlFor="">Số sửa đổi</label>
            <input type="number" name="revisionNumber" onChange={handleChange} />
            <label htmlFor="">Thêm mục</label>
            <form action="" className="add" onSubmit={handleFeature}>
            <input type="text" placeholder="Ví dụ: Đồ họa 2D"/>
            <button type="submit">Thêm</button>
            </form> 
            <div className="addedFeatures">
              {state?.features?.map(f=>(
              <div className="item" key={f}> 
                <button onClick={() =>
                  dispatch({type:"REMOVE_FEATURE",payload: f })
                  }
                >
                  {f}
                  <span>X</span> 
                </button>
              </div>
              ))}
            </div>
            <label htmlFor="">Giá tiền</label>
            <input type="number" onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default add; //khi ấn vào button X thì sẽ xóa feature bằng remove feature