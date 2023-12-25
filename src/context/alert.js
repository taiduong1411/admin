import React from 'react';
import { Button, message, Space } from 'antd';
const Alert = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Success',
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Error',
        });
    };
    return (
        <>
            {contextHolder}
            <Space>
                <Button onClick={success}>Success</Button>
                <Button onClick={error}>Error</Button>
            </Space>
        </>
    );
};
export default Alert;