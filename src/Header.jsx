import React from 'react';
import { Typography } from 'antd'
import { DeploymentUnitOutlined } from '@ant-design/icons'
const { Title, Text } = Typography;
const Header = (props) => {
  return (
    <div style={{ backgroundColor: '#ffff0fa3', display: 'flex', paddingBottom: '0.5em', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start', marginBottom: '0.5rem' }}>
      <DeploymentUnitOutlined style={{ marginLeft: '0.5em', fontSize: '3rem' }}/>
      <Title level={1} style={{ marginBottom: 0, marginLeft: '0.5rem' }}> Keg </Title>
      <Text keyboard style={{ marginLeft: '1rem' }}> Build the KnowledgE Graph of your learning</Text>
    </div>
  );
}

export default Header;
