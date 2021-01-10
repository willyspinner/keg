import React from 'react';
import { Button, message, Popconfirm, Typography } from 'antd'
import { DeploymentUnitOutlined } from '@ant-design/icons'
const { Title, Text } = Typography;

const Header = (props) => {
  const [showDeletionConfirm, setShowDeletionConfirm] = React.useState(false);
  const onResetData = () => {
    delete localStorage['existingSave'];
    window.location.reload(true);
  };

  const onCancelReset = () => {
    message.info("deletion cancelled.");
    setShowDeletionConfirm(false);
  }
  console.log("DEL CONF", showDeletionConfirm)
  return (
    <div style={{ backgroundColor: '#ffff0fa3', borderBottom: '1px solid #eaeaea', display: 'flex', paddingBottom: '0.5em', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
      <div style={{ display:'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
        <DeploymentUnitOutlined style={{ marginLeft: '0.2em', fontSize: '3rem' }}/>
        <Title level={1} style={{ marginBottom: 0, marginLeft: '0.5rem' }}> Keg </Title>
        <Text keyboard style={{ marginLeft: '1rem' }}> Build the KnowledgE Graph of your learning</Text>
      </div>
      { process.env.NODE_ENV !== 'production' && (
        <Popconfirm
          visible={showDeletionConfirm}
          title="You will lose all localStorage data. Proceed?"
          onConfirm={onResetData}
          onCancel={onCancelReset}
          okText="Yes"
          cancelText="No"
        >
        <Button danger type="primary" style={{ marginRight: '1em' }} onClick={() => setShowDeletionConfirm(true)}> reset storage</Button>
        </Popconfirm>
      )}
    </div>
  );
}

export default Header;
