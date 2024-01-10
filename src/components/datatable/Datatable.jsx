import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { ApiClient } from "../../interceptors/axios";
import { Space, Table, Button, Modal, Alert, message, Avatar } from 'antd';
import upload from '../../interceptors/upload';


const Datatable = () => {
  // Setup Table
  const columns = [
    {
      title: 'User Name',
      // dataIndex: 'username',
      key: 'username',
      render: (record) => {
        return (
          <div>
            <Avatar src={record.img} />
            <span style={{ marginLeft: '10px' }}><strong>{record.username}</strong></span>
          </div>
        );
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Type',
      key: 'isSeller',
      render: (record) => {
        if (record.isSeller == true) {
          return (
            <Button style={{ backgroundColor: 'blue', color: 'white' }}>Seller</Button>
          )
        } else {
          return (
            <Button style={{ backgroundColor: 'green', color: 'white' }}>Buyer</Button>
          )
        }
      }
    },
    {
      title: 'Action',
      key: 'Action',
      render: (record) => (
        <Space size="middle">
          <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record._id} data-username={record.email} onClick={showModalDel}>Delete</Button>
          <Button type="primary" style={{ backgroundColor: 'green' }} data-id={record._id} onClick={showModalUpdate}>Update</Button>
        </Space>
      ),
    },
  ];
  // alert setup
  const [messageApi, contextHolder] = message.useMessage();
  const success = (msg) => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
  };
  const error = (msg) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };
  // Get data from Server
  const [data, setData] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    await ApiClient().get('admin/all-users').then(res => {
      if (res.status == 200) {
        setData(res.data.users);
      }
    })
  }

  // Handle Modal Click Button Add New
  const { register, handleSubmit } = useForm();

  // Setup Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleAddCancel = () => {
    setIsModalOpen(false);
  };

  // Handle Add Submit Form
  const [singleFile, setSingleFile] = useState(undefined);
  const onSubmit = async (data) => {
    try {
      const url = await upload(singleFile);
      const allData = {
        username: data['username'],
        email: data['email'],
        phone: data['phone'],
        password: data['password'],
        isSeller: data['level'] == 'isSeller' ? true : false,
        desc: data['desc'],
        country: data['country'],
        img: url
      }
      // console.log(allData);
      await ApiClient().post('admin/create-user', allData).then(res => {
        if (res.status == 200) {
          handleAddCancel();
          success(res.data.msg);
          getData();
        } else {
          error(res.data.msg);
        }
      })
    } catch (err) {
      console.log(err);
    }
  }
  // Handle Delete
  const [openDel, setOpenDel] = useState(false);
  const [email, setEmail] = useState();
  const [_id, setId] = useState();
  const showModalDel = (event) => {
    const emailText = event.currentTarget.dataset.username;
    const data_id = event.currentTarget.dataset.id;
    setEmail(emailText);
    setId(data_id);
    setOpenDel(true);
  };
  const handleOkDel = () => {
    setOpenDel(false);
    deleteAccount(_id);
  };
  const deleteAccount = async (_id) => {
    await ApiClient().del(`admin/delete-account/${_id}`).then(res => {
      if (res.status == 200) {
        success(res.data.msg);
        getData();
      } else {
        error(res.data.msg);
      }
    })
  }
  const handleCancelDel = () => {
    setOpenDel(false);
  };

  // Handle Update
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [userId, setUserId] = useState();
  const showModalUpdate = async (event) => {
    setOpenUpdate(true);
    const data_id = event.currentTarget.dataset.id;
    setUserId(data_id)
    await ApiClient().get(`admin/get-user/${data_id}`).then(res => {
      if (res.status == 200) {
        setDataUser(res.data.user);
      } else {
        setOpenUpdate(false);
      }
    })
  }
  const handleUpdateCancel = async () => {
    setDataUser([]);
    setOpenUpdate(false);
  }
  const onUpdateSubmit = async (data) => {
    try {
      const url = await upload(singleFile);
      const allData = {
        username: data['username'] ? data['username'] : dataUser.username,
        email: data['email'] ? data['email'] : dataUser.email,
        phone: data['phone'] ? data['phone'] : dataUser.phone,
        password: data['password'] ? data['password'] : dataUser.password,
        isSeller: data['level'] == 'isSeller' ? true : false,
        desc: data['desc'] ? data['desc'] : dataUser.desc,
        country: data['country'] ? data['country'] : dataUser.country,
        img: url ? url : dataUser.img,
      }
      // console.log(allData);
      await ApiClient().post(`admin/update-user/${userId}`, allData).then(res => {
        if (res.status == 200) {
          handleUpdateCancel();
          success(res.data.msg);
          getData();
        } else {
          handleUpdateCancel();
          error(res.data.msg);
        }
      })
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Người dùng
        <Button
          className="link"
          onClick={showModal}
        >
          Add New
        </Button>
      </div>
      {/* Table */}
      <Table columns={columns} dataSource={data} onCancel={handleAddCancel} />

      {/* MODAL ADD */}
      <Modal open={isModalOpen} onCancel={handleAddCancel} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}>
        <form className="space-y-4 md:space-y-6 mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">User Name</label>
            <input type="text" {...register("username")} name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
            <input type="email" {...register("email")} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phone</label>
            <input type="text" {...register("phone")} name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
            <input type="password" {...register("password")} name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="level" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phân Quyền</label>
            <select name="cat" {...register('level')} id="level">
              <option value="null">Hãy chọn một mục</option>
              <option value="isSeller">Người Bán</option>
              <option value="isBuyer">Người Mua</option>
            </select>
          </div>
          <div>
            <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Country</label>
            <input {...register('country')} type="text" id="country" name="country" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Description</label>
            <input {...register('desc')} type="text" id="desc" name="desc" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="img" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Image</label>
            <input type="file" onChange={(e) => setSingleFile(e.target.files[0])} />
          </div>
          <button type="submit" className={"w-full text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800"}>Submit</button>
        </form>
      </Modal>
      {/* MODAL DELETE */}
      <Modal
        title="Xoá Tài Khoản"
        open={openDel}
        onOk={handleOkDel}
        onCancel={handleCancelDel}
        okButtonProps={{ style: { backgroundColor: 'red' } }}
      >
        <p>Tài khoản <strong>{email}</strong> bị xoá vĩnh viễn.
          <br />
          Bạn có muốn tiếp tục ?</p>
      </Modal>
      {/* MODAL UPDATE */}
      <Modal open={openUpdate} onCancel={handleUpdateCancel} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}>
        <form className="space-y-4 md:space-y-6 mt-4" onSubmit={handleSubmit(onUpdateSubmit)}>
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">User Name</label>
            <input type="text" {...register("username")} defaultValue={dataUser.username} name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
            <input type="email" {...register("email")} defaultValue={dataUser.email} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phone</label>
            <input type="text" {...register("phone")} defaultValue={dataUser.phone} name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
            <input type="password" {...register("password")} name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="level" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phân Quyền</label>
            <select name="cat" {...register('level')} id="level">
              <option value="null">Hãy chọn một mục</option>
              <option value="isSeller">Người Bán</option>
              <option value="isBuyer">Người Mua</option>
            </select>
          </div>

          <div>
            <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Country</label>
            <input {...register('country')} type="text" defaultValue={dataUser.country} id="country" name="country" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Description</label>
            <input {...register('desc')} type="text" defaultValue={dataUser.desc} id="desc" name="desc" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
          </div>
          <div>
            <label htmlFor="img" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Image</label>
            <input type="file" onChange={(e) => setSingleFile(e.target.files[0])} />
            <img src={dataUser.img} alt="abc" width={50} height={50} />
          </div>
          <button type="submit" className={"w-full text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800"}>Submit</button>
        </form>
      </Modal>
      {/* ALERT */}
      {contextHolder}
      <Space>
        <Button style={{ display: "none" }} onClick={success}>Success</Button>
        <Button style={{ display: "none" }} onClick={error}>Error</Button>
      </Space>
    </div>
  );
};

export default Datatable;
