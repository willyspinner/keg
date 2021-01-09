import React from 'react';
import { Typography } from 'antd'
const { Title, Text } = Typography;
const Header = (props) => {
  return (
    <div style={{ backgroundColor: '#ffff0fa3', display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', marginBottom: '0.5rem' }}>
      <Title level={1} style={{ marginLeft: '1rem' }}> Keg </Title>
      <Text keyboard style={{ marginLeft: '1rem' }}> Build the knowledge graph of your learning</Text>
    </div>
  );
}

export default Header;
