const createError = (status,message) =>{
    const err = new Error(); //nếu tk ko tồn tại thì nó sẽ hiện trạng thái 404 ko tìm thấy ng dùng
        err.status = status;
        err.message = message;

        return err
};

export default createError;
